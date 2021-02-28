CREATE DATABASE project2;

USE project2;

/* Create Tables */
CREATE TABLE users(id int AUTO_INCREMENT, firstName VARCHAR(25), lastName VARCHAR(30), username VARCHAR(25), password VARCHAR(50), chessUsername VARCHAR(25), PRIMARY KEY (id), CONSTRAINT uc_person UNIQUE(username));


CREATE TABLE games(id int AUTO_INCREMENT, url VARCHAR(60), datePlayed DATE, whiteName VARCHAR(25), blackName VARCHAR(25), winner VARCHAR(20), numMoves int, moves VARCHAR(600), PRIMARY KEY (id));

	
/* Create Users */
INSERT INTO users(firstName, lastName, username, chessUsername, password) VALUES('Kaleb', 'Crisci', 'kcrisci', 'kcrisci94', 'password');


