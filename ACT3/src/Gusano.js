export  class Gusano extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, gusano_frame1){
        super(scene, x, y, gusano_frame1)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        
        this.body.allowGravity = false;

        this.body.immovable = true;

        this.scene.anims.create({
            key: 'gusano_anim',
            frames: [
                {key: 'gusano_frame1'},
                {key: 'gusano_frame2'}
            ],
            frameRate: 4,
            repeat: -1
        });
        this.play('gusano_anim')

        this.setScale(5);
    }

    update(){

}
}