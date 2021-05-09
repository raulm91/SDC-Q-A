DROP SCHEMA QA;

CREATE SCHEMA QA;

DROP TABLE IF EXISTS questions;

CREATE TABLE QA.questions(
  id INT NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  question_body INT NOT NULL,
  question_helpfullness BOOLEAN,
  reported BOOLEAN,
  answers_id INT NOT NULL,
  FOREIGN KEY (answers_id) REFERENCES answers(id)
  FOREIGN KEY (user_id) REFERENCES users(id)
)

DROP TABLE IF EXISTS answers;

CREATE TABLE QA.answers(
  id INT NOT NULL PRIMARY KEY
  user_id INT NOT NULL,
  body VARCHAR(255),
  post_date VARCHAR(50),
  helpfullness VARCHAR(50),
  photos VARCHAR(150),
  page INT NOT NULL,
  count INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
)

DROP TABLE IF EXISTS users;

CREATE TABLE QA.users(
  id INT NOT NULL PRIMARY KEY,
  user_name VARCHAR(100),
  e-mail VARCHAR(150),
  pw VARCHAR(150)
)


