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
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  login VARCHAR(100) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users (id,username,password,motdepasse,roles) VALUES
  (1, 'admin', 'd05cc09587a5589671f59966bea4fb12', 'admin', 'ADMIN'),
  (2, 'player', '2f9dab7127378d55a4121d855266074c', 'client','PLAYER'),
  (3, 'player2', '2b49abae6e13396373d67063c6473efb','client2','PLAYER');
