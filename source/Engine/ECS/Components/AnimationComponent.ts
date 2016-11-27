import RenderableComponent from '../RenderableComponent'
import SpriteSheet from '../../Graphics/SpriteSheet'
import Animation from  '../../Graphics/Animation'
import {IRenderer} from '../../Graphics/IRenderer'

export default class AnimationComponent extends RenderableComponent {
    private animations: { [index: string]: Animation } = {};
    private _width:number;
    private _height:number;
    private _playing:string;

    getX():number {
        return this.entity.x;
    }

    getY():number {
        return this.entity.y;
    }

    getHeight():number {
        return this._height;
    }
    
    getWidth():number {
        return this._width;
    }

    public addAnimation(key:string, spriteSheet:SpriteSheet, frames?:number[]) {
        if(frames && frames.length)
            this.animations[key] = new Animation(spriteSheet, frames);
        else
            this.animations[key] = new Animation(spriteSheet);

        this._width = spriteSheet.frameWidth;
        this._height = spriteSheet.frameHeight;

        this.animations[key].setVisible(false);
        this.addGraphic(this.animations[key].graphic);
    }

    public play(key:string, frameSpeed?:number, loop?:boolean) {
        if(this._playing)
            this.animations[this._playing].setVisible(false);

        this._playing = key;
        if(frameSpeed && loop)
            this.animations[key].play(frameSpeed, loop);
        else if(frameSpeed)
            this.animations[key].play(frameSpeed);
        else
            this.animations[key].play();
        this.animations[key].setVisible(true);
    }

    update(dt:number) {
        if(this._playing) {
            this.animations[this._playing].update(dt);
            this.animations[this._playing].setPosition(this.getX(), this.getY());
        }
    }
} 