CREATE DATABASE project2;

USE project2;

/* Create Tables */
CREATE TABLE users(id int AUTO_INCREMENT, firstName VARCHAR(25), lastName VARCHAR(30), username VARCHAR(25), password VARCHAR(50), chessUsername VARCHAR(25), PRIMARY KEY (id), CONSTRAINT uc_person UNIQUE(username));


CREATE TABLE games(id int AUTO_INCREMENT, url VARCHAR(60), datePlayed VARCHAR(15), whiteName VARCHAR(25), blackName VARCHAR(25), winner VARCHAR(20), numMoves int, moves VARCHAR(800), UNIQUE (url), PRIMARY KEY (id));


CREATE TABLE addedUsers(id int AUTO_INCREMENT, added_by int, added_user VARCHAR(25), FOREIGN KEY (added_by) REFERENCES users(id), PRIMARY KEY (id), UNIQUE(added_by, added_user));

/* Create Users */
INSERT INTO users(firstName, lastName, username, chessUsername, password) VALUES('Kaleb', 'Crisci', 'kcrisci', 'kcrisci', 'password');


