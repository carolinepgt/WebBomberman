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
        $queryBuilder = new QueryBuilder($this->db);
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
        return $queryBuilder->execute();
    }
}