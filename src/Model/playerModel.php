<?php
namespace App\Model;

use Doctrine\DBAL\Query\QueryBuilder;
use Silex\Application;

class playerModel{
    private $db;

    public function __construct(Application $app) {
        $this->db = $app['db'];
    }


}