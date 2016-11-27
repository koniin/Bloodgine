import SpriteSheet from '../Graphics/SpriteSheet'
import * as PIXI from 'pixi.js'
import * as howler from 'howler'

let globalyLoadedTextures: { [id: string] : string; } = {}; 
export default class ResourceManager {
    public sounds: { [id: string] : Howl; };
    private resourceCount:number = 0;
    private resourcesReady:number = 0;
    private disableSound:boolean;
    private preloader:any;

    constructor() {
        this.sounds = {};
        this.disableSound = false;
    }

    isReady():boolean {
        return this.resourceCount === this.resourcesReady;
    }

    setProgressUpdate(f:any) {
        PIXI.loader.off("progress", () => {});
        PIXI.loader.on("progress", (loader, progress) => { 
            this.resourcesReady++;
            f(loader, progress);
        });
    }

    loadImage(imgUrl:string, onloaded?:Function) {
        let image = new Image();
        image.onload = () => {
            PIXI.Texture.fromImage(image.src);
            if(onloaded)
                onloaded();
        };
        image.src = imgUrl;
    }

    load(textures:string[]) {
        let newTextures = [];
        for(let texture of textures) {
            if(!globalyLoadedTextures[texture]) {
                globalyLoadedTextures[texture] = texture;
                newTextures[newTextures.length] = texture;
                this.resourceCount++;
            }
        }

        PIXI.loader.add(newTextures).load();
    }

    loadSound(id:string, path:string, volume?:number):Howl {
        let sound = new howler.Howl({
            src: [path]
        });
        this.sounds[id] = sound;
        return sound;
    }

    getTexture(id:string):PIXI.Texture {
        return PIXI.loader.resources[id].texture;
    }

    getSound(id:string):Howl {
        return this.sounds[id];
    }

    clear() {
        this.sounds = {};
        PIXI.loader.reset();
    }

    toggleSound():void {
        this.disableSound = !this.disableSound;
        Howler.mute(this.disableSound);
    }

    soundDisabled():boolean {
        return this.disableSound;
    }
}