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
    
    this.keys = this.escena.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    })
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
        {key: 'spr_player', frame: 'spr_saltando1'}        
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
  
  update() {
    const velocidad = 200;        
    const velocidadSalto = -550;
    const animacion = this.tieneArma ? 'andar_pistola' : 'andar';   
    if (this.body.velocity.x > 0) {
      this.setFlipX(false)
    }
    else if (this.body.velocity.x < 0){
      this.setFlipX(true);
    }
    //movimiento
    if (this.keys.left.isDown) {
      this.setVelocityX(-velocidad);    
      if (this.body.onFloor()) {
        this.play(animacion, true);
      }   
    } 
    else if (this.keys.right.isDown) {
      this.setVelocityX(velocidad); 
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
      this.setVelocityY(velocidadSalto); 
      this.play('spr_saltando1', true);
      this.sonidoSalto.play();    
    } 
    if(Phaser.Input.Keyboard.JustUp(this.keys.jump) && this.body.velocity.y < 0) {
      this.setVelocityY(this.body.velocity.y * 0.5);
    }   
  }
}