const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour servir le dossier frontend comme des fichiers statiques
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(cors());
app.use(bodyParser.json());

// Configuration de la base de données
const pool = mysql.createPool({
    host: 'db', // Le nom du service Docker pour MariaDB
    user: 'root',
    password: 'root',
    database: 'automate',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Route principale (sanity check)
app.get('/', (req, res) => {
    res.send('API opérationnelle 🚀');
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
            SELECT v.*, hv.valeur AS valeur_actuelle
            FROM variables v
            LEFT JOIN (
                SELECT id_variable, valeur, horodatage
                FROM historique_variables
                WHERE (id_variable, horodatage) IN (
                    SELECT id_variable, MAX(horodatage) 
                    FROM historique_variables 
                    GROUP BY id_variable
                )
            ) hv ON v.id_variable = hv.id_variable
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

// Route pour ajouter une nouvelle variable
app.post('/api/variables', async (req, res) => {
    const { nom_variable, adresse_ip, unite, seuil_alerte_min, seuil_alerte_max, enregistrement_modbus, zone, type } = req.body;

    // Vérifier que les champs requis sont présents
    if (!nom_variable || !adresse_ip || !enregistrement_modbus || !zone || !type) {
        return res.status(400).json({ error: 'Les champs nom_variable, adresse_ip, enregistrement_modbus, zone et type sont requis.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO variables 
            (nom_variable, adresse_ip, unite, seuil_alerte_min, seuil_alerte_max, enregistrement_modbus, zone, type, date_creation, date_modification) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [nom_variable, adresse_ip, unite, seuil_alerte_min, seuil_alerte_max, enregistrement_modbus, zone, type]
        );
        res.status(201).json({ message: 'Variable ajoutée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la variable :', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'ajout de la variable : ' + error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Route pour supprimer une variable
app.delete('/api/variables/:id_variable', async (req, res) => {
    const { id_variable } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query('DELETE FROM variables WHERE id_variable = ?', [id_variable]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Variable supprimée avec succès.' });
        } else {
            res.status(404).json({ error: 'Variable non trouvée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la variable :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
    } finally {
        if (connection) connection.release();
    }
});

// Route pour récupérer l'historique d'une variable
app.get('/api/variables/:id_variable/historique', async (req, res) => {
    const { id_variable } = req.params;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM historique_variables WHERE id_variable = ? ORDER BY horodatage DESC',
            [id_variable]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique de la variable :', error);
        res.status(500).send('Erreur serveur');
    } finally {
        if (connection) connection.release();
    }
});

// Route pour archiver les changements de valeur des variables
app.post('/api/archiver-variable', async (req, res) => {
    const { id_variable, valeur } = req.body;

    if (id_variable === undefined || valeur === undefined) {
        return res.status(400).json({ error: 'L\'id de la variable et sa valeur sont requis.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Vérifiez la dernière valeur enregistrée pour éviter la duplication si la valeur n'a pas changé
        const [lastRecorded] = await connection.query(
            'SELECT valeur FROM historique_variables WHERE id_variable = ? ORDER BY horodatage DESC LIMIT 1',
            [id_variable]
        );

        const lastValue = lastRecorded.length > 0 ? lastRecorded[0].valeur : null;

        if (lastValue !== valeur) {
            // Insérer une nouvelle entrée dans la table historique_variables
            await connection.query(
                'INSERT INTO historique_variables (id_variable, valeur, horodatage) VALUES (?, ?, NOW())',
                [id_variable, valeur]
            );
            res.status(200).json({ message: 'Valeur archivée avec succès.' });
        } else {
            res.status(200).json({ message: 'La valeur n\'a pas changé, aucun archivage nécessaire.' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'archivage de la variable :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        if (connection) connection.release();
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
