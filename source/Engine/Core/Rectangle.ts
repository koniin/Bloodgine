import Point from './Point'
import {Circle} from './Circle'

export class Rectangle {
    public x:number;
    public y:number;
    public width:number;
    public height:number;

    constructor(x?:number, y?:number, width?:number, height?:number) {
        if(x !== undefined)
            this.x = x;
        if(y !== undefined)
            this.y = y;
        if(width !== undefined)
            this.width = width;
        if(height !== undefined)
            this.height = height;
    }

    public get left():number {
        return this.x;
    }

    public get right():number {
        return this.x + this.width;
    }

    public get top():number {
        return this.y;
    }

    public get bottom():number {
        return this.y + this.height;
    }

    public intersects(other:Rectangle):boolean {
        return Rectangle.intersect(this, other);
    }

    public intersectsPoint(x:number, y:number):boolean {
        return Rectangle.intersectPoint(x, y, this);
    }

    public intersectsPointO(p:Point):boolean {
        return Rectangle.intersectPoint(p.x, p.y, this);
    }

    public intersectCircle(c:Circle):boolean {
        return Rectangle.intersectCircle(c, this);
    }

    public static intersect(r1:Rectangle, r2:Rectangle):boolean {
        return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
    }

    public static intersectXY(x1:number, y1:number, width1:number, height1:number, x2:number, y2:number, width2:number, height2:number):boolean {
        return !(x2 > x1 + width1 || 
           x2 + width2 < x1 || 
           y2 > y1 + height1 ||
           y2 + height2 < y1);
    }

    public static intersectPoint(x:number, y:number, r:Rectangle):boolean {
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    public static intersectCircle(c:Circle, r:Rectangle) {
        return Circle.intersectRect(c, r);
    }
}