import State from '../State/State'
import Animation from './Animation'
import {Image} from './Image'
import {Lights} from './Lighting'
import SpriteSheet from './SpriteSheet'
import {InputManager} from '../Input/InputManager'
import {GraphicsContainer} from '../Graphics/GraphicsContainer'
import {TiledMap} from '../Utils/TiledMap'
import {Grid2d} from '../Utils/Grid/Grid2d'
import {IRenderer, IRenderable} from './IRenderer'
import {IParticleConfig, Emitter} from './Particles/Emitter'
import * as PIXI from 'pixi.js'

export class GraphicsFactory {
    zIndex:number = 0;
    constructor(private state:State, private renderer:IRenderer,  private graphicsContainer:GraphicsContainer) {}

    addDisplayObject(o:PIXI.DisplayObject, zIndex?:number) {
        let z = zIndex;
        if(!z)
            z = 0;
        this.graphicsContainer.addDisplayObject(o, z);
    }

    add(renderable:IRenderable, zIndex?:number) {
        if(zIndex)
            this.graphicsContainer.add(renderable, zIndex);
        else 
            this.graphicsContainer.add(renderable, renderable.zIndex);
    }

    remove(renderable:IRenderable) {
        this.graphicsContainer.remove(renderable);
    }

    image(texture:PIXI.Texture, x:number, y:number, z?:number):Image {
        let image = new Image(texture, x, y);
        if(z)
            this.graphicsContainer.add(image, z);
        else
            this.graphicsContainer.add(image, this.zIndex);
        return image;
    }

    spriteSheet(texture:PIXI.Texture, width:number, height:number, frames:number) {
        let spriteSheet = new SpriteSheet(texture, width, height, frames);
        //this.graphicsContainer.add(spriteSheet, this.zIndex);
        return spriteSheet;
    }

    animation(spriteSheet:SpriteSheet, x:number, y:number):Animation {
        let animation = new Animation(spriteSheet);
        animation.setPosition(x, y);
        //this.state.addInputListener(btn);
        this.graphicsContainer.add(animation, this.zIndex);
        return animation;
    }

    particleEmitter(x:number, y:number, config:IParticleConfig):Emitter {
        let emitter = new Emitter(x, y, config);
        this.graphicsContainer.add(emitter);
        return emitter;
    }

    tiledmap(url:string, grid?:Grid2d):TiledMap {
        let tiledmap = new TiledMap();
        tiledmap.onLoaded = () => {
            this.graphicsContainer.add(tiledmap, this.zIndex);
        };
        tiledmap.load(url, this.state.resources, grid);
        return tiledmap;
    }

    createImage(x:number, y:number, width:number, height:number, color:number):Image {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(color);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        
        let texture = this.renderer.createRenderTexture(width, height, graphics);
        return this.image(texture, x, y);
    }

    createSprite(x:number, y:number, width:number, height:number, color:number):PIXI.Sprite {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(color);
        graphics.drawRect(0, 0, width, height);
        graphics.endFill();
        
        let texture = this.renderer.createRenderTexture(width, height, graphics);
        let sprite = this.sprite(texture);
        sprite.position.set(x, y);
        return sprite;
    }

    sprite(texture:PIXI.Texture, z?:number):PIXI.Sprite {
        let sprite = new PIXI.Sprite(texture);
        if(z)
            this.graphicsContainer.addDisplayObject(sprite, z);
        else
            this.graphicsContainer.addDisplayObject(sprite, this.zIndex); 
        return sprite;
    }   

    setZIndex(z:number):void {
        this.zIndex = z;    
    }
}