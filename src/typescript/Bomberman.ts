let model :Model = new Model(2,17, 35);
let view :View = new View(model);
let controller :Controller = new Controller(model, view);

let boucle=setInterval(function() {
    controller.actualisePostion();
    if (model.partieFini()){
        setTimeout(()=>{alert("Le joueur n°"+(this.model.gagnant().nj+1)+" à gagné !");}, 50);
        clearInterval(boucle);
    }
}, 30);

