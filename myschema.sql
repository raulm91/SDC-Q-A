DROP DATABASE Q&A IF EXISTS;

CREATE Q&A;
USE Q&A

CREATE TABLE questions(
  id INT NOT NULL PRIMARY KEY,
  user_id INT NOT NULL,
  question_body INT NOT NULL,
  question_helpfullness BOOLEAN,
  reported BOOLEAN,
  answers_id INT NOT NULL,
  FOREIGN KEY (answers_id) REFERENCES answers(id)
  FOREIGN KEY (user_id) REFERENCES users(id)
)

CREATE TABLE answers(
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

CREATE TABLE users(
  id INT NOT NULL PRIMARY KEY,
  user_name VARCHAR(100),
  e-mail VARCHAR(150),
  pw VARCHAR(150)
)


