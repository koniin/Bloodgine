
export interface IStack<T> {    
    peek():T;
    push(item:T):void;
    pop():T;
    enumerateFromTop(f:(item:T, index?:number) => void):void;
    enumerateFromBottom(f:(item:T, index?:number) => void):void;
    count():number;
    clear():void;
    isEmpty():boolean;
}

export class Stack<T> implements IStack<T> {
    private _items:T[];
    private _count:number = 0;

    constructor() {
        this._items = [];
    }

    peek():T {
        if(this._count > 0)
            return this._items[this._count - 1];
        return null;
    }

    push(item:T):void {
        this._items[this._count++] = item;
    }

    pop():T {
        if(this._count <= 0) return null;
        let item = this._items[this._count - 1];
        this._items.length = this._count = this._count - 1;
        return item;
    }

    enumerateFromTop(f:(item:T, index?:number) => void):void {
        for(let i = this._count - 1; i > -1; i--) {
            f(this._items[i], i);
        }
    }

    enumerateFromBottom(f:(item:T, index?:number) => void):void {
        for(let i = 0; i < this._count; i++) {
            f(this._items[i], i);
        }
    }

    count():number {
        return this._count;
    }
    
    clear():void {
        this._count = 0;
        this._items.length = 0;
    }

    isEmpty():boolean {
        return this._count === 0;
    }
}

/* 
    Tests
    ------
    let stack = new Stack<number>();
    console.log("count: " + stack.count());
    stack.push(100);
    stack.push(200);
    console.log("count: " + stack.count());
    console.log("peeked: " + stack.peek());
    stack.push(300);
    console.log("count: " + stack.count());
    console.log("items from top:");
    stack.enumerateFromTop((item) => { console.log(item); });
    console.log("items from bottom:");
    stack.enumerateFromBottom((item, index) => { console.log(item + ", " + index); });
    console.log("popped:" + stack.pop());
    console.log("items from top:");
    stack.enumerateFromTop((item) => { console.log(item); });
    stack.clear();
    console.log("items from top:");
    stack.enumerateFromTop((item) => { console.log(item); });
    console.log("count: " + stack.count());
*/