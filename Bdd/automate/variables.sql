-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           11.5.2-MariaDB - mariadb.org binary distribution
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage des données de la table automate.variables : ~4 rows (environ)
INSERT INTO `variables` (`id_variable`, `nom_variable`, `adresse_ip`, `unite`, `seuil_alerte_min`, `seuil_alerte_max`, `date_creation`, `date_modification`, `enregistrement_modbus`) VALUES
	(1, 'Humidité', '192.168.1.2', '%', 20, 80, '2024-11-28 09:11:05', '2024-11-28 09:11:05', 'Registre B'),
	(2, 'Humidité', '192.168.1.2', '%', 20, 80, '2024-11-28 09:11:44', '2024-11-28 09:11:44', 'Registre B'),
	(3, 'Humidité', '192.168.1.2', '%', 20, 80, '2024-11-28 09:31:35', '2024-11-28 09:31:35', 'Registre B'),
	(4, 'Humidité', '192.168.1.2', '%', 20, 80, '2024-11-28 09:33:51', '2024-11-28 09:33:51', 'Registre B');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
