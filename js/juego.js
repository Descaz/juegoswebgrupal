import EscenaBase from './escenaBase.js';

/** 
 * 
 *  Clase que crea la configuracion general del juego
 * 
 */
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 768,
    backgroundColor: '#5496ec',
    pixelArt: true,
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