-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: survival
-- ------------------------------------------------------
-- Server version 8.0.32-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `survival`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `survival` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `survival`;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
                            `activity_id` int NOT NULL AUTO_INCREMENT,
                            `club_id` int NOT NULL,
                            `announcement_title` varchar(100) NOT NULL,
                            `announcement_content` varchar(2000) NOT NULL,
                            `post_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`activity_id`),
                            KEY `club_id` (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,1,'Welcome to web club!','Welcome to join us! Are you looking forward to attending your first event? What you need to prepare and when and where will be announced later. Stay tuned to us! Stay tuned! -- WEB!','2023-06-07 06:37:48'),(2,2,'Welcome to sleeping club!','Welcome to join us! Are you looking forward to attending your first event? What you need to prepare and when and where will be announced later. Stay tuned to us! Stay tuned! -- SLEEPING!','2023-06-07 06:38:36'),(3,3,'Welcome to frisbee club!','Are you looking forward to attending your first event? What you need to prepare and when and where will be announced later. Stay tuned to us! Stay tuned! -- FRISBEE!','2023-06-07 06:39:47'),(4,4,'Welcome to eating club!','Welcome to join us! Are you looking forward to attending your first event? What you need to prepare and when and where will be announced later. Stay tuned to us! Stay tuned!-- EATING!','2023-06-07 06:40:11');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `club`
--

DROP TABLE IF EXISTS `club`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `club` (
                        `club_id` int NOT NULL AUTO_INCREMENT,
                        `club_name` varchar(20) NOT NULL,
                        `manager_id` int DEFAULT NULL,
                        PRIMARY KEY (`club_id`),
                        UNIQUE KEY `manager_id` (`manager_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `club`
--

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;
INSERT INTO `club` VALUES (1,'Web',5),(2,'Sleeping',6),(3,'Frisbee',7),(4,'Eating',8);
/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
                           `user_id` int NOT NULL,
                           `club_id` int NOT NULL,
                           PRIMARY KEY (`user_id`),
                           KEY `club_id` (`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
INSERT INTO `manager` VALUES (5,1),(6,2),(7,3),(8,4);
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
                        `user_id` int NOT NULL AUTO_INCREMENT,
                        `user_name` varchar(30) NOT NULL,
                        `user_password` varchar(50) NOT NULL,
                        `user_email` varchar(50) NOT NULL,
                        `user_identity` varchar(20) NOT NULL,
                        PRIMARY KEY (`user_id`),
                        UNIQUE KEY `user_name` (`user_name`),
                        UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Felix','123456','xiofelix725@gmail.com','admin'),(2,'Jancy','123456','1317858648@qq.com','admin'),(3,'Lily','123456','wangqianying2022@gmail.com','admin'),(4,'Emily','123456','cyqqazmlp@gmail.com','admin'),(5,'F','123456','xiofelix@gmail.com','manager'),(6,'J','123456','131785@qq.com','manager'),(7,'L','123456','wangqianying@gmail.com','manager'),(8,'E','123456','cyqqaz@gmail.com','manager'),(9,'A','123456','A@gmail.com','manager'),(10,'B','123456','B@gmail.com','user'),(11,'C','123456','C@gmail.com','user'),(12,'D','123456','D@gmail.com','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userAct`
--

DROP TABLE IF EXISTS `userAct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userAct` (
                           `user_id` int NOT NULL,
                           `activity_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userAct`
--

LOCK TABLES `userAct` WRITE;
/*!40000 ALTER TABLE `userAct` DISABLE KEYS */;
/*!40000 ALTER TABLE `userAct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userClub`
--

DROP TABLE IF EXISTS `userClub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userClub` (
                            `user_id` int NOT NULL,
                            `club_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userClub`
--

LOCK TABLES `userClub` WRITE;
/*!40000 ALTER TABLE `userClub` DISABLE KEYS */;
/*!40000 ALTER TABLE `userClub` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-07  7:30:45