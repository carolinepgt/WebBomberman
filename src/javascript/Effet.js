var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Effet = /** @class */ (function (_super) {
    __extends(Effet, _super);
    /*

    1 : Bonus portee;
    2 : Bonus nbBombe;
    3 : Bonus vie;
    4 : Bonus vitesse;
    5 : Bonus penetrator;

     */
    function Effet(posX, posY) {
        var _this = _super.call(this, "", posX, posY) || this;
        _this.typeEffetCreation();
        return _this;
    }
    Effet.prototype.typeEffetCreation = function () {
        this._typeEffet = Math.floor(Math.random() * 5 + 1);
    };
    Effet.prototype.appliqueEffet = function (perso) {
        switch (this._typeEffet) {
            case 1:
                if (perso.portee < 6)
                    perso.portee++;
                break;
            case 2:
                perso.nbBombeRestantes++;
                break;
            case 3:
                if (perso.vie < 3)
                    perso.vie++;
                break;
            case 4:
                if (perso.vitesse < 4)
                    perso.vitesse++;
                break;
            case 5:
                perso.nbSpikeBombe++;
                break;
        }
    };
    Object.defineProperty(Effet.prototype, "typeEffet", {
        get: function () {
            return this._typeEffet;
        },
        enumerable: true,
        configurable: true
    });
    Effet.prototype.toString = function () {
        return "" + this._typeEffet;
    };
    return Effet;
}(Elem));
