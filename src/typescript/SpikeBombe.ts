class SpikeBombe extends  Bombe{
    constructor(perso:Personnage, posX :number, posY:number) {
        super(perso, posX, posY);
    }

    public explosion(plateau :Plateau) :number[]{
        let elements :Elem[][]= plateau.tabElement;
        let explosion :number[]=new Number[4];
        let x :number =this.posX;
        let y :number =this.posY;

        for (let i=0; i<4; i++){
            let mur :boolean = false;
            let e :Elem=null;
            let porteeReel :number;
            for (porteeReel = 1; porteeReel <= this.portee && !mur; porteeReel++) {
                switch (i){
                    case 0: e = elements[x][y - porteeReel]; break;
                    case 1: e = elements[x + porteeReel][y]; break;
                    case 2: e = elements[x][y + porteeReel]; break;
                    case 3: e = elements[x - porteeReel][y]; break;
                }
                mur = e!=null && e instanceof Mur && !(<Mur>e).destructible;
            }
            if (mur && !(<Mur>e).destructible) porteeReel--;
            explosion[i]=porteeReel;
        }
        return explosion;
    }

}