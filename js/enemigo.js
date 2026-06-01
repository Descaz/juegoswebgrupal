export default class Enemigo extends Phaser.Physics.Arcade.Sprite {
  constructor(escena, x, y) {
    super(escena, x, y, 'gusano_frame1');
    this.escena = escena;
    this.escena.add.existing(this);
    this.escena.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.body.allowGravity = false;

    this.body.immovable = true;
   // this.setBounce(0.1); 
    
        this.direccion = 1;
        this.velocidad = 100;

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
  }
   
  update() {
    this.setVelocityX(this.velocidad * this.direccion);
  }
}
