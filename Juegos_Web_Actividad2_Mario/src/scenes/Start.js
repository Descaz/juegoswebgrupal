export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('fondo', 'assets/Sprites/Backgrounds/Double/background_fade_trees.png');
        
        this.load.spritesheet('personaje', 'assets/Spritesheets/spritesheet-characters-double.png', { frameWidth: 257, frameHeight: 257 });
    }

    create() {
        this.background = this.add.tileSprite(860, 100, 1920, 1080, 'fondo');
        this.background.setScale(2);

        this.add.text(960, 200, 'LA CIMA', {
            fontSize: '200px',
            fontFamily: 'Times New Roman',
            color: '#A64E0D',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(963, 203, 'LA CIMA', {
            fontSize: '200px',
            fontFamily: 'Times New Roman',
            color: '#571208',
        }).setOrigin(0.5);

        const botonJugar = this.add.text(960, 650, 'Jugar', {
            fontSize: '100px',
            fontFamily: 'sans-serif',
            color: '#2D55B5',
            backgroundColor: '#ACB52D',
            padding: {
                x: 20,
                y: 10
            }
        })
        .setOrigin(0.5)
        .setInteractive();

        botonJugar.on('pointerover', () => {
            botonJugar.setStyle({color: '#3FB52D'});
        });

        botonJugar.on('pointerout', () => {
            botonJugar.setStyle({color: '#2D55B5'});
        });

        botonJugar.on('pointerdown', () => {
            this.scene.start('Game');
        })

        this.personaje = this.add.sprite(960, 900, 'personaje');

        this.anims.create ({
            key: 'caminar',
            frames: this.anims.generateFrameNumbers('personaje', {
                start: 5,
                end: 7
            }),
            frameRate: 4,
            repeat: -1
        })

        this.personaje.play('caminar');
    }

    update() {
        this.background.tilePositionX += 0.5;
    }
    
}
