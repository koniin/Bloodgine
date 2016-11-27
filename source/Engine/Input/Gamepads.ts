
		// DEADZONE
		// https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
		
		// test pad:
		// http://html5gamepad.com/
		/*

		EACH GAMEPAD OBJECT LOOKS LIKE THIS: LINK
		axes: Array[4]
		buttons: Array[16]
		connected: true
		id: "Xbox 360 Controller (XInput STANDARD GAMEPAD)"
		index: 0
		mapping: "standard"
		timestamp: 12
		
        
        // dont need those really?
		window.addEventListener("gamepadconnected", Gamepad.connect);
		window.addEventListener("gamepaddisconnected", Gamepad.disconnect);

		*/

// Handles 1 gamepad
export class Gamepads {
    gamepad:Gamepad;
    private buttonsPressed:{ [id:number]: boolean } = {};
    private buttonsPressedLast:{ [id:number]: boolean } = {};
    private axes:{ [id:number]: number } = {};
    private lastAxes:{ [id:number]: number } = {};
	private deadZoneWidth:number = 0.25;
    public disconnected:boolean;
	private _enabled = false;

	public enable() {
		this._enabled = true;
	}

    update(dt:number) {
		if(!this._enabled)
			return;
			
        this.gamepad = this.getFirstActiveGamePad();
      	if(this.gamepad) {
            this.disconnected = false;
			
			for(var i = 0; i < this.gamepad.axes.length; i++) {
				this.lastAxes[i] = this.axes[i];
				this.axes[i] = this.applyDeadzone(this.gamepad.axes[i], this.deadZoneWidth); 
			}

			for(var i = 0; i < this.gamepad.buttons.length; i++) {
                // think buttons[i].value is used for triggers and needs to be adjusted to that
                this.buttonsPressedLast[i] = this.buttonsPressed[i]; 
                this.buttonsPressed[i] = (this.gamepad.buttons[i].pressed || this.gamepad.buttons[i].value > 0.4);
			}
      	} else {
            this.disconnected = true;
        }
    }

    getFirstActiveGamePad():Gamepad | undefined {
        var pads = navigator.getGamepads();
        for(var i = 0; i < pads.length; i++) {
			if(pads[i])
				return pads[i];
		}
        return undefined;
    }

	axis(axis:number):number {
		return this.axes[axis];
	}

	axisPressed(axis:number):boolean {
        return Math.round(this.axes[axis]) && !Math.round(this.lastAxes[axis]); 
	}

	axisReleased(axis:number):boolean {
        return Math.round(this.lastAxes[axis]) && !Math.round(this.axes[axis]); 
	}

    buttonDown(button:number):boolean {
        return this.buttonsPressed[button];
    }

    buttonPressed(button:number):boolean {
        return !this.buttonsPressedLast[button] && this.buttonsPressed[button]; 
    }

	buttonReleased(button:number):boolean {
        return this.buttonsPressedLast[button] && !this.buttonsPressed[button]; 
    }
    
    applyDeadzone(number:number, threshold:number):number {
	    let percentage = (Math.abs(number) - threshold) / (1 - threshold);
		if(percentage < 0){
			percentage = 0;
		}
		return percentage * (number > 0 ? 1 : -1);
	}
}