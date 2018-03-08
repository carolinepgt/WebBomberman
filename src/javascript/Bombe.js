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
var Bombe = /** @class */ (function (_super) {
    __extends(Bombe, _super);
    function Bombe(perso, posX, posY) {
        var _this = _super.call(this, "./images/bomb.png", posX, posY) || this;
        _this._personnage = perso;
        _this.portee = perso.portee;
        perso.nbBombeRestantes--;
        return _this;
    }
    Bombe.prototype.explosion = function (plateau) {
        var elements = plateau.tabElement;
        var explosion = [];
        var x = this.posX;
        var y = this.posY;
        for (var i = 0; i < 4; i++) {
            explosion[i] = 0;
            var mur = false;
            var e = null;
            var porteeReel = void 0;
            for (porteeReel = 1; porteeReel <= this.portee && !mur; porteeReel++) {
                switch (i) {
                    case 0:
                        e = elements[x][y - porteeReel];
                        break;
                    case 1:
                        e = elements[x + porteeReel][y];
                        break;
                    case 2:
                        e = elements[x][y + porteeReel];
                        break;
                    case 3:
                        e = elements[x - porteeReel][y];
                        break;
                }
                mur = e != null && e instanceof Mur;
            }
            if (mur && !e.destructible)
                porteeReel--;
            explosion[i] = porteeReel;
        }
        return explosion;
    };
    Bombe.prototype.toString = function () {
        return "B" + this._personnage.nj;
    };
    Bombe.prototype.isBombe = function () {
        return true;
    };
    Object.defineProperty(Bombe.prototype, "personnage", {
        get: function () {
            return this._personnage;
        },
        enumerable: true,
        configurable: true
    });
    return Bombe;
}(Elem));
