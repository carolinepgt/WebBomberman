<?php
namespace App\Controller;

use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Silex\ControllerCollection;

class GameController implements ControllerProviderInterface{

    public function index(Application $app){
        return $this->playWithOnePlayer($app);
    }

    public function playWithOnePlayer(Application $app)
    {
        return $app["twig"]->render("Game/soloPlayer.html.twig");
    }

    public function playWithTwoPlayer(Application $app)
    {
        return $app["twig"]->render("Game/duoPlayer.html.twig");
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
        $index->match("/", 'App\Controller\GameController::index')->bind('game.index');
        $index->match("/soloPlayer", 'App\Controller\GameController::playWithOnePlayer')->bind("game.soloPlayer");
        $index->match("/duoPlayer", 'App\Controller\GameController::playWithTwoPlayer')->bind("game.duoPlayer");

        return $index;
    }
}