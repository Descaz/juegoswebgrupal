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
        this.load.image('jugador', './resources/prota.png');
        this.load.image('moneda', './resources/moneda.png');
        this.load.image('bala', './resources/assets/Tiles/tile_0044.png');
        this.load.image('enemigo', './resources/assets/Tiles/tile_0055.png');
        
        //carga de sonidos
        this.load.audio('musica', './resources/music.mp3');
        this.load.audio('saltar', './resources/jump.mp3');
        this.load.audio('coin', './resources/pickup.mp3');
        //carga de sprites de animacion
        this.load.atlas('spr_player', './resources/spr_player.png', './resources/spr_player_atlas.json');
    }   

    create() {   
        //creamos el mapa    
        const map = this.make.tilemap({key : 'mapa1'});
        const tileset = map.addTilesetImage('tiles2', 'tileset');
        
        const escalaVertical = window.innerHeight / map.heightInPixels;

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

       
        //crea la musica de fondo y se reproduce
        this.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        this.musica.play(); 
        //sonidos de salto y monedas
        this.sonidoSalto = this.sound.add('saltar');
        this.sonidoRecolectar = this.sound.add('coin');
        //creamos al personaje del jugador y asignamos colliders
        this.jugador = new Personaje(this, 100, 400, this.sonidoSalto);
        this.jugador.setScale(3); 
        this.jugador.setCollideWorldBounds(true);    
        this.physics.add.collider(this.jugador, plataformas);
        // Creamos el enemigo que se mueve aleatoriamente
        this.enemigo = new Enemigo(this, 500, 100);
        this.enemigo.setScale(5); // Cambia la escala al 50%
        this.physics.add.collider(this.enemigo, plataformas);
        this.physics.add.overlap(this.jugador, this.enemigo, this.colisionEnemigo, null, this);

        this.balaGroup = new BalaGroup(this);
        this.addEvents();
        this.cameras.main.startFollow(this.jugador);
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
    
    //cuando se recogen las monedas o el personaje cae a los pinchos, game over y reset
    gameOver() {
        this.musica.stop();
        this.scene.restart();
    }

    disparar() {
        this.balaGroup.dispararBala(this.jugador.x+20, this.jugador.y);
        this.physics.add.collider(this.balaGroup, this.enemigo, this.colisionEnemigoBala, null, this);
        this.sonidoRecolectar.play();
    }
    
    colisionEnemigo(jugador, enemigo) {
    // Prevenir múltiples llamadas mientras el jugador y el enemigo están superpuestos
    if (this.invulnerable) return;

    // Activar invulnerabilidad temporal (1 segundo)
    this.invulnerable = true;

     // Sonido de pérdida de vida
    this.jugador.setTint(0xff0000); // Cambia color de jugador a rojo

    // Reiniciar los puntos
    this.puntos = this.puntos - 25;
    
      // Programar el fin de la invulnerabilidad dentro de 1000 ms (1 segundo)
      this.time.delayedCall(1000, () => {
        this.invulnerable = false;
        this.jugador.clearTint(); // Restauramos el color original del jugador
      });    
    }

    colisionEnemigoBala(balaGroup, enemigo) {
    // Prevenir múltiples llamadas mientras el jugador y el enemigo están superpuestos
    this.enemigo.destroy();
    
    this.puntos = this.puntos + 25;
    
     
    }
}