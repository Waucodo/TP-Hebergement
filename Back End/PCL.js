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

// Vérifiez la connexion à la base de données dès le démarrage
async function testDatabaseConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("Connexion à la base de données réussie !");
    } catch (err) {
        console.error("Erreur lors de la connexion à la base de données :", err.message);
    } finally {
        if (connection) connection.release();
    }
}

testDatabaseConnection();

// Fonction pour lire la valeur de l'arrêt d'urgence sur le PLC Z3
async function readArretUrgenceFromPLCZ3() {
    try {
        const [rows] = await pool.query("SELECT enregistrement_modbus FROM variables WHERE nom_variable LIKE '%Arret dUrgence%' AND zone = 'Zone 3'");
        
        if (rows.length > 0) {
            const register = rows[0].enregistrement_modbus;
            const data = await clientZ3.readCoils(register, 1); // Utiliser le registre récupéré depuis la BDD
            const value = data.data[0]; // Récupérer uniquement la première valeur (true ou false)
            console.log(`Valeur de l'arrêt d'urgence (registre ${register}) : ${value}`);
        } else {
            console.log("Aucun enregistrement trouvé pour l'arrêt d'urgence dans la base de données.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du numéro de registre de l'arrêt d'urgence :", error.message);
    }
}

// Connexion initiale au PLC de la Zone 3
connectPLCZ3();

// Lire la valeur de l'arrêt d'urgence toutes les 10 secondes
setInterval(readArretUrgenceFromPLCZ3, 10000);
