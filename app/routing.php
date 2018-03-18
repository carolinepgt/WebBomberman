<?php

$app->mount("/", new App\Controller\IndexController($app));
$app->mount("/player", new App\Controller\playerController($app));
$app->mount("/connexion", new App\Controller\UserController($app));
$app->mount("/Game", new App\Controller\GameController($app));
$app->mount("/Friends", new App\Controller\FriendsController($app));
$app->mount("/Statistics", new App\Controller\StatistiquesController($app));