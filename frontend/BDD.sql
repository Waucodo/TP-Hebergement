CREATE TABLE Pieces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_serie VARCHAR(50) NOT NULL,
    date_creation TIMESTAMP DEFAULT NOW(),
    operateur_id INT,
    status BOOLEAN NULL,
    FOREIGN KEY (operateur_id) REFERENCES Operateurs(id)
);
