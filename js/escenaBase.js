import Personaje from './personaje.js';
import Enemigo from './enemigo.js';
import Moneda from './moneda.js';
import Pinchos from './pinchos.js';
import BalaGroup from './bala.js';
import Bala from './bala.js';

/**
 * Clase que regula la escena principal del juego.
 * 
 * 
 */
export default class EscenaBase extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaBase' });
    }

    preload() {
        console.log('Metodo preload');        
        //Carga de sprites y matriz del mapa
        this.load.tilemapTiledJSON('mapa1', './resources/assets/mapa1.json');
        this.load.image('tileset', './resources/assets/tilesets/tilemap.png');
        //carga de sprites jugador y objetos
        this.load.image('moneda', './resources/moneda.png');
        this.load.image('bala', './resources/assets/Tiles/tile_0044.png');
        this.load.image('enemigo', './resources/assets/Tiles/tile_0055.png');
        this.load.image('pistola', './resources/assets/Tiles/tile_0050.png');        
        //carga de sonidos
        this.load.audio('saltar', './resources/SoundJump1.wav'); //salto
        this.load.audio('dmg', './resources/SoundPlayerHit.wav'); //daño
        this.load.audio('killenemigo', './resources/SoundEnemyDeath.wav'); //muerte enemigo
        this.load.audio('disparo', './resources/SoundShootRegular.wav'); //disparo
        this.load.audio('powerup', './resources/SoundBonus.wav'); //powerup
        //carga de sprites de animacion
        this.load.atlas('spr_player', './resources/spr_player.png', './resources/spr_player_atlas.json');
    }   

    create() {   
        //creamos el mapa    
        const map = this.make.tilemap({key : 'mapa1'});
        const tileset = map.addTilesetImage('tiles2', 'tileset');        
        const escalaVertical = this.scale.height / map.heightInPixels;
        const fondo = map.createLayer('fondo', tileset, 0, 0);
        const plataformas = map.createLayer('plataformas', tileset, 0, 0);
        const detalles = map.createLayer('detalles', tileset, 0, 0);
        fondo.setScale(escalaVertical);
        plataformas.setScale(escalaVertical);
        detalles.setScale(escalaVertical);
        const anchoEscalado = map.widthInPixels * escalaVertical;
        const altoEscalado = map.heightInPixels * escalaVertical;              
        this.cameras.main.setBounds(0, 0, anchoEscalado, altoEscalado);
        this.physics.world.setBounds(0, 0, anchoEscalado, altoEscalado);
        
        //sonidos de salto y monedas
        this.sonidoSalto = this.sound.add('saltar');
        this.sonidoDmg = this.sound.add('dmg');
        this.sonidoKill = this.sound.add('killenemigo');
        this.sonidoDisparo = this.sound.add('disparo');
        this.sonidoPowerUp = this.sound.add('powerup');
        //creamos al personaje del jugador y asignamos colliders
        this.jugador = new Personaje(this, 100, 400, this.sonidoSalto);
        this.jugador.setScale(3); 
        this.jugador.setCollideWorldBounds(true);    
        this.physics.add.collider(this.jugador, plataformas);

        //creamos el arma
        this.pistola = this.physics.add.staticSprite(300, 300, 'pistola');
        this.pistola.setScale(3);
        this.physics.add.overlap(
            this.jugador,
            this.pistola,
            this.jugador.recogerArma,
            null,
            this.jugador
        );
        //Creacion enemigo
        this.enemigo = new Enemigo(this, 500, 100);
        this.enemigo.setScale(5); 
        this.physics.add.collider(this.enemigo, plataformas);
        this.physics.add.overlap(this.jugador, this.enemigo, this.colisionEnemigo, null, this);
        //Camara que sigue al jugador
        this.cameras.main.startFollow(this.jugador);
        //Creacion bala group
        this.balaGroup = new BalaGroup(this);
        this.addEvents();
        this.physics.add.collider(this.balaGroup, this.enemigo, this.colisionEnemigoBala, null, this);
        this.physics.add.collider(this.balaGroup, plataformas,
            (bala) => {
                bala.setActive(false);
                bala.setVisible(false);
                bala.body.stop();
            }
        )
        // COLISION PLATAFORMAS
        plataformas.setCollisionByExclusion([-1]);        
        plataformas.forEachTile(tile => {
            if (tile.index !== -1) {
                tile.setSize(map.tileWidth * escalaVertical, map.tileHeight * escalaVertical);
                tile.updatePixelXY();
            }
        });       
        //marcador de puntos
        this.puntos = 0;
        this.txtMarcador = this.add.text(10, 20, 'Puntos: ' + this.puntos);
        this.txtMarcador.setFontSize(30);
        this.txtMarcador.setStyle({fontStyle: 'bold italic'});
        this.txtMarcador.setFill('#000');
        this.txtMarcador.setScrollFactor(0);           
    }

    update() {
        this.jugador.update();            
    }

    addEvents() {
        this.input.on('pointerdown', pointer=> {
            this.disparar();
        });
    }    
    
    gameOver() {
        this.musica.stop();
        this.scene.restart();
    }

    disparar() {
        const direccion = this.jugador.flipX ? -1 : 1;
        if (!this.jugador.tieneArma) return;
        this.balaGroup.dispararBala(this.jugador.x+20, this.jugador.y, direccion);
        this.sonidoDisparo.play();
    }
    
    colisionEnemigo(jugador, enemigo) {
        if (this.invulnerable) return;
        this.invulnerable = true;
        this.jugador.setTint(0xff0000);
        this.sonidoDmg.play();
        this.puntos = this.puntos - 25;
        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
            this.jugador.clearTint(); 
        });    
    }

    colisionEnemigoBala(balaGroup, enemigo) {
        this.enemigo.destroy();
        this.sonidoKill.play();    
        this.puntos = this.puntos + 25;     
    }
}