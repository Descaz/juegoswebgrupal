export default class BalaGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {		
		super(scene.physics.world, scene);	
		this.createMultiple({
			classType: Bala, 
			frameQuantity: 5000, //Cantidad de balas
			setAllowGravity: false,
			active: false,
			visible: false,
			key: 'bala'            
		})
	}

    dispararBala(x, y, direccion, p){
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
		if(this.x > 20000 || this.x < -20000) {
			this.setActive(false);
			this.setVisible(false);
						
		}
	}
}