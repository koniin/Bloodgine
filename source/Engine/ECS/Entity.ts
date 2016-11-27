import Scene from './Scene'
import Component from './Component'
import {Transform} from './Transform'

export default class Entity {
    private components:Component[];
    public scene:Scene;
    public transform:Transform;
    public id:number;
    
    constructor(public name:string, x:number, y:number) {
        this.transform = new Transform();
        this.components = [];
    }

    update(dt) {
        for(let component of this.components)
            component.update(dt);
    }

    get x():number {
        return this.transform.x;
    }
    set x(x:number) {
        this.transform.x = x;
    }

    get y():number {
        return this.transform.y;
    }
    set y(y:number) {
        this.transform.y = y;
    }

    setPosition(x:number, y:number) {
        this.transform.x = x;
        this.transform.y = y;
    }
    
    addComponent(component:Component):Entity {
        component.entity = this;
        this.scene.registerComponent(component);
        this.components[this.components.length] = component;
        component.onAddedToEntity();
        this[this.getName(component)] = component;
        return this;
    }

    hasComponent(componentType):boolean {
        for(let component of this.components) {
            if(component instanceof componentType)
                return true;
        }
        return false;
    }

    getComponentByType(componentType):Component {
        for(let component of this.components) {
            if(component instanceof componentType)
                return component;
        }
        return undefined;
    }


/**
 * Get the name of a function (e.g. constructor)
 * @param {Function} f
 * @return {String} The function name.
 */
getName(f)
{
    
    var FUNCTION_NAME = /function\s+([^\s(]+)/;
  var name = '';

  if (f instanceof Function) {
    if (f.name) {
      return f.name;
    }

    var match = f.toString().match(FUNCTION_NAME);

    if (match) {
      name = match[1];
    }
  } else if (f && f.constructor instanceof Function) {
    name = this.getName(f.constructor);
  }

  return name;
}
}