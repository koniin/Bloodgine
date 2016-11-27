import {IRenderer, IRenderable} from './IRenderer'
import * as PIXI from 'pixi.js'

export default class SpriteSheet {
    framesPerRow:number;
    frames:PIXI.Texture[];
    
    constructor(private texture:PIXI.Texture, public frameWidth:number, public frameHeight:number, public endFrame:number) {
        this.framesPerRow = Math.floor(texture.width / frameWidth);
        this.frames = [];
        for(let i = 0; i < endFrame; i++) {
            var row = Math.floor(i / this.framesPerRow);
            var col = Math.floor(i % this.framesPerRow);
            var rectangle = new PIXI.Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight);
            var frame = new PIXI.Texture(texture.baseTexture, rectangle);
            this.frames.push(frame);
        }
    }

    getFrameTexture(frame:number):PIXI.Texture {
        return this.frames[frame];
    }
}