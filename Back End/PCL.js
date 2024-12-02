const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

const clientZ3 = new ModbusRTU();

// Configuration de la base de données
const pool = mysql.createPool({
    host: 'localhost',
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

// Fonction pour lire la valeur de l'arrêt d'urgence (registre fixe 514) sur le PLC Z3
async function readArretUrgenceFromPLCZ3() {
    try {
        const data = await clientZ3.readCoils(516, 1); // Utiliser le registre fixe 514
        const value = data.data[0]; // Récupérer uniquement la première valeur (true ou false)
        console.log(`Valeur de l'arrêt d'urgence (registre 516) : ${value}`);
    } catch (plcError) {
        console.error("Erreur lors de la lecture de l'arrêt d'urgence :", plcError.message);
    }
}

// Connexion initiale au PLC de la Zone 3
connectPLCZ3();

// Lire la valeur de l'arrêt d'urgence toutes les 10 secondes
setInterval(readArretUrgenceFromPLCZ3, 10000);
