import StateMachine from './State/StateMachine'
import State from './State/State'
import {ITransition} from './State/Transition'
import Scene from './ECS/Scene'
import Vector2 from './Core/Vector2'
import {IRenderer} from './Graphics/IRenderer'
import {Renderer} from './Graphics/Renderer'
import {PixiRenderer} from './Graphics/PixiRenderer'
import {InputManager, Input} from './Input/InputManager'
import {ResolutionManager} from './Graphics/ResolutionManager'

export interface IStatCounter {
    begin(timestamp:any);
    end();
    fpsCount:number;
}

class FPSCounter implements IStatCounter {
    public fpsCount:number = 60;
    private framesThisSecond:number = 0;
    private lastFpsUpdate:number = 0;

    begin(timestamp) {
        // Count fps
        if (timestamp > this.lastFpsUpdate + 1000) {
            this.fpsCount = 0.25 * this.framesThisSecond + 0.75 * this.fpsCount;

            this.lastFpsUpdate = timestamp;
            this.framesThisSecond = 0;
        }
        this.framesThisSecond++;
    }
    end() {}
}

export default class GameCore {
    private then:number;
    private stateMachine:StateMachine;
    renderer:IRenderer;
    private _nextStates:State[];
    private _context:any = null;
    private _numberOfStatesToPop:number = 0;
    input:InputManager;
    resolution:ResolutionManager;
    private statCounter:IStatCounter;
    private fps:number = 60;
    private step:number;
    private delta:number = 0;
    private now:number; 
    private last:number;

    get currentFps():number {
        return this.statCounter.fpsCount;
    }

    get width():number {
        return this.renderer.width;
    }

    get height():number {
        return this.renderer.height;
    }

    constructor() {
        this._nextStates = [];
        this.stateMachine = new StateMachine();   
        this.renderer = new PixiRenderer();
        this.input = Input;
        this.resolution = new ResolutionManager(this.input);
        this.statCounter = new FPSCounter();
    }

    protected initialize() {
    }

    protected setStatCounter(statCounter:IStatCounter) {
        this.statCounter = statCounter;
        this.statCounter.fpsCount = 0;
    }

    // Override to use an element on the page or whatever you want
    protected setCanvas():HTMLCanvasElement {
        return this.renderer.createDefault();
    }

    public createScene():Scene {
        return new Scene(this);
    }

    run() {
        this.renderer.initialize(this.setCanvas());
        this.input.registerEventHandlers(this.renderer.canvas);
        this.resolution.initialize(this.renderer);
        this.initialize();
        this.then = Date.now();

        this.step = 1/this.fps;
        this.last = this.timestamp();
        
        requestAnimationFrame(this.loop);
    }

    loop = (timestamp) => {
        this.now = this.timestamp();
        this.delta = this.delta + Math.min(1, (this.now - this.last) / 1000);
        
        this.statCounter.begin(timestamp);

        var numUpdateSteps = 0;
        while(this.delta >= this.step) {
            this.stateMachine.update(this, this.step);
            this.input.update(this.step);
            this.delta = this.delta - this.step;
            if (++numUpdateSteps >= 240) {
                this.panic();
                break;
            }
            
            this.updateStates();
            if(this.stateMachine.empty())
                return;   
        }

        this.renderer.begin();
        this.renderer.end();
        this.last = this.now;

        this.statCounter.end();

        requestAnimationFrame(this.loop);
    }

    private timestamp():number {
        if (window.performance && window.performance.now)
            return window.performance.now();
        else
            return new Date().getTime();
    }

    private panic():void {
        this.delta = 0;
    }

    public replaceState(state:State, context?:any) {
        this.popState();
        this._nextStates[this._nextStates.length] = state;
        this._context = context;
    }

    public pushState(state:State, context?:any) {
        this._nextStates[this._nextStates.length] = state;
        this._context = context;
    }

    public insertStateUnder(state:State, context?:any) {

    }

    public clearStates() {
        this._numberOfStatesToPop = this.stateMachine.count();
    }

    public popState() {
        this._numberOfStatesToPop = this._numberOfStatesToPop | 1;
    }

    private updateStates():boolean {
        if(this._numberOfStatesToPop > 0) {
            for(let i = 0; i < this._numberOfStatesToPop; i++)
                this.stateMachine.popState(this);
            this._numberOfStatesToPop = 0;
        }
        if(this._nextStates.length > 0) {
            // Could be from a stateFactory and only parameter is a int
            // let newState = this.stateFactory.create(stateId);
            // newState.id = stateId;
            // this.stateMachine.pushState(newState, this);
            for(let i = 0; i < this._nextStates.length; i++)
                this.stateMachine.pushState(this._nextStates[i], this, this._context);
            this._nextStates.length = 0; 
            this._context = undefined;
            return true;
        }
        return false;
    }

    /*
    public transition(newState:State, outTransition?:ITransition, inTransition?:ITransition, context?:any) {
        if(outTransition && inTransition) {
            outTransition.callBack = (state, context) => {
                this.setNextState(state, context);
            };
            outTransition.setup(this, newState, context);
            this.stateMachine.peek().setTransition(outTransition);
            newState.setTransition(inTransition);
        } else if(inTransition) {
            newState.setTransition(inTransition);
            this.setNextState(newState, context);
        } else if(outTransition) {
            outTransition.callBack = (state, context) => {
                this.setNextState(state, context);
            };
            outTransition.setup(this, newState, context);
            this.stateMachine.peek().setTransition(outTransition);
        }
    }
    */
}