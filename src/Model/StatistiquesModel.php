<?php
namespace App\Model;

use Doctrine\DBAL\Query\QueryBuilder;
use Silex\Application;

class StatistiquesModel{
    private $db;

    public function __construct(Application $app) {
        $this->db = $app['db'];
    }

    public function getStatistiquesByPlayer($user){
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('statictics')
            ->where('idUsers = '.$user);

        return $queryBuilder->execute()->fetch();
    }

    public function getAllStat()
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select('*')
            ->from('statictics');

        return $queryBuilder->execute()->fetchAll();
    }

    public function editStat($donnees){
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->update('statictics')
            ->set('nbMort', '?')
            ->set('nbKill', '?')
            ->where('idUsers= ?')
            ->setParameter(0, $donnees['nbMort'])
            ->setParameter(1, $donnees['nbKill'])
            ->setParameter(2, $donnees['idUsers']);
        return $queryBuilder->execute();
    }
}
