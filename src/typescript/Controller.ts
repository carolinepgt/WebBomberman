class Controller {

    private model :Model;
    private view :View;

    private goNorth :boolean[];
    private goEast :boolean[];
    private goSouth :boolean[];
    private goWest :boolean[];


    constructor( model :Model, view :View) {

        this.model = model;
        this.view=view;
        let nbJoueur :number=model.tabPerso.length;
        this.goNorth=[];
        this.goEast=[];
        this.goSouth=[];
        this.goWest=[];

        for (let i=0; i<nbJoueur; i++ ){
            this.goNorth[i]=false;
            this.goEast[i]=false;
            this.goSouth[i]=false;
            this.goWest[i]=false;
        }

        this.start();

    }

    public start()  :void {

        window.onkeydown  = (event) =>{
            let key :number = window.event ? event.keyCode : event.which;
            if (key==122 || key==90) this.goNorth[0]=true;
            if (key==100 || key==68) this.goEast[0]=true;
            if (key==115 || key==83) this.goSouth[0]=true;
            if (key==113 || key==81) this.goWest[0]=true;
            if (key==32) this.toucheBombe(0,0);

            if (key==38) this.goNorth[1]=true;
            if (key==39) this.goEast[1]=true;
            if (key==40) this.goSouth[1]=true;
            if (key==37) this.goWest[1]=true;
            if (key==96) this.toucheBombe(1,0);

            return false;
        };
        window.onkeyup = (event) => {
            let key :number = window.event ? event.keyCode : event.which;
            if (key==122 || key==90) this.goNorth[0]=false;
            if (key==100 || key==68) this.goEast[0]=false;
            if (key==115 || key==83) this.goSouth[0]=false;
            if (key==113 || key==81) this.goWest[0]=false;

            if (key==38) this.goNorth[1]=false;
            if (key==39) this.goEast[1]=false;
            if (key==40) this.goSouth[1]=false;
            if (key==37) this.goWest[1]=false;

            return false;
        }

    }


    /*
    Gère les déplacements du personnages en fonction des attributs activé par la pression des touches
     */
    public  actualisePostion() :void {
        for (let i=0; i< this.model.tabPerso.length; i++){
            let perso :Personnage= this.model.tabPerso[i];
            perso.actualisePosition(this.model.plateau,this.goNorth[i], this.goEast[i], this.goSouth[i], this.goWest[i]);
            this.verifieEffet(perso);
        }
        this.view.afficheVue();

    }

    private toucheBombe (i :number, typeBombe :number):void {
        let bomb :Bombe = this.model.tabPerso[i].poseBombe(this.model.plateau.tabElement, typeBombe);
        if (bomb!=null ) {
            setTimeout(()=>{this.suppressionElement(bomb.posX, bomb.posY)}, 2000);
        }
    }

    /*
    Supprime l'élement envoyé en paramètre
     */
    private suppressionElement(x:number, y:number) :void{
        let elements  :Elem[][]= this.model.plateau.tabElement;
        let element :Elem=elements[x][y];
        if (element==null || !(element instanceof Effet)) {
            for (let i = 0; i < this.model.tabPerso.length; i++) {
                let perso :Personnage= this.model.tabPerso[i];

                if (Math.floor(perso.posX/Model.elemSize) == x && Math.floor(perso.posY/Model.elemSize) == y) perso.vie--;
            }
        }

        if (element != null) {

            if (!(element instanceof Mur && !(<Mur> element).destructible)) {
                elements[x][y] = null;

                if (element instanceof Mur) {
                    let mur= <Mur>element;
                    model.plateau.tabElement[mur.posX][mur.posY] = mur.effet;
                }

                if (element.isBombe()) {
                    this.explosionBombe(<Bombe> element);
                }

            }
        }
    }

    /*
    Gère l'explosion de la bombe: les elements en ligne et à portée de la bombe sont détruit, les joueurs dans cette zone subissent des degats
     */

    private explosionBombe(bombe :Bombe) :void {
        bombe.personnage.nbBombeRestantes++;
        let explosion :number[]= bombe.explosion(this.model.plateau);

        for (let i=1; i<explosion[0]; i++) this.suppressionElement(bombe.posX, bombe.posY-i);
        for (let i=1; i<explosion[1]; i++) this.suppressionElement(bombe.posX+i, bombe.posY);
        for (let i=1; i<explosion[2]; i++) this.suppressionElement(bombe.posX, bombe.posY+i);
        for (let i=1; i<explosion[3]; i++) this.suppressionElement(bombe.posX-i, bombe.posY);

        view.explosionsRange.splice(view.explosionsRange.length, 0, explosion);
        view.explosionBombe.splice(view.explosionBombe.length, 0, bombe);
        setTimeout(()=>{
            view.explosionsRange.splice(0,1);
            view.explosionBombe.splice(0,1);
        }, 200);
        view.afficheRange(explosion,bombe);



    }


    /*
    Applique un ou les effets présents a l'emplacement du déplacement du personnages,
     */
    private  verifieEffet(perso :Personnage) :void{
        let elements :Elem[][]=this.model.plateau.tabElement;
        let elementsAVerifier :Elem[]=[];
        elementsAVerifier[0]= elements[Math.floor(perso.posX/Model.elemSize)][Math.floor(perso.posY/Model.elemSize)];
        elementsAVerifier[1]= elements[Math.floor((perso.posX+Personnage.width)/Model.elemSize)][Math.floor(perso.posY/Model.elemSize)];
        elementsAVerifier[2]= elements[Math.floor((perso.posX+Personnage.width)/Model.elemSize)][Math.floor((perso.posY+Personnage.height)/Model.elemSize)];
        elementsAVerifier[3]= elements[Math.floor(perso.posX/Model.elemSize)][Math.floor((perso.posY+Personnage.height)/Model.elemSize)];
        for (let i=0; i<4; i++){
            if (elementsAVerifier[i]!= null && elementsAVerifier[i] instanceof Effet){
                let elementIdentique :boolean=false;
                for (let j=0; j<i; j++){
                    if (elementsAVerifier[i]==elementsAVerifier[j]) elementIdentique=true;
                }
                if (!elementIdentique) {
                    (<Effet> elementsAVerifier[i]).appliqueEffet(perso);
                    this.suppressionElement(elementsAVerifier[i].posX, elementsAVerifier[i].posY);
                }
            }
        }
    }

}
