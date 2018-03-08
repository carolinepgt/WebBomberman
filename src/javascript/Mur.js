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
var Mur = /** @class */ (function (_super) {
    __extends(Mur, _super);
    function Mur(destructible, x, y) {
        var _this = _super.call(this, "", x, y) || this;
        if (Math.floor(Math.random() * 4) == 0) {
            _this._effet = new Effet(_this.posX, _this.posY);
        }
        _this._destructible = destructible;
        return _this;
    }
    Object.defineProperty(Mur.prototype, "destructible", {
        /*
        public Mur(boolean destructible, int posX, int posY, int effet) {
            super(destructible, posX, posY);
            if (effet!=0) this.effet = new Effet(effet, getPosX(), getPosY());
    
            Destructible = destructible;
        }
        */
        get: function () {
            return this._destructible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mur.prototype, "effet", {
        get: function () {
            return this._effet;
        },
        enumerable: true,
        configurable: true
    });
    Mur.prototype.toString = function () {
        if (!this._destructible)
            return "MI";
        if (this.effet == null)
            return "M0";
        return "M" + this.effet.toString();
    };
    return Mur;
}(Elem));
