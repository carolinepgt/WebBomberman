<?php
namespace App\Controller;

use App\Model\FriendsModel;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;   // pour utiliser request

class FriendsController implements ControllerProviderInterface{
    private $friendsModel;

    public function index(Application $app){
        return $this->showFriendsPlayer($app);
    }

    public function showFriendsPlayer(Application $app){
        $user = $app['session']->get('user_id');
        $this->friendsModel = new FriendsModel($app);
        $clientModel = $this->friendsModel->getAllFriends($user);

        return $app["twig"]->render('player_views/showAllFriends.html.twig',['donnees'=>$clientModel]);
    }

    public function deleteAFriend(Application $app,$id){
        $user = $app['session']->get('user_id');
        $this->friendsModel= new FriendsModel($app);
        $donneesClient = $this->friendsModel->getAFriend($user,$id);
        return $app['twig']->render('player_views/supprimerAmi.html.twig',['donneesAmi'=>$donneesClient]);
    }

    public function validFormDeleteFriend(Application $app,Request $req){
        $donnees=[
            'id' => $req->get('id'),
            'id2' => $req->get('id2')
        ];
        $this->friendsModel = new FriendsModel($app);
        $this->friendsModel->deleteFriend($donnees['id'],$donnees['id2']);
        return $app->redirect($app["url_generator"]->generate("friends.index"));
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
        $index->match("/", 'App\Controller\FriendsController::showFriendsPlayer')->bind('friends.index');

        $index->get("/delete/{id}", 'App\Controller\FriendsController::deleteAFriend')->bind('friends.delete');
        $index->delete("/delete", 'App\Controller\FriendsController::validFormDeleteFriend')->bind('friends.validFormDelete');

        return $index;
    }
}