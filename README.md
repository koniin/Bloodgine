Simple game engine for HTML5 games written in Typescript.

Built on Pixi.js.

Features:
1. States (Menu, Game, Pause etc) with support for displaying a state on top of another (great for e.g. pause menu or combat on a map)
2. Input handling (Keyboard, Mouse, Gamepad)
3. Crude camera support
4. Resolution scaling
5. Basic Tiled map support
6. 2d grid class and A-star path finding
7. EC (Entity + component system), no support for systems built in
8. Simple Ambient lighting
9. Noise and noise maps (Maps, Islands) generated from Simplex Noise
10. Turn based support (not thoroughly tested) and Ability/Spell system (also in beginning state, works but no more ;))
11. Some UI features like basic buttons, text, control list
12. Some Electron integration for Desktop based games
13. Basic Particle system

Example in Typescript:

import * as engine from 'bloodgine'
import * as PIXI from 'pixi.js'

class SuperDuperGame extends engine.GameCore {
    initialize() {
        this.pushState(new MainMenuState());
    }
}

let game = new SuperDuperGame();
game.run();


export default class MainMenuState extends engine.State {
    init(game:engine.GameCore) {
      // setup entities, gui etc here
    }

    destroy(game:engine.GameCore) {
      // remove anything you don't want to ase anymore, most things gets removed automatically
    }

    update(game:engine.GameCore, dt:number) {
        if(engine.Input.keyPressed(engine.Input.Keys.e)) {
            console.log("pressed e");
        }

        /// Returns false if this state does not want further updates down the state stack
        return false;
    }
}

