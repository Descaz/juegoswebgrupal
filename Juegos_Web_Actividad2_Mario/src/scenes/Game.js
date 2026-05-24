import {Llave} from '/src/objects/Llave.js'

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('fondo2', 'assets/Sprites/Backgrounds/Double/background_color_trees.png');

        this.load.spritesheet('personaje2', 'assets/Spritesheets/spritesheet-characters-default.png', {frameWidth: 128, frameHeight: 128});

        this.load.tilemapTiledJSON('mapa', 'assets/Mapa_Act2.json');
        this.load.image('tiles', 'assets/Spritesheets/spritesheet-tiles-default.png')

        this.load.image('llaveRoja', 'assets/Sprites/Tiles/Default/key_red.png');
        this.load.image('llaveAzul', 'assets/Sprites/Tiles/Default/key_blue.png');
        this.load.image('llaveVerde', 'assets/Sprites/Tiles/Default/key_green.png');
        this.load.image('llaveAmarilla', 'assets/Sprites/Tiles/Default/key_yellow.png');

        this.load.image('cerraduraRoja', 'assets/Sprites/Tiles/Default/lock_red.png');
        this.load.image('cerraduraAzul', 'assets/Sprites/Tiles/Default/lock_blue.png');
        this.load.image('cerraduraVerde', 'assets/Sprites/Tiles/Default/lock_green.png');
        this.load.image('cerraduraAmarilla', 'assets/Sprites/Tiles/Default/lock_yellow.png');

        this.load.image('puerta', 'assets/Sprites/Tiles/Default/door_closed_top.png');

        this.load.audio('andar', 'assets/Sounds/sfx_bump.ogg');
        this.load.audio('saltar', 'assets/Sounds/sfx_jump.ogg');
        this.load.audio('llave', 'assets/Sounds/sfx_magic.ogg');
        this.load.audio('puerta', 'assets/Sounds/sfx_gem.ogg');
    }

    create() {
        this.background = this.add.tileSprite(960, 60, 1920, 1080, 'fondo2');
        this.background.setScale(2);

        const map = this.make.tilemap({ key: 'mapa'});
        const tileset = map.addTilesetImage('spritesheet-tiles-default', 'tiles');
        const suelo = map.createLayer('Capa de patrones 1', tileset, 0, 0);

        suelo.setCollisionByExclusion(-1);

        this.player = this.physics.add.sprite(0, 1000, 'personaje2');
        this.player.setDisplaySize(64, 64);

        this.player.setGravityY(500);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, suelo);

        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.jumpSpeed = -600;

        this.puerta = this.physics.add.staticSprite(960, 95, 'puerta');

        this.physics.add.overlap(
            this.player,
            this.puerta,
            this.abrirPuerta,
            null,
            this
        )

        this.llaves = [];

        this.llaves.push(new Llave(this, 1850, 600, 'llaveRoja', 'rojo'));
        this.llaves.push(new Llave(this, 40, 550, 'llaveAzul', 'azul'));
        this.llaves.push(new Llave(this, 1800, 30, 'llaveVerde', 'verde'));
        this.llaves.push(new Llave(this, 25, 100, 'llaveAmarilla', 'amarillo'));

        this.llaves.forEach((llave) => {
            this.physics.add.overlap(
                this.player,
                llave,
                this.recogerLlave,
                null,
                this
            );
        });

        this.llavesRecogidas = 0;

        this.cerraduras = {

            rojo: this.add.image(1040, 97, 'cerraduraRoja'),

            azul: this.add.image(880, 97, 'cerraduraAzul'),

            verde: this.add.image(1040, 33, 'cerraduraVerde'),

            amarillo: this.add.image(880, 33, 'cerraduraAmarilla')
        }

        this.anims.create({
            key: 'andar',
            frames: this.anims.generateFrameNumbers('personaje2', {
                frames: [5, 6, 7, 8]
            }),
            frameRate: 5,
            repeat: -1
        })

        this.sonidoAndar = this.sound.add('andar');
        this.sonidoSaltar = this.sound.add('saltar');
        this.sonidoLlave = this.sound.add('llave');
        this.sonidoPuerta = this.sound.add('puerta'); 

        this.ultimoPaso = 0;
        this.intervaloPaso = 350;
    }

    abrirPuerta(player, puerta) {
        if(this.llavesRecogidas >= 4) {
            this.physics.pause();
            this.scene.start('Victory');
        }
    }

    recogerLlave(player, llave) {
        llave.destroy();
        this.cerraduras[llave.color].destroy();
        this.llavesRecogidas++;

        this.sonidoLlave.play();

        if(this.llavesRecogidas >= 4) {
            this.puerta.setTint(0x00ff00);
            this.sonidoPuerta.play();
        }

    }

    update() {
        if (this.keys.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);

            if(this.player.body.blocked.down) {
                this.player.anims.play('andar', true);
            }

            if(this.time.now > this.ultimoPaso + this.intervaloPaso && this.player.body.blocked.down) {
                this.sonidoAndar.play();
                this.ultimoPaso = this.time.now;
            }
        }
        else if (this.keys.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);

            if(this.player.body.blocked.down) {
                this.player.anims.play('andar', true);
            }

            if(this.time.now > this.ultimoPaso + this.intervaloPaso && this.player.body.blocked.down) {
                this.sonidoAndar.play();
                this.ultimoPaso = this.time.now;
            }
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop();           
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && this.player.body.blocked.down) {
            this.player.anims.stop();
            this.player.setVelocityY(this.jumpSpeed);
            this.sonidoSaltar.play();
        }

        if (Phaser.Input.Keyboard.JustUp(this.keys.jump) && this.player.body.velocity.y < 0) {
            this.player.setVelocityY(this.player.body.velocity.y * 0.5);
        }
    }

}
