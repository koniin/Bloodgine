import {Pool} from '../Core/Pool'
import * as plib from '../Core/Performance'

class TimeEvent {
    public elapsed:number = 0;
    public active:boolean = false;
    public time:number = 0;
    public callback:Function;

    constructor() {}

    reset() {
        this.elapsed = 0;
    }
}

export class TimerEvents {
    private activeEvents:TimeEvent[];
    private completedEvents:TimeEvent[];
    private eventPool:Pool<TimeEvent> = new Pool<TimeEvent>();

    constructor() {
        this.activeEvents = [];
        this.completedEvents = [];
    }

    public add(time:number, callback:Function, context?:any) {
        let timeEvent = this.eventPool.get<TimeEvent>(TimeEvent);
        timeEvent.time = time;
        if(context)
            timeEvent.callback = callback.bind(context);
        else 
            timeEvent.callback = callback;
        this.activeEvents[this.activeEvents.length] = timeEvent;
    }

    public update(dt:number) {
        for(let event of this.activeEvents) {
            event.elapsed += dt;
            if(event.elapsed >= event.time) {
                event.callback();
                this.completedEvents[this.completedEvents.length] = event;
                this.eventPool.free(event);
            }
        }

        plib.arrayRemoveMany(this.activeEvents, this.completedEvents);
    }
}