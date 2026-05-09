/** 
 * 
 *  Clase que crea un objeto moneda.
 * 
 */

export default class Moneda extends Phaser.Physics.Arcade.Sprite {
    constructor(escena, x, y) {
        super(escena, x, y, 'moneda');

        this.escena = escena;
        this.escena.add.existing(this);
        this.escena.physics.add.existing(this);

        this.body.allowGravity = false;
    }


    update() {

    }
}