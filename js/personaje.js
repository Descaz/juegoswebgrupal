/** 
 * 
 *  Clase que crea al personaje jugable y gestiona sus interacciones.
 * 
 */

import BalaGroup from './bala.js';
import Bala from './bala.js';

export default class Personaje extends Phaser.Physics.Arcade.Sprite{
  constructor(escena, x, y, sonidoSalto) {
    super(escena, x, y, 'jugador');
    this.escena = escena;
    this.escena.add.existing(this);
    this.escena.physics.add.existing(this);
    this.cursors = this.escena.input.keyboard.createCursorKeys();
    this.sonidoSalto = sonidoSalto; 
    //preparamos la animacion de andar
    this.animacionAndar =  {}
    this.animacionAndar.key = 'spr_andando';
    this.animacionAndar.frames = this.escena.anims.generateFrameNames('spr_player', {
        prefix: 'spr_disparando',
        start: 1,
        end: 3,
      });
    this.animacionAndar.frameRate = 10;
    this.animacionAndar.repeat = -1;
    this.escena.anims.create(this.animacionAndar); 



    
  }
  
  update() {
    const velocidad = 200;        
    const velocidadSalto = -1000;   
    
    if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    }
    else if (this.body.velocity.x < 0){
      this.setFlipX(true);
    }
    //movimiento
    if (this.cursors.left.isDown) {
      this.setVelocityX(-velocidad);    
      if (this.body.onFloor()) {
        this.play('spr_andando', true);
      }   
    } 
    else if (this.cursors.right.isDown) {
      this.setVelocityX(velocidad); 
      if (this.body.onFloor()) {
        this.play('spr_andando', true);
      }     
    }    
    else {          
      this.setVelocityX(0);        
      if (this.body.onFloor()) {
        this.play('spr_andando', false);       
      }
    }  
    if(this.cursors.up.isDown && this.body.onFloor()) {
      this.setVelocityY(velocidadSalto);  
      this.sonidoSalto.play();    
    }    
  }
}