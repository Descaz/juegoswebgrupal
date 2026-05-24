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

    dispararBala(x,y){
        const bala = this.getFirstDead(false);
        bala.disparar(x,y);
    }

}

export class Bala extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'bala');
	}

    disparar(x,y) {
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(800);   
		this.setScale(2);   
		  
    }}