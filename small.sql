CREATE DATABASE IF NOT EXISTS small;

USE small;

CREATE TABLE act (
  act_id INT AUTO_INCREMENT PRIMARY KEY,
  club_id INT NOT NULL,
  title VARCHAR(10) NOT NULL,
  content VARCHAR(20) NOT NULL,
  post_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  join_id INT
);

INSERT INTO act(club_id, title, content, join_id) VALUES ('333', 'lily', 'lily said she sleeps', '222');
INSERT INTO act(club_id, title, content, join_id) VALUES ('444', 'E', 'E said she dies', '345');
INSERT INTO act(club_id, title, content, join_id) VALUES ('555', 'Jancy', 'J said she writes', '323');
INSERT INTO act(club_id, title, content, join_id) VALUES ('666', 'xio', 'xio said he confuses', '145'),('777', 'Wen', 'Wen said she sends', '227');
INSERT INTO act(club_id, title, content, join_id) VALUES
