class Elem {
    private _posX :number;
    private _posY :number;

    constructor(imageURL:string, posX:number, posY:number) {
        this._posX=posX;
        this._posY=posY;
    }

    get posX(): number {
        return this._posX;
    }

    get posY(): number {
        return this._posY;
    }

    isBombe() : boolean{
        return false;
    }

}
