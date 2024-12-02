-- Création de la table 'operateurs'
CREATE TABLE IF NOT EXISTS operateurs (
    id_operateur INT AUTO_INCREMENT PRIMARY KEY,
    nom_operateur VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_creation DATETIME NOT NULL,
    statut VARCHAR(50) NOT NULL,
    id_defaut INT DEFAULT NULL,
    id_variable INT DEFAULT NULL,
    date_derniere_action DATETIME NOT NULL
);

-- Insertion des données dans la table 'operateurs' sans mot de passe
INSERT INTO `operateurs` (`id_operateur`, `nom_operateur`, `email`, `password`, `date_creation`, `statut`, `id_defaut`, `id_variable`, `date_derniere_action`) VALUES
    (1, 'amal lachker', 'amal.lachker@example.com', '', '2024-11-28 10:45:36', 'Actif', 1, 1, '2024-11-28 15:45:00'),
    (2, 'admin user', 'admin@example.com', '', '2024-11-28 10:30:00', 'Actif', NULL, NULL, '2024-11-28 15:00:00'),
    (3, 'dorion wocomant', 'dorion.wocomant@example.com', '', '2024-11-28 10:57:46', 'Actif', 2, 1, '2024-11-28 15:45:00'),
    (4, 'dorion wocomant', 'dorion.wocomant@example.com', '', '2024-11-28 10:56:51', 'non Actif', 2, 3, '2024-11-28 15:45:00');
