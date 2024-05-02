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
        //arrays to hold all enemies
        this.my.sprite.enemies = [];
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
        //set game speeds
        this.playerSpeed = 6;
        this.playerBulletSpeed = 8;

        //bullet cooldown
        this.bulletCooldown = 10;
        //enemy movement cooldown
        this.enemyCooldown = 10;

        //set background
        if (true) {
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
        }
        
        //make and scale the player shipd
        my.sprite.playerShip = this.add.sprite(game.config.width/2, 570, "spaceParts", "playerShip1_red.png");
        my.sprite.playerShip.setScale(this.scale);

        //make all enemies
        //  top row of enemies
        for (let i = 0; i < 10; i++) {
            my.sprite.enemies.unshift(this.add.sprite(i*(config.width/10)+40, 30, "spaceParts", "enemyRed4.png").setScale(this.scale*.9));
        }
        //  row 2 of enemies
        for (let i = 0; i < 10; i++) {
            my.sprite.enemies.unshift(this.add.sprite(i*(config.width/10)+40, 80, "spaceParts", "enemyRed1.png").setScale(this.scale*.9));
        }
        //  row 3 of enemies
        for (let i = 0; i < 10; i++) {
            my.sprite.enemies.unshift(this.add.sprite(i*(config.width/10)+40, 130, "spaceParts", "enemyRed2.png").setScale(this.scale*.9));
        }

        // Create keys
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        let my = this.my;

        //update cooldowns every tick
        this.bulletCooldown-=1;
        this.enemyCooldown-=1;

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
            //if bullet cooldown has expired fire a bullet
            if (this.bulletCooldown<0) {
                my.sprite.bullet = this.add.sprite(my.sprite.playerShip.x, my.sprite.playerShip.y-(my.sprite.playerShip.displayHeight/2), "spaceParts", "laserGreen09.png");
                my.sprite.bullet.setScale(this.scale);
                my.sprite.playerBullet.push(my.sprite.bullet);
                //reset bullet cooldown
                this.bulletCooldown = 10;
            }
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.playerBullet) {
            bullet.y -= this.playerBulletSpeed;
        }

        //remove any bullets and enemies that have gone offscreen
        my.sprite.playerBullet = my.sprite.playerBullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.y > -(enemy.displayHeight/2));
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.y < (config.height)+100);

        //check for any bullets colliding with enemies
        for (const enemy of my.sprite.enemies) {
            for (const bullet of my.sprite.playerBullet) {
                if (this.collides(enemy, bullet)) {
                    //move bullet and enemy offscreen it will be deleted next update
                    bullet.y = -100;
                    enemy.y = -100;
                }
            }
        }

        //check if an enemy should attack
        if (this.enemyCooldown<0) {
            this.enemyCooldown=150;
            my.sprite.enemies[0].isAttacking = true;
        }

        //move attacking enemies along their path
        for (const enemy of my.sprite.enemies) {
            if (enemy.isAttacking) {
                
            }
        }
    }

    
    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}
         