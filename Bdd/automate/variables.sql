-- Création de la table 'variables'
CREATE TABLE IF NOT EXISTS variables (
    id_variable INT AUTO_INCREMENT PRIMARY KEY,
    zone VARCHAR(50) NOT NULL,  -- Nouvelle colonne pour la zone
    nom_variable VARCHAR(255) NOT NULL,
    adresse_ip VARCHAR(255) NOT NULL,
    unite VARCHAR(50) NOT NULL,
    seuil_alerte_min INT NOT NULL,
    seuil_alerte_max INT NOT NULL,
    date_creation DATETIME NOT NULL,
    date_modification DATETIME NOT NULL,
    enregistrement_modbus VARCHAR(255) NOT NULL,
    valeur INT DEFAULT NULL
);


