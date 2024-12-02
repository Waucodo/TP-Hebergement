const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

const clientZ3 = new ModbusRTU();

// Configuration de la base de données
const pool = mysql.createPool({
    host: 'db',  // Assurez-vous que cela est bien 'db' pour correspondre au nom du service Docker
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
        await clientZ3.connectTCP("172.16.1.23", { port: 502, timeout: 5000 }); // Connexion au PLC Z3
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
                    const value = data.data[0]; // Récupérer la première valeur (true ou false)
                    console.log(`Valeur de la variable "${variable.nom_variable}" (registre ${variable.enregistrement_modbus}) : ${value}`);
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
