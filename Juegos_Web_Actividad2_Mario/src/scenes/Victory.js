export class Victory extends Phaser.Scene { 
    constructor() { 
        super('Victory'); 
        }
    
    preload() { 
        this.load.image('fondo3', 'assets/Sprites/Backgrounds/Double/background_solid_sky.png'); 
    }

    create() { 
        this.background = this.add.tileSprite(960, 200, 1920, 1080, 'fondo3');
        this.background.setScale(2);

        this.text = this.add.text(960, 200, '¡¡VICTORIA!!', { 
            fontSize: '200px', 
            color: '#000000' 
        }).setOrigin(0.5);

        const botonReiniciar = this.add.text(960, 540, 'reiniciar', { 
            fontSize: '100px', 
            color: '#2D55B5', 
            backgroundColor: '#D6D938', 
            padding: { 
                x: 20, 
                y: 10 
            } 
        }).setOrigin(0.5).setInteractive();

        botonReiniciar.on('pointerover', () => { 
            botonReiniciar.setStyle({color: '#3FB52D'}); 
        });

        botonReiniciar.on('pointerout', () => { 
            botonReiniciar.setStyle({color: '#2D55B5'}); 
        });

        botonReiniciar.on('pointerdown', () => { 
            this.scene.start('Game'); 
        })
    }
}