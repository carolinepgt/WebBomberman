var View = /** @class */ (function () {
    function View(model) {
        this.model = model;
        this.canvas = document.getElementById('canvas');
        this.start();
        this.afficheVue();
    }
    View.prototype.start = function () {
        this.images = [];
        for (var i = 0; i < 8; i++) {
            this.images[i] = new Image();
        }
        this.images[0].src = document.location.href + "/../../../../images/murCassable.jpg";
        this.images[1].src = document.location.href + "/../../../../images/Mur2.png";
        this.images[2].src = document.location.href + "/../../../../images/bomb.png";
        this.images[3].src = document.location.href + "/../../../../images/portee30_30.png";
        this.images[4].src = document.location.href + "/../../../../images/bonusBombe30_30.png";
        this.images[5].src = document.location.href + "/../../../../images/vie30_30.png";
        this.images[6].src = document.location.href + "/../../../../images/sonic30_30.png";
        this.images[7].src = document.location.href + "/../../../../images/penetrator30_30.png";
        this.imagesExplo = [];
        for (var i = 0; i < 7; i++) {
            this.imagesExplo[i] = new Image();
            this.imagesExplo[i].src = document.location.href + "/../../../../images/ExplosionOrange" + i + ".png";
        }
        this.imagesExplo[0].src = document.location.href + "/../../../../images/ExplosionOrange0.jpg";
        this._explosionsRange = [];
        this._explosionBombe = [];
        var elements = this.model.plateau.tabElement;
        var ctx = this.canvas.getContext('2d');
        var elemSize = Model.elemSize;
        var size = this.model.plateau.tabElement.length;
        for (var i = 0; i < size; i++) {
            var _loop_1 = function (j) {
                var element = elements[i][j];
                if (element != null) {
                    var image_1;
                    if (element instanceof Mur) {
                        if (element.destructible)
                            image_1 = this_1.images[0];
                        else
                            image_1 = this_1.images[1];
                    }
                    else if (element instanceof Bombe)
                        image_1 = this_1.images[2];
                    else if (element instanceof Effet)
                        image_1 = this_1.images[element.typeEffet + 2];
                    image_1.addEventListener('load', function () {
                        ctx.drawImage(image_1, element.posX * elemSize, element.posY * elemSize, elemSize, elemSize);
                    });
                }
            };
            var this_1 = this;
            for (var j = 0; j < size; j++) {
                _loop_1(j);
            }
        }
        var _loop_2 = function (i) {
            var perso = this_2.model.tabPerso[i];
            perso.images[perso.changement].addEventListener('load', function () {
                ctx.drawImage(perso.images[perso.changement - 1], perso.posX, perso.posY, elemSize, elemSize);
            });
        };
        var this_2 = this;
        for (var i = 0; i < this.model.tabPerso.length; i++) {
            _loop_2(i);
        }
    };
    View.prototype.afficheVue = function () {
        var elements = this.model.plateau.tabElement;
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var size = this.model.plateau.tabElement.length;
        var elemSize = Model.elemSize;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var element = elements[i][j];
                if (element != null) {
                    var image = void 0;
                    if (element instanceof Mur) {
                        if (element.destructible)
                            image = this.images[0];
                        else
                            image = this.images[1];
                    }
                    else if (element instanceof Bombe)
                        image = this.images[2];
                    else if (element instanceof Effet)
                        image = this.images[element.typeEffet + 2];
                    ctx.drawImage(image, element.posX * elemSize, element.posY * elemSize, elemSize, elemSize);
                }
            }
        }
        for (var i = 0; i < this.model.tabPerso.length; i++) {
            var perso = this.model.tabPerso[i];
            if (perso.estEnVie()) {
                ctx.drawImage(perso.images[perso.changement - 1], perso.posX, perso.posY, elemSize, elemSize);
            }
        }
        if (!this.model.partieFini()) {
            for (var i = 0; i < this.explosionBombe.length; i++) {
                this.afficheRange(this.explosionsRange[i], this.explosionBombe[i]);
            }
        }
    };
    View.prototype.afficheRange = function (explosion, bombe) {
        var ctx = this.canvas.getContext('2d');
        var rayon;
        var elemSize = Model.elemSize;
        ctx.drawImage(this.imagesExplo[0], bombe.posX * elemSize, (bombe.posY) * elemSize, elemSize, elemSize);
        for (var j = 0; j < 4; j++) {
            rayon = explosion[j];
            for (var i = 1; i < rayon; i++) {
                var image = void 0;
                if (i < rayon - 1) {
                    image = this.imagesExplo[j % 2 + 1];
                }
                else {
                    image = this.imagesExplo[3 + j];
                }
                switch (j) {
                    case 0:
                        ctx.drawImage(image, bombe.posX * elemSize, (bombe.posY - i) * elemSize, elemSize, elemSize);
                        break;
                    case 1:
                        ctx.drawImage(image, (bombe.posX + i) * elemSize, bombe.posY * elemSize, elemSize, elemSize);
                        break;
                    case 2:
                        ctx.drawImage(image, bombe.posX * elemSize, (bombe.posY + i) * elemSize, elemSize, elemSize);
                        break;
                    case 3:
                        ctx.drawImage(image, (bombe.posX - i) * elemSize, bombe.posY * elemSize, elemSize, elemSize);
                        break;
                }
            }
        }
    };
    Object.defineProperty(View.prototype, "explosionsRange", {
        get: function () {
            return this._explosionsRange;
        },
        set: function (value) {
            this._explosionsRange = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "explosionBombe", {
        get: function () {
            return this._explosionBombe;
        },
        set: function (value) {
            this._explosionBombe = value;
        },
        enumerable: true,
        configurable: true
    });
    return View;
}());
