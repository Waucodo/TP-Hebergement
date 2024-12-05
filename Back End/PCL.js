const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

const clientZ3 = new ModbusRTU();

// Configuration de la base de données
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'automate',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
});

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

// Fonction pour lire toutes les variables de type "Coils" dans la base de données et les lire sur le PLC Z3
async function readAllCoilsFromPLCZ3() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [variables] = await connection.query("SELECT * FROM variables WHERE zone = 'Zone 3' AND type = 'Coils'");

        if (variables.length > 0) {
            for (const variable of variables) {
                try {
                    // Lire le registre spécifique du PLC Z3
                    const data = await clientZ3.readCoils(variable.enregistrement_modbus, 1);
                    const currentValue = data.data[0];

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
                            "UPDATE variables SET valeur = ? WHERE id_variable = ?",
                            [currentValue, variable.id_variable]
                        );

                        console.log(`Valeur modifiée de "${variable.nom_variable}" (registre ${variable.enregistrement_modbus}) : ${currentValue}`);
                    }
                } catch (plcError) {
                    console.error(`Erreur lors de la lecture de la variable ${variable.nom_variable} :`, plcError.message);
                }
            }
        } else {
            console.log("Aucune variable de type 'Coils' trouvée pour la Zone 3 dans la base de données.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des variables de type 'Coils' depuis la BDD :", error.message);
    } finally {
        if (connection) connection.release();
    }
}

// Connexion initiale au PLC de la Zone 3
connectPLCZ3();

// Lire toutes les variables de type "Coils" toutes les 10 secondes
setInterval(readAllCoilsFromPLCZ3, 10000);
