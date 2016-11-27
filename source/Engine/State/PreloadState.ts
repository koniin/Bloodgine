import GameCore from '../GameCore'
import State from './State'

export class PreloadState extends State {
    private preloader:any;
    private textures:string[];

    constructor(private nextState:State) {
        super();
        this.textures = nextState.getTextures();
    }

    resourceProgressUpdate = (loader, loadedResource) => {
        console.log('Progress:', loader.progress + '%');
    };

    init(game:GameCore) {
        this.resources.setProgressUpdate(this.resourceProgressUpdate);
        this.resources.load(this.textures);
    }

    /// Returns false if this state does not want further updates down the state stack
    update(game:GameCore, dt:number) {
        if(this.resources.isReady())
            game.replaceState(this.nextState);
        return false;
    }

    destroy(game:GameCore) {}
    render(game:GameCore):void {}
}