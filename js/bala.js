export default class BalaGroup extends Phaser.Physics.Arcade.Group {
    constructor(escena) {		
		super(escena.physics.world, escena);	
		this.createMultiple({
			classType: Bala, 
			frameQuantity: 8, //Cantidad de balas
			setAllowGravity: false,
			active: false,
			visible: false,
			key: 'bala'		         
		})
	}

    dispararBala(x, y, direccion, p){ // p = 0 recto
        const bala = this.getFirstDead(false);
		if (bala && p == 0) {
			bala.disparar(x, y, direccion);			  
		}
		else if(bala &&  p == 1) {
			bala.disparar2(x, y, direccion);
		}
		else if(bala &&  p == 2) {
			bala.disparar3(x, y, direccion);
		}
		else {
			
		}			   		
    }
}

export class Bala extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'bala');
	}

    disparar(x, y, direccion) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(1600 * direccion);   
		this.setScale(2);		
	}

	disparar2(x, y, direccion) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(800 * direccion);   
		this.setVelocityY(800 * direccion); 
		this.setScale(2);		
	}
	
	disparar3(x, y, direccion) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(800 * direccion);   
		this.setVelocityY(800 *-direccion); 
		this.setScale(2);		
	}
	
	
	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		const bounds = this.scene.physics.world.bounds;
		if (this.x > bounds.right || this.x < bounds.left || this.y > bounds.bottom || this.y < bounds.top) {
    		this.setActive(false);
    		this.setVisible(false);
		}
	}
}