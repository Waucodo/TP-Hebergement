-- Création de la table 'defauts' avec la colonne 'date_detection_defaut' en type DATETIME
CREATE TABLE IF NOT EXISTS defauts (
    id_defaut INT AUTO_INCREMENT PRIMARY KEY,
    id_variable INT DEFAULT NULL,
    type_defaut VARCHAR(255) NOT NULL,
    heure_detection_defaut DATETIME NOT NULL,
    date_detection_defaut DATETIME NOT NULL, -- Changement de DATE à DATETIME
    statut VARCHAR(50) NOT NULL
);

-- Insertion des données dans la table 'defauts' avec des valeurs correctes pour 'date_detection_defaut'
INSERT INTO `defauts` (`id_defaut`, `id_variable`, `type_defaut`, `heure_detection_defaut`, `date_detection_defaut`, `statut`) VALUES
    (1, 1, 'Fuite', '2024-11-28 14:30:00', '2024-11-28 14:30:00', 'Actif'),
    (2, NULL, 'Fuite', '2024-11-28 14:30:00', '2024-11-28 14:30:00', 'Actif'),
    (3, NULL, 'Fuite', '2024-11-28 14:30:00', '2024-11-28 14:30:00', 'Actif');
