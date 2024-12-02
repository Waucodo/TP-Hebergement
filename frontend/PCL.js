const ModbusRTU = require("modbus-serial");
const mysql = require("mysql2/promise");

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
    host: "db",
    user: "root",
    password: "root",
    database: "automate",
    waitForConnections: true,
    connectionLimit: 10,
    //queueLimit: 0,
});

// Création du client Modbus
const client = new ModbusRTU();

// Fonction principale pour lire les valeurs des automates
async function readPLCData() {
    let connection;
    try {
        // Connexion au PLC (par exemple, via TCP sur une adresse IP spécifique)
        await client.connectTCP("172.16.1.23", { port: 502 });
        console.log("Connexion au PLC réussie");

        // Connexion à la base de données
        connection = await pool.getConnection();
        console.log("Connexion au  réussie");

        // Récupérer les variables dynamiques depuis la base de données
        const [variables] = await connection.query("SELECT * FROM variables");

        // Lire chaque variable en fonction de son type (Coils ou Holding Register)
        for (const variable of variables) {
            let value;
            try {
                if (variable.type === "Coils") {
                    // Lecture d'une variable de type Coil
                    const data = await client.readCoils(variable.enregistrement_modbus, 1);
                    value = data.data[0] ? 1 : 0;
                } else if (variable.type === "HoldingRegisters") {
                    // Lecture d'une variable de type Holding Register
                    const data = await client.readHoldingRegisters(variable.enregistrement_modbus, 1);
                    value = data.data[0];
                } else {
                    console.warn(`Type de variable inconnu: ${variable.type}`);
                    continue;
                }

                // Mise à jour de la valeur de la variable dans la base de données
                await connection.query(
                    "UPDATE variables SET valeur = ? WHERE id_variable = ?",
                    [value, variable.id_variable]
                );
                console.log(`Variable ${variable.nom_variable} mise à jour avec la valeur ${value}`);
            } catch (err) {
                console.error(`Erreur lors de la lecture de la variable ${variable.nom_variable}:`, err);
            }
        }
    } catch (error) {
        console.error("Erreur générale :", error);
    } finally {
        if (connection) connection.release();
        client.close();
    }
}

// Exécuter la fonction toutes les 5 secondes
setInterval(readPLCData, 5000);

/* NodeS7
//Version Node7
var nodes7 = require('nodes7'); // This is the package name, if the repository is cloned you may need to require 'nodeS7' with uppercase S
var conn = new nodes7;
var doneReading = false;
var doneWriting = false;
 
var variables = {
    TEST1: 'Fanuc_R1_DB.Static.DATA,x_Prog_Running.0',  
    //TEST1: 'MR4',          // Memory real at MD4
      TEST2: 'M32.2',        // Bit at M32.2
      TEST3: 'M20.0',        // Bit at M20.0
      TEST4: 'DB1,REAL0.20', // Array of 20 values in DB1
      TEST5: 'DB1,REAL4',    // Single real value
      TEST6: 'DB1,REAL8',    // Another single real value
      TEST7: 'DB1,INT12.2',  // Two integer value array
      TEST8: 'DB1,LREAL4',   // Single 8-byte real value
      TEST9: 'DB1,X14.0',    // Single bit in a data block
      TEST10: 'DB1,X14.0.8'  // Array of 8 bits in a data block
};
 
conn.initiateConnection({ port: 102, host: '172.16.1.101', rack: 0, slot: 1, online: 'UnilasalleAmiens1', debug: false }, connected); // slot 2 for 300/400, slot 1 for 1200/1500, change debug to true to get more info
// conn.initiateConnection({port: 102, host: '192.168.0.2', localTSAP: 0x0100, remoteTSAP: 0x0200, timeout: 8000, doNotOptimize: true}, connected);
// local and remote TSAP can also be directly specified instead. The timeout option specifies the TCP timeout.
 
function connected(err) {
  if (typeof(err) !== "undefined") {
    // We have an error. Maybe the PLC is not reachable.
    console.log(err);
    process.exit();
  }
  conn.setTranslationCB(function(tag) { return variables[tag]; }); // This sets the "translation" to allow us to work with object names
  conn.addItems('TEST1');
 
  //conn.addItems(['TEST1', 'TEST4']);
  //conn.addItems('TEST6');
  // conn.removeItems(['TEST2', 'TEST3']); // We could do this.
  // conn.writeItems(['TEST5', 'TEST6'], [ 867.5309, 9 ], valuesWritten); // You can write an array of items as well.
  // conn.writeItems('TEST7', [666, 777], valuesWritten); // You can write a single array item too.
  //conn.writeItems('TEST3', true, valuesWritten); // This writes a single boolean item (one bit) to true
  conn.readAllItems(valuesReady);
}
 
function valuesReady(anythingBad, values) {
  if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
  console.log(values);
  doneReading = true;
  if (doneWriting) { process.exit(); }
}
 
function valuesWritten(anythingBad) {
  if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
  console.log("Done writing.");
  doneWriting = true;
  if (doneReading) { process.exit(); }
}
*/