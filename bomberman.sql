DROP TABLE IF EXISTS participe, parties, statictics, users, friends, networkParty, score;

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

create table if not exists parties(
  idPartie int(11) not null AUTO_INCREMENT,
  nomPartie varchar(11) not null,
  etat text,
  nbJoueursAttendus int(11) not null,
  nbJoueursDansPartie int(11) not null,
  primary key(idPartie)
) DEFAULT CHARSET=utf8;

create table if not exists participe(
  idPartie int(11) not null,
  idJoueur int(11) not null,
  actionPartie VARCHAR(25) not null, /*mettre le numero de joueur + 5 zeros a la creation d'un champ*/
  nbJoueur int(11) not null, /*numéro du joueur courant dans la partie*/
  primary key(idPartie,idJoueur),
  CONSTRAINT fk_participe_users FOREIGN KEY (idJoueur) REFERENCES users (id),
  CONSTRAINT fk_participe_parties FOREIGN KEY (idPartie) REFERENCES parties (idPartie)
) DEFAULT CHARSET=utf8;

create table if not exists statictics(
  id int(11) not null AUTO_INCREMENT,
  idUsers int(11) not null,
  nbKill INT(11),
  nbMort int(11),
  PRIMARY KEY (id),
  CONSTRAINT fk_statistics_users FOREIGN KEY (idUsers) REFERENCES users (id)
) DEFAULT CHARSET=utf8;

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

INSERT INTO statictics (id,idUsers,nbKill,nbMort) VALUES
  (1,1,0,0),
  (2,2,0,0),
  (3,3,0,0);
