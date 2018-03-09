DROP TABLE IF EXISTS localParty, users, friends, statictics, networkParty, score;

CREATE TABLE IF NOT EXISTS users (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL DEFAULT '',
  motdepasse VARCHAR(255) NOT NULL DEFAULT '',
  roles VARCHAR(255) NOT NULL DEFAULT 'PLAYER',

  nom varchar(255),
  code_postal varchar(255),
  ville varchar(255),
  adresse varchar(255),

  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_login` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS friends (
  idAjout INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  loginPlayerAjoute VARCHAR(100) NOT NULL,
  idUserAjoutant int(11) NOT NULL,
  idUSerAjoute int(11) NOT NULL,

  PRIMARY KEY (`idAjout`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users (id,username,password,motdepasse,roles) VALUES
  (1, 'admin', 'd05cc09587a5589671f59966bea4fb12', 'admin', 'ADMIN'),
  (2, 'player', '6dfaed59e0e74691a7d6103ba21353f9', 'player','PLAYER'),
  (3, 'player2', 'c0a6de5a2609c11cc36f86d602d1a2e7','player2','PLAYER');
