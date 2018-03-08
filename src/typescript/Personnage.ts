class Personnage {

    static width :number=2;
    static height :number=2;
    private _nj :number; //
    private _posX :number;
    private _posY :number;
    private _vitesse :number;
    private _nbBombeRestantes :number;
    private _portee :number;
    private _vie :number;
    private _nbSpikeBombe :number;
    private _couleur :string;
    private _changement :number;
    private _images :HTMLImageElement[];

    constructor(posX :number, posY :number, couleur :string, nj :number) {
        Personnage.width=Model.elemSize-Model.elemSize/10;
        Personnage.height=Model.elemSize-Model.elemSize/10;
        this._posX = posX;
        this._posY = posY;
        this._nj=nj;
        this._vitesse = Model.elemSize/10-1;
        this._portee=1;
        this._vie=1;
        this._nbBombeRestantes=1;
        this._nbSpikeBombe=1;
        this._changement=1;
        this._couleur = couleur;
        this._images=[];
        for (let i=0; i<4; i++){
            this._images[i]=new Image();
            this._images[i].src="./images/SKF_"+couleur+(i+1)+".PNG"
        }
    }

    get vitesse(): number {
        return this._vitesse;
    }

    set vitesse(value: number) {
        this._vitesse = value;
    }

    get nbBombeRestantes(): number {
        return this._nbBombeRestantes;
    }

    set nbBombeRestantes(value: number) {
        this._nbBombeRestantes = value;
    }

    get portee(): number {
        return this._portee;
    }

    set portee(value: number) {
        this._portee = value;
    }

    get vie(): number {
        return this._vie;
    }

    set vie(value: number) {
        this._vie = value;
    }

    get nbSpikeBombe(): number {
        return this._nbSpikeBombe;
    }

    set nbSpikeBombe(value: number) {
        this._nbSpikeBombe = value;
    }

    get posX(): number {
        return this._posX;
    }

    get posY(): number {
        return this._posY;
    }

    get couleur(): string {
        return this._couleur;
    }

    get nj(): number {
        return this._nj;
    }
    set posX(value: number) {
        this._posX = value;
    }

    set posY(value: number) {
        this._posY = value;
    }

    get changement(): number {
        return this._changement;
    }

    set changement(value: number) {
        this._changement = value;
    }


    get images(): HTMLImageElement[] {
        return this._images;
    }

    estEnVie() :boolean{
        return this._vie > 0;

    }


    actualisePosition(plateau :Plateau, north :boolean, east :boolean, south :boolean, west :boolean) :number {

        let elements :Elem[][]=plateau.tabElement;
        let sizeElem=Model.elemSize;
        let modifPosition=0;
        let bombeProbableHG :Elem = elements[Math.floor(this.posX / sizeElem)][Math.floor(this.posY / sizeElem)];
        let bombeProbableBG :Elem = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
        let bombeProbableHD :Elem = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor(this.posY / sizeElem)];
        let bombeProbableBD :Elem = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];

        if (north) {
            for (let i = 0; i < this._vitesse; i++) {
                let element1 :Elem = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY - 1) / sizeElem)];
                let element2 :Elem = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY - 1) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableHD)) {
                    this._posY-=1;
                    modifPosition=3;
                }
            }
        }
        if (east) {
            for (let i = 0; i < this._vitesse; i++) {
                let element1 :Elem = elements[Math.floor((this.posX + Personnage.width + 1) / sizeElem)][Math.floor(this.posY / sizeElem)];
                let element2 :Elem = elements[Math.floor((this.posX + Personnage.width + 1) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHD) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBD)) {
                    this._posX += 1;
                    modifPosition = 2;
                }
            }
        }

        if (south) {
            for (let i = 0; i < this._vitesse; i++) {
                let element1 :Elem = elements[Math.floor(this.posX / sizeElem)][Math.floor((this.posY + Personnage.height + 1) / sizeElem)];
                let element2 :Elem = elements[Math.floor((this.posX + Personnage.width) / sizeElem)][Math.floor((this.posY + Personnage.height + 1) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableBG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBD)) {
                    this._posY+= 1;
                    modifPosition=1;
                }
            }
        }
        if (west) {
            for (let i = 0; i < this._vitesse; i++) {
                let element1 :Elem = elements[Math.floor((this.posX - 1) / sizeElem)][Math.floor(this.posY / sizeElem)];
                let element2 :Elem = elements[Math.floor((this.posX - 1) / sizeElem)][Math.floor((this.posY + Personnage.height) / sizeElem)];
                if ((element1 == null || element1 instanceof Effet || element1 == bombeProbableHG) && (element2 == null || element2 instanceof Effet || element2 == bombeProbableBG)) {
                    this._posX -= 1;
                    modifPosition = 4;
                }
            }
        }
        if (modifPosition!=0)  this.changement=modifPosition;
        return modifPosition;
    }


    /*
    Si c'est possible pose une bombe à la position du joueur
     */
    poseBombe( elements :Elem[][], typeBombe :number) :Bombe{
        let sizeElem :number=Model.elemSize;
        if (!this.estEnVie()) return null;
        let x :number= Math.floor((this._posX + Personnage.width / 2) / sizeElem);
        let y :number= Math.floor((this._posY + Personnage.height / 2) / sizeElem);
        let element :Elem= elements[x][y];


        if (this.nbBombeRestantes > 0 && element == null) {
            let bombe :Bombe=null;
            if (typeBombe==0){
                bombe = new Bombe(this, x, y);
            }
            if (typeBombe==1 && this._nbSpikeBombe>0){
                bombe = new SpikeBombe(this, x, y);
                this.nbSpikeBombe--;
            }
            elements[x][y]=bombe;
            return bombe;
        }
        return null;
    }

}