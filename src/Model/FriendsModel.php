<?php
namespace App\Model;

use Doctrine\DBAL\Query\QueryBuilder;
use Silex\Application;

class FriendsModel{
    private $db;

    public function __construct(Application $app) {
        $this->db = $app['db'];
    }

    public function getAllFriends($user)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('friends')
            ->where('idUserAjoutant ='.$user);

        return $queryBuilder->execute()->fetchAll();
    }

    public function getAFriend($user, $id)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->select ('*')
            ->from('friends')
            ->where('idUserAjoutant ='.$user." and idUSerAjoute=".$id." LIMIT 1");

        return $queryBuilder->execute()->fetch();
    }

    public function deleteFriend($id, $id2)
    {
        $queryBuilder = new QueryBuilder($this->db);
        $queryBuilder
            ->delete('friends')
            ->where('idUserAjoutant='.$id2." and idUSerAjoute=".$id);
        return $queryBuilder->execute();
    }
}