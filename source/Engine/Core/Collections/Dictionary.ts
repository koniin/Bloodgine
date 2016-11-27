export interface IDictionary<K, V> {
    add(key:K, value:V):boolean;
    remove(key:K):void;
    get(key:K):V;
    containsKey(key:K):boolean;
    count():number;
    keys():K[];
    values():V[];
    isEmpty():boolean;
}

export class Dictionary<K, V> implements IDictionary<K, V> {
    private _keys:K[];
    private _values:V[];
    private _count:number = 0;

    constructor() {
        this._keys = [];
        this._values = [];
    }

    add(key:K, value:V):boolean {
		if (this._keys.indexOf(key) > -1) return false;
        this._keys[this._keys.length] = key;
        this._values[this._values.length] = value; 
        this._count++;
        return true;
    }
    
    remove(key:K):boolean {
        let index = this._keys.indexOf(key);
        if(index < 0) return false;
        for (var i = index, len = this._keys.length - 1; i < len; i++) {
	        this._keys[i] = this._keys[i + 1];
            this._values[i] = this._values[i + 1];
        }
        this._count = this._keys.length = this._values.length = len;
        return true;
    }

    get(key:K):V {
        let index = this._keys.indexOf(key);
        if(index < 0) return null;
        return this._values[index];
    }

    containsKey(key:K):boolean {
        return this._keys.indexOf(key) >= 0 ? true : false;
    }

    count():number {
        return this._count;
    }

    keys():K[] {
        return this._keys;
    }

    values():V[] {
        return this._values;
    }

    isEmpty():boolean {
        return this._count === 0;
    }
}

/*
    Tests
    ------
    let dictionary = new Dictionary<number, number>();
    dictionary.add(1, 1);
    dictionary.add(2, 2);
    dictionary.add(3, 2);
    console.log(dictionary.count() + " == 3");
    dictionary.remove(2);
    console.log(dictionary.containsKey(2) + " == false");
    console.log(dictionary.containsKey(3)  + " == true");
    console.log(dictionary.count() + " == 2");
    console.log(dictionary.get(3) + " == 2");
*/