CREATE TABLE IF NOT EXISTS historique_automates (
    id_historique INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    zone VARCHAR(50) DEFAULT NULL,
    ancienne_ip VARCHAR(50) DEFAULT NULL,
    nouvelle_ip VARCHAR(50) DEFAULT NULL,
    date_action DATETIME DEFAULT CURRENT_TIMESTAMP
);
