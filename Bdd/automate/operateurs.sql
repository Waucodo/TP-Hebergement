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

-- Listage des données de la table automate.operateurs : ~3 rows (environ)
INSERT INTO `operateurs` (`id_operateur`, `nom_operateur`, `email`, `date_creation`, `statut`, `id_defaut`, `id_variable`, `date_derniere_action`) VALUES
	(1, 'amal lachker', 'amal.lachker@example.com', '2024-11-28 10:45:36', 'Actif', 1, 1, '2024-11-28 15:45:00'),
	(3, 'dorion.wocomant', 'dorion.wocomant@example.com', '2024-11-28 10:57:46', 'Actif', 2, 1, '2024-11-28 15:45:00'),
	(4, 'dorion.wocomant', 'dorion.wocomant@example.com', '2024-11-28 10:56:51', 'non Actif', 2, 3, '2024-11-28 15:45:00');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
