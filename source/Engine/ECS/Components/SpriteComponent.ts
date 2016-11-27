import RenderableComponent from './RenderableComponent'
import {IRenderer} from '../../Graphics/IRenderer'
import {Rectangle} from '../../Core/Rectangle'
import * as PIXI from 'pixi.js'

export default class SpriteComponent extends RenderableComponent {
    public resource:PIXI.Sprite;
    public scale:number = 1;
    private _rect:Rectangle;
    
    get rect():Rectangle {
        this._rect.x = this.entity.x;
        this._rect.y = this.entity.y;
        this._rect.height = this.getHeight();
        this._rect.width = this.getWidth();
        return this._rect;
    }

    constructor(resource:PIXI.Texture) {
        super();
        this.resource = new PIXI.Sprite(resource);
        this.addGraphic(this.resource);
        this._rect = new Rectangle();
    }

    getX():number {
        return this.entity.x;
    }

    getY():number {
        return this.entity.y;
    }

    getHeight():number {
        return this.resource.height * this.scale;
    }
    
    getWidth():number {
        return this.resource.width * this.scale;
    }
    
    update(dt) {
        this.resource.position.set(this.entity.x, this.entity.y);
    }

/*
    render(renderer:IRenderer) {
        renderer.render(this.resource, this.entity.x, this.entity.y, this.getWidth(), this.getHeight());
    }*/
}