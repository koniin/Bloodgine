import {IRenderer, IRenderable} from './IRenderer'
import * as PIXI from 'pixi.js'

class DisplayObjectContainer extends PIXI.Container {
    constructor(public z:number) {
        super();
    }
}

export class GraphicsContainer {
    public container:PIXI.Container;
    private zContainers:{[z:number]: DisplayObjectContainer};

    constructor() {
        this.container = new PIXI.Container();
        this.zContainers = {};
        this.zContainers[0] = new DisplayObjectContainer(0);
        this.container.addChild(this.zContainers[0]);
    }

    add(renderable:IRenderable, zIndex:number = 0) {
        this.addDisplayObject(renderable.graphic, renderable.zIndex);
    }

    addDisplayObject(o:PIXI.DisplayObject, zIndex:number) {
        let container = this.zContainers[zIndex];
        if(!container) {
            this.zContainers[zIndex] = new DisplayObjectContainer(zIndex);
            container = this.zContainers[zIndex];
            this.addNewZContainer(container, zIndex);
        }
        container.addChild(o);
    }

    private addNewZContainer(container:PIXI.Container, z:number) {
        this.container.addChild(container);
        this.container.children.sort(function(a:DisplayObjectContainer,b:DisplayObjectContainer) {
            a.z = a.z || 0;
            b.z = b.z || 0;
            return a.z - b.z
        });
    }

    remove(renderable:IRenderable) {
        let container = this.zContainers[renderable.zIndex];
        container.removeChild(renderable.graphic);
    }
}
