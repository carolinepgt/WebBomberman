<?php
namespace App\Model;

use Doctrine\DBAL\Query\QueryBuilder;
use Silex\Application;

class playerModel{
    private $db;

    public function __construct(Application $app) {
        $this->db = $app['db'];
    }

    public function getCoordonneesClientById($user){
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('users')
            ->where('id = '.$user);

        return $queryBuilder->execute()->fetch();
    }

    public function getAllClient(){
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('users')
            ->where('roles = "PLAYER"');

        return $queryBuilder->execute()->fetchAll();
    }

    public function addClient($donnees){
        try{
            $this->db->beginTransaction();
            $this->db->query("INSERT INTO users (nom,username,code_postal,ville,adresse,motdepasse,password) VALUES ('".$donnees['nom']."',
            '".$donnees['username']."','".$donnees['code_postal']."','".$donnees['ville']."','".$donnees['adresse']."',
            '".$donnees['motdepasse']."','".$donnees['password']."');");

            $maxID = $this->db->prepare("SELECT max(id) from users");
            $maxID->execute();
            $max = $maxID->fetch();
            var_dump($max);

            $this->db->query("INSERT INTO statictics VALUES('".$max['max(id)']."','".$max['max(id)']."',0,0);");
            $this->db->commit();
        }
        catch (Exception $e){
            $this->db->rollback();
            echo 'Tout ne s\'est pas bien passé, voir les erreurs ci-dessous<br />';
            echo 'Erreur : '.$e->getMessage().'<br />';
            echo 'N° : '.$e->getCode();
            exit();
        }
         /* $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->insert('users')
            ->values([
                'nom'=> '?',
                'username'=>'?',
                'code_postal'=>'?',
                'ville'=>'?',
                'adresse'=>'?',
                'motdepasse'=>'?',
                'password'=>'?'
            ])

            ->where('id= ?')
            ->setParameter(0, $donnees['nom'])
            ->setParameter(1, $donnees['username'])
            ->setParameter(2, $donnees['code_postal'])
            ->setParameter(3, $donnees['ville'])
            ->setParameter(4, $donnees['adresse'])
            ->setParameter(5, $donnees['motdepasse'])
            ->setParameter(6, $donnees['password']);
        return $queryBuilder->execute();*/
    }

    public function editClient($donnees)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->update('users')
            ->set('nom', '?')
            ->set('username','?')
            ->set('code_postal','?')
            ->set('adresse','?')
            ->set('ville','?')
            ->where('id= ?')
            ->setParameter(0, $donnees['nom'])
            ->setParameter(1, $donnees['username'])
            ->setParameter(2, $donnees['code_postal'])
            ->setParameter(3, $donnees['adresse'])
            ->setParameter(4, $donnees['ville'])
            ->setParameter(5, $donnees['id']);
        return $queryBuilder->execute();
    }

    public function deletePlayer($id)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->delete('users')
            ->where('id='.$id);
        return $queryBuilder->execute();
    }
}