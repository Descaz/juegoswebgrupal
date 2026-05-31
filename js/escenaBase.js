import Personaje from './personaje.js';
import Enemigo from './enemigo.js';
import BalaGroup from './bala.js';
import Bala from './bala.js';
import Gusano from './Gusano.js';


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
        this.load.image('gusano_frame1', './resources/assets/Tiles/tile_0055.png');
        this.load.image('gusano_frame2', './resources/assets/Tiles/tile_0056.png');
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
        const muerte = map.createLayer('morir', tileset, 0, 0);
        fondo.setScale(escalaVertical);
        plataformas.setScale(escalaVertical);
        detalles.setScale(escalaVertical);
        muerte.setScale(escalaVertical);
        const anchoEscalado = map.widthInPixels * escalaVertical;
        const altoEscalado = map.heightInPixels * escalaVertical;              
        this.cameras.main.setBounds(0, 0, anchoEscalado, altoEscalado);
        this.physics.world.setBounds(0, 0, anchoEscalado, altoEscalado);
        // COLISION PLATAFORMAS
        plataformas.setCollisionByExclusion([-1]);        
        plataformas.forEachTile(tile => {
            if (tile.index !== -1) {
                tile.setSize(16, 4); 
        tile.updatePixelXY();
            }
        });
        muerte.setCollisionByExclusion([-1]);        
        

        //sonidos
        this.sonidoSalto = this.sound.add('saltar');
        this.sonidoDmg = this.sound.add('dmg');
        this.sonidoKill = this.sound.add('killenemigo');
        this.sonidoDisparo = this.sound.add('disparo');
        this.sonidoPowerUp = this.sound.add('powerup');
        //creamos al personaje del jugador y asignamos colliders
        this.jugador = new Personaje(this, 0, 1200, this.sonidoSalto);
        this.jugador.setScale(4); 
        this.physics.add.collider(this.jugador, plataformas);
        this.physics.add.collider(this.jugador, muerte, this.gameOver, null, this);        
        this.jugador.setCollideWorldBounds(true);          

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
        //this.enemigo = new Enemigo(this, 500, 100);
        //this.enemigo.setScale(5); 
        //this.physics.add.collider(this.enemigo, plataformas);
        //this.physics.add.overlap(this.jugador, this.enemigo, this.colisionEnemigo, null, this);
        
        //Creacion enemigo gusano
        this.gusanos = this.physics.add.group({
    allowGravity: false,
    immovable: true
});
        
        this.gusanos.add(new Gusano(this, 625, 390, 'gusano_frame1', 625, 1095));
        this.gusanos.add(new Gusano(this, 1700, 450, 'gusano_frame1', 1700, 2050));
        this.gusanos.add(new Gusano(this, 2730, 390, 'gusano_frame1', 2730, 3100));
        this.gusanos.add(new Gusano(this, 3400, 450, 'gusano_frame1', 3400, 3580));
        this.gusanos.add(new Gusano(this, 4450, 80, 'gusano_frame1', 4450, 4930));
        this.gusanos.add(new Gusano(this, 6570, 760, 'gusano_frame1', 6570, 6960));
        this.gusanos.add(new Gusano(this, 8300, 265, 'gusano_frame1', 8300, 8680));
        this.gusanos.add(new Gusano(this, 9360, 205, 'gusano_frame1', 9360, 9700));
        this.gusanos.add(new Gusano(this, 10030, 265, 'gusano_frame1', 10030, 10200));
        this.gusanos.add(new Gusano(this, 10520, 265, 'gusano_frame1', 10520, 10700));
        this.gusanos.add(new Gusano(this, 10880, 265, 'gusano_frame1', 10880, 11070));
        this.gusanos.add(new Gusano(this, 12960, 265, 'gusano_frame1', 12960, 13340));
        this.gusanos.add(new Gusano(this, 16510, 145, 'gusano_frame1', 16160, 16510));
        this.gusanos.add(new Gusano(this, 16200, 390, 'gusano_frame1', 16200, 16530));
        this.physics.add.overlap(this.jugador, this.gusanos, this.colisionEnemigo, null, this);
        
        //Camara que sigue al jugador
        this.cameras.main.startFollow(this.jugador, true);
        //Creacion bala group
        this.balaGroup = new BalaGroup(this);
        this.addEvents();
        //this.physics.add.collider(this.balaGroup, this.enemigo, this.colisionEnemigoBala, null, this);
        this.physics.add.overlap(this.balaGroup, this.gusanos, this.colisionEnemigoBala, null, this);
        this.physics.add.collider(this.balaGroup, plataformas,
            (bala) => {
                bala.setActive(false);
                bala.setVisible(false);
                bala.body.stop();
            }
        )     
        //marcador de puntos
        this.puntos = 0;
        this.txtMarcador = this.add.text(10, 20, 'Puntos: ' + this.puntos);
        this.txtMarcador.setFontSize(30);
        this.txtMarcador.setStyle({fontStyle: 'bold italic'});
        this.txtMarcador.setFill('#000');
        this.txtMarcador.setScrollFactor(0);     
        //Debug coordenadas   
        this.debugText = this.add.text(1000, 10, '', { fill: '#000000', fontSize: '24px' });
        this.debugText.setScrollFactor(0);
    }

    update() {
        this.jugador.update();   
        
        this.gusanos.getChildren().forEach(gusano => {
            if (gusano.active) gusano.update();
});
      //Debug actualizar coordenadas   
        this.debugText.setText
        (
        'X: ' + Math.floor(this.input.activePointer.worldX) +
        'Y: ' + Math.floor(this.input.activePointer.worldY)
        );
        
    }

    addEvents() {
        this.input.on('pointerdown', pointer=> {
            this.disparar();
        });
    }    
    
    gameOver() {
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
        //this.enemigo.destroy();
        enemigo.destroy();
        this.sonidoKill.play();    
        this.puntos = this.puntos + 25;     
    }
}