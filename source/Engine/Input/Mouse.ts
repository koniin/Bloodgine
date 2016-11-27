import Point from '../Core/Point'

export class Mouse {
    position:Point;
    clicked:boolean;
    down:boolean;

    constructor() {
        this.position = new Point();
        this.clicked = false;
        this.down = false;
    }
}