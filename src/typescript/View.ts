class View{

    private model :Model;
    private images :HTMLImageElement[];
    private imagesExplo :HTMLImageElement[];
    private canvas :HTMLCanvasElement;
    private _explosionsRange :number[][];
    private _explosionBombe :Bombe[];

    constructor(model :Model){
        this.model=model;
        this.canvas=<HTMLCanvasElement> document.getElementById('canvas');
        this.start();
        this.afficheVue();
    }


    public start() :void {
        this.images = [];
        for (let i = 0; i < 8; i++) {
            this.images[i]=new Image();
        }
        this.images[0].src = "./images/murCassable.jpg";
        this.images[1].src = "./images/Mur2.png";
        this.images[2].src = "./images/bomb.png";
        this.images[3].src = "./images/portee30_30.png";
        this.images[4].src = "./images/bonusBombe30_30.png";
        this.images[5].src = "./images/vie30_30.png";
        this.images[6].src = "./images/sonic30_30.png";
        this.images[7].src = "./images/penetrator30_30.png";

        this.imagesExplo = [];
        for (let i = 0; i < 7; i++) {
            this.imagesExplo[i]=new Image();
            this.imagesExplo[i].src = "images/ExplosionOrange"+i+".png";
        }
        this.imagesExplo[0].src = "images/ExplosionOrange0.jpg";

        this._explosionsRange=[];
        this._explosionBombe=[];

        let elements :Elem[][] = this.model.plateau.tabElement;
        let ctx = this.canvas.getContext('2d');
        let elemSize=Model.elemSize;
        let size=model.plateau.tabElement.length;
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                let element :Elem=elements[i][j];
                if (element!=null){
                    let image;
                    if (element instanceof Mur){
                        if ((<Mur>element).destructible) image=this.images[0];
                        else image=this.images[1];
                    }
                    else if (element instanceof Bombe) image=this.images[2];
                    else if (element instanceof Effet) image=this.images[(<Effet>element).typeEffet+2];

                    image.addEventListener('load',function () {
                        ctx.drawImage(image, element.posX*elemSize, element.posY*elemSize, elemSize, elemSize);
                    })
                }
            }
        }
        for (let i=0; i<this.model.tabPerso.length; i++){
            let perso :Personnage =this.model.tabPerso[i];
            perso.images[perso.changement].addEventListener('load',function () {
                ctx.drawImage(perso.images[perso.changement-1], perso.posX, perso.posY, elemSize, elemSize);
            })
        }
    }

    public afficheVue() :void {
        let elements: Elem[][] = this.model.plateau.tabElement;
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let size=model.plateau.tabElement.length;
        let elemSize=Model.elemSize;
        for (let i=0; i<size; i++){
            for (let j=0; j<size; j++){
                let element: Elem = elements[i][j];
                if (element != null) {
                    let image;
                    if (element instanceof Mur) {
                        if ((<Mur>element).destructible) image = this.images[0];
                        else image = this.images[1];
                    }
                    else if (element instanceof Bombe) image = this.images[2];
                    else if (element instanceof Effet) image = this.images[(<Effet>element).typeEffet + 2];

                    ctx.drawImage(image, element.posX * elemSize, element.posY * elemSize, elemSize, elemSize);
                }
            }
        }
        for (let i = 0; i < this.model.tabPerso.length; i++) {
            let perso: Personnage = this.model.tabPerso[i];
            if (perso.estEnVie()) {
                ctx.drawImage(perso.images[perso.changement - 1], perso.posX, perso.posY, elemSize, elemSize);

            }
        }
        if (!this.model.partieFini()) {
            for (let i = 0; i < this.explosionBombe.length; i++) {
                this.afficheRange(this.explosionsRange[i], this.explosionBombe[i])
            }
        }
    }

    afficheRange(explosion: number[], bombe: Bombe) :void{

        let ctx = this.canvas.getContext('2d');
        let rayon :number;

        let elemSize=Model.elemSize;
        ctx.drawImage(this.imagesExplo[0], bombe.posX * elemSize, (bombe.posY) * elemSize, elemSize, elemSize);

        for (let j=0; j<4; j++) {
            rayon = explosion[j];
            for (let i = 1; i < rayon; i++) {
                let image: HTMLImageElement;
                if (i < rayon - 1) {
                    image = this.imagesExplo[j%2+1]
                } else {
                    image = this.imagesExplo[3+j]
                }

                switch (j){
                    case 0:
                        ctx.drawImage(image, bombe.posX * elemSize, (bombe.posY - i) * elemSize, elemSize, elemSize);
                        break;
                    case 1:
                        ctx.drawImage(image, (bombe.posX+i) * elemSize, bombe.posY * elemSize, elemSize, elemSize);
                        break;
                    case 2:
                        ctx.drawImage(image, bombe.posX * elemSize, (bombe.posY + i) * elemSize, elemSize, elemSize);
                        break;
                    case 3:
                        ctx.drawImage(image, (bombe.posX-i) * elemSize, bombe.posY * elemSize, elemSize, elemSize);
                        break;
                }

            }
        }
    }


    get explosionsRange(): number[][] {
        return this._explosionsRange;
    }

    set explosionsRange(value: number[][]) {
        this._explosionsRange = value;
    }

    get explosionBombe(): Bombe[] {
        return this._explosionBombe;
    }

    set explosionBombe(value: Bombe[]) {
        this._explosionBombe = value;
    }
}