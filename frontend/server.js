const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Créer une connexion à la base de données
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'controle_qualite'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});

// Endpoint pour insérer des données
app.post('/api/insert', (req, res) => {
    const { id_piece, continuite, temperature, maj_firmware, nom, prenom } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    const heure = new Date().toLocaleTimeString();

    const query = 'INSERT INTO historique (date, heure, id_piece, continuite, temperature, maj_firmware, nom, prenom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [date, heure, id_piece, continuite, temperature, maj_firmware, nom, prenom], (error, results) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json({ message: 'Nouvelle entrée créée avec succès.' });
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
