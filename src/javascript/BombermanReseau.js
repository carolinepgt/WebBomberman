var modelR = new Model(2, 17, 35);
var viewR = new View(modelR);
var controllerR = new Controller(modelR, viewR, true);
var boucleR = setInterval(function () {
    controllerR.actualisePostion();
    if (modelR.partieFini()) {
        setTimeout(function () { alert("Le joueur n°" + (modelR.gagnant().nj + 1) + " à gagné !"); }, 50);
        clearInterval(boucleR);
    }
}, 30);
