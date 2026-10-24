-- Marketplace de instrumentos usados
-- Uso: psql -d marketplace -f db/script.sql

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(100) NOT NULL,          -- hash bcrypt, nunca texto plano
  picture     TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE posts (
  id           SERIAL PRIMARY KEY,
  user_id      INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INT NOT NULL REFERENCES categories(id),
  title        VARCHAR(120) NOT NULL,
  description  TEXT NOT NULL,
  price        INT NOT NULL CHECK (price >= 0),
  image_url    TEXT NOT NULL,
  condition    VARCHAR(20) NOT NULL DEFAULT 'usado'
               CHECK (condition IN ('nuevo', 'como nuevo', 'usado')),
  location     VARCHAR(100),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE favorites (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id     INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

INSERT INTO categories (name) VALUES
  ('Guitarras'),
  ('Bajos'),
  ('Baterías y percusión'),
  ('Teclados y pianos'),
  ('Cuerdas frotadas'),
  ('Otros');
