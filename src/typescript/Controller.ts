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

    private xmlhttp;



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
        this.xmlhttp=new XMLHttpRequest();

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
            this.model.tabPerso[0].vitesse=4;
            this.model.tabPerso[1].vitesse=4;
        } else this.nj=1;
        this.start();

    }

    private recupereIdPartie(){
        this.nj=parseInt(document.getElementById('nj').innerText);
        this.idPartie=parseInt(document.getElementById('idPartie').innerText);
    }

    public start()  :void {

        window.onkeydown  = (event) =>{
            let key :number = window.event ? event.keyCode : event.which;
            if (key==122 || key==90) this.goNorth[this.nj-1]=true;
            if (key==100 || key==68) this.goEast[this.nj-1]=true;
            if (key==115 || key==83) this.goSouth[this.nj-1]=true;
            if (key==113 || key==81) this.goWest[this.nj-1]=true;
            if (key==32) this.toucheBombe(this.nj-1,0);

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
            if (key==122 || key==90) this.goNorth[this.nj-1]=false;
            if (key==100 || key==68) this.goEast[this.nj-1]=false;
            if (key==115 || key==83) this.goSouth[this.nj-1]=false;
            if (key==113 || key==81) this.goWest[this.nj-1]=false;

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
                    this.model.plateau.tabElement[mur.posX][mur.posY] = mur.effet;
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

        this.view.explosionsRange.splice(this.view.explosionsRange.length, 0, explosion);
        this.view.explosionBombe.splice(this.view.explosionBombe.length, 0, bombe);
        setTimeout(()=>{
            this.view.explosionsRange.splice(0,1);
            this.view.explosionBombe.splice(0,1);
        }, 200);
        this.view.afficheRange(explosion,bombe);



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
        for (let i =0; i<this.model.plateau.tabElement.length; i++){
            for (let j=0; j<this.model.plateau.tabElement.length; j++){
                let e=this.model.plateau.tabElement[i][j];
                if (e==null)message+="N-";
                else message+=e.toString()+"-";
            }
        }
        message+="//";
        for (let i=0; i<2; i++){
            message+=this.model.tabPerso[i].posX+"-";
            message+=this.model.tabPerso[i].posY+"-";
            message+=this.bombe[i]+",";
        }
        this.xmlhttp=new XMLHttpRequest();
        this.xmlhttp.open("GET","../../../src/phpAjax/ActualiseEtat.php?idPartie="+this.idPartie+"&etat="+message,false);
        this.xmlhttp.send();
    }


    private toObject(x :number, y :number, s :string) :void{
        let tabE =(this.model.plateau.tabElement);
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
                let mm :string[] =rep.split("//");
                let m :string[] =mm[0].split("-");
                let taille :number = this.model.plateau.tabElement.length;
                for (let i=0; i<taille; i++){
                    for (let j=0; j<taille; j++){
                        this.toObject(i, j, m[i*taille+j]);
                    }
                }
                m=mm[1].split(",");
                for (let i=0; i<2; i++){
                    let s=m[i].split("-");
                    this.model.tabPerso[i].posX=parseInt(s[0]);
                    this.model.tabPerso[i].posY=parseInt(s[1]);
                    if (parseInt(s[2])==1) this.toucheBombe(i,0);
                }
                this.view.afficheVue();
            }
        };

        xmlhttp.open("GET","../../../../src/phpAjax/RecupereEtat.php?idPartie="+this.idPartie,false);
        xmlhttp.send();

    }


    public recupereAction() :void{
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=()=> {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let rep=xmlhttp.responseText.split(",");
                for (let i=1; i<2; i++){
                    let m=rep[i];
                    console.log(m);
                    this.goNorth[i]=m[1]=='1';
                    this.goEast[i]=m[2]=='1';
                    this.goSouth[i]=m[3]=='1';
                    this.goWest[i]=m[4]=='1';
                    if (m[5]=='1') this.toucheBombe(i,0);
                }
            }
        };

        xmlhttp.open("GET","../../../src/phpAjax/RecupereAction.php?idPartie="+this.idPartie,false);
        xmlhttp.send();
    }



    public actualiseAction() :void{

        let message :string=""+ this.nj;
        if(this.goNorth[this.nj-1])message+=1;
        else message+=0;
        if(this.goEast[this.nj-1])message+=1;
        else message+=0;
        if(this.goSouth[this.nj-1])message+=1;
        else message+=0;
        if(this.goWest[this.nj-1])message+=1;
        else message+=0;
        if(this.bombe[this.nj-1]){
            message+=1;
            this.bombe[this.nj-1]=false;
        }
        else message+=0;
        let xmlhttp=new XMLHttpRequest();

        xmlhttp.open("GET","../../../../src/phpAjax/ActualiseAction.php?idPartie="+this.idPartie+"&nj="+this.nj+"&action="+message,false);
        xmlhttp.send();
    }

}
