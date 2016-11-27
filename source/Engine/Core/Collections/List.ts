export interface ICollection<T> extends IEnumerable<T> {
    add(item:T):void;
    addRange(items:T[]):void;
    remove(item:T):void;
    removeAt(index:number);
    count():number;
    clear():void;
    sort(f:(first:T, second:T) => number):void;
}

export interface IEnumerable<T> {
    get(index:number):T;
    indexOf(item:T):number;
    contains(item:T):boolean;
    forEach(f:(item:T, index?:number) => void):void;
    isEmpty():boolean;
}

export class List<T> implements ICollection<T> {
    private _items:T[];
    private _count:number = 0;

    constructor(private initialSize?:number) {
        if(initialSize)
            this._items = new Array<T>(initialSize);
        else 
            this._items = [];
    }

    get first():T {
        return this._items[0];
    }

    get last():T {
        return this._items[this._count - 1];
    }

    get(index:number) {
        return this._items[index];
    }

    add(item:T):void {
        this._items[this._count++] = item;
    }

    addRange(items:T[]):void {
        let startIndex = this._count;
        this._items.length = this._count = this._count + items.length;
        for(let i = startIndex, j = 0; i < this._count; i++, j++) {
            this._items[i] = items[j];
        }
    }

    remove(item:T):void {
        let removed:boolean = false;
        for (var i:number = 0, l:number = this._count - 1; i < l; i++) {
            if(this._items[i] === item)
                removed = true;
            if(removed)
                this._items[i] = this._items[i + 1];
        }
        
        if(removed) {
            this._count = this._items.length = l;
        }
    }

    removeAt(index:number) {
        for (var i = index, l = this._count - 1; i < l; i++)
	        this._items[i] = this._items[i + 1];
        this._count = this._items.length = l;
    }

    indexOf(item:T):number {
        for (var i = 0; i < this._count; i++)  {
            if(this._items[i] === item)
                return i;
        }
        return -1;
    }

    count():number {
        return this._count;
    }

    contains(item:T):boolean {
        return this.indexOf(item) >= 0;
    }
    
    clear():void {
        this._count = this._items.length = 0;
    }

    forEach(f:(item:T, index?:number) => void):void {
        for(let i = 0; i < this._count; i++)
            f(this._items[i], i);
    }

    sort(f:(first:T, second:T) => number):void {
        this._items.sort(f);
    }

    isEmpty():boolean {
        return this._count === 0;
    }
}

/* 
    Tests
    -----
    let list = new List<number>();
    list.add(100);
    list.add(200);
    list.add(300);
    console.log("count: " + list.count());
    list.forEach((item, index) => { 
        console.log("item" + index + ": " + item);
    });
    console.log("contains 200? " + list.contains(200));
    list.remove(200);
    console.log("contains 200? " + list.contains(200));
    list.addRange([400, 500, 600]);
    list.forEach((item, index) => { 
        console.log("item" + index + ": " + item);
    });
    console.log("count: " + list.count());
    console.log(list.get(list.count() - 1));
    console.log(list.indexOf(600));
    console.log(list.first);
    list.removeAt(4);
    console.log(list.last);
*/