class Bombe extends Elem {

    private _personnage :Personnage;
    protected portee :number;

    constructor(perso :Personnage, posX:number, posY:number){
        super(posX,posY);
        this._personnage=perso;
        this.portee=perso.portee;
        perso.nbBombeRestantes--;
    }

    public explosion(plateau :Plateau) :number[]{
        let elements :Elem[][]= plateau.tabElement;
        let explosion :number[]=[];
        let x :number =this.posX;
        let y :number =this.posY;

        for (let i=0; i<4; i++){
            explosion[i]=0;
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
                mur = e!=null && e instanceof Mur;
            }
            if (mur && !(<Mur>e).destructible) porteeReel--;
            explosion[i]=porteeReel;
        }
        return explosion;
    }

    public toString() :string {
        return "B"+this._personnage.nj;
    }

    public  isBombe() :boolean {
        return true;
    }


    get personnage(): Personnage {
        return this._personnage;
    }




   
}