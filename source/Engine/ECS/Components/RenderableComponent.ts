import Component from '../Component'
import {IRenderable} from '../../Graphics/IRenderer'
import * as PIXI from 'pixi.js'

abstract class RenderableComponent extends Component implements IRenderable {
    abstract getX():number;
    abstract getY():number;
    abstract getWidth():number;
    abstract getHeight():number;
    public graphic:PIXI.DisplayObject;
    private _container:PIXI.Container;
    public zIndex:number = 0;

    constructor() {
        super();
        this._container = new PIXI.Container();
        this.graphic = this._container;
    }

    protected addGraphic(displaybject:PIXI.DisplayObject) {
        this._container.addChild(displaybject);
    }
}

export default RenderableComponent;