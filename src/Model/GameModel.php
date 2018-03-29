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
            $this->db->query("INSERT INTO parties (nomPartie,etat,nbJoueursAttendus,nbJoueursDansPartie) VALUES ('".$donnees['nomPartie']."','MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-N-N-M0-M0-M0-M0-M0-M0-M0-M1-M0-M0-M0-M0-M0-MI-MI-N-MI-M5-MI-M1-MI-M2-MI-M0-MI-M1-MI-M2-MI-M0-MI-MI-M0-M0-M0-M0-M0-M0-M2-M0-M0-M0-M5-M0-M4-M4-M0-MI-MI-M5-MI-M0-MI-M5-MI-M0-MI-M0-MI-M1-MI-M2-MI-M3-MI-MI-M0-M4-M0-M0-M0-M5-M0-M0-M0-M0-M3-M5-M0-M0-M0-MI-MI-M0-MI-M4-MI-M0-MI-M0-MI-M0-MI-M5-MI-M0-MI-M0-MI-MI-M1-M2-M0-M0-M2-M2-M1-M0-M0-M0-M3-M0-M4-M0-M3-MI-MI-M4-MI-M4-MI-M0-MI-M0-MI-M0-MI-M5-MI-M0-MI-M0-MI-MI-M0-M0-M4-M5-M2-M0-M5-M0-M0-M4-M0-M0-M0-M0-M0-MI-MI-M0-MI-M0-MI-M0-MI-M0-MI-M0-MI-M0-MI-M1-MI-M0-MI-MI-M0-M0-M0-M0-M0-M0-M0-M5-M0-M2-M2-M0-M3-M0-M0-MI-MI-M0-MI-M0-MI-M0-MI-M0-MI-M0-MI-M0-MI-M2-MI-M0-MI-MI-M0-M0-M0-M0-M0-M0-M0-M0-M5-M0-M0-M4-M3-M0-M0-MI-MI-M0-MI-M2-MI-M2-MI-M0-MI-M4-MI-M0-MI-M2-MI-N-MI-MI-M0-M0-M0-M2-M0-M0-M0-M0-M0-M0-M4-M0-M2-N-N-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-MI-//35-35-false,525-525-false,'
            ,'".$donnees['nbJoueursAttendus']."',1);");

            $maxID = $this->db->prepare("SELECT max(idPartie) from parties");
            $maxID->execute();
            $max = $maxID->fetch();

            $this->db->query("INSERT INTO participe VALUES('".$max['max(idPartie)']."','".$user."','".$user."00000',1);");
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
        try{
            $this->db->beginTransaction();

            $maxID = $this->db->prepare("SELECT max(nbJoueur) from participe where idPartie=".$idPartie);
            $maxID->execute();
            $max = $maxID->fetch();

            $maxJoueur = $max['max(nbJoueur)']+1;

            $this->db->query("INSERT INTO participe VALUES('".$idPartie."','".$user."','".$user."00000','".$maxJoueur."');");
            $this->db->commit();
        }
        catch (Exception $e){
            $this->db->rollback();
            echo 'Tout ne s\'est pas bien passé, voir les erreurs ci-dessous<br />';
            echo 'Erreur : '.$e->getMessage().'<br />';
            echo 'N° : '.$e->getCode();
            exit();
        }


        /*$queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->insert('participe')
            ->values([
                'idPartie'=> '?',
                'idJoueur'=> '?',
                'actionPartie'=> '?',
                'nbJoueur'=> '?'
            ])
            ->setParameter(0, $idPartie)
            ->setParameter(1, $user)
            ->setParameter(2, $user."00000")
            ->setParameter(3, $user."00000");
        return $queryBuilder->execute();*/
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

    public function getIdPartie(){
        $this->db->beginTransaction();

        $maxID = $this->db->prepare("SELECT max(idPartie) from parties");
        $maxID->execute();
        $max = $maxID->fetch();
        return $max['max(idPartie)'];
    }

}