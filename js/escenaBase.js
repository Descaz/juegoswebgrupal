import Personaje from './personaje.js';
import Moneda from './moneda.js';
import Pinchos from './pinchos.js';

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
        this.load.image('tilesheet', './resources/tiles.png'); 
        this.load.tilemapTiledJSON('map', './resources/mapa.json'); 
        //carga de sprites jugador y objetos
        this.load.image('jugador', './resources/prota.png');
        this.load.image('moneda', './resources/moneda.png');  
        //carga de sonidos
        this.load.audio('musica', './resources/music.mp3');
        this.load.audio('saltar', './resources/jump.mp3');
        this.load.audio('coin', './resources/pickup.mp3');
        //carga de sprites de animacion
        this.load.atlas('spr_player', './resources/spr_player.png', './resources/spr_player_atlas.json');
    }   

    create() {   
        //creamos el mapa    
        const mapa = this.make.tilemap({ key: 'map' });
        const tiles = mapa.addTilesetImage('tiles', 'tilesheet');
        const plataformas = mapa.createLayer('plataformas', tiles);
        plataformas.setScale(4); //redimension de la imagen
        //crea la musica de fondo y se reproduce
        this.musica = this.sound.add('musica', { loop: true, volume: 0.5 });
        this.musica.play(); 
        //sonidos de salto y monedas
        this.sonidoSalto = this.sound.add('saltar');
        this.sonidoRecolectar = this.sound.add('coin');
        //creamos al personaje del jugador y asignamos colliders
        this.jugador = new Personaje(this, 100, 400, this.sonidoSalto);
        this.jugador.setScale(3.5); 
        plataformas.setCollisionByExclusion(1, true);      
        this.jugador.setCollideWorldBounds(true);    
        this.physics.add.collider(this.jugador, plataformas);
        //creamos los objetos de monedas
        if(mapa.getObjectLayer('monedas') != null) {
            this.objetos = mapa.getObjectLayer('monedas').objects;
            this.objetos.forEach(objeto => {
                this.moneda = new Moneda(this, objeto.x*4.2, objeto.y*4.2).setScale(4);
                this.physics.add.collider(this.moneda, plataformas);
                this.physics.add.collider(this.moneda, this.jugador, this.colMonedaJugador, null, this);                
            });
        }
        else {
            console.log("No hay capa de objetos moneda");
        }
        //creamos los pinchos que "matan" al personaje
        if(mapa.getObjectLayer('pinchos') != null) {
            this.objetos2 = mapa.getObjectLayer('pinchos').objects;
            this.objetos2.forEach(objeto => {
                this.pinchos = new Pinchos(this, objeto.x*4.08, objeto.y*4.08).setScale(4);
                this.physics.add.collider(this.pinchos, plataformas);
                this.physics.add.collider(this.pinchos, this.jugador, this.gameOver, null, this);                
            });
        }
        else {
            console.log("No hay capa de objetos pincho");
        }
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
    //Si el jugador colisiona con una moneda, suma puntos y desaparece.
    //El juego acaba al recoger todas las monedas
    colMonedaJugador(moneda) {
        this.sonidoRecolectar.play();
        moneda.destroy(true);
        this.puntos = this.puntos + 25;
        this.txtMarcador.setText('Puntos: ' + this.puntos);
        if(this.puntos == 375) {
            this.gameOver();
        }
    }
    //cuando se recogen las monedas o el personaje cae a los pinchos, game over y reset
    gameOver() {
        this.musica.stop();
        this.scene.restart();
    }
}