-- =============================================
-- Database Creation Script: PurchaseBillDb (MySQL)
-- =============================================
CREATE DATABASE IF NOT EXISTS PurchaseBillDb;
USE PurchaseBillDb;

-- Location_Details Table
CREATE TABLE IF NOT EXISTS Location_Details (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    LocationCode VARCHAR(50) NOT NULL,
    LocationName VARCHAR(200) NOT NULL,
    UserEmail VARCHAR(200) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
