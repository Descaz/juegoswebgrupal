export class Llave extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture, color) {
        super(scene, x, y, texture);

        this.color = color;

        scene.add.existing(this);
        scene.physics.add.existing(this, true);
    }
}