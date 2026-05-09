/** 
 * 
 *  Clase que crea un objeto pincho que "mata" al personaje al tocarlo.
 * 
 */

export default class Pinchos extends Phaser.Physics.Arcade.Sprite {
    constructor(escena, x, y) {
        super(escena, x, y);

        this.escena = escena;
        this.escena.add.existing(this);
        this.escena.physics.add.existing(this);

        this.body.allowGravity = false;
    }


    update() {

    }
}