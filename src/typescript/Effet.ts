class Effet extends Elem {
    private _typeEffet :number;

    /*

    1 : Bonus portee;
    2 : Bonus nbBombe;
    3 : Bonus vie;
    4 : Bonus vitesse;
    5 : Bonus penetrator;

     */

    constructor(typeEffet:number,posX:number, posY:number) {
        super(posX, posY);
        this._typeEffet=typeEffet;
    }



    public appliqueEffet(perso :Personnage) :void {
        switch (this._typeEffet) {
            case 1:  if (perso.portee<6) perso.portee++; break;
            case 2: perso.nbBombeRestantes++; break;
            case 3: if (perso.vie<3) perso.vie++; break;
            case 4: if (perso.vitesse<4) perso.vitesse++; break;
            case 5: perso.nbSpikeBombe++; break;
        }
    }


    get typeEffet(): number {
        return this._typeEffet;
    }

    public  toString() :string{
        return ""+this._typeEffet;
    }
}