/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.27-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: automate
-- ------------------------------------------------------
-- Server version	10.5.27-MariaDB-ubu2004

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `automates`
--

DROP TABLE IF EXISTS `automates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `automates` (
  `id_automate` int(11) NOT NULL AUTO_INCREMENT,
  `zone` varchar(50) NOT NULL,
  `adresse_ip` varchar(50) NOT NULL,
  PRIMARY KEY (`id_automate`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automates`
--

LOCK TABLES `automates` WRITE;
/*!40000 ALTER TABLE `automates` DISABLE KEYS */;
INSERT INTO `automates` VALUES (1,'Zone 1','172.16.1.21'),(2,'Zone 2','172.16.1.22'),(3,'Zone 3','172.16.1.23'),(4,'Zone 4','172.16.1.24'),(5,'Zone 5','172.16.1.25'),(6,'Zone 6','172.16.1.26');
/*!40000 ALTER TABLE `automates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `defauts`
--

DROP TABLE IF EXISTS `defauts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `defauts` (
  `id_defaut` int(11) NOT NULL AUTO_INCREMENT,
  `id_variable` int(11) DEFAULT NULL,
  `type_defaut` varchar(255) NOT NULL,
  `heure_detection_defaut` datetime NOT NULL,
  `date_detection_defaut` datetime NOT NULL,
  `statut` varchar(50) NOT NULL,
  PRIMARY KEY (`id_defaut`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `defauts`
--

LOCK TABLES `defauts` WRITE;
/*!40000 ALTER TABLE `defauts` DISABLE KEYS */;
INSERT INTO `defauts` VALUES (1,1,'Fuite','2024-11-28 14:30:00','2024-11-28 14:30:00','Actif'),(2,NULL,'Fuite','2024-11-28 14:30:00','2024-11-28 14:30:00','Actif'),(3,NULL,'Fuite','2024-11-28 14:30:00','2024-11-28 14:30:00','Actif');
/*!40000 ALTER TABLE `defauts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_automates`
--

DROP TABLE IF EXISTS `historique_automates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historique_automates` (
  `id_historique` int(11) NOT NULL AUTO_INCREMENT,
  `id_automate` int(11) NOT NULL,
  `zone` varchar(255) NOT NULL,
  `ancienne_ip` varchar(255) DEFAULT NULL,
  `nouvelle_ip` varchar(255) DEFAULT NULL,
  `modifie_par` varchar(255) NOT NULL,
  `date_modification` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historique`),
  KEY `id_automate` (`id_automate`),
  CONSTRAINT `historique_automates_ibfk_1` FOREIGN KEY (`id_automate`) REFERENCES `automates` (`id_automate`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_automates`
--

LOCK TABLES `historique_automates` WRITE;
/*!40000 ALTER TABLE `historique_automates` DISABLE KEYS */;
INSERT INTO `historique_automates` VALUES (1,1,'Zone 1','172.16.1.31','172.16.1.36','admin','2024-11-30 19:00:38'),(2,1,'Zone 1','172.16.1.36','172.16.1.21','admin','2024-11-30 19:16:18'),(3,1,'Zone 1','172.16.1.21','172.16.1.17','admin','2024-11-30 20:57:45'),(4,1,'Zone 1','172.16.1.17','172.16.1.21','admin','2024-11-30 20:57:51'),(5,1,'Zone 1','172.16.1.21','172.16.1.17','admin','2024-12-02 07:11:50'),(6,1,'Zone 1','172.16.1.17','172.16.1.21','admin','2024-12-02 07:11:58'),(7,1,'Zone 1','172.16.1.21','172.16.1.17','admin','2024-12-02 07:35:27'),(8,1,'Zone 1','172.16.1.17','172.16.1.21','admin','2024-12-02 07:35:34'),(9,1,'Zone 1','172.16.1.21','172.16.1.17','admin','2024-12-02 08:12:12'),(10,1,'Zone 1','172.16.1.17','172.16.1.21','admin','2024-12-02 08:12:18');
/*!40000 ALTER TABLE `historique_automates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_variables`
--

DROP TABLE IF EXISTS `historique_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historique_variables` (
  `id_historique` int(11) NOT NULL AUTO_INCREMENT,
  `id_variable` int(11) NOT NULL,
  `valeur` tinyint(1) NOT NULL,
  `horodatage` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_historique`),
  KEY `id_variable` (`id_variable`),
  CONSTRAINT `historique_variables_ibfk_1` FOREIGN KEY (`id_variable`) REFERENCES `variables` (`id_variable`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_variables`
--

LOCK TABLES `historique_variables` WRITE;
/*!40000 ALTER TABLE `historique_variables` DISABLE KEYS */;
/*!40000 ALTER TABLE `historique_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operateurs`
--

DROP TABLE IF EXISTS `operateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operateurs` (
  `id_operateur` int(11) NOT NULL AUTO_INCREMENT,
  `nom_operateur` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_creation` datetime NOT NULL,
  `statut` varchar(50) NOT NULL,
  `id_defaut` int(11) DEFAULT NULL,
  `id_variable` int(11) DEFAULT NULL,
  `date_derniere_action` datetime NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id_operateur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operateurs`
--

LOCK TABLES `operateurs` WRITE;
/*!40000 ALTER TABLE `operateurs` DISABLE KEYS */;
INSERT INTO `operateurs` VALUES (1,'amal lachker','amal.lachker@example.com','','2024-11-28 10:45:36','Actif',1,1,'2024-11-28 15:45:00','user'),(2,'admin user','admin@example.com','','2024-11-28 10:30:00','Actif',NULL,NULL,'2024-11-28 15:00:00','user'),(3,'dorion wocomant','dorion.wocomant@example.com','','2024-11-28 10:57:46','Actif',2,1,'2024-11-28 15:45:00','user'),(4,'dorion wocomant','dorion.wocomant@example.com','','2024-11-28 10:56:51','non Actif',2,3,'2024-11-28 15:45:00','user'),(5,'admin','admin@example.com','admin.01','2024-11-30 18:39:54','Actif',NULL,NULL,'2024-11-30 18:39:54','admin');
/*!40000 ALTER TABLE `operateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variables`
--

DROP TABLE IF EXISTS `variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variables` (
  `id_variable` int(11) NOT NULL AUTO_INCREMENT,
  `zone` varchar(50) NOT NULL,
  `nom_variable` varchar(255) NOT NULL,
  `adresse_ip` varchar(255) NOT NULL,
  `unite` varchar(50) NOT NULL,
  `seuil_alerte_min` int(11) NOT NULL,
  `seuil_alerte_max` int(11) NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_modification` datetime NOT NULL,
  `enregistrement_modbus` varchar(255) NOT NULL,
  `valeur` float DEFAULT NULL,
  `type` varchar(255) DEFAULT 'Coils',
  PRIMARY KEY (`id_variable`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variables`
--

LOCK TABLES `variables` WRITE;
/*!40000 ALTER TABLE `variables` DISABLE KEYS */;
INSERT INTO `variables` VALUES (65,'Zone 3','Commutateur Automatique','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','500',NULL,'Coils'),(66,'Zone 3','Commutateur Manuel','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','501',NULL,'Coils'),(67,'Zone 3','Commutateur Distance','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','502',NULL,'Coils'),(68,'Zone 3','Bouton Poussoir Depart Cycle','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','503',NULL,'Coils'),(69,'Zone 3','Bouton Poussoir Arret Cycle','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','504',NULL,'Coils'),(70,'Zone 3','Bouton Poussoir Test Lampes','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','505',NULL,'Coils'),(71,'Zone 3','Bouton Poussoir Acquitement Defaut','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','506',NULL,'Coils'),(72,'Zone 3','Bouton Poussoir Marche Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','507',NULL,'Coils'),(73,'Zone 3','Bouton Poussoir Arret Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','508',NULL,'Coils'),(74,'Zone 3','Bouton Poussoir Marche Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','509',NULL,'Coils'),(75,'Zone 3','Bouton Poussoir Arret Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','510',NULL,'Coils'),(76,'Zone 3','Bouton Poussoir Marche Convoyeur Vibrant','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','511',NULL,'Coils'),(77,'Zone 3','Bouton Poussoir Arret Convoyeur Vibrant','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','512',NULL,'Coils'),(78,'Zone 3','Arret dUrgence','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','516',NULL,'Coils'),(79,'Zone 3','Contacteur General / Armoire en Service','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','517',NULL,'Coils'),(80,'Zone 3','Securite Operateur','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','518',NULL,'Coils'),(81,'Zone 3','Retour Contacteur Moteur Ventilateur Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','522',NULL,'Coils'),(82,'Zone 3','Retour Contacteur Moteur Ventilateur Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','523',NULL,'Coils'),(83,'Zone 3','Defaut Variateur Convoyeur Vibrant','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','524',NULL,'Coils'),(84,'Zone 3','Retour Contacteur Resistance Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','525',NULL,'Coils'),(85,'Zone 3','Defaut Electrique Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','526',NULL,'Coils'),(86,'Zone 3','Retour Contacteur Resistance Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','527',NULL,'Coils'),(87,'Zone 3','Defaut Electrique Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','528',NULL,'Coils'),(88,'Zone 3','Capteur Debit Agregat','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','529',NULL,'HoldingRegisters'),(89,'Zone 3','Thermostat Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','530',NULL,'HoldingRegisters'),(90,'Zone 3','Thermostat Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','531',NULL,'HoldingRegisters'),(91,'Zone 3','Colonne Lumineuse / Voyant Vert','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','600',NULL,'Coils'),(92,'Zone 3','Colonne Lumineuse / Voyant Orange','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','601',NULL,'Coils'),(93,'Zone 3','Colonne Lumineuse / Voyant Rouge','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','602',NULL,'Coils'),(94,'Zone 3','Voyant Armoire en Service','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','603',NULL,'Coils'),(95,'Zone 3','Autorisation Contacteur General','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','605',NULL,'Coils'),(96,'Zone 3','Marche / Arret Variateur Convoyeur','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','606',NULL,'Coils'),(97,'Zone 3','Voyant Marche Convoyeur Vibrant','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','608',NULL,'Coils'),(98,'Zone 3','Voyant Defaut Convoyeur Vibrant','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','609',NULL,'Coils'),(99,'Zone 3','Voyant Marche Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','610',NULL,'Coils'),(100,'Zone 3','Voyant Defaut Aerotherme 1','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','611',NULL,'Coils'),(101,'Zone 3','Voyant Marche Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','612',NULL,'Coils'),(102,'Zone 3','Voyant Defaut Aerotherme 2','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','613',NULL,'Coils'),(103,'Zone 3','Voyant Debit Agregat','172.16.1.23','N/A',0,100,'2024-11-30 22:24:55','2024-11-30 22:24:55','614',NULL,'Coils');
/*!40000 ALTER TABLE `variables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-05  7:32:34
