export interface IPoolItem {
    reset():void;
    active:boolean;
}

export class Pool<T extends IPoolItem> {
    private items:IPoolItem[];

    constructor(type?:{new():T;}, count?:number) {
        if(type && count) {
            this.items = new Array<T>(count);
            for(let i = 0; i < count; i++)
                this.items[i] = new type();
        } else
            this.items = [];
    }
    
    get<T>(type:{new():IPoolItem;}):any {
        let item:IPoolItem;
        for(let i = 0; i < this.items.length; i++) {
            if(!this.items[i].active) {
                item = this.items[i];
                item.active = true;
                return item;
            }
        }

        item = new type();
        this.items.push(item);
        item.active = true;
        return item;
    }

    free(item:T):void {
        item.reset();
        item.active = false;
    }
}