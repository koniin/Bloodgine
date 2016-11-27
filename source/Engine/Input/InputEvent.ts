import { IPoolItem } from '../Core/Pool'

export enum InputEventType {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseEnter,
    mouseLeave,
    dragStart,
    dragMove,
    dragEnd
}

export class InputEvent implements IPoolItem {
    type:InputEventType;
    button:number;
    x:number;
    y:number;
    active:boolean;

    reset() {
        this.button = 0;
        this.x = 0;
        this.y = 0;
    }
}