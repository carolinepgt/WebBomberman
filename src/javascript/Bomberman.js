var model = new Model(2, 17, 35);
var view = new View(model);
var controller = new Controller(model, view, false);
var boucle = setInterval(function () {
    var _this = this;
    controller.actualisePostion();
    if (model.partieFini()) {
        setTimeout(function () { alert("Le joueur n°" + (_this.model.gagnant().nj + 1) + " à gagné !"); }, 50);
        clearInterval(boucle);
    }
}, 30);
