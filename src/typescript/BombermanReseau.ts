let modelR :Model = new Model(2,17, 35);
let viewR :View = new View(modelR);
let controllerR :Controller = new Controller(modelR, viewR,true);

let boucleR=setInterval(function() {
    controllerR.actualisePostion();
    if (modelR.partieFini()){
        setTimeout(()=>{alert("Le joueur n°"+(modelR.gagnant().nj+1)+" à gagné !");}, 50);
        clearInterval(boucleR);
    }
}, 30);

