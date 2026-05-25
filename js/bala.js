export default class BalaGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
		// Call the super constructor, passing in a world and a scene
		super(scene.physics.world, scene);
 
		// Initialize the group
		this.createMultiple({
			classType: Bala, // This is the class we create just below
			frameQuantity: 5000, // Create 30 instances in the pool
			active: false,
			visible: false,
			key: 'bala'
            
		})


	}

    dispararBala(x, y, direccion){
        const bala = this.getFirstDead(false);
		if (bala) {
			bala.disparar(x, y, direccion);
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
        this.setVelocityX(800 * direccion);   
		this.setScale(2);   
		  
    }
	
	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if(this.x > 2000 || this.x < -2000) {
			this.setActive(false);
			this.setVisible(false);
		}
	}
}