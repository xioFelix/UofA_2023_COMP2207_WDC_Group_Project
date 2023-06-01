CREATE DATABASE IF NOT EXISTS survival;

USE survival;

CREATE TABLE activity (
  activity_id INT PRIMARY KEY,
  club_id INT NOT NULL,
  announcement_title VARCHAR(100) NOT NULL,
  announcement_content VARCHAR(2000) NOT NULL,
  post_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  join_user_id INT
);

CREATE TABLE club (
  club_id INT AUTO_INCREMENT PRIMARY KEY,
  club_name VARCHAR(20) NOT NULL,
  manager_id VARCHAR(30) UNIQUE
);

CREATE TABLE manager (
  user_id INT PRIMARY KEY NOT NULL,
  club_id INT NOT NULL
);

CREATE TABLE user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(30) NOT NULL,
  full_name VARCHAR(30) NOT NULL,
  user_password VARCHAR(50) NOT NULL,
  user_email VARCHAR(50) NOT NULL,
  join_club_id INT,
  user_identity VARCHAR(20) NOT NULL
);

ALTER TABLE activity
ADD FOREIGN KEY(club_id)
REFERENCES club(club_id),
ADD FOREIGN KEY (join_user_id)
REFERENCES user(user_id);

ALTER TABLE manager
ADD FOREIGN KEY(user_id)
REFERENCES user(user_id),
ADD FOREIGN KEY (club_id)
REFERENCES club(club_id);

ALTER TABLE user
ADD FOREIGN KEY(join_club_id)
REFERENCES club(club_id);