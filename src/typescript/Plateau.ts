class Plateau {
    private _tabElement : Elem[][];

    constructor(size :number) {
        this._tabElement = [];
        for (let x=0; x<size; x++){
            this.tabElement[x]=[];
            for (let y=0; y<size; y++){
                this.tabElement[x][y]=null;
                if (x==0 || y==0 || x==size-1 || y==size-1){
                    this._tabElement[x][y]=new Mur(false,x,y);
                }else if(x%2==0 && y%2==0){
                    this._tabElement[x][y]=new Mur(false,x,y);
                }else if(!(x<=2 && y<=2) && !(x>=size-3 && y>=size-3) && (x%2!=0 || y%2!=0) ){
                    this._tabElement[x][y]=new Mur(true,x,y);
                }
            }
        }

    }

    get tabElement(): Elem[][] {
        return this._tabElement;
    }
}