import Entity from './Entity'

export default class Component {
    public entity:Entity;
    update(dt:number) {}
    onAddedToEntity(){}
}