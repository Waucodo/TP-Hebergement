const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors'); // Importer le middleware CORS

const app = express();
const port = 3000;

// Utiliser le middleware CORS
app.use(cors());

// Utiliser le middleware pour traiter les requêtes JSON
app.use(express.json());
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'automate',
    connectionLimit: 10, // Augmenter la limite de connexions
});

// Fonction pour tester la connexion à la base de données
pool.getConnection()
  .then(conn => {
    console.log("Connecté à MariaDB !");
    conn.release(); // Libérer la connexion
  })
  .catch(err => {
    console.error("Erreur de connexion à MariaDB", err);
  });

// Route pour récupérer toutes les variables
app.post('/variables', async (req, res) => {
    const {
      nom_variable,
      adresse_ip,
      unite,
      seuil_alerte_min,
      seuil_alerte_max,
      enregistrement_modbus
    } = req.body;

    let conn;
    try {
      conn = await pool.getConnection(); // Obtenir une connexion
      const result = await conn.query(
        `INSERT INTO variables (nom_variable, adresse_ip, unite, seuil_alerte_min, seuil_alerte_max, enregistrement_modbus) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nom_variable, adresse_ip, unite, seuil_alerte_min, seuil_alerte_max, enregistrement_modbus]
      );
      // Convertir insertId en un nombre classique pour sérialisation
      res.status(201).send({ message: 'Variable insérée avec succès', id: Number(result.insertId) });
    } catch (err) {
      console.error('Erreur lors de l\'insertion de la variable :', err);
      res.status(500).send({ error: 'Erreur lors de l\'insertion de la variable' });
    } finally {
      if (conn) conn.release(); // Libérer la connexion
    }
  });

// Route pour récupérer tous les défauts
app.post('/defauts', async (req, res) => {
    const {
      id_variable,
      type_defaut,
      heure_detection_defaut,
      date_detection_defaut,
      statut
    } = req.body;

    let conn;
    try {
      conn = await pool.getConnection(); // Obtenir une connexion
      const result = await conn.query(
        `INSERT INTO Defauts (id_variable, type_defaut, heure_detection_defaut, date_detection_defaut, statut) 
         VALUES (?, ?, ?, ?, ?)`,
        [id_variable, type_defaut, heure_detection_defaut, date_detection_defaut, statut]
      );
      // Convertir insertId en un nombre classique pour sérialisation
      res.status(201).send({ message: 'Défaut inséré avec succès', id: Number(result.insertId) });
    } catch (err) {
      console.error('Erreur lors de l\'insertion du défaut :', err);
      res.status(500).send({ error: 'Erreur lors de l\'insertion du défaut' });
    } finally {
      if (conn) conn.release(); // Libérer la connexion
    }
  });

// Route pour récupérer tous les opérateurs
app.post('/operateurs', async (req, res) => {
    const {
      nom_operateur,
      email,
      statut,
      id_defaut,
      id_variable,
      date_derniere_action
    } = req.body;

    let conn;
    try {
      conn = await pool.getConnection(); // Obtenir une connexion
      const result = await conn.query(
        `INSERT INTO Operateurs (nom_operateur, email, statut, id_defaut, id_variable, date_derniere_action) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nom_operateur, email, statut, id_defaut, id_variable, date_derniere_action]
      );
      // Convertir insertId en un nombre classique pour sérialisation
      res.status(201).send({ message: 'Opérateur inséré avec succès', id: Number(result.insertId) });
    } catch (err) {
      console.error('Erreur lors de l\'insertion de l\'opérateur :', err);
      res.status(500).send({ error: 'Erreur lors de l\'insertion de l\'opérateur' });
    } finally {
      if (conn) conn.release(); // Libérer la connexion
    }
  });

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
