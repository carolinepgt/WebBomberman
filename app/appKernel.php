<?php
/**
 * Created by PhpStorm.
 * User: carol
 * Date: 02/02/2018
 * Time: 12:33
 */

require "config.php";

ini_set('date.timezone', 'Europe/Paris');

$loader = require_once join(DIRECTORY_SEPARATOR,[dirname(__DIR__), 'vendor', 'autoload.php']);

$loader->addPsr4('App\\',join(DIRECTORY_SEPARATOR,[dirname(__DIR__), 'src']));

$app = new Silex\Application();

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => array(
        'driver' => 'pdo_mysql',
        'dbhost' => hostname,
        'host' => hostname,
        'dbname' => database,
        'user' => username,
        'password' => password,
        'charset' => 'utf8mb4',
    ),
));

//utilisation de twig
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => join(DIRECTORY_SEPARATOR, [dirname(__DIR__), 'src', 'View'])
));

// utilisation des sessoins
$app->register(new Silex\Provider\SessionServiceProvider());

//en dev, nous voulons voir les erreurs
$app['debug'] = true;

// rajoute la méthode asset dans twig

$app->register(new Silex\Provider\AssetServiceProvider(), array(
    'assets.named_packages' => array(
        'css' => array(
            'version' => 'css2',
            'base_path' => __DIR__.'/../web/'
        ),
    ),
));


//Permet d'utiliser les tokens
use Silex\Provider\CsrfServiceProvider;
$app->register(new CsrfServiceProvider());
use Silex\Provider\FormServiceProvider;
$app->register(new FormServiceProvider());

use Symfony\Component\HttpFoundation\Request;
Request::enableHttpMethodParameterOverride();

$app->register(new Silex\Provider\ValidatorServiceProvider());

include('routing.php');

//MiddleWares TOKEN
use Symfony\Component\Security\Csrf\CsrfToken;
$app->before(function (\Symfony\Component\HttpFoundation\Request $request) use ($app) {

    $nomRoute=$request->get('_route');
    $routeToken = array("'player.validFormAddPlayer","player.validFormAddPlayerNonInscrit","player.valideFormEditClient",
        "user.validFormlogin","friends.validFormDelete","friends.validFormAdd","statistiques.validFormEditStat",
        "player.validFormDeletePlayer");

    if (in_array($nomRoute,$routeToken)){
        if (isset($_POST['_csrf_token'])) {
            $token = $_POST['_csrf_token'];
            $csrf_token = new CsrfToken('token', $token);
            $csrf_token_ok = $app['csrf.token_manager']->isTokenValid($csrf_token);
            if(!$csrf_token_ok)
            {
                return $app ->redirect($app["url_generator"]->generate("index.errorCsrf"));
            }
        }
    }
});

//MiddleWare routes cote PLAYER
$app->before(function (\Symfony\Component\HttpFoundation\Request $request) use ($app) {
    $nomRoute = $request->get('_route');
    $routeClient = array("statistiques.index","game.index","game.bomberPac","game.multiplayer","friends.index","friends.showPlayers",
        "friends.add","friends.delete","player.index","player.editClient");

    if ($app['session']->get('roles') != 'PLAYER' && in_array($nomRoute,$routeClient)){
        return $app->redirect($app["url_generator"]->generate('index.erreurDroit'));
    }

    if (($app['session']->get('logged') != 1 && $nomRoute=='index.pagePlayer')){
        return $app->redirect($app["url_generator"]->generate('index.erreurDroit'));
    }
});

//MiddleWare routes cote ADMIN
$app->before(function (\Symfony\Component\HttpFoundation\Request $request) use ($app) {
    $nomRoute = $request->get('_route');
    $routeClient = array("statistiques.showAll","statistiques.editStat","player.addClientAdmin","player.showAll","player.editPlayerAdmin",
        "player.deletePlayer");

    if ($app['session']->get('roles') != 'ADMIN' && in_array($nomRoute,$routeClient)){
        return $app->redirect($app["url_generator"]->generate('index.erreurDroit'));
    }

    if (($app['session']->get('logged') != 1 && $nomRoute=='index.pageAdmin')){
        return $app->redirect($app["url_generator"]->generate('index.erreurDroit'));
    }
});

$app->run();