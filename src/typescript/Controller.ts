class Controller {

    private model :Model;
    private view :View;

    private goNorth :boolean[];
    private goEast :boolean[];
    private goSouth :boolean[];
    private goWest :boolean[];

    private ligne :boolean;
    private idPartie :number;
    private nbJoueur :number;
    private bombe :boolean[];
    private messageServeur :string;
    private nj :number;
    private changement :number[];



    constructor( model :Model, view :View, reseau :boolean) {

        this.model = model;
        this.view=view;
        let nbJoueur :number=model.tabPerso.length;
        this.goNorth=[];
        this.goEast=[];
        this.goSouth=[];
        this.goWest=[];
        this.bombe=[];
        this.changement=[];
        this.messageServeur="";
        this.ligne=reseau;

        for (let i=0; i<nbJoueur; i++ ){
            this.goNorth[i]=false;
            this.goEast[i]=false;
            this.goSouth[i]=false;
            this.goWest[i]=false;
            this.bombe[i]=false;
            this.changement[i]=0;
        }

        if (this.ligne){
            this.recupereIdPartie();
            this.recupereEtat();
        } else this.nj=1;
        this.start();

    }

    private recupereIdPartie(){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=()=> {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let m :string[]=xmlhttp.responseText.split(",");
                this.idPartie=parseInt(m[0]);
                this.nbJoueur=parseInt(m[1]);
                this.nj=parseInt(m[2]);
            }
        };

        xmlhttp.open("GET","RecupereId.php",true);
        xmlhttp.send();
    }

    public start()  :void {

        window.onkeydown  = (event) =>{
            let key :number = window.event ? event.keyCode : event.which;
            if (key==122 || key==90) this.goNorth[0]=true;
            if (key==100 || key==68) this.goEast[0]=true;
            if (key==115 || key==83) this.goSouth[0]=true;
            if (key==113 || key==81) this.goWest[0]=true;
            if (key==32) this.toucheBombe(0,0);

            if(!this.ligne) {
                if (key == 38) this.goNorth[1] = true;
                if (key == 39) this.goEast[1] = true;
                if (key == 40) this.goSouth[1] = true;
                if (key == 37) this.goWest[1] = true;
                if (key == 96) this.toucheBombe(1, 0);
            }
            return false;
        };
        window.onkeyup = (event) => {
            let key :number = window.event ? event.keyCode : event.which;
            if (key==122 || key==90) this.goNorth[0]=false;
            if (key==100 || key==68) this.goEast[0]=false;
            if (key==115 || key==83) this.goSouth[0]=false;
            if (key==113 || key==81) this.goWest[0]=false;

            if (!this.ligne) {
                if (key == 38) this.goNorth[1] = false;
                if (key == 39) this.goEast[1] = false;
                if (key == 40) this.goSouth[1] = false;
                if (key == 37) this.goWest[1] = false;
            }
            return false;
        }

    }


    /*
    Gère les déplacements du personnages en fonction des attributs activé par la pression des touches
     */
    public  actualisePostion() :void {
        if (this.nj==1) {
            if(this.ligne)this.recupereAction();
            for (let i=0; i< this.model.tabPerso.length; i++){
                let perso :Personnage= this.model.tabPerso[i];
                perso.actualisePosition(this.model.plateau,this.goNorth[i], this.goEast[i], this.goSouth[i], this.goWest[i]);
                this.verifieEffet(perso);
            }
            if (this.ligne)this.actualiseEtat();
        }
        else {
            this.actualiseAction();
            this.recupereEtat();
        }
        this.view.afficheVue();

    }

    private toucheBombe (i :number, typeBombe :number):void {
        if (this.nj==1) {
            let bomb: Bombe = this.model.tabPerso[i].poseBombe(this.model.plateau.tabElement, typeBombe);
            if (bomb != null) {
                setTimeout(() => {
                    this.suppressionElement(bomb.posX, bomb.posY)
                }, 2000);
            }
        }
        else this.bombe[this.nj-1]=true;
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

    public  actualiseEtat() :void {
        let message :string="";
        for (let i =0; i<model.plateau.tabElement.length; i++){
            for (let j=0; j<model.plateau.tabElement.length; j++){
                let e=model.plateau.tabElement[i][j];
                if (e==null)message+="N-";
                else message+=e.toString()+"-";
            }
        }

        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","ActualiseEtat.php?idPartie="+this.idPartie+"&etat="+message,true);
        xmlhttp.send();

    }


    private static toObject(x :number, y :number, s :string) :void{
        let tabE :Elem[][]=model.plateau.tabElement;
        if (s=="N"){
            tabE[x][y]=null;
            return;
        }
        if (s=="MI"){
            tabE[x][y]=new Mur( false, x, y);
            return;
        }
        for (let i=0; i<6; i++){
            if (s=="M"+i){
                tabE[x][y]=new Mur( true, x, y);
                (<Mur>tabE[x][y]).ajouteEffet(i);
                return;
            }
        }
    }

    public  recupereEtat() :void{
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=()=> {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let rep=xmlhttp.responseText;
                let m :string[] =rep.split("-");
                let taille :number = model.plateau.tabElement.length;
                for (let i=0; i<taille; i++){
                    for (let j=0; j<taille; j++){
                        Controller.toObject(i, j, m[i*taille+j]);
                    }
                }
                view.afficheVue();
            }
        };

        xmlhttp.open("GET","RecupereEtat.php?idPartie="+this.idPartie,true);
        xmlhttp.send();

    }


    public recupereAction() :void{
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=()=> {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let rep=xmlhttp.responseText.split(",");
                for (let i=0; i<rep.length; i++){
                    let m=rep[i];
                    let n :number=parseInt(""+m[0]);
                    this.goNorth[n]=m[1]=='1';
                    this.goEast[n]=m[2]=='1';
                    this.goSouth[n]=m[3]=='1';
                    this.goWest[n]=m[4]=='1';
                    this.bombe[n]=m[5]=='1';
                }
            }
        };

        xmlhttp.open("GET","RecupereAction.php?idPartie="+this.idPartie,true);
        xmlhttp.send();
    }



    public actualiseAction() :void{

        let message :string=""+ this.nj;
        if(this.goNorth[this.nj])message+=1;
        else message+=0;
        if(this.goEast[this.nj])message+=1;
        else message+=0;
        if(this.goSouth[this.nj])message+=1;
        else message+=0;
        if(this.goWest[this.nj])message+=1;
        else message+=0;
        if(this.bombe[this.nj])message+=1;
        else message+=0;

        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","ActualiseAction.php?idPartie="+this.idPartie+"&nj="+this.nj+"&action="+message,true);
        xmlhttp.send();
    }

}
