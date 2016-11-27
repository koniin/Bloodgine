let w:any = window;

let noUi = {
    add: function(){},
    addColor: function(){},
    init: function(){},
    destroy: function(){}
};

export class DatUiWrapper {
    public gui:any;

    constructor() {
        this.gui = noUi;
    }
    
    init() {
        if(w.dat && w.dat.GUI) {
            this.gui = new w.dat.GUI();
        }
    }

    add(...args: any[]) {
        this.gui.add(...args);
    }

    addColor(...args: any[]) {
        this.gui.addColor(...args);
    }

    destroy() {
        this.gui.destroy();
    }
}

export const DebugUi = new DatUiWrapper();
export default DebugUi;