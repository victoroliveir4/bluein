CREATE DATABASE IF NOT EXISTS bluein;
USE bluein;

CREATE TABLE IF NOT EXISTS enterprises (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(255) NOT NULL,
  votes INT DEFAULT 0 NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  vote TINYINT DEFAULT 0,
  enterpriseId INT DEFAULT NULL,
  vote_date DATETIME DEFAULT NULL,
  created_date DATETIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (enterpriseId) REFERENCES enterprises(id)
);

INSERT INTO enterprises (name) VALUES ('Le Jardin'), ('Evian'), ('Olímpia Thermas');