
class Model {

    private _tabPerso :Personnage[];
    private _plateau :Plateau;
    static elemSize :number;

    constructor(nbJoueurs :number, size :number, elemSize :number) {
        Model.elemSize=elemSize;
        this._plateau=new Plateau(size);
        this._tabPerso=[];
        this._tabPerso[0]=new Personnage(elemSize,elemSize, "Bleu", 0);
        this._tabPerso[1]=new Personnage((size-2)*elemSize,(size-2)*elemSize, "Orange", 1);

    }


    get tabPerso(): Personnage[] {
        return this._tabPerso;
    }

    get plateau(): Plateau {
        return this._plateau;
    }

    public gagnant() :Personnage{
        for ( let i=0; i<this._tabPerso.length; i++){
            let perso :Personnage=this._tabPerso[i];
            if (perso.estEnVie())return perso;
        }
        return null;
    }

    public partieFini() :boolean{
        let nbJoueurEnVie :number =0;
        this._tabPerso.forEach(function (perso) {
            if (perso.estEnVie())nbJoueurEnVie++;
        });
        return nbJoueurEnVie <= 1;
    }
}