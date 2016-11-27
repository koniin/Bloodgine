import Component from '../Component'
import {Camera} from '../../Graphics/Camera'

export default class CameraFollowComponent extends Component  {
    cameraX:number;
    cameraY:number;

    constructor(private camera:Camera) {
        super();
        this.camera = camera;
    }
    
    update(dt:number) {
        var dx = this.entity.x - this.camera.width / 2;
        var dy = this.entity.y - this.camera.height / 2;
        this.camera.setOffset(dx, dy);
    }
}