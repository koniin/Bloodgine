import {IRenderer, IRenderable} from './IRenderer'
import SpriteSheet from './SpriteSheet'
import * as PIXI from 'pixi.js'

export default class Animation implements IRenderable {
    loop:boolean = false;
    frameSpeed:number; // standard 60 fps
    public onComplete:Function;
    private elapsed:number = 0;
    private currentFrame:number = 0;  // the current frame to draw
    private lastFrame:number = 0;  // the current frame to draw
    private playing:boolean = false;
    private frames:number[];
    private sprite:PIXI.Sprite;
    public graphic:PIXI.DisplayObject;
    public zIndex:number = 0;
    private endFrame:number;
    private startFrame:number = 0;

    constructor(protected spriteSheet:SpriteSheet, frames?:number[]) {
        this.frameSpeed = 1000 / 60;
        if(frames) {
            this.frames = frames;
        } else {
            this.frames = [];
            this.endFrame = spriteSheet.endFrame - 1;
            for (let frameNumber = this.startFrame; frameNumber <= this.endFrame; frameNumber++) {
                this.frames.push(frameNumber);
            }
        }
        this.endFrame = this.frames.length - 1;
        
        let texture = this.spriteSheet.getFrameTexture(this.currentFrame);
        this.sprite = new PIXI.Sprite(texture);
        this.graphic = this.sprite;
    }

    play(frameSpeed?:number, loop?:boolean) {
        if(frameSpeed)
            this.frameSpeed = 1000 / frameSpeed;
        
        this.loop = loop;
        this.playing = true;
        this.reset();
    }

    stop() {
        this.playing = false;
    }

    reset() {
        this.currentFrame = this.startFrame;
    }

    setVisible(visible:boolean) {
        this.sprite.visible = visible;
    }

    update(dt:number) {
        if(!this.playing) return;

        this.elapsed += dt * 1000; 
        if(this.elapsed < this.frameSpeed) return;

        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        if(this.currentFrame != this.lastFrame)
            this.sprite.texture = this.spriteSheet.getFrameTexture(this.currentFrame);
        this.lastFrame = this.currentFrame;

        if(!this.loop && this.currentFrame == this.endFrame)
            this.stop();

        if(this.onComplete)
            this.onComplete();

        this.elapsed = 0;
    }

    setPosition(x:number, y:number) {
        this.sprite.position.set(x, y);
    }
}