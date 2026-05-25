import EscenaBase from './escenaBase.js';
import { Start } from './menu.js';

/** 
 * 
 *  Clase que crea la configuracion general del juego
 * 
 */
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#5496ec',
    pixelArt: true,
    antialias: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500},
            debug: false
        }
    },
    scene: [Start, EscenaBase]
};

const game = new Phaser.Game(config);