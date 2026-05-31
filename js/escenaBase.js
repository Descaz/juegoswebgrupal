import Personaje from './personaje.js';
import Enemigo from './enemigo.js';
import BalaGroup from './bala.js';
import Bala from './bala.js';
import Gusano from './Gusano.js';
var powerup = false;
var puntos = 0;
var vida = 3;
var balas = 0;


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
        this.load.image('personaje', './resources/spr_andando2.png');
        this.load.image('bala', './resources/assets/Tiles/tile_0044.png');
        this.load.image('gusano_frame1', 'resources/assets/Tiles/tile_0055.png');
        this.load.image('gusano_frame2', 'resources/assets/Tiles/tile_0056.png');
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
        this.jugador = new Personaje(this, 40, 820, this.sonidoSalto);
        this.jugador.setScale(4); 
        this.physics.add.collider(this.jugador, plataformas);       
        this.physics.add.collider(this.jugador, muerte, this.gameOver, null, this);        
        this.jugador.setCollideWorldBounds(true);          

        //creamos pistolas
        if(map.getObjectLayer('municion') != null) {
            this.pistolas = map.getObjectLayer('municion').objects;
            this.pistolas.forEach(objeto => {
                this.pistola = this.physics.add.staticSprite(objeto.x*4, objeto.y*4, 'pistola');
                this.pistola.setScale(3);
                this.physics.add.collider(this.pistola, this.jugador, this.recogerArma, null, this);        
            });
        }
        else {
            console.log("No hay capa de pistolas");
        }

        //creamos powerups
        if(map.getObjectLayer('powerups') != null) {
            this.power = map.getObjectLayer('powerups').objects;
            this.power.forEach(objeto => {
                this.powerup = this.physics.add.staticSprite(objeto.x*4, objeto.y*4, 'pistola');
                this.powerup.setScale(3);
                this.physics.add.collider(this.powerup, this.jugador, this.recogerPowerUp, null, this);        
            });
        }
        else {
            console.log("No hay capa de pistolas");
        }        

        //Creacion enemigo especial
        this.enemigof = new Enemigo(this, 5000, 100);
        this.enemigof.setScale(20); 
        this.enemigof.setTint(0x00FFFF);
        this.physics.add.collider(this.enemigof, plataformas);
        this.physics.add.overlap(this.jugador, this.enemigof, this.colisionEnemigo, null, this);

        //Camara que sigue al jugador
        this.cameras.main.startFollow(this.jugador, true);
        //Creacion bala group
        this.balaGroup = new BalaGroup(this);
        this.addEvents();       
        this.physics.add.collider(this.balaGroup, this.enemigof, this.colisionEnemigoBalaBoss, null, this);
        this.physics.add.collider(this.balaGroup, plataformas,
            (bala) => {
                bala.setActive(false);
                bala.setVisible(false);
                bala.body.stop();
            }
        )
        
        //crear gusanos
        if(map.getObjectLayer('enemigos') != null) {
            this.objetos = map.getObjectLayer('enemigos').objects;
            this.objetos.forEach(objeto => {
                this.enemigo = new Enemigo(this, objeto.x*4, objeto.y*4).setScale(4);
                this.physics.add.collider(this.enemigo, plataformas);
                this.physics.add.collider(this.balaGroup, this.enemigo,
                    (objeto) => {
                        objeto.destroy();
                        this.sonidoKill.play(); 
                        this.updatePuntos(25);                        
                    }                
                )
                this.physics.add.collider(this.enemigo, this.jugador, this.colisionEnemigo, null, this);  
                this.physics.add.collider(this.enemigo, muerte, this.enemigoMuerto, null, this);   
                //this.aiEnemigo();              
            });
        }
        else {
            console.log("No hay capa de objetos enemigo");
        }
        
        this.txtMarcador = this.add.text(10, 20, 'Puntos: ' + puntos);
        this.txtMarcador.setFontSize(30);
        this.txtMarcador.setStyle({fontStyle: 'bold italic'});
        this.txtMarcador.setFill('#000');
        this.txtMarcador.setScrollFactor(0);   
        
        //marcador de vida 
        this.txtVida = this.add.text(10, 50, 'Vida: ' + vida);
        this.txtVida.setFontSize(30);
        this.txtVida.setStyle({fontStyle: 'bold italic'});
        this.txtVida.setFill('#000');
        this.txtVida.setScrollFactor(0);   

        //marcador de balas 
        this.txtBalas = this.add.text(10, 80, 'Balas: ' + balas);
        this.txtBalas.setFontSize(30);
        this.txtBalas.setStyle({fontStyle: 'bold italic'});
        this.txtBalas.setFill('#000');
        this.txtBalas.setScrollFactor(0);
    }

    update() {
        this.jugador.update();   
        if(vida <= 0) {
            this.gameOver();            
        }    
    }

    updatePuntos(p) {
        puntos = puntos + p; 
        this.txtMarcador.setText('Puntos: ' + puntos);
    }
    
    updateVida(v) {
        vida = vida - v; 
        this.txtVida.setText('Vida: ' + vida);
    }

    updateBalas(b) {
        balas = balas - b; 
        this.txtBalas.setText('Balas: ' + balas);
    }

    addEvents() {
        this.input.on('pointerdown', pointer=> {
            if(powerup) {
                this.dispararPowerUp();
            }
            else {
                this.disparar();
            }
        });
    }    
    
    gameOver() {
        vida = 3;
        puntos = 0;
        this.invulnerable = false;
        this.scene.restart();        
    }

    enemigoMuerto(enemigo) {
        enemigo.destroy();
    }

    disparar() {
        if(balas > 0) {
            const direccion = this.jugador.flipX ? -1 : 1;
            if (!this.jugador.tieneArma) return;
            this.balaGroup.dispararBala(this.jugador.x + 40, this.jugador.y, direccion, 0);
            this.updateBalas(1);
            this.sonidoDisparo.play();
        }
    }

    dispararPowerUp() {
        const direccion = this.jugador.flipX ? -1 : 1;
        if (!this.jugador.tieneArma) return;
        this.balaGroup.dispararBala(this.jugador.x + 40, this.jugador.y, direccion, 0);
        this.balaGroup.dispararBala(this.jugador.x + 40, this.jugador.y, direccion, 1);
        this.balaGroup.dispararBala(this.jugador.x + 40, this.jugador.y, direccion, 2);
        this.sonidoDisparo.play();
    }
    
    /*aiEnemigo(enem) {
        while(enem != null) {
            this.time.delayedCall(3000, () => { //timer duracion powerup
                this.balaGroup.dispararBala(enem.x + 40, enem.y, direccion, 0);
            });
        }
    }*/

    recogerArma(municion) {        
        this.updateBalas(-30);
        this.jugador.recogerArma(this.jugador,municion);
    }

    recogerPowerUp(pow) {
        powerup = true;
        this.jugador.recogerArma(this.jugador, pow);
        this.time.delayedCall(10000, () => { //timer duracion powerup
            powerup = false; 
        });
    }

    colisionEnemigo(jugador, enemigo) {
        if (this.invulnerable) return;
        this.invulnerable = true;
        this.jugador.setTint(0xff0000);
        this.sonidoDmg.play();                
        this.time.delayedCall(1000, () => {
            this.invulnerable = false;
            this.jugador.clearTint();      
            
        });
        this.updateVida(1);
        this.updatePuntos(-25);             
    }  
    
    colisionEnemigoBalaBoss(balaGroup, enemigo2) {     
        this.enemigof.destroy();
        this.sonidoKill.play();    
        this.updatePuntos(100);  
    } 
}