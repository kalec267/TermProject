create database shop default character set utf8mb4;
show databases;
use shop;

CREATE TABLE users (
    userId INT AUTO_INCREMENT PRIMARY KEY, 
    userName VARCHAR(50) NOT NULL UNIQUE,   
    userEmail VARCHAR(100) NOT NULL,
    userPassword VARCHAR(255) NOT NULL,
    userPhone VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

desc users;
select * from users;
