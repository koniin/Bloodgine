import {IRenderer, IRenderable} from './IRenderer'
import * as PIXI from 'pixi.js'

export class Image implements IRenderable {
    public blendMode:string;
    public graphic:PIXI.DisplayObject;
    public zIndex:number = 0;

    public setBlendMode(blendMode:number) {
        (<PIXI.Sprite>this.graphic).blendMode = blendMode;
    }

    constructor(private texture:PIXI.Texture, public x:number, public y:number) {
        this.graphic = new PIXI.Sprite(texture);
        this.graphic.position.set(x, y);
    }

/*
    render(renderer:IRenderer) {
        if(this.blendMode) {
            renderer.ctx.globalCompositeOperation = this.blendMode;
        }
        if(this.resource instanceof ImageData)
            renderer.ctx.putImageData(this.resource, this.x, this.y);
        else if(this.resource instanceof HTMLImageElement)
            renderer.render(this.resource, this.x, this.y);
        else
            console.log("cant render resource!");

        if(this.blendMode)
            renderer.ctx.globalCompositeOperation = 'source-over';
    }
    */
}