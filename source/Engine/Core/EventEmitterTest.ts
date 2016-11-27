class EventEmitter {
    public length:number;
    
    constructor() {
        this.length = 0;
    }

    addListener(fn) {
        var index = this.length;
        this.length++;
        this[index] = fn;
    }
}