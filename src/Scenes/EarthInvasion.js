class EarthInvasion extends Phaser.Scene {
    constructor() {
        super("earthInvasion");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // array to hold all player bullets
        this.my.sprite.playerBullet = []; 
        this.my.sprite.enemyBullet = [];  
        
    }

    preload() {
        this.load.setPath("./assets/");
        //load spritesheet
        this.load.image("images/sheet");
        //load background
        this.load.image("background" ,"backgrounds/blue.png");
    }

    create() {
        let my = this.my;

        //set background
        my.sprite.background = this.add.sprite(200, 200, "background");
    }

    update() {
        let my = this.my;
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}
         