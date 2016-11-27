import Point from '../Core/Point'
import Vector2 from '../Core/Vector2'
import {Pool} from '../Core/Pool'
import * as plib from '../Core/Performance'
import GameCore from '../GameCore'
import {Control} from '../UI/Control'
import {IInputListener} from './IInputListener'
import {Mouse} from './Mouse'
import {Gamepads} from './Gamepads'
import {InputEvent, InputEventType} from './InputEvent'

class DragState {
    dragging:boolean;
    selection:IInputListener;
    dragoffx:number;
    dragoffy:number;

    constructor() {
        this.dragging = false; // Keep track of when we are dragging
        // the current selected object.
        // In the future we could turn this into an array for multiple selection
        this.selection = null;
        this.dragoffx = 0; // See mousedown and mousemove events for explanation
        this.dragoffy = 0;
    }
}

        /*
        basic click flow in Phaser:
            - when interactive is set on a sprite a handler is attached that also registers itself in game interactive objects
 
            - click event is fired 
            - calls move function with fromclick set to true
                - move function updates the mouse location
                - sets which mouse button is clicked from event data
                - move function checks all registered objects and sets this.targetObject
            - move function calls the click handler on the object
            
            - processInteractiveObjects calls swaptarget when it finds a target
            - swaptarget calls pointerOver and pointer out depending on logic (https://github.com/photonstorm/phaser/blob/694debe94b26d88d88a0bffd4abce5572f1ffdda/src/input/Pointer.js)
            
            - move function calls all move callbacks on the object

    */


export class InputManager {
    private keys = [];
    private keysPressed = [];
    private keysUp = [];
    private domElement:HTMLCanvasElement;
    public mouse:Mouse;
    public gamepads:Gamepads;
    private resolution:number = 1;
    private game:GameCore;
    private inputListeners:IInputListener[] = [];
    public scaleX:number = 1;
    public scaleY:number = 1;

    private drag:DragState;

    constructor() {
        this.mouse = new Mouse();
        this.gamepads = new Gamepads();
        this.drag = new DragState();
    }

    registerEventHandlers(canvas:HTMLCanvasElement) {
        this.domElement = canvas;
        window.addEventListener("keydown", this.keyDownListener, false);
        window.addEventListener("keyup", this.keyUpListener, false);
        window.addEventListener('blur', this.blurListener);
        this.domElement.addEventListener("mousedown", this.mouseDownListener, true);
        this.domElement.addEventListener("mouseup", this.mouseUpListener, true);
        this.domElement.addEventListener("mousemove", this.mouseMoveListener, true);
    }

    update(dt:number) {
        this.gamepads.update(dt);
        this.keysPressed.length = 0;
        this.keysUp.length = 0;
        this.mouse.clicked = false;
    }

    keyDown(keyCode:number):boolean {
        return this.keys[keyCode];
    }

    keyPressed(keyCode:number):boolean {
        return this.keysPressed[keyCode];
    }

    keyUp(keyCode:number):boolean {
        return this.keysUp[keyCode];
    }

    mouseDown():boolean {
        return this.mouse.down;
    }

    mouseClicked():boolean {
        return this.mouse.clicked;
    }

    addInputListener(inputListener:IInputListener):boolean {
        if (this.inputListeners.indexOf(inputListener) === -1) {
            this.inputListeners.push(inputListener);
            // Sort by priority, higher gets hit first
            this.inputListeners.sort(this.inputListenerSortDescending);
            return true;
        }
        else
            console.warn("already added " + inputListener + "to inputlisteners");
        
        return false;
    }

    removeInputListener(inputListener:IInputListener):void {
        let i = this.inputListeners.indexOf(inputListener);
        if(i > -1) {
            plib.arrayRemove(this.inputListeners, i);
            // Sort by priority, higher gets hit first
            this.inputListeners.sort(this.inputListenerSortDescending);
        }
    }

    addInputListeners(inputListeners:IInputListener[]):void {
        for(let i of inputListeners)
            this.addInputListener(i);
    }

    removeInputListeners(inputListeners:IInputListener[]):void {
        for(let i of inputListeners)
            this.removeInputListener(i);
    }

    setScale(x:number, y:number) {
        this.scaleX = x;
        this.scaleY = y;
    }

    // Sort descending
    private inputListenerSortDescending(first:IInputListener, second:IInputListener) {
        if (first.priority < second.priority)
            return 1;
        if (first.priority > second.priority)
            return -1;
        return 0;
    }

    private blurListener = (ev: UIEvent) => {
        this.keys.length = 0;
    }

    private keyDownListener = (e:KeyboardEvent) => {
        //e.preventDefault(); // might need this for window game or something to not do f5 reload?
        if(!this.keys[e.keyCode]) { // this disables key repeat
            this.keys[e.keyCode] = true;
            this.keysPressed[e.keyCode] = true;
        }
    }

    private keyUpListener = (e:KeyboardEvent) => {
        //e.preventDefault();
        this.keys[e.keyCode] = false;
        this.keysUp[e.keyCode] = true;
    }

    private inputEventPool:Pool<InputEvent> = new Pool<InputEvent>();
    private getInputEvent(type:InputEventType):InputEvent {
        let inputEvent = this.inputEventPool.get<InputEvent>(InputEvent);
        //let inputEvent = new InputEvent();
        inputEvent.type = type;
        // inputEvent.button = 
        inputEvent.x = this.mouse.position.x;
        inputEvent.y = this.mouse.position.y;
        return inputEvent;
    }

    private mouseMoveListener = (e:MouseEvent) => {
        this.mapMousePosition(this.mouse.position, e.clientX, e.clientY);
        let inputEvent = this.getInputEvent(InputEventType.mouseMove);
        this.mouseMove(inputEvent);
        this.inputEventPool.free(inputEvent);
    }

    // Now does onclick for all objects under, no priority or break if handled
    private mouseDownListener = (e:MouseEvent) => {
        this.mapMousePosition(this.mouse.position, e.clientX, e.clientY);
        this.mouse.clicked = true;
        this.mouse.down = true;
        let inputEvent = this.getInputEvent(InputEventType.mouseDown);
        this.mouseButtonChange(inputEvent);
        this.inputEventPool.free(inputEvent);
    }

    private mouseUpListener = (e:MouseEvent) => {
        this.mapMousePosition(this.mouse.position, e.clientX, e.clientY);
        this.mouse.down = false;
        this.mouse.clicked = false;
        let inputEvent = this.getInputEvent(InputEventType.mouseUp);
        this.mouseButtonChange(inputEvent);
        this.inputEventPool.free(inputEvent);
    }

    private watchList:IInputListener[] = [];
    private mouseButtonChange(inputEvent:InputEvent) {
        for (let inputListener of this.inputListeners) {
            if(this.hitTest(inputListener)) {
                this.handleDrag(inputListener, inputEvent);
                if(inputListener.handle(inputEvent)) {
                    return;
                }
            }
        }
    }

    private mouseMove(inputEvent:InputEvent) {
        for (let inputListener of this.inputListeners) {
            if(this.hitTest(inputListener)) {
                this.handleDrag(inputListener, inputEvent);
                // inputListener is not on watchlist - add it and call mouseEnter
                if(this.watchList.indexOf(inputListener) === -1) {
                    this.watchList.push(inputListener);
                    let mouseEnter = this.getInputEvent(InputEventType.mouseEnter);
                    inputListener.handle(mouseEnter);
                    this.inputEventPool.free(mouseEnter);
                }
                if(inputListener.handle(inputEvent)) {
                    // inputListener handled mouseOver event so we need to clear others
                    if(this.watchList.length > 1) {
                        let i = this.watchList.indexOf(inputListener);
                        let topMost = this.watchList[i];
                        plib.arrayRemove(this.watchList, i);
                        for(let inter of this.watchList) {
                            let mouseLeave = this.getInputEvent(InputEventType.mouseLeave);
                            inter.handle(mouseLeave);
                            this.inputEventPool.free(mouseLeave);
                        }
                        this.watchList.length = 0;
                        this.watchList[this.watchList.length] = topMost;
                    }
                    return;
                }
            // inputListener is on watchlist so remove it
            } else {
                let index = this.watchList.indexOf(inputListener);
                if(index >= 0) {
                    let mouseLeave = this.getInputEvent(InputEventType.mouseLeave);
                    inputListener.handle(mouseLeave);
                    this.inputEventPool.free(mouseLeave);
                    plib.arrayRemove(this.watchList, index);
                }
            }
        }
    }

    public resetDrag():void {
        this.drag.selection = null;
        this.drag.dragging = false;
    }

    private handleDrag(inputListener:IInputListener, inputEvent:InputEvent):void {
        if(!inputListener.draggable) return;
        if(inputEvent.type == InputEventType.mouseDown) {
            this.drag.dragoffx = this.mouse.position.x - inputListener.left;
            this.drag.dragoffy = this.mouse.position.y - inputListener.top;
            this.drag.dragging = true;
            this.drag.selection = inputListener;
            let event = this.getInputEvent(InputEventType.dragStart);
            inputListener.handle(event);
            this.inputEventPool.free(event);
        } else if(inputEvent.type == InputEventType.mouseMove && this.drag.dragging) {
            let event = this.getInputEvent(InputEventType.dragMove);
            if(!inputListener.handle(event)) {
                this.drag.selection.left = this.mouse.position.x - this.drag.dragoffx;
                this.drag.selection.top = this.mouse.position.y - this.drag.dragoffy;
            }
            this.inputEventPool.free(event);
        } else if(inputEvent.type == InputEventType.mouseUp) {
            this.drag.dragging = false;
            let event = this.getInputEvent(InputEventType.dragEnd);
            inputListener.handle(event);
            this.inputEventPool.free(event);
        }
    }

    private hitTest(inputListener:IInputListener):boolean {
        if(!inputListener.active)
            return false;
        if(inputListener.disableHitTesting)
            return true;
        if(this.mouse.position.x >= inputListener.left && this.mouse.position.x <= inputListener.right) {
            if(this.mouse.position.y >= inputListener.top && this.mouse.position.y <= inputListener.bottom) {
                return true;
            }
        }
        return false;
    }

    private mapMousePosition(pos:Point, x:number, y:number) {
        let rect = this.domElement.getBoundingClientRect();
        pos.x = ( ( x - rect.left ) * (this.domElement.width  / rect.width  ) ) / this.resolution / this.scaleX;
        pos.y = ( ( y - rect.top  ) * (this.domElement.height / rect.height ) ) / this.resolution / this.scaleY;
    }

    Keys = {
        backspace: 8,
        tab: 9,
        return: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        delete: 46,
        zero: 48, 
        one: 49, 
        two: 50, 
        three: 51, 
        four: 52, 
        five: 53, 
        six: 54, 
        seven: 55, 
        eight: 56, 
        nine: 57,
        a: 65, 
        b: 66, 
        c: 67, 
        d: 68, 
        e: 69, 
        f: 70, 
        g: 71, 
        h: 72, 
        i: 73, 
        j: 74, 
        k: 75, 
        l: 76, 
        m: 77, 
        n: 78, 
        o: 79, 
        p: 80, 
        q: 81, 
        r: 82, 
        s: 83, 
        t: 84, 
        u: 85, 
        v: 86, 
        w: 87, 
        x: 88, 
        y: 89, 
        z: 90
    };  
} 

export const Input = new InputManager();
export default Input;