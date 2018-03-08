var Plateau = /** @class */ (function () {
    function Plateau(size) {
        this._tabElement = [];
        for (var x = 0; x < size; x++) {
            this.tabElement[x] = [];
            for (var y = 0; y < size; y++) {
                this.tabElement[x][y] = null;
                if (x == 0 || y == 0 || x == size - 1 || y == size - 1) {
                    this._tabElement[x][y] = new Mur(false, x, y);
                }
                else if (x % 2 == 0 && y % 2 == 0) {
                    this._tabElement[x][y] = new Mur(false, x, y);
                }
                else if (!(x <= 2 && y <= 2) && !(x >= size - 3 && y >= size - 3) && (x % 2 != 0 || y % 2 != 0)) {
                    this._tabElement[x][y] = new Mur(true, x, y);
                }
            }
        }
    }
    Object.defineProperty(Plateau.prototype, "tabElement", {
        get: function () {
            return this._tabElement;
        },
        enumerable: true,
        configurable: true
    });
    return Plateau;
}());
