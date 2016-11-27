import State from './State'
import GameCore from '../GameCore'

export default class StateMachine {
    private stateStack:State[] = [];

    public update(game:GameCore, dt:number){
        for(var i = this.stateStack.length - 1; i >= 0; i--) {
            if(!this.stateStack[i].updateState(game, dt)) {
                break;
            }
        }
    }

    count():number {
        return this.stateStack.length;
    }

    empty():boolean {
        return this.stateStack.length <= 0;
    }

    public peek():State {
        return this.stateStack[this.stateStack.length - 1];
    }

    public pushState(state:State, game:GameCore, context?:any) {
        if(this.stateStack.length - 1 >= 0)
            this.stateStack[this.stateStack.length - 1].deactivate(game);
        state.initState(game, context);
        this.stateStack.push(state);
    }
    
    public popState(game:GameCore) {
        let state = this.stateStack.pop();
        if(state)
            state.destroyState(game);
        if(this.stateStack.length - 1 >= 0)
            this.stateStack[this.stateStack.length - 1].activate(game);
    }

    public injectState(state:State, pos:number) {
        this.stateStack.splice(pos, 0, state);
    }

    public handleEvent(e:any) {
        /*
        for(var i = this.stateStack.length - 1; i >= 0; i--) {
            this.stateStack[i].handleEvent(e);
            if(e.handled())
                return;
        }

        for(var i = this.stateStack.length - 1; i >= 0; i--) {
            if(this.stateStack[i].handleEvent(e))
                return;
        }
        */
    }
}