class Mur extends Elem {

    private _destructible :boolean;
    private _effet :Effet;

    constructor(destructible :boolean, x :number, y :number) {
        super("",x,y);
        if (Math.floor(Math.random()*4)==0) {
            this._effet = new Effet(this.posX, this.posY);
        }
        this._destructible=destructible;
    }
    /*
    public Mur(boolean destructible, int posX, int posY, int effet) {
        super(destructible, posX, posY);
        if (effet!=0) this.effet = new Effet(effet, getPosX(), getPosY());

        Destructible = destructible;
    }
    */

    get destructible(): boolean {
        return this._destructible;
    }

    get effet(): Effet {
        return this._effet;
    }

    public toString() :string {
        if (!this._destructible) return "MI";
        if (this.effet==null) return "M0";
        return "M"+this.effet.toString();
    }

}