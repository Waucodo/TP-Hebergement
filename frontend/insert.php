<?php
// Activer l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Informations de connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "root"; // ou ce que vous avez défini
$dbname = "controle_qualite";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Récupérer les données du formulaire
$id_piece = $_POST['id_piece'];
$continuite = $_POST['continuite'];
$temperature = $_POST['temperature'];
$maj_firmware = isset($_POST['maj_firmware']) ? 'Oui' : 'Non'; // Vérifier si la case est cochée
$nom = 'WAUCOMONT'; // Remplace par le nom statique ou saisis via un champ si nécessaire
$prenom = 'DORIAN'; // Remplace par le prénom statique ou saisis via un champ si nécessaire

// Validation de la référence de la pièce
if (empty($id_piece)) {
    die("La référence de la pièce ne peut pas être vide.");
}

// Préparer et lier
$stmt = $conn->prepare("INSERT INTO historique (date, heure, id_piece, continuite, temperature, maj_firmware, nom, prenom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$date = date('Y-m-d'); // Date actuelle
$heure = date('H:i:s'); // Heure actuelle
$stmt->bind_param("ssissssss", $date, $heure, $id_piece, $continuite, $temperature, $maj_firmware, $nom, $prenom);

// Exécuter la requête
if ($stmt->execute()) {
    echo "Nouvelle entrée créée avec succès.";
} else {
    echo "Erreur : " . $stmt->error;
}

// Fermer la connexion
$stmt->close();
$conn->close();
?>
