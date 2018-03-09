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

    public function playToBomberPac(Application $app){
        return $app["twig"]->render("Game/bomberPac.html.twig");
    }

    public function playToMultiplayer(Application $app){
        return $app["twig"]->render("Game/multiplayer.html.twig");
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
        $index->match("/bomberPac", 'App\Controller\GameController::playToBomberPac')->bind("game.bomberPac");
        $index->match("/multiplayer", 'App\Controller\GameController::playToMultiplayer')->bind("game.multiplayer");

        return $index;
    }
}