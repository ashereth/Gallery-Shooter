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
        this.load.atlasXML("spaceParts", "images/sheet.png", "images/sheet.xml");
        //load background
        this.load.image("background" ,"backgrounds/blue.png");
    }

    create() {
        let my = this.my;
        //set how much each image should be scaled 
        this.scale = .5;
        //set player speed
        this.playerSpeed = 6;

        //set background
        my.sprite.background = this.add.sprite(129, 129, "background");
        my.sprite.background = this.add.sprite(385, 129, "background");
        my.sprite.background = this.add.sprite(641, 129, "background");
        my.sprite.background = this.add.sprite(850, 129, "background");
        my.sprite.background = this.add.sprite(129, 385, "background");
        my.sprite.background = this.add.sprite(129, 641, "background");
        my.sprite.background = this.add.sprite(385, 385, "background");
        my.sprite.background = this.add.sprite(385, 641, "background");
        my.sprite.background = this.add.sprite(850, 385, "background");
        my.sprite.background = this.add.sprite(850, 641, "background");
        my.sprite.background = this.add.sprite(641, 385, "background");
        my.sprite.background = this.add.sprite(641, 641, "background");

        //make and scale the player ship
        my.sprite.playerShip = this.add.sprite(game.config.width/2, 570, "spaceParts", "playerShip1_red.png");
        my.sprite.playerShip.setScale(this.scale);

        // Create keys
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.playerShip.x > (my.sprite.playerShip.displayWidth/2)+4) {
                my.sprite.playerShip.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.playerShip.x < (game.config.width - (my.sprite.playerShip.displayWidth/2))-4) {
                my.sprite.playerShip.x += this.playerSpeed;
            }
        }
        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            my.sprite.bullet = this.add.sprite(my.sprite.playerShip.x, my.sprite.playerShip.y-(my.sprite.playerShip.displayHeight/2), "spaceParts", "laserGreen07.png");
            my.sprite.bullet.setScale(this.scale);
            my.sprite.playerBullet.push(my.sprite.bullet);
        }
    }

    

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}
         