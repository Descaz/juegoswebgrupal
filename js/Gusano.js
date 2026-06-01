export default  class Gusano extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, gusano_frame1, xMin, xMax){
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
        
        this.xMin = xMin;
        this.xMax = xMax;
        this.direccion = 1;
        this.velocidad = 100;
    }

    update(){
    this.setVelocityX(this.velocidad * this.direccion);
    if (this.x >= this.xMax) 
        this.direccion = -1;
    else if (this.x <= this.xMin)
        this.direccion = 1;
    if (this.direccion == 1) this.setFlipX(false)
    else if (this.direccion == -1) this.setFlipX(true)
}
}
