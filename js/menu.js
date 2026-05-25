
export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('fondo', './resources/background_color_mushrooms.png');        
        this.load.atlas('spr_player', './resources/spr_player.png', './resources/spr_player_atlas.json');
        this.load.audio('musica', './resources/music.mp3');
    }

    create() {
        this.background = this.add.tileSprite(860, 100, 800, 600, 'fondo');
        this.background.setScale(2.5);

        this.add.text(400, 200, 'EL CONEJO MALO', {
            fontSize: '70px',
            fontFamily: 'Times New Roman',
            color: '#A64E0D',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(403, 203, 'EL CONEJO MALO', {
            fontSize: '70px',
            fontFamily: 'Times New Roman',
            color: '#571208',
        }).setOrigin(0.5);

        const botonJugar = this.add.text(400, 400, 'Jugar', {
            fontSize: '30px',
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
            this.scene.start('EscenaBase');
        })

        this.anims.create({
            key: 'andar_menu',
            frames: [
                {key: 'spr_player', frame: 'spr_andando2'},
                {key: 'spr_player', frame: 'spr_andando1'}
            ],
            frameRate: 7,
            repeat: -1
        });

        this.personaje = this.add.sprite(400, 500, 'spr_player');
        this.personaje.setScale(4);

        this.personaje.play('andar_menu');

        this.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        this.musica.play();
    }

    update() {
        this.background.tilePositionX += 0.5;
    }
    
}