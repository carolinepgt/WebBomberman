<?php
namespace App\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Silex\ControllerCollection;   // modif version 2.0

class IndexController implements ControllerProviderInterface{

    public function index(Application $app)
    {
        if ($app['session']->get('roles') == 'PLAYER')
            return $app->redirect($app["url_generator"]->generate("index.pagePlayer"));
        if ($app['session']->get('roles') == 'ADMIN')
            return $app->redirect($app["url_generator"]->generate("index.pageAdmin"));
        //return $app["twig"]->render("backOff/backOFFICE.html.twig");

        return $app["twig"]->render("accueil.html.twig");
    }

    public function showPageAdmin(Application $app){
        return $app["twig"]->render("admin_views/accueilAdmin.html.twig");
    }

    public function showPagePlayer(Application $app){
        return $app["twig"]->render("player_views\accueilPlayer.html.twig");
    }

    public function erreurDroit(Application $app){
        return $app["twig"]->render("erreurDroit.html.twig");
    }

    public function erreurCrsf(Application $app){
        return $app["twig"]->render("error_csrf.html.twig");
    }

    /**
     * Returns routes to connect to the given application.
     *
     * @param Application $app An Application instance
     *
     * @return ControllerCollection A ControllerCollection instance
     */
    public function connect(Application $app)
    {
        // TODO: Implement connect() method.
        $index = $app['controllers_factory'];
        $index->match("/", 'App\Controller\IndexController::index')->bind('accueil');
        $index->match("/index", 'App\Controller\IndexController::index')->bind("index.index");
        $index->match("/pageError", 'App\Controller\IndexController::erreurDroit')->bind("index.erreurDroit");
        $index->match("/pageErrorToken", 'App\Controller\IndexController::erreurCrsf')->bind("index.errorCsrf");
        $index->match("/pageAdmin", 'App\Controller\IndexController::showPageAdmin')->bind("index.pageAdmin");
        $index->match("/pageplayer", 'App\Controller\IndexController::showPagePlayer')->bind("index.pagePlayer");

        return $index;
    }
}