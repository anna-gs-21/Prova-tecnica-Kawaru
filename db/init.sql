CREATE DATABASE IF NOT EXISTS kawaru;

USE kawaru;

CREATE TABLE IF NOT EXISTS companies (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
); 

CREATE TABLE IF NOT EXISTS users (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    idCompany INT NOT NULL,
    mail VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
    
	CONSTRAINT fk_User_Company
    FOREIGN KEY (idCompany)
    REFERENCES companies(id)
    ON DELETE CASCADE
); 

CREATE TABLE IF NOT EXISTS priorities (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS states (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
); 

CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) UNIQUE,
    idCompany INT NOT NULL,
    description VARCHAR(255),
    idPriority INT,
    idState INT,
    
    CONSTRAINT fk_Application_Company
    FOREIGN KEY (idCompany)
    REFERENCES companies(id)
    ON DELETE CASCADE,
    
    CONSTRAINT fk_Application_Priority
    FOREIGN KEY (idPriority)
    REFERENCES priorities(id),
    
    CONSTRAINT fk_Application_State
    FOREIGN KEY (idState)
    REFERENCES states(id)
); 

INSERT INTO priorities (name) VALUES ("Baixa");
INSERT INTO priorities (name) VALUES ("Mitjana");
INSERT INTO priorities (name) VALUES ("Alta");

INSERT INTO states (name) VALUES ("Oberta");
INSERT INTO states (name) VALUES ("En curs");
INSERT INTO states (name) VALUES ("Tancada");

INSERT INTO companies (name) VALUES ("Empresa A");
INSERT INTO companies (name) VALUES ("Empresa B");