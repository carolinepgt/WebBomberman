<?php
namespace App\Controller;

use App\Model\GameModel;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Silex\ControllerCollection;
use function Sodium\add;
use Symfony\Component\HttpFoundation\Request;

class GameController implements ControllerProviderInterface{
    private $gameModel;

    public function index(Application $app){
        return $this->playWithTwoPlayer($app);
    }

    public function playWithTwoPlayer(Application $app)
    {
        return $app["twig"]->render("Game/duoPlayer.html.twig");
    }

    public function createAGame(Application $app){
        return $app["twig"]->render("Game/creerPartie.html.twig");
    }

    public function validFormCreateGame(Application $app,Request $req){
        if (isset($_POST['nomPartie']) && isset($_POST['nbJoueursAttendus'])) {
            $donnees = [
                'nomPartie' => htmlspecialchars($_POST['nomPartie']),                    // echapper les entrées
                'nbJoueursAttendus' => htmlspecialchars($req->get('nbJoueursAttendus'))  //$app['request']-> ne focntionne plus
            ];

            if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['nomPartie']))) $erreurs['nomPartie']='Le nom de la parite doit être composé de 2 lettres minimum';
            if(! is_numeric($donnees['nbJoueursAttendus']))$erreurs['nbJoueursAttendus']='Saisir une valeur numérique';

            if (!empty($erreurs)) {
                return $app["twig"]->render('Game/creerPartie.html.twig',['donnees'=>$donnees,'erreurs'=>$erreurs]);
            }
            else
            {
                $user = $app['session']->get('user_id');
                $this->gameModel = new GameModel($app);
                $gameModel = $this->gameModel->addPartie($donnees,$user);
                $nbJoueursInPartie = $this->gameModel->getJoueursDansPartie($gameModel);
                $donne=array(
                    'nj'=>$nbJoueursInPartie['nbJoueursDansPartie'],
                    'idPartie'=>$gameModel
                );

                while($nbJoueursInPartie['nbJoueursDansPartie']<$nbJoueursInPartie['nbJoueursAttendus']){
                    $nbJoueursInPartie = $this->gameModel->getJoueursDansPartie($gameModel);
                }

                //retour par défaut à modifier lors du lancement de la partie
                return $app["twig"]->render('Game/game.html.twig',['donne'=>$donne]);
            }
        }
        else
            return $app->abort(404, 'error Pb id form edit');
    }

    public function showAllGames(Application $app){
        $this->gameModel = new GameModel($app);
        $gameModel = $this->gameModel->getAllParties();

        return $app["twig"]->render('Game/allParties.html.twig',['donnees'=>$gameModel]);
    }


    public function goInPartie(Application $app,$idPartie){
        $user = $app['session']->get('user_id');
        $this->gameModel = new GameModel($app);
        $this->gameModel->rejoindrePartie($idPartie,$user);
        $nbJoueursInPartie = $this->gameModel->getJoueursDansPartie($idPartie);
        $this->gameModel->updateParties($nbJoueursInPartie['nbJoueursDansPartie'],$idPartie);
        $nbJoueursInPartie = $this->gameModel->getJoueursDansPartie($idPartie);
        $donne=array(
            'nj'=>$nbJoueursInPartie['nbJoueursDansPartie'],
            'idPartie'=>$this->gameModel->getIdPartie()
        );
        $etatPartie = $this->gameModel->getEtatPartie($idPartie);

        while($nbJoueursInPartie['nbJoueursDansPartie']<$nbJoueursInPartie['nbJoueursAttendus'] && $etatPartie['etat'] == null){
            $nbJoueursInPartie = $this->gameModel->getJoueursDansPartie($idPartie);
            $etatPartie = $this->gameModel->getEtatPartie($idPartie);
        }
        //retour par défaut à modifier pour lancer une partie
        return $app["twig"]->render('Game/game.html.twig',['donne'=>$donne]);
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
        $index->match("/duoPlayer", 'App\Controller\GameController::playWithTwoPlayer')->bind("game.duoPlayer");

        $index->get("/createGame", 'App\Controller\GameController::createAGame')->bind("game.createGame");
        $index->post("/createGame", 'App\Controller\GameController::validFormCreateGame')->bind("game.validFormCreatePartie");
        $index->get("/goInPartie/{idPartie}", 'App\Controller\GameController::goInPartie')->bind("game.goInPartie");
        $index->match("/showAllGames", 'App\Controller\GameController::showAllGames')->bind("game.showAllParties");

        return $index;
    }
}