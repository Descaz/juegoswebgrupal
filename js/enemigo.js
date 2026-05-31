export default class Enemigo extends Phaser.Physics.Arcade.Sprite {
  constructor(escena, x, y) {
    super(escena, x, y, 'gusano_frame1');
    this.escena = escena;
    this.escena.add.existing(this);
    this.escena.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setBounce(0.1); 
    const velocidadX = Phaser.Math.Between(-150, 150);
    const velocidadY = Phaser.Math.Between(-150, 150);
    this.setVelocity(velocidadX, velocidadY);

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
    
  }
}
