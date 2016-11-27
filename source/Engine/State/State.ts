import GameCore from '../GameCore'
import Scene from '../ECS/Scene'
import DebugUi from '../UI/DatGui/DatGuiWrapper'
import {GraphicsContainer} from '../Graphics/GraphicsContainer'
import {GraphicsFactory} from '../Graphics/GraphicsFactory'
import {IInputListener} from '../Input/IInputListener'
import {TweenManager} from '../Utils/Tween/TweenManager'
import {UIFactory} from '../UI/UIFactory'
import {TimerEvents} from '../Utils/Timer'
import ResourceManager from '../Utils/ResourceManager'
import SpriteSheet from '../Graphics/SpriteSheet'
import {ITransition} from './Transition' 

abstract class State {
    private _initialized = false;
    protected abstract init(game:GameCore, context?:any):void;
    protected abstract destroy(game:GameCore):void;
    /// Returns false if this state does not want further updates down the state stack
    protected abstract update(game:GameCore, dt:number):boolean;
    
    protected scenes:Scene[];
    protected game:GameCore;
    protected registeredInputListeners:IInputListener[];
    public graphicsContainer:GraphicsContainer;
    public tween:TweenManager;
    public ui:UIFactory;
    public gfx:GraphicsFactory;
    public timer:TimerEvents;
    public resources:ResourceManager;

    constructor() {
        this.resources = new ResourceManager();
    }

    public getTextures():string[] {
        return [];
    }

    public initState(game:GameCore, context?:any):void {
        if(this._initialized) return;

        this.tween = new TweenManager();
        this.graphicsContainer = new GraphicsContainer();
        game.renderer.add(this.graphicsContainer);
        this.ui = new UIFactory(this, this.graphicsContainer);
        this.gfx = new GraphicsFactory(this, game.renderer, this.graphicsContainer);
        this.timer = new TimerEvents();
        this.scenes = [];
        this.registeredInputListeners = [];
        this.game = game;
        this.init(game, context);
        this._initialized = true;
    }

    public destroyState(game:GameCore):void {
        this.scenes.length = 0;
        delete this.tween;
        this.game.input.removeInputListeners(this.registeredInputListeners);
        this.registeredInputListeners.length = 0;
        game.input.resetDrag();
        game.renderer.remove(this.graphicsContainer);
        //this.resources.clear();
        DebugUi.destroy();
        this.destroy(game);
    }

    public updateState(game:GameCore, dt:number):boolean {
        this.tween.update(dt);
        this.timer.update(dt);
        for(let scene of this.scenes)
            scene.update(dt);
        return this.update(game, dt);
    }

    public activate(game:GameCore):void {
        game.input.addInputListeners(this.registeredInputListeners);
    } 

    public deactivate(game:GameCore):void {
        game.input.removeInputListeners(this.registeredInputListeners);
        game.input.resetDrag();
    } 

    protected createScene():Scene {
        let scene = this.game.createScene();
        scene.setGraphicsContainer(this.graphicsContainer);
        this.scenes.push(scene);
        return scene;
    }
    
    protected getScene(name:string):Scene {
        throw "NOT IMPLEMENTED!";
    }

    protected createTransition(newState:State) {
        return new TransitionState(this, newState);
    }

    public addInputListener(listener:IInputListener):void {
        if(this.game.input.addInputListener(listener))
            this.registeredInputListeners.push(listener);
    }
}

export default State;

export class TransitionState extends State {
    constructor(private fromState:State, private newState:State) {
        super();
    }

    protected init(game:GameCore, context?:any):void {
        this.resources.setProgressUpdate(this.resourceProgressUpdate);
        this.resources.load(this.newState.getTextures());
    }

    resourceProgressUpdate = (loader, loadedResource) => {
        console.log('Progress:', loader.progress + '%');
        if(this.resources.isReady()) {
            this.newState.initState(this.game);
            this.newState.graphicsContainer.container.alpha = 0;
            // dirty to run one update so all renderable components gets their position right!
            // maybe change to something like push a state under this one so we can just pop this off when done
            this.newState.updateState(this.game, 0);
        }
    };

    protected destroy(game:GameCore):void {
    }

    test:number = 0;
    alpha:number = 1;
    direction:number = 0; // 0 is transition in and 1 is transition out
    protected update(game:GameCore, dt:number):boolean {
        //this.fromState.graphicsContainer.container.alpha -= 0.01;
        
        if(this.resources.isReady()) {
            this.test += 0.005; 

            if(this.direction == 0) {
                this.alpha -= 0.005;
                this.fromState.graphicsContainer.container.alpha = this.alpha;
                if(this.alpha <= 0) {
                    this.alpha = 0;
                    this.direction = 1;
                }
            } 
            if(this.direction == 1) {
                this.alpha += 0.005;
                this.newState.graphicsContainer.container.alpha = this.alpha;
                if(this.alpha >= 1) {
                    console.log("done");
                    game.clearStates();
                    game.replaceState(this.newState);
                }
            }
        }
        return true;
    }
}