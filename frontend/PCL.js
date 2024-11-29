const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();
const clientZ3 = new ModbusRTU();

// open connection to a tcp line API 2.4Ghz ou 5Ghz Happywifi
client.connectTCP("172.16.1.24", { port: 502 }); //IP Z4 et port 502 OK
client.setID(1); // Remplacez l'ID par celui de votre automate si nécessaire

clientZ3.connectTCP("172.16.1.23", { port: 502 }); //IP Z4 et port 502 OK
clientZ3.setID(1);

setInterval(async function() {
    try {
      //const dataZ4Coils = await client.readCoils(514, 1);  //readCoils 514,1 = premier AU
      //console.log("Z4 coils values:", dataZ4Coils.data);
      //const dataZ4HoldingRegister = await client.readHoldingRegisters(400, 10); // Registre ex 0;10
      //console.log("Z4 Register values:", dataZ4HoldingRegister.data);
      //const dataZ3Coils = await client.readCoils(516, 1); // Registre ex 0;10


      //Ecriture Dcy
      const dataZ4Coils = await client.writeCoil(658, 0, 1);
      const WriteZ4Coils = await client.readCoils(658, 1);  //readCoils 514,1 = premier AU
      console.log("Z4 coils values:", WriteZ4Coils.data);
        //console.log("Z3 coils values:", dataZ3Coils.data);
    } catch (err) {
        console.error("Error reading :", err.message);
    }
}, 1000);