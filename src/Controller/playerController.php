<?php
namespace App\Controller;

use App\Model\playerModel;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;

use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;   // pour utiliser request

use Gregwar\Captcha\CaptchaBuilder;

class playerController implements ControllerProviderInterface{
    private $playerModel;

    public function index(Application $app){
        return $this->showCoordonnesPlayer($app);
    }

    public function showCoordonnesPlayer(Application $app)
    {
        $user = $app['session']->get('user_id');
        $this->playerModel = new playerModel($app);
        $clientModel = $this->playerModel->getCoordonneesClientById($user);

        return $app["twig"]->render('player_views/showCoordonnees.html.twig',['donnees'=>$clientModel]);
    }

    public function showAllPlayers(Application $app){
        $this->playerModel = new playerModel($app);
        $clientModel = $this->playerModel->getAllClient();

        return $app["twig"]->render('admin_views/showAllPlayer.html.twig',['donnees'=>$clientModel]);
    }

    public function addPlayerWithNoAccount(Application $app){
        $builder = new CaptchaBuilder();
        $builder->build();
        $_SESSION['phrase'] = $builder -> getPhrase();
        $phrase = $_SESSION['phrase'];
        $app['session']->set('phrase',$phrase);

        return $app["twig"]->render('addPlayer.html.twig', ['phrase' => $phrase, 'image' => $builder -> inline()]);
    }

    public function addPlayerAdmin(Application $app){
        $builder = new CaptchaBuilder();
        $builder->build();
        $_SESSION['phrase'] = $builder -> getPhrase();
        $phrase = $_SESSION['phrase'];
        $app['session']->set('phrase',$phrase);

        return $app["twig"]->render('admin_views/creerClient.html.twig', ['phrase' => $phrase, 'image' => $builder -> inline()]);
    }

    public function validFormAddPlayerWithNoAccount(Application $app,Request $req){
         $this->playerModel = new playerModel($app);
            if (isset($_POST['username']) && isset($_POST['motdepasse']) and isset($_POST['nom']) and isset($_POST['code_postal']) and isset($_POST['ville']) and isset($_POST['adresse']) and isset($_POST['maPhrase'])) {
                $donnees = [
                    'username' => htmlspecialchars($req->get('username')),
                    'motdepasse' => htmlspecialchars($req->get('motdepasse')),
                    'nom' => htmlspecialchars($req->get('nom')),
                    'code_postal' => htmlspecialchars($req->get('code_postal')),
                    'ville' => htmlspecialchars($req->get('ville')),
                    'adresse' => htmlspecialchars($req->get('adresse')),
                    'maPhrase'=> htmlspecialchars($req->get('maPhrase')),
                    'image'=> htmlspecialchars($req->get('image')),
                ];

                $data = $this->playerModel->getAllClient();

                if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['nom']))) $erreurs['nom']='Le nom doit être composé de 2 lettres minimum';
                if (strlen($donnees['motdepasse']) < 4) $erreurs['motdepasse']='le mot de passe doit contenir quatre caracteres minimum';
                if (strlen($donnees['username']) < 4) $erreurs['username']='Le pseudo doit être composé de 4 caracteres minimum';
                foreach ($data as $value){
                    if($donnees['username'] == $value['username']){
                        $erreurs['username']='Cette username est déjà utilisé, veuillez en prendre un autre';
                        break;
                    }
                }
                if ((! preg_match("/^[0-9]{5}/",$donnees['code_postal']))) $erreurs['code_postal']='Le code postal doit être composé de 5 chiffres';
                if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['adresse']))) $erreurs['adresse']="L'adresse doit être composé de 2 lettres minimum";
                if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['ville']))) $erreurs['ville']='La ville doit être composé de 2 lettres minimum';
                if(! is_numeric($donnees['code_postal']))$erreurs['code_postal']='Saisir une valeur numérique';
                if($donnees['maPhrase'] != $app['session']->get('phrase')) $erreurs['phrase']='Le captcha est incorrect';

                if(! empty($erreurs))
                {
                    $builder = new CaptchaBuilder();
                    $builder->build();
                    $_SESSION['phrase'] = $builder -> getPhrase();
                    $phrase = $_SESSION['phrase'];
                    $app['session']->set('phrase',$phrase);
                    if($app['session']->get('roles') == 'ADMIN') {
                        return $app["twig"]->render('admin_views/creerClient.html.twig', ['donnees' => $donnees, 'erreurs' => $erreurs, 'image' => $builder->inline(), 'phrase' => $phrase]);
                    }else{
                        return $app["twig"]->render('addPlayer.html.twig', ['donnees' => $donnees, 'erreurs' => $erreurs, 'image' => $builder->inline(), 'phrase' => $phrase]);

                    }
                }
                else
                {
                    $grainDeSel = "gsjkstzzeadsfùzrafsdf!sq!fezlkfes";
                    $hash = md5($donnees['motdepasse'].$grainDeSel);
                    $donnees['password'] = $hash;
                    $this->playerModel = new playerModel($app);
                    $this->playerModel->addClient($donnees);

                    return $app->redirect($app["url_generator"]->generate('index.index'));
                }

            }
            else
                return $app->abort(404, 'error Pb data form Add');
        }

    public function editPlayer(Application $app,$id, Request $request)
    {
        $user = $app['session']->get('user_id');
        if (!($app['session']->get('roles') == 'PLAYER' && $id == (int)$user)) {
            return $app->redirect($app["url_generator"]->generate("index.erreurDroit"));
        }

        $this->playerModel = new playerModel($app);
        $donnees = $this->playerModel->getCoordonneesClientById($id);
        return $app["twig"]->render('player_views/editCoordonnees.html.twig', ['donnees' => $donnees]);
    }

    public function editPlayerAdmin(Application $app,$id){
        $this->playerModel = new playerModel($app);
        $donnees = $this->playerModel->getCoordonneesClientById($id);
        return $app["twig"]->render('admin_views/editCoordonnees.html.twig', ['donnees' => $donnees]);
    }

    public function deletePlayer(Application $app,$id){
        $this->playerModel = new playerModel($app);
        $donnees = $this->playerModel->getCoordonneesClientById($id);
        return $app["twig"]->render('admin_views/deletePlayer.html.twig', ['donnees' => $donnees]);
    }
    public function validFormDeletePlayer(Application $app,Request $req){
        $donnees=[
            'id' => $req->get('id'),
        ];
        $this->playerModel = new playerModel($app);
        $this->playerModel->deletePlayer($donnees['id']);
        return $app->redirect($app["url_generator"]->generate("player.showAll"));
    }

    public function validFormEditPlayer(Application $app, Request $req){
        if (isset($_POST['nom']) && isset($_POST['username']) and isset($_POST['code_postal']) and isset($_POST['adresse']) and isset($_POST['id']) and isset($_POST['ville'])) {
            $donnees = [
                'nom' => htmlspecialchars($_POST['nom']),                    // echapper les entrées
                'username' => htmlspecialchars($req->get('username')),  //$app['request']-> ne focntionne plus
                'code_postal' => htmlspecialchars($req->get('code_postal')),
                'ville' => htmlspecialchars($req->get('ville')),  //$req->query->get('photo')-> ne focntionne plus
                'adresse' => htmlspecialchars($req->get('adresse')),  //$req->query->get('photo')-> ne focntionne plus
                'id' => $app->escape($req->get('id'))//$req->query->get('photo')
            ];

            if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['nom']))) $erreurs['nom']='Le nom doit être composé de 2 lettres minimum';
            if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['username']))) $erreurs['username']='Le pseudo doit être composé de 2 lettres minimum';
            if ((! preg_match("/^[0-9]{5}/",$donnees['code_postal']))) $erreurs['code_postal']='Le code postal doit être composé de 5 chiffres';
            if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['adresse']))) $erreurs['adresse']="L'adresse doit être composé de 2 lettres minimum";
            if ((! preg_match("/^[A-Za-z ]{2,}/",$donnees['ville']))) $erreurs['ville']='La ville doit être composé de 2 lettres minimum';
            if(! is_numeric($donnees['code_postal']))$erreurs['code_postal']='Saisir une valeur numérique';

            if (!empty($erreurs)) {
                $this->playerModel = new playerModel($app);
                $typeProduits = $this->playerModel->getCoordonneesClientById($donnees['id']);
                return $app["twig"]->render('player_views/editCoordonnees.html.twig',['donnees'=>$donnees,'erreurs'=>$erreurs]);
            }
            else
            {
                $this->playerModel = new playerModel($app);
                //var_dump($donnees);
                $this->playerModel->editClient($donnees);
                if ($app['session']->get('roles') == 'ADMIN'){
                    return $app->redirect($app["url_generator"]->generate("player.showAll"));
                }else{
                    return $app->redirect($app["url_generator"]->generate("player.index"));
                }
            }
        }
        else
            return $app->abort(404, 'error Pb id form edit');
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
        $index->match("/", 'App\Controller\playerController::showCoordonnesPlayer')->bind('player.index');
        $index->match("/showAllPlayers", 'App\Controller\playerController::showAllPlayers')->bind('player.showAll');

        $index->get("/addPlayer", 'App\Controller\playerController::addPlayer')->bind('player.addClient');
        $index->get("/addPlayerAdmin", 'App\Controller\playerController::addPlayerAdmin')->bind('player.addClientAdmin');
        $index->get("/addPlayerNonInscrit", 'App\Controller\playerController::addPlayerWithNoAccount')->bind('player.addPlayerWithNoAccount');

        $index->post("/addPlayer", 'App\Controller\playerController::valideFormAddPlayer')->bind('player.validFormAddPlayer');
        $index->post("/addPlayerNonInscrit", 'App\Controller\playerController::validFormAddPlayerWithNoAccount')->bind('player.validFormAddPlayerNonInscrit');

        $index->get("/editPlayer/{id}", 'App\Controller\playerController::editPlayer')->bind('player.editClient');
        $index->get("/editPlayerAdmin/{id}", 'App\Controller\playerController::editPlayerAdmin')->bind('player.editPlayerAdmin');
        $index->put("/editPlayer", 'App\Controller\playerController::validFormEditPlayer')->bind('player.valideFormEditClient');

        $index->get("/deletePlayer/{id}", 'App\Controller\playerController::deletePlayer')->bind('player.deletePlayer');
        $index->delete("/deletePlayer", 'App\Controller\playerController::validFormDeletePlayer')->bind('player.validFormDeletePlayer');

        return $index;
    }
}
