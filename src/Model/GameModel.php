<?php
namespace App\Model;

use Doctrine\DBAL\Query\QueryBuilder;
use Silex\Application;

class GameModel{
    private $db;

    public function __construct(Application $app) {
        $this->db = $app['db'];
    }

    public function addPartie($donnees,$user)
    {
        try{
            $this->db->beginTransaction();
            $this->db->query("INSERT INTO parties (nomPartie,etat,nbJoueursAttendus,nbJoueursDansPartie) VALUES ('".$donnees['nomPartie']."',
            null,'".$donnees['nbJoueursAttendus']."',1);");

            $maxID = $this->db->prepare("SELECT max(idPartie) from parties");
            $maxID->execute();
            $max = $maxID->fetch();

            $this->db->query("INSERT INTO participe VALUES('".$max['max(idPartie)']."','".$user."');");
            $this->db->commit();
            return $max['max(idPartie)'];
        }
        catch (Exception $e){
            $this->db->rollback();
            echo 'Tout ne s\'est pas bien passé, voir les erreurs ci-dessous<br />';
            echo 'Erreur : '.$e->getMessage().'<br />';
            echo 'N° : '.$e->getCode();
            exit();
        }
    }

    public function getAllParties()
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('parties');

        return $queryBuilder->execute()->fetchAll();
    }

    public function rejoindrePartie($idPartie, $user)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->insert('participe')
            ->values([
                'idPartie'=> '?',
                'idJoueur'=> '?'
            ])
            ->setParameter(0, $idPartie)
            ->setParameter(1, $user);
        return $queryBuilder->execute();
    }

    public function getJoueursDansPartie($idPartie)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('nbJoueursDansPartie','nbJoueursAttendus')
            ->from('parties')
            ->where('idPartie='.$idPartie);

        return $queryBuilder->execute()->fetch();
    }

    public function updateParties($nbJoueursDansPartie,$idPartie)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->update('parties')
            ->set('nbJoueursDansPartie', '?')
            ->where('idPartie= ?')
            ->setParameter(0, $nbJoueursDansPartie+1)
            ->setParameter(1, $idPartie);
        return $queryBuilder->execute();
    }

    public function getEtatPartie($idPartie)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('etat')
            ->from('parties')
            ->where('idPartie='.$idPartie);

        return $queryBuilder->execute()->fetch();
    }

}