const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const ModbusRTU = require('modbus-serial');

const app = express();
const PORT = 3000;

// Middleware pour servir le dossier frontend comme des fichiers statiques
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(cors());
app.use(bodyParser.json());

// Configuration de la base de données
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'automate',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Modbus client pour PLC Z3
const clientZ3 = new ModbusRTU();

// Simuler un utilisateur connecté (à remplacer par une gestion des sessions)
let currentUser = {
    id_operateur: 1,
    nom_operateur: 'admin',
    role: 'admin'
};

// Fonction de connexion au PLC de la Zone 3
async function connectPLCZ3() {
    try {
        await clientZ3.connectTCP("172.16.1.23", { port: 502, timeout: 5000 });
        clientZ3.setID(1);
        console.log("Connexion au PLC Z3 réussie");
    } catch (err) {
        console.error("Erreur lors de la connexion au PLC Z3 :", err.message);
    }
}

// Fonction pour lire les variables Coils et Holding Registers
async function readAllFromPLCZ3() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [variables] = await connection.query("SELECT * FROM variables WHERE zone = 'Zone 3'");

        if (variables.length > 0) {
            for (const variable of variables) {
                try {
                    let currentValue;
                    if (variable.type === 'Coils') {
                        const data = await clientZ3.readCoils(variable.enregistrement_modbus, 1);
                        currentValue = data.data[0];
                    } else if (variable.type === 'HoldingRegisters') {
                        const data = await clientZ3.readHoldingRegisters(variable.enregistrement_modbus, 1);
                        currentValue = data.data[0];
                    } else {
                        continue; // Skip other types for now
                    }

                    // Vérifier la dernière valeur enregistrée dans historique_variables
                    const [lastRecorded] = await connection.query(
                        "SELECT valeur FROM historique_variables WHERE id_variable = ? ORDER BY horodatage DESC LIMIT 1",
                        [variable.id_variable]
                    );

                    const lastValue = lastRecorded.length > 0 ? lastRecorded[0].valeur : null;

                    // Si la valeur a changé, l'archiver dans la base de données
                    if (lastValue !== currentValue) {
                        await connection.query(
                            "INSERT INTO historique_variables (id_variable, valeur, horodatage) VALUES (?, ?, NOW())",
                            [variable.id_variable, currentValue]
                        );

                        // Mettre à jour la valeur actuelle de la variable dans la table variables
                        await connection.query(
                            "UPDATE variables SET valeur = ?, date_modification = NOW() WHERE id_variable = ?",
                            [currentValue, variable.id_variable]
                        );

                        console.log(`Valeur modifiée de "${variable.nom_variable}" (registre ${variable.enregistrement_modbus}) : ${currentValue}`);
                    }
                } catch (plcError) {
                    console.error(`Erreur lors de la lecture de la variable ${variable.nom_variable} :`, plcError.message);
                }
            }
        } else {
            console.log("Aucune variable trouvée pour la Zone 3 dans la base de données.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des variables depuis la BDD :", error.message);
    } finally {
        if (connection) connection.release();
    }
}

// Connexion initiale au PLC de la Zone 3
connectPLCZ3();

// Lire toutes les variables toutes les 10 secondes
setInterval(readAllFromPLCZ3, 10000);

// Routes API

// Route principale (sanity check)
app.get('/', (req, res) => {
    res.send('API opérationnelle 🚀');
});

// Route pour récupérer les opérateurs
app.get('/api/operateurs', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM operateurs');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route de connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe requis.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.query(
            'SELECT * FROM operateurs WHERE nom_operateur = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            currentUser = rows[0]; // Met à jour l'utilisateur connecté
            res.status(200).json({ id: currentUser.id_operateur, username: currentUser.nom_operateur, role: currentUser.role });
        } else {
            res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect.' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        if (connection) connection.release();
    }
});

// Route pour retourner la page de connexion (Log.html)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'Log.html'));
});

// Route pour récupérer les variables par zone, avec la dernière valeur enregistrée
app.get('/api/variables', async (req, res) => {
    const zone = req.query.zone;

    if (!zone) {
        return res.status(400).json({ error: 'La zone est requise.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(`
            SELECT v.*, v.valeur AS valeur_actuelle
            FROM variables v
            WHERE v.zone = ?
        `, [zone]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des variables :', error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route pour récupérer les informations des automates (zones et adresses IP)
app.get('/api/automates', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM automates');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des automates :', error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route pour récupérer l'historique d'une variable spécifique
app.get('/api/variables/:id_variable/historique', async (req, res) => {
    const { id_variable } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT horodatage, valeur FROM historique_variables WHERE id_variable = ? ORDER BY horodatage ASC',
            [id_variable]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique :', error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route pour obtenir les trois dernières alarmes
app.get('/api/last-three-alarms', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(`
            SELECT hv.horodatage, hv.valeur, v.nom_variable 
            FROM historique_variables hv 
            JOIN variables v ON hv.id_variable = v.id_variable 
            WHERE v.zone = 'Zone 3' 
            AND (v.nom_variable LIKE '%defaut%' OR v.nom_variable LIKE '%securite%' OR v.nom_variable LIKE '%urgence%')
            AND v.nom_variable NOT LIKE '%acquit%'
            ORDER BY hv.horodatage DESC
            LIMIT 3
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des alarmes :', error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route pour obtenir l'utilisateur connecté
app.get('/api/current-user', (req, res) => {
    if (currentUser) {
        res.status(200).json(currentUser);
    } else {
        res.status(401).json({ error: 'Utilisateur non connecté.' });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
