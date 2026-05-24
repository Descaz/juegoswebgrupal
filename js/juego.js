import EscenaBase from './escenaBase.js';

/** 
 * 
 *  Clase que crea la configuracion general del juego
 * 
 */
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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
    scene: [EscenaBase]
};

const game = new Phaser.Game(config);