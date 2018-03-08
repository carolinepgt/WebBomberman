var Elem = /** @class */ (function () {
    function Elem(imageURL, posX, posY) {
        this._posX = posX;
        this._posY = posY;
    }
    Object.defineProperty(Elem.prototype, "posX", {
        get: function () {
            return this._posX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Elem.prototype, "posY", {
        get: function () {
            return this._posY;
        },
        enumerable: true,
        configurable: true
    });
    Elem.prototype.isBombe = function () {
        return false;
    };
    return Elem;
}());
