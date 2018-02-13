<?php

$app->mount("/", new App\Controller\IndexController($app));
$app->mount("/player", new App\Controller\playerController($app));
$app->mount("/connexion", new App\Controller\UserController($app));