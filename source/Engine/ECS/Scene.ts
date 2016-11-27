import GameCore from '../GameCore'
import Entity from './Entity'
import Component from './Component'
import RenderableComponent from './Components/RenderableComponent'
import TouchInputComponent from './Components/TouchInputComponent'
import SpriteComponent from './Components/SpriteComponent'
import {IRenderer} from '../Graphics/IRenderer'
import InteractiveComponent from './Components/InteractiveComponent'
import {GraphicsContainer} from '../Graphics/GraphicsContainer'

export default class Scene {
    private graphicsContainer:GraphicsContainer;
    private renderer:IRenderer;
    private game:GameCore;
    private entities:Entity[] = [];
    private entityId:number = 0;
    active:boolean;
    
    constructor(game:GameCore) {
        this.game = game;
        this.renderer = game.renderer;
        this.active = true;
    }

    public setGraphicsContainer(graphicsContainer:GraphicsContainer) {
        this.graphicsContainer = graphicsContainer;
    }

    public update(dt) {
        if(!this.active) return;
        for (let entity of this.entities) {
            entity.update(dt);
        }
    }

    public render() {
        if(!this.active) return;
        //this.graphicsContainer.render(this.renderer);
    }

    public destroy() {
        //this.graphicsContainer.destroy();
        this.entities = null;
    }

    public createEntity(name:string, x?:number, y?:number):Entity {
        let entity = new Entity(name, 0, 0);
        entity.id = ++this.entityId;
        if(x && y)
            entity.setPosition(x, y);
        this.addEntity(entity);
        return entity;
    }
    
    public registerComponent(c:Component) {
        if(c instanceof RenderableComponent) {
            //if (!this.graphicsContainer.contains(c))
                this.graphicsContainer.add(c, c.zIndex);
            //else 
                //console.warn("already added " + c + "to renderables");
        }
        if(c instanceof InteractiveComponent) {
            this.game.input.addInputListener(<any>c);
        }
    }

    public addEntity(entity:Entity) {
        entity.scene = this;
        this.entities.push(entity);
    }

    public getEntities():Entity[] {
        return this.entities;
    }

    public findEntity(name:string):Entity {
        for (let entity of this.entities) {
            if(entity.name == name)
                return entity;
        }
        console.error("Could not find entity with name: " + name);
        return null;
    }
}