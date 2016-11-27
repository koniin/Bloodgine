export class Camera {
    public offsetX:number = 0;
    public offsetY:number = 0;
    public width:number = 0;
    public height:number = 0;
    public worldWidth:number = 0;
    public worldHeight:number = 0;

    move(x:number, y:number) {
        this.offsetX += x;
        this.offsetY += y;
        this.keepInWorld();
    }

    setOffset(x:number, y:number) {
        this.offsetX = x | 0;
        this.offsetY = y | 0;
        this.keepInWorld();
    }

    private keepInWorld() {
        if(this.offsetX < 0)
            this.offsetX = 0;
        if(this.offsetY < 0)
            this.offsetY = 0;

        if(this.offsetX > this.worldWidth - this.width)
            this.offsetX = this.worldWidth - this.width;
        if(this.offsetY > this.worldHeight - this.height)
            this.offsetY = this.worldHeight - this.height;
    }
}