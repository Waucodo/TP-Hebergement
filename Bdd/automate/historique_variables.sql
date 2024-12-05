CREATE TABLE historique_variables (
    id_historique INT AUTO_INCREMENT PRIMARY KEY,
    id_variable INT NOT NULL,
    valeur BOOLEAN NOT NULL,
    horodatage DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_variable) REFERENCES variables(id_variable)
);

-- Explications :
-- 1. id_historique : Un identifiant unique pour chaque enregistrement historique.
-- 2. id_variable : Référence à la variable (doit correspondre à l'identifiant dans la table des variables).
-- 3. valeur : La valeur actuelle de la variable (type BOOLEAN).
-- 4. horodatage : Date et heure de l'enregistrement de la valeur (par défaut, la date et l'heure actuelles).
-- 5. FOREIGN KEY : Le lien vers la table 'variables' pour assurer l'intégrité des données.
