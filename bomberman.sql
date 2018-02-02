DROP TABLE IF EXISTS localParty, users, friends, statictics, networkParty, score;

CREATE TABLE IF NOT EXISTS users (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  login VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT '',
  mdp VARCHAR(255) NOT NULL DEFAULT '',
  role VARCHAR(255) NOT NULL DEFAULT 'PLAYER',

  nom varchar(255),
  code_postal varchar(255),
  ville varchar(255),
  adresse varchar(255),

  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS friends (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  login VARCHAR(100) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;