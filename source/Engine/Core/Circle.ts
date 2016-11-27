import * as math from './Math'
import {Rectangle} from './Rectangle'

export class Circle {
    // center x
    public x:number;
    // center y
    public y:number;
    public radius:number;

    intersects(c:Circle):boolean {
        return Circle.intersect(c, this);
    }

    intersectsRect(r:Rectangle):boolean {
        return Circle.intersectRect(this, r);
    }

    public static intersect(c1:Circle, c2:Circle):boolean {
        let distanceX = c1.x - c2.x;
        let distanceY = c1.y - c2.y;
        let radiusSum = c1.radius + c2.radius;
        return distanceX * distanceX + distanceY * distanceY <= radiusSum * radiusSum;
    }

    public static intersectRect(circle:Circle, rectangle:Rectangle):boolean {
        // Find the closest point to the circle within the rectangle
        // Assumes axis alignment! ie rect must not be rotated
        var closestX = math.clamp(circle.x, rectangle.x, rectangle.x + rectangle.width);
        var closestY = math.clamp(circle.y, rectangle.y, rectangle.y + rectangle.height);

        // Calculate the distance between the circle's center and this closest point
        var distanceX = circle.x - closestX;
        var distanceY = circle.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (circle.radius * circle.radius);
    }
}