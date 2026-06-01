import Personaje from './personaje.js';
import Enemigo from './enemigo.js';
import BalaGroup from './bala.js';
import Bala from './bala.js';
import Gusano from './gusano.js';
var powerup = false;
var puntos = 0;
var vida = 3;
var vidaBoss = 100;
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
        this.load.image('gusano_frame1', './resources/assets/Tiles/tile_0055.png');
        this.load.image('gusano_frame2', './resources/assets/Tiles/tile_0056.png');
        this.load.image('abeja_vuelo', 'resources/assets/Tiles/tile_0051.png');
        this.load.image('abeja_vuelo2', 'resources/assets/Tiles/tile_0052.png');
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
        this.invulnerable = false;
        this.invulnerableBoss = false;
        // bala abeja
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xff0000, 1); // Rojo
        graphics.fillCircle(5, 5, 5); 
        graphics.generateTexture('circulo_test', 10, 10);

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
                this.pistola = this.physics.add.staticSprite(objeto.x*escalaVertical, objeto.y*escalaVertical, 'pistola');
                this.pistola.setScale(4);
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
                this.powerup = this.physics.add.staticSprite(objeto.x*escalaVertical, objeto.y*escalaVertical, 'pistola');
                this.powerup.setScale(4);
                this.powerup.setTint(0x2787F5);
                this.physics.add.collider(this.powerup, this.jugador, this.recogerPowerUp, null, this);        
            });
        }
        else {
            console.log("No hay capa de powerups");
        }   

        //Camara que sigue al jugador
        this.cameras.main.startFollow(this.jugador, true);
        //Creacion bala group
        this.balaGroup = new BalaGroup(this);
        this.addEvents();       
        this.physics.add.collider(this.balaGroup, plataformas,
            (bala) => {
                bala.setActive(false);
                bala.setVisible(false);
                bala.body.stop();
            }
        )
        //Layer de barreras
        if(map.getObjectLayer('barreras') != null){
            this.barrerasGroup = this.physics.add.staticGroup();
            map.getObjectLayer('barreras').objects.forEach(barrera => {
                const sprite = this.barrerasGroup.create(barrera.x * escalaVertical, barrera.y * escalaVertical, null);
                sprite.setVisible(false);
                sprite.refreshBody();
            }
            )};

        if(map.getObjectLayer('enemigos') != null) {
            this.objetos = map.getObjectLayer('enemigos').objects;
            this.gusanos = this.physics.add.group({
                allowGravity: false, immovable: true
            });
            this.objetos.forEach(objeto => {
                this.gusanos.add(new Enemigo(this, objeto.x * escalaVertical, objeto.y * escalaVertical));            
            });
        }
        else {
            console.log("No hay capa de objetos enemigo");
        }

        //Boss
        this.enemigof = this.gusanos.getChildren()[26];
        this.enemigof.setScale(10);
        this.enemigof.setTint(0x00FFFF);
        this.enemigof.velocidad = 800;
        this.physics.add.collider(this.enemigof, this.BalaGroup, this.colisionEnemigoBalaBoss, null, this);

        this.physics.add.overlap(this.gusanos, this.barrerasGroup, 
            (enemigo, barrera) => {
                if (enemigo.x < barrera.x) enemigo.direccion = -1       
                else {enemigo.direccion = 1}
            }, 
            null, this);       

        this.physics.add.collider(this.gusanos, this.jugador, this.colisionEnemigo, null, this);
        this.physics.add.collider(this.balaGroup, this.gusanos,
            (bala, enemigo) => {               
                var esBoss = (enemigo === this.enemigof);
                this.updatePuntos(esBoss ? 0 : 25);       
                if(esBoss) {
                    this.colisionEnemigoBalaBoss(enemigo);
                }
                else {                    
                    this.enemigoMuerto(enemigo);
                } 
                bala.setActive(false);
                bala.setVisible(false);
                bala.body.stop();                  
            });  
        //this.physics.add.collider(this.gusanos, muerte, this.enemigoMuerto, null, this);
        
        // ENEMIGO ABEJA
        // animacion vuelo
        if (!this.anims.exists('vuelo_abeja')) {
            this.anims.create({
                key: 'vuelo_abeja',
                frames: [{ key: 'abeja_vuelo' }, { key: 'abeja_vuelo2' }],
                frameRate: 8,
                repeat: -1
            });
        }

        this.abejas = this.physics.add.group();
        this.balasEnemigas = this.physics.add.group();

        // ABEJAS
        const configuracionEnjambres = [
            [1000, 400, 1],   
            [5000, 500, 2], 
            [10000, 300, 4], 
            [15000, 450, 5], 
            [18500, 400, 6]
        ];

        configuracionEnjambres.forEach(enjambre => {
            const [cX, cY, cantidad] = enjambre;
            for (let i = 0; i < cantidad; i++) {
                let offsetX = i * 64; 
                let offsetY = Math.random() * 60 - 30; // Variación de altura
                let abeja = this.abejas.create(cX + offsetX, cY + offsetY, 'abeja_vuelo'); 
                
                abeja.setScale(4);
                abeja.body.setAllowGravity(false);
                abeja.play('vuelo_abeja');
                abeja.setDepth(100);
                
                abeja.posInicialX = cX + offsetX;
                abeja.distancia = 200;
                abeja.dir = (i % 2 === 0) ? 1 : -1; 
            }
        });

        
        this.physics.add.overlap(this.jugador, this.abejas, this.colisionEnemigo, null, this);
        this.physics.add.overlap(this.jugador, this.balasEnemigas, (jugador, bala) => {
            bala.destroy();
            this.colisionEnemigo(jugador, null); 
        }, null, this);

        this.physics.add.collider(this.balaGroup, this.abejas, (bala, abeja) => {
            bala.setActive(false).setVisible(false);
            if (bala.body) bala.body.stop();
            abeja.destroy();
            this.sonidoKill.play();
            this.updatePuntos(50);
        }, null, this);

        
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.abejas.getChildren().forEach(abeja => {
                    let distancia = Phaser.Math.Distance.Between(abeja.x, abeja.y, this.jugador.x, this.jugador.y);
                    if (distancia < 600) {
                        this.abejaDispara(abeja);
                    }
                });
            },
            loop: true
        });

        // TERMINA ABEJAS

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

        //marcador de balas 
        this.txtVidaBoss = this.add.text(650, 860, 'GUSANEITOR: ' + vidaBoss + '%');
        this.txtVidaBoss.setFontSize(60);
        this.txtVidaBoss.setStyle({fontStyle: 'bold italic'});
        this.txtVidaBoss.setFill('#810101');
        this.txtVidaBoss.setScrollFactor(0);
        this.txtVidaBoss.visible = false;   
        
        this.txtWin = this.add.text(600, 350, '¡HAS GANADO! \n\n');
        this.txtWin.setFontSize(100);
        this.txtWin.setStyle({fontStyle: 'bold italic'});
        this.txtWin.setFill('#2e0181');
        this.txtWin.setScrollFactor(0);
        this.txtWin.visible = false;   
        this.txtWin2 = this.add.text(500, 500, 'Cierre la ventana para salir');
        this.txtWin2.setFontSize(60);
        this.txtWin2.setStyle({fontStyle: 'bold italic'});
        this.txtWin2.setFill('#2e0181');
        this.txtWin2.setScrollFactor(0);
        this.txtWin2.visible = false;   
    }

    update() {
        this.jugador.update();   
        if(vida <= 0) {
            this.gameOver();
            vida = 3;
        }  
        this.gusanos.getChildren().forEach(e => {
            if (e.active) e.update()});
        
        // MOVIMIENTO DE TODAS LAS ABEJAS
        this.abejas.getChildren().forEach(abeja => {
            if (abeja.active) {
                // Movimiento horizontal manual (no se escapa)
                abeja.x += 2 * abeja.dir;

                if (abeja.x >= abeja.posInicialX + abeja.distancia) {
                    abeja.dir = -1;
                    abeja.flipX = true;
                } else if (abeja.x <= abeja.posInicialX - abeja.distancia) {
                    abeja.dir = 1;
                    abeja.flipX = false;
                }

                // Flotación vertical
                abeja.y += Math.sin(this.time.now / 200) * 2;
            }
        });

        if(vidaBoss <= 0) {
            this.txtVidaBoss.visible = false;
            this.enemigoMuerto(this.enemigof);
            this.updatePuntos(5000); 
            this.win(); 
        }
    }      
        
    abejaDispara(abejaRecibida) {
        let bala = this.balasEnemigas.create(abejaRecibida.x, abejaRecibida.y, 'circulo_test');
        if (bala) {
            bala.body.setAllowGravity(false);
            let angulo = Phaser.Math.Angle.Between(abejaRecibida.x, abejaRecibida.y, this.jugador.x, this.jugador.y);
            bala.setVelocityX(Math.cos(angulo) * 250);
            bala.setVelocityY(Math.sin(angulo) * 250);
            this.time.delayedCall(3000, () => { if(bala.active) bala.destroy(); });
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

    updateVidaBoss(vb) {
        vidaBoss = vidaBoss - vb; 
        this.txtVidaBoss.setText('GUSANEITOR: ' + vidaBoss + '%');
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
        balas = 0;
        vidaBoss = 100;
        this.invulnerable = false;
        this.scene.restart();        
    }

    win() {      
        this.txtWin.visible = true;  
        this.txtWin2.visible = true;    
        this.scene.pause();               
    }

    enemigoMuerto(enemigo) {
        this.sonidoKill.play();   
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
    
    colisionEnemigoBalaBoss(enem) {   
        if(!this.txtVidaBoss.visible) {
            this.txtVidaBoss.visible = true;
        }
        if (this.invulnerableBoss) return;
        this.invulnerableBoss = true;
        enem.setTint(0xff0000);
        this.sonidoDmg.play();  
        this.updateVidaBoss(2);      
        this.time.delayedCall(250, () => {
            this.invulnerableBoss = false;
            enem.setTint(0x00FFFF);              
        });         
    } 
}