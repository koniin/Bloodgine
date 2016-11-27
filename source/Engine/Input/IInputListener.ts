import {InputEvent} from './InputEvent'

export interface IInputListener {
    // if its not active it will not be used in hit testing
    active:boolean;

    // events are sent to listeners in priority order ascending
    priority:number;

    // if true no hit test will be done on this listener
    disableHitTesting:boolean;

    // used to enable dragging of this
    draggable:boolean;

    // Used for hit testing
    left:number;
    right:number;
    top:number;
    bottom:number;
    
    // Returns a boolean indicating if the input was processed.
    // which stops any other interactive to get processed
    handle(e:InputEvent):boolean;
}
