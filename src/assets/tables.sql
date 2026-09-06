
-- Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS base_asisya;

USE base_asisya;


CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `IX_Users_Username` (`Username`)
);


CREATE TABLE `categories` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`CategoryID`)
);


CREATE TABLE `products` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SupplierID` int DEFAULT NULL,
  `CategoryID` int NOT NULL,
  `QuantityPerUnit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `UnitPrice` decimal(18,2) DEFAULT NULL,
  `UnitsInStock` smallint DEFAULT NULL,
  `UnitsOnOrder` smallint DEFAULT NULL,
  `ReorderLevel` smallint DEFAULT NULL,
  `Discontinued` tinyint(1) NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `IX_Products_CategoryID` (`CategoryID`),
  KEY `IX_Products_SupplierID` (`SupplierID`)
);

CREATE TABLE `suppliers` (
  `SupplierID` int NOT NULL AUTO_INCREMENT,
  `CompanyName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ContactName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ContactTitle` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Address` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `City` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Region` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PostalCode` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Fax` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `HomePage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`SupplierID`)
);


INSERT INTO `base_asisya`.`categories`
 (`CategoryName`, `Description`, `Picture`)
VALUES
('CategoryName1', 'Description1', '/src/assets/libros.png'),
('CategoryName2', 'Description2', '/ruta/completa/a/la/foto2.jpg'),
('CategoryName3', 'Description3', '/ruta/completa/a/la/foto3.jpg'),
('CategoryName4', 'Description4', '/ruta/completa/a/la/foto4.jpg'),
('CategoryName5', 'Description5', '/ruta/completa/a/la/foto5.jpg'),
('CategoryName6', 'Description6', '/ruta/completa/a/la/foto6.jpg'),
('CategoryName7', 'Description7', '/ruta/completa/a/la/foto7.jpg'),
('CategoryName8', 'Description8', '/ruta/completa/a/la/foto8.jpg'),
('CategoryName9', 'Description6', '/ruta/completa/a/la/foto9.jpg'),
('CategoryName10', 'Description7', '/ruta/completa/a/la/foto10.jpg'),
('CategoryName11', 'Description8', '/ruta/completa/a/la/foto11.jpg');

INSERT INTO `base_asisya`.`suppliers`
(`CompanyName`,`ContactName`,`ContactTitle`,`Address`,`City`,`Region`,`PostalCode`,`Country`,`Phone`,`Fax`,`HomePage`)
VALUES
("CompanyName1","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName2","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName3","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName4","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName5","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName6","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName7","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName8","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName9","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage"),
("CompanyName10","ContactName","ContactTitle","Address","City","Region","PostalCode","Country","Phone","Fax","HomePage");


