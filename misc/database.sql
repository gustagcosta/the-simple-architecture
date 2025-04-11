CREATE DATABASE test;

USE test;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payer_id INT NOT NULL,
  payee_id INT NOT NULL,
  value INT NOT NULL,
  status ENUM('approved', 'unpaid', 'confirmed', 'canceled') NOT NULL,
  date DATETIME NOT NULL,
  FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE CASCADE
);
