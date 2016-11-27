import GameCore from '../GameCore'
import State from './State'

// push new state on top -> like a fade out 
// push the new state and push a fade in on top

// setStateOnTop(new FadeInTransition) //maybe have fixed ones that we can just reset instead..later

// when transition is done - remove 2 states and push 2 new ones

export interface ITransition {
    update(dt:number);
    render(game:GameCore);
    reset():void;
    setup(game:GameCore, nextState:State, context?:any):void;
    callBack:(state, context) => void;
    done:boolean;
}

export class Transitions {
    //private static fadeIn:ITransition = new Transition();

    public static get FadeIn():ITransition {
        //this.fadeIn.reset();
        //return this.fadeIn;
        return new FadeInTransition();
    } 

    public static get FadeOut():ITransition {
        //this.fadeIn.reset();
        //return this.fadeIn;
        return new FadeOutTransition();
    } 
}  

class Transition implements ITransition {
    private game:GameCore;
    private nextState:State;
    private context?:any;
    elapsed:number = 0;
    duration:number = 2;
    done:boolean = false;
    callBack:(state, context) => void;

    setup(game:GameCore, nextState:State, context?:any):void {
        this.game = game;
        this.nextState = nextState;
        this.context = context;
    }

    update(dt:number) {
        this.elapsed += dt;
        if(this.elapsed >= this.duration) {
            this.done = true;
            if(this.callBack)
                this.callBack(this.nextState, this.context);
        }
    }

    render(game:GameCore):void {
    }

    reset():void {
        this.elapsed = 0;
        this.callBack = undefined;
        this.done = false;
    }
}


class FadeOutTransition extends Transition {
    color:string;
    alpha:number = 0;
    duration:number = 1;

    constructor() {
        super();
        this.color = "rgba(0, 0, 0, " + this.alpha + ")";
    }

    update(dt:number) {
        super.update(dt);
        this.alpha += dt;
        this.color = "rgba(0, 0, 0, " + this.alpha + ")";
    }

    render(game:GameCore):void {
    }
}

class FadeInTransition extends Transition {
    color:string;
    alpha:number = 1;
    duration:number = 1;

    constructor() {
        super();
        this.color = "rgba(0, 0, 0, " + this.alpha + ")";
    }

    update(dt:number) {
        super.update(dt);
        this.alpha -= dt;
        this.color = "rgba(0, 0, 0, " + this.alpha + ")";
    }

    render(game:GameCore):void {
    }
}
/*
export class TransitionState extends State {
    context:any;
    newState:State;
    outTransition:Transition;
    inTransition:Transition;

    constructor(outTransition?:string, inTransition?:string) {
        super();
    }

    setNextState(state:State) {
        this.newState = state;
    }

    init(game:GameCore, context?:any) {
        this.context = context;
    }

    destroy(game:GameCore) {
    }
    
    /// Returns false if this state does not want further updates down the state stack
    update(game:GameCore, dt:number) {
        this.outTransition.update(dt);
        if(this.outTransition.done) {
            game.setNextState(this.newState, this.context);
            game.setNextState(new FadeInTransition());
        }
        return false;
    }

    render(game:GameCore):void {
        this.outTransition.render(game);
    }
}*/