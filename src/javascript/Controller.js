var Controller = /** @class */ (function () {
    function Controller(model, view, reseau) {
        this.model = model;
        this.view = view;
        var nbJoueur = model.tabPerso.length;
        this.goNorth = [];
        this.goEast = [];
        this.goSouth = [];
        this.goWest = [];
        this.bombe = [];
        this.changement = [];
        this.messageServeur = "";
        this.ligne = reseau;
        for (var i = 0; i < nbJoueur; i++) {
            this.goNorth[i] = false;
            this.goEast[i] = false;
            this.goSouth[i] = false;
            this.goWest[i] = false;
            this.bombe[i] = false;
            this.changement[i] = 0;
        }
        if (this.ligne) {
            this.recupereIdPartie();
            this.recupereEtat();
        }
        else
            this.nj = 1;
        this.start();
    }
    Controller.prototype.recupereIdPartie = function () {
        var _this = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var m = xmlhttp.responseText.split(",");
                _this.idPartie = parseInt(m[0]);
                _this.nbJoueur = parseInt(m[1]);
                _this.nj = parseInt(m[2]);
            }
        };
        xmlhttp.open("GET", "RecupereId.php", true);
        xmlhttp.send();
    };
    Controller.prototype.start = function () {
        var _this = this;
        window.onkeydown = function (event) {
            var key = window.event ? event.keyCode : event.which;
            if (key == 122 || key == 90)
                _this.goNorth[0] = true;
            if (key == 100 || key == 68)
                _this.goEast[0] = true;
            if (key == 115 || key == 83)
                _this.goSouth[0] = true;
            if (key == 113 || key == 81)
                _this.goWest[0] = true;
            if (key == 32)
                _this.toucheBombe(0, 0);
            if (!_this.ligne) {
                if (key == 38)
                    _this.goNorth[1] = true;
                if (key == 39)
                    _this.goEast[1] = true;
                if (key == 40)
                    _this.goSouth[1] = true;
                if (key == 37)
                    _this.goWest[1] = true;
                if (key == 96)
                    _this.toucheBombe(1, 0);
            }
            return false;
        };
        window.onkeyup = function (event) {
            var key = window.event ? event.keyCode : event.which;
            if (key == 122 || key == 90)
                _this.goNorth[0] = false;
            if (key == 100 || key == 68)
                _this.goEast[0] = false;
            if (key == 115 || key == 83)
                _this.goSouth[0] = false;
            if (key == 113 || key == 81)
                _this.goWest[0] = false;
            if (!_this.ligne) {
                if (key == 38)
                    _this.goNorth[1] = false;
                if (key == 39)
                    _this.goEast[1] = false;
                if (key == 40)
                    _this.goSouth[1] = false;
                if (key == 37)
                    _this.goWest[1] = false;
            }
            return false;
        };
    };
    /*
    Gère les déplacements du personnages en fonction des attributs activé par la pression des touches
     */
    Controller.prototype.actualisePostion = function () {
        if (this.nj == 1) {
            if (this.ligne)
                this.recupereAction();
            for (var i = 0; i < this.model.tabPerso.length; i++) {
                var perso = this.model.tabPerso[i];
                perso.actualisePosition(this.model.plateau, this.goNorth[i], this.goEast[i], this.goSouth[i], this.goWest[i]);
                this.verifieEffet(perso);
            }
            if (this.ligne)
                this.actualiseEtat();
        }
        else {
            this.actualiseAction();
            this.recupereEtat();
        }
        this.view.afficheVue();
    };
    Controller.prototype.toucheBombe = function (i, typeBombe) {
        var _this = this;
        if (this.nj == 1) {
            var bomb_1 = this.model.tabPerso[i].poseBombe(this.model.plateau.tabElement, typeBombe);
            if (bomb_1 != null) {
                setTimeout(function () {
                    _this.suppressionElement(bomb_1.posX, bomb_1.posY);
                }, 2000);
            }
        }
        else
            this.bombe[this.nj - 1] = true;
    };
    /*
    Supprime l'élement envoyé en paramètre
     */
    Controller.prototype.suppressionElement = function (x, y) {
        var elements = this.model.plateau.tabElement;
        var element = elements[x][y];
        if (element == null || !(element instanceof Effet)) {
            for (var i = 0; i < this.model.tabPerso.length; i++) {
                var perso = this.model.tabPerso[i];
                if (Math.floor(perso.posX / Model.elemSize) == x && Math.floor(perso.posY / Model.elemSize) == y)
                    perso.vie--;
            }
        }
        if (element != null) {
            if (!(element instanceof Mur && !element.destructible)) {
                elements[x][y] = null;
                if (element instanceof Mur) {
                    var mur = element;
                    model.plateau.tabElement[mur.posX][mur.posY] = mur.effet;
                }
                if (element.isBombe()) {
                    this.explosionBombe(element);
                }
            }
        }
    };
    /*
    Gère l'explosion de la bombe: les elements en ligne et à portée de la bombe sont détruit, les joueurs dans cette zone subissent des degats
     */
    Controller.prototype.explosionBombe = function (bombe) {
        bombe.personnage.nbBombeRestantes++;
        var explosion = bombe.explosion(this.model.plateau);
        for (var i = 1; i < explosion[0]; i++)
            this.suppressionElement(bombe.posX, bombe.posY - i);
        for (var i = 1; i < explosion[1]; i++)
            this.suppressionElement(bombe.posX + i, bombe.posY);
        for (var i = 1; i < explosion[2]; i++)
            this.suppressionElement(bombe.posX, bombe.posY + i);
        for (var i = 1; i < explosion[3]; i++)
            this.suppressionElement(bombe.posX - i, bombe.posY);
        view.explosionsRange.splice(view.explosionsRange.length, 0, explosion);
        view.explosionBombe.splice(view.explosionBombe.length, 0, bombe);
        setTimeout(function () {
            view.explosionsRange.splice(0, 1);
            view.explosionBombe.splice(0, 1);
        }, 200);
        view.afficheRange(explosion, bombe);
    };
    /*
    Applique un ou les effets présents a l'emplacement du déplacement du personnages,
     */
    Controller.prototype.verifieEffet = function (perso) {
        var elements = this.model.plateau.tabElement;
        var elementsAVerifier = [];
        elementsAVerifier[0] = elements[Math.floor(perso.posX / Model.elemSize)][Math.floor(perso.posY / Model.elemSize)];
        elementsAVerifier[1] = elements[Math.floor((perso.posX + Personnage.width) / Model.elemSize)][Math.floor(perso.posY / Model.elemSize)];
        elementsAVerifier[2] = elements[Math.floor((perso.posX + Personnage.width) / Model.elemSize)][Math.floor((perso.posY + Personnage.height) / Model.elemSize)];
        elementsAVerifier[3] = elements[Math.floor(perso.posX / Model.elemSize)][Math.floor((perso.posY + Personnage.height) / Model.elemSize)];
        for (var i = 0; i < 4; i++) {
            if (elementsAVerifier[i] != null && elementsAVerifier[i] instanceof Effet) {
                var elementIdentique = false;
                for (var j = 0; j < i; j++) {
                    if (elementsAVerifier[i] == elementsAVerifier[j])
                        elementIdentique = true;
                }
                if (!elementIdentique) {
                    elementsAVerifier[i].appliqueEffet(perso);
                    this.suppressionElement(elementsAVerifier[i].posX, elementsAVerifier[i].posY);
                }
            }
        }
    };
    Controller.prototype.actualiseEtat = function () {
        var message = "";
        for (var i = 0; i < model.plateau.tabElement.length; i++) {
            for (var j = 0; j < model.plateau.tabElement.length; j++) {
                var e = model.plateau.tabElement[i][j];
                if (e == null)
                    message += "N-";
                else
                    message += e.toString() + "-";
            }
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "ActualiseEtat.php?idPartie=" + this.idPartie + "&etat=" + message, true);
        xmlhttp.send();
    };
    Controller.toObject = function (x, y, s) {
        var tabE = model.plateau.tabElement;
        if (s == "N") {
            tabE[x][y] = null;
            return;
        }
        if (s == "MI") {
            tabE[x][y] = new Mur(false, x, y);
            return;
        }
        for (var i = 0; i < 6; i++) {
            if (s == "M" + i) {
                tabE[x][y] = new Mur(true, x, y);
                tabE[x][y].ajouteEffet(i);
                return;
            }
        }
    };
    Controller.prototype.recupereEtat = function () {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var rep = xmlhttp.responseText;
                var m = rep.split("-");
                var taille = model.plateau.tabElement.length;
                for (var i = 0; i < taille; i++) {
                    for (var j = 0; j < taille; j++) {
                        Controller.toObject(i, j, m[i * taille + j]);
                    }
                }
                view.afficheVue();
            }
        };
        xmlhttp.open("GET", "RecupereEtat.php?idPartie=" + this.idPartie, true);
        xmlhttp.send();
    };
    Controller.prototype.recupereAction = function () {
        var _this = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var rep = xmlhttp.responseText.split(",");
                for (var i = 0; i < rep.length; i++) {
                    var m = rep[i];
                    var n = parseInt("" + m[0]);
                    _this.goNorth[n] = m[1] == '1';
                    _this.goEast[n] = m[2] == '1';
                    _this.goSouth[n] = m[3] == '1';
                    _this.goWest[n] = m[4] == '1';
                    _this.bombe[n] = m[5] == '1';
                }
            }
        };
        xmlhttp.open("GET", "RecupereAction.php?idPartie=" + this.idPartie, true);
        xmlhttp.send();
    };
    Controller.prototype.actualiseAction = function () {
        var message = "" + this.nj;
        if (this.goNorth[this.nj])
            message += 1;
        else
            message += 0;
        if (this.goEast[this.nj])
            message += 1;
        else
            message += 0;
        if (this.goSouth[this.nj])
            message += 1;
        else
            message += 0;
        if (this.goWest[this.nj])
            message += 1;
        else
            message += 0;
        if (this.bombe[this.nj])
            message += 1;
        else
            message += 0;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "ActualiseAction.php?idPartie=" + this.idPartie + "&nj=" + this.nj + "&action=" + message, true);
        xmlhttp.send();
    };
    return Controller;
}());
