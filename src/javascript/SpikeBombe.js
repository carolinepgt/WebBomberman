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
var SpikeBombe = /** @class */ (function (_super) {
    __extends(SpikeBombe, _super);
    function SpikeBombe(perso, posX, posY) {
        return _super.call(this, perso, posX, posY) || this;
    }
    SpikeBombe.prototype.explosion = function (plateau) {
        var elements = plateau.tabElement;
        var explosion = new Number[4];
        var x = this.posX;
        var y = this.posY;
        for (var i = 0; i < 4; i++) {
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
                mur = e != null && e instanceof Mur && !e.destructible;
            }
            if (mur && !e.destructible)
                porteeReel--;
            explosion[i] = porteeReel;
        }
        return explosion;
    };
    return SpikeBombe;
}(Bombe));
