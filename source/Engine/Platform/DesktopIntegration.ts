declare var electron:any;

interface Ipc {
    send(...params: any[]);
    sendSync(...params: any[]);
    on(...params: any[]);
    once(...params: any[]);
    removeListener(...params:any[]);
    removeAllListeners(...params:any[]);
}

class IpcNullImplementation implements Ipc {
    send(...params: any[]) {}
    sendSync(...params: any[]) {}
    on(...params: any[]) {}
    once(...params: any[]) {}
    removeListener(...params:any[]) {}
    removeAllListeners(...params:any[]) {}
}

export class DesktopIntegration {
    private _electron;
    private _ipc:Ipc;

    constructor() {
        if(electron) {
            this._electron = electron;
            this._ipc = electron.ipcRenderer;            
        } else {
            this._ipc = new IpcNullImplementation();
        }
    }

    public sendMessage(channel:string, ...args:any[]) {
        this._ipc.send(channel, args);
    }

    public sendMessageSync(channel:string, ...args:any[]) {
        this._ipc.sendSync(channel, args);
    }

    public onReceiveMessage(channel:string, listener:Function) {
        this._ipc.on(channel, listener);
    }

    public onReceiveMessageOnce(channel:string, listener:Function) {
        this._ipc.once(channel, listener);
    }

    public removeListener(channel:string, listener:Function) {
        this._ipc.removeListener(channel, listener);
    }

    public removeAllListeners(channel?:string) {
        if(channel)
            this._ipc.removeAllListeners(channel);
        else 
            this._ipc.removeAllListeners();
    }

    public quit() {
        this.sendMessage('exit-app');
    }

    public resize(width:number, height:number) {
        this.sendMessage("resize", width, height);
    }

    public debug() {
        this.sendMessage('debug');
    }
};

export const DesktopApi = new DesktopIntegration();
export default DesktopApi;

/*
//let window = BrowserWindow.getFocusedWindow();
             //window.setFullScreen(!window.isFullScreen());
             //ipc.send('close-main-window');
             //app.setName("Hej");
            //ipc.send("close-main-window");
            ipc.send('asynchronous-message', 'ping');

            const reply = ipc.sendSync('synchronous-message', 'ping');
            const message = `Synchronous message reply: ${reply}`;
            console.log(message);

ipc.on('asynchronous-reply', function (event, arg) {
  const message = `Asynchronous message reply: ${arg}`
  console.log(message);
});*/