<?php
namespace App\Controller;

use App\Model\StatistiquesModel;
use Silex\Application;
use Silex\Api\ControllerProviderInterface;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;   // pour utiliser request

class StatistiquesController implements ControllerProviderInterface{
    private $statistiquesModel;

    public function index(Application $app){
        return $this->showStatistiques($app);
    }

    public function showStatistiques(Application $app)
    {
        $user = $app['session']->get('user_id');
        $this->statistiquesModel = new StatistiquesModel($app);
        $statModel = $this->statistiquesModel->getStatistiquesByPlayer($user);

        return $app["twig"]->render('player_views/showStat.html.twig',['donnees'=>$statModel]);
    }

    public function showAllStats(Application $app){
        $this->statistiquesModel = new StatistiquesModel($app);
        $statModel = $this->statistiquesModel->getAllStat();

        return $app["twig"]->render('admin_views/showAllStats.html.twig',['donnees'=>$statModel]);
    }

    public function editStat(Application $app,$id){
        $this->statistiquesModel = new StatistiquesModel($app);
        $statModel = $this->statistiquesModel->getStatistiquesByPlayer($id);

        return $app["twig"]->render('admin_views/editStat.html.twig',['donnees'=>$statModel]);
    }

    public function validFormEditStat(Application $app, Request $req){
        if (isset($_POST['nbKill']) && isset($_POST['nbMort']) and isset($_POST['idUsers'])) {
            $donnees = [
                'idUsers' =>htmlspecialchars($_POST['idUsers']),
                'nbKill' => htmlspecialchars($_POST['nbKill']),                    // echapper les entrées
                'nbMort' => htmlspecialchars($req->get('nbMort'))  //$app['request']-> ne focntionne plus
            ];

            if(! is_numeric($donnees['nbKill']))$erreurs['nbKill']='Saisir une valeur numérique';
            if(! is_numeric($donnees['nbMort']))$erreurs['nbMort']='Saisir une valeur numérique';

            if (!empty($erreurs)) {
                $this->statistiquesModel = new StatistiquesModel($app);
                $stat = $this->statistiquesModel->getStatistiquesByPlayer($donnees['idUsers']);
                return $app["twig"]->render('admin_views/editStat.html.twig',['donnees'=>$donnees,'erreurs'=>$erreurs]);
            }
            else
            {
                $this->statistiquesModel = new StatistiquesModel($app);
                //var_dump($donnees);
                $this->statistiquesModel->editStat($donnees);

                return $app->redirect($app["url_generator"]->generate("statistiques.showAll"));
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
        $index->match("/", 'App\Controller\StatistiquesController::index')->bind('statistiques.index');
        $index->match("/showAllStats", 'App\Controller\StatistiquesController::showAllStats')->bind('statistiques.showAll');

        $index->get("/editStat/{id}", 'App\Controller\StatistiquesController::editStat')->bind('statistiques.editStat');
        $index->put("/editStat", 'App\Controller\StatistiquesController::validFormEditStat')->bind('statistiques.validFormEditStat');

        return $index;
    }
}
