import Gusano from '/';
export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.tilemapTiledJSON('mapa1', 'assets/mapa1.json');
        this.load.image('tileset', 'assets/tilesets/tilemap.png');
        this.load.image('gusano_frame1', 'assets/Tiles/tile_0055.png');
        this.load.image('gusano_frame2', 'assets/Tiles/tile_0056.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0055ff');
        this.add.text(20, 20, "FUNCIONA CON COLISIONES", { fill: "#ffffff" });

        const map = this.make.tilemap({key : 'mapa1'});
        const tileset = map.addTilesetImage('tiles2', 'tileset');
        
        const escalaVertical = window.innerHeight / map.heightInPixels;

        const fondo = map.createLayer('fondo', tileset, 0, 0);
        const plataformas = map.createLayer('plataformas', tileset, 0, 0);
        const detalles = map.createLayer('detalles', tileset, 0, 0);

        // ESCALAR MAPA PARA OCUPAR TODA LA PANTALLA
        fondo.setScale(escalaVertical);
        plataformas.setScale(escalaVertical);
        detalles.setScale(escalaVertical);

        const anchoEscalado = map.widthInPixels * escalaVertical;
        const altoEscalado = map.heightInPixels * escalaVertical;

        this.cameras.main.setBounds(0, 0, anchoEscalado, altoEscalado);
        this.physics.world.setBounds(0, 0, anchoEscalado, altoEscalado);
        
        // COLISION PLATAFORMAS
        plataformas.setCollisionByExclusion([-1]);
        
        plataformas.forEachTile(tile => {
            if (tile.index !== -1) {
                tile.setSize(map.tileWidth * escalaVertical, map.tileHeight * escalaVertical);
                tile.updatePixelXY();
            }
        });

        // OBJETO PROVISIONAL PARA PROBAR COLISIONES (SUSTITUIR POR PERSONAJE)
        this.jugador = this.add.rectangle(100, 100, 32, 48, 0xffffff);
        
        this.physics.add.existing(this.jugador);
        
        this.jugador.body.setCollideWorldBounds(true);
        this.jugador.body.setGravityY(800);

        this.physics.add.collider(this.jugador, plataformas);
        //DEBUG RATON
        this.debugText = this.add.text(10, 10, '', { fill: '#000000', fontSize: '16px' });
        this.debugText.setScrollFactor(0);  

        // ENEMIGO GUSANO
        this.enemy = new Gusano(this, 700, 390, 'gusano_frame1', 620, 1030);
    }

    update() {
        this.enemy.update();
        this.debugText.setText(
    'X: ' + Math.floor(this.input.activePointer.worldX) +
    ' Y: ' + Math.floor(this.input.activePointer.worldY)
);
    }
}