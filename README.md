## Simple game engine for HTML5 games written in Typescript.

Built on [Pixi.js](https://github.com/pixijs/pixi.js) for rendering.

## Features:

1. States (Menu, Game, Pause etc) with support for displaying a state on top of another (great for e.g. pause menu or combat on a map)
2. Input handling (Keyboard, Mouse, Gamepad) - can also use Pixi-sprites if you want to do it that way
3. Crude camera support
4. Resolution scaling
5. Basic Tiled map support
6. 2d grid class and A-star path finding
7. EC (Entity + component system), no support for systems built in
8. Simple Ambient lighting
9. Noise and noise maps (Maps, Islands) generated from [simplex-noise](https://github.com/jwagner/simplex-noise.js)
10. Turn based support (works, but not fancy) and Ability/Spell system (also in beginning state, works but no more ;))
11. Some UI features like basic buttons, text, control list
12. Some [Electron](https://github.com/electron/electron) integration for Desktop based games
13. Basic Particle system
14. Audio through [Howler.js](https://github.com/goldfire/howler.js/)
15. Tweening with [tween.js](https://github.com/tweenjs/tween.js/)

## Example in Typescript:

SuperDuperGame.ts:

```javascript

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

```
## Motivation

I wanted to start making games in HTML5 and typescript. So I have done some work with Phaser but I just wanted to create something myself from scratch that has everything I want for my games, simple solution; just roll my own ;)

## Installation

Install the engine with npm (if thats what you prefer):
```
npm install bloodgine
```

## Tests

Currently there are no tests written for anything, code is provided as is.

## Contributors

If you want to add/contribute to the project I would be more than happy to accept PRs or anything.

## License

MIT
