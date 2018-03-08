var Model = /** @class */ (function () {
    function Model(nbJoueurs, size, elemSize) {
        Model.elemSize = elemSize;
        this._plateau = new Plateau(size);
        this._tabPerso = [];
        this._tabPerso[0] = new Personnage(elemSize, elemSize, "Bleu", 0);
        this._tabPerso[1] = new Personnage((size - 2) * elemSize, (size - 2) * elemSize, "Orange", 1);
    }
    Object.defineProperty(Model.prototype, "tabPerso", {
        get: function () {
            return this._tabPerso;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "plateau", {
        get: function () {
            return this._plateau;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.gagnant = function () {
        for (var i = 0; i < this._tabPerso.length; i++) {
            var perso = this._tabPerso[i];
            if (perso.estEnVie())
                return perso;
        }
        return null;
    };
    Model.prototype.partieFini = function () {
        var nbJoueurEnVie = 0;
        this._tabPerso.forEach(function (perso) {
            if (perso.estEnVie())
                nbJoueurEnVie++;
        });
        return nbJoueurEnVie <= 1;
    };
    return Model;
}());
