import * as TWEEN from 'tween.js'

export class TweenManager {
    public add(target:any) {
        var tween = new TWEEN.Tween(target);
        return tween;
    }
    
    update(dt:number):void {
        TWEEN.update();
    }
}