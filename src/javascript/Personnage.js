var Personnage = /** @class */ (function () {
    function Personnage(posX, posY, couleur, nj) {
        Personnage.width = Model.elemSize - Model.elemSize / 10;
        Personnage.height = Model.elemSize - Model.elemSize / 10;
        this._posX = posX;
        this._posY = posY;
        this._nj = nj;
        this._vitesse = Model.elemSize / 10 - 1;
        this._portee = 1;
        this._vie = 1;
        this._nbBombeRestantes = 1;
        this._nbSpikeBombe = 1;
        this._changement = 1;
        this._couleur = couleur;
        this._images = [];
        for (var i = 0; i < 4; i++) {
            this._images[i] = new Image();
            this._images[i].src = "./images/SKF_" + couleur + (i + 1) + ".PNG";
        }
    }
    Object.defineProperty(Personnage.prototype, "vitesse", {
        get: function () {
            return this._vitesse;
        },
        set: function (value) {
            this._vitesse = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "nbBombeRestantes", {
        get: function () {
            return this._nbBombeRestantes;
        },
        set: function (value) {
            this._nbBombeRestantes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "portee", {
        get: function () {
            return this._portee;
        },
        set: function (value) {
            this._portee = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "vie", {
        get: function () {
            return this._vie;
        },
        set: function (value) {
            this._vie = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "nbSpikeBombe", {
        get: function () {
            return this._nbSpikeBombe;
        },
        set: function (value) {
            this._nbSpikeBombe = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "posX", {
        get: function () {
            return this._posX;
        },
        set: function (value) {
            this._posX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "posY", {
        get: function () {
            return this._posY;
        },
        set: function (value) {
            this._posY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "couleur", {
        get: function () {
            return this._couleur;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "nj", {
        get: function () {
            return this._nj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "changement", {
        get: function () {
            return this._changement;
        },
        set: function (value) {
            this._changement = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Personnage.prototype, "images", {
        get: function () {
            return this._images;
        },
        enumerable: true,
        configurable: true
    });
    Personnage.prototype.estEnVie = function () {
        return this._vie > 0;
    };
    Personnage.prototype.actualisePosition = function (plateau, north, east, south, west) {
        var elements = plateau.tabElement;
        var sizeElem = Model.elemSize;
        var modifPosition = 0;
        var bombeProbableHG = elements[Math.floor(this.posX / sizeElem)][Math.floor(this.posY / sizeElem)];
        var bombeProbableBG = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
        var bombeProbableHD = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor(this.posY / sizeElem)];
        var bombeProbableBD = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
        if (north) {
            for (var i = 0; i < this._vitesse; i++) {
                var element1 = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY - 1) / sizeElem)];
                var element2 = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY - 1) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableHD)) {
                    this._posY -= 1;
                    modifPosition = 3;
                }
            }
        }
        if (east) {
            for (var i = 0; i < this._vitesse; i++) {
                var element1 = elements[Math.floor((this.posX + Personnage.width + 1) / sizeElem)][Math.floor(this.posY / sizeElem)];
                var element2 = elements[Math.floor((this.posX + Personnage.width + 1) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHD) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBD)) {
                    this._posX += 1;
                    modifPosition = 2;
                }
            }
        }
        if (south) {
            for (var i = 0; i < this._vitesse; i++) {
                var element1 = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY + Personnage.height + 1) / sizeElem)];
                var element2 = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY + Personnage.height + 1) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableBG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBD)) {
                    this._posY += 1;
                    modifPosition = 1;
                }
            }
        }
        if (west) {
            for (var i = 0; i < this._vitesse; i++) {
                var element1 = elements[Math.floor((this.posX - 1) / sizeElem)][Math.floor(this.posY / sizeElem)];
                var element2 = elements[Math.floor((this.posX - 1) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBG)) {
                    this._posX -= 1;
                    modifPosition = 4;
                }
            }
        }
        if (modifPosition != 0)
            this.changement = modifPosition;
        return modifPosition;
    };
    /*
    Si c'est possible pose une bombe à la position du joueur
     */
    Personnage.prototype.poseBombe = function (elements, typeBombe) {
        var sizeElem = Model.elemSize;
        if (!this.estEnVie())
            return null;
        var x = Math.floor((this._posX + Personnage.width / 2) / sizeElem);
        var y = Math.floor((this._posY + Personnage.height / 2) / sizeElem);
        var element = elements[x][y];
        if (this.nbBombeRestantes > 0 && element == null) {
            var bombe = null;
            if (typeBombe == 0) {
                bombe = new Bombe(this, x, y);
            }
            if (typeBombe == 1 && this._nbSpikeBombe > 0) {
                bombe = new SpikeBombe(this, x, y);
                this.nbSpikeBombe--;
            }
            elements[x][y] = bombe;
            return bombe;
        }
        return null;
    };
    Personnage.width = 2;
    Personnage.height = 2;
    return Personnage;
}());
