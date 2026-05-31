/** 
 * 
 *  Clase que crea al personaje jugable y gestiona sus interacciones.
 * 
 */

import BalaGroup from './bala.js';
import Bala from './bala.js';
import EscenaBase from './escenaBase.js';

export default class Personaje extends Phaser.Physics.Arcade.Sprite{
  constructor(escena, x, y, sonidoSalto) {
    super(escena, x, y, 'personaje');
    this.escena = escena;
    this.escena.add.existing(this);
    this.escena.physics.add.existing(this);
    this.body.setSize(12, 14);
    this.body.setOffset(3, 2);

    this.velocidad = 200;
    this.velocidadSalto = -550;
    this.velocidadDash = 3000;

    this.dashing = false;
    this.puedeDash = true;
    this.direccion = 1;
    
    this.keys = this.escena.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    this.sonidoSalto = sonidoSalto; 
    //preparamos la animacion de andar
    this.tieneArma = false;  
    this.escena.anims.create({
      key: 'andar',
      frames: [
        {key: 'spr_player', frame: 'spr_andando2'},
        {key: 'spr_player', frame: 'spr_andando1'}
      ],
      frameRate: 6,
      repeat: -1
    });
    this.escena.anims.create({
      key: 'andar_pistola',
      frames: [
        {key: 'spr_player', frame: 'spr_disparando1'},
        {key: 'spr_player', frame: 'spr_disparando2'},
        {key: 'spr_player', frame: 'spr_disparando3'}
      ],
      frameRate: 6,
      repeat: -1
    });  

    this.escena.anims.create({
      key: 'saltando',
      frames: [
        {key: 'spr_player', frame: 'spr_saltando'}        
      ],
      frameRate: 6,
      repeat: -1
    }); 
  }

  recogerArma(jugador, pistola) {
    this.tieneArma = true;
    this.escena.sonidoPowerUp.play();
    pistola.destroy();
  }

  dash() {
    if (!this.puedeDash || this.dashing) {
      return;
    }

    this.dashing = true;
    this.puedeDash = false;

    this.escena.invulnerable = true;

    this.setTint(0x00ffff);
    this.body.allowGravity = false;

    this.setVelocityX(this.velocidadDash * this.direccion);
    this.setVelocityY(0);

    this.escena.time.delayedCall(150, () => {
      this.dashing = false;
      this.body.allowGravity = true;
      this.clearTint();
      this.escena.invulnerable = false;
      this.setVelocityX(400 * this.direccion)
    });

    this.escena.time.delayedCall(1000, () => {
      this.puedeDash = true;
    });
  }
  
  update() {
    if (this.dashing) {return;}        
    
    const animacion = this.tieneArma ? 'andar_pistola' : 'andar';   
    if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    }
    else if (this.body.velocity.x < 0){
      this.setFlipX(true);
    }
    //movimiento
    if(Phaser.Input.Keyboard.JustDown(this.keys.dash)) {
      this.dash();
    }
    if (this.keys.left.isDown) {
      this.direccion = -1;
      this.setVelocityX(-this.velocidad);    
      if (this.body.onFloor()) {
        this.play(animacion, true);
      }   
    } 
    else if (this.keys.right.isDown) {
      this.direccion = 1;
      this.setVelocityX(this.velocidad); 
      if (this.body.onFloor()) {
        this.play(animacion, true);
      }     
    }    
    else {          
      this.setVelocityX(0);        
      if (this.body.onFloor()) {
        this.play(animacion, false);       
      }
    }  
    if(Phaser.Input.Keyboard.JustDown(this.keys.jump) && this.body.onFloor()) {
      this.setVelocityY(this.velocidadSalto); 
      this.sonidoSalto.play();    
    } 
    if(Phaser.Input.Keyboard.JustUp(this.keys.jump) && this.body.velocity.y < 0) {
      this.setVelocityY(this.body.velocity.y * 0.5);
    }   
  }
}