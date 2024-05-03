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
        //array to hold attacking enemies
        this.my.sprite.attackingEnemies = [];
        //paths for each enemy type
        this.resetPaths()
    }

    resetPaths(){
        this.my.enemyPath1 = [
            716,97,
            724,299,
            692,464,
            567,527,
            496,433,
            508,358,
            559,325,
            602,340,
            604,401,
            617,500,
            617,565,
            626,725];
        this.my.curve1 = new Phaser.Curves.Spline(this.my.enemyPath1);
        this.my.enemyPath2Right = [
            84,142,
            89,235,
            128,287,
            176,309,
            247,324,
            277,314,
            298,272,
            291,239,
            253,208,
            186,189,
            140,188,
            108,206,
            92,245,
            90,291,
            92,355,
            94,418,
            92,461,
            94,474,
            128,508,
            218,567,
            269,591,
            248,697,
            152,755,
            158,799];
        this.my.curve2Right = new Phaser.Curves.Spline(this.my.enemyPath2Right);
        this.my.enemyPath2Left = [
            713,150,
            712,185,
            698,259,
            678,293,
            633,299,
            574,317,
            501,301,
            451,266,
            455,210,
            502,183,
            584,189,
            618,199,
            634,271,
            635,330,
            628,367,
            608,410,
            598,457,
            587,517,
            584,519,
            547,543,
            458,567,
            367,639,
            370,693,
            426,733,
            500,769,
            503,794];
        this.my.curve2Left = new Phaser.Curves.Spline(this.my.enemyPath2Left);
        this.my.enemyPath3 = [
            364,126,
            328,165,
            366,193,
            327,245,
            372,304,
            336,343,
            384,430,
            345,461,
            410,548,
            330,582,
            381,636,
            338,671,
            373,741,
            344,797];
        this.my.curve3 = new Phaser.Curves.Spline(this.my.enemyPath3);
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
        this.enemyBulletSpeed = 5;

        //health
        this.playerHealth = 3;
        this.earthHealth = 10;

        //bullet cooldown
        this.bulletCooldown = 10;
        //enemy movement cooldown
        this.enemyCooldown = 10;
        this.enemyBulletCooldown = 100;
        //restart cooldown
        this.restartCooldown = 100;

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
            let enemy = this.add.follower(my.curve3, i*(config.width/10)+40, 30, "spaceParts", "enemyRed4.png").setScale(this.scale*.9);
            enemy.isAttacking = false;
            enemy.hasAttacked = false;
            enemy.type = 3;
            my.sprite.enemies.unshift(enemy);
        }
        //  row 2 of enemies
        for (let i = 0; i < 10; i++) {
            //for enemies on left side
            if (i<5) {
                let enemy = this.add.follower(my.curve2Right,i*(config.width/10)+40, 80, "spaceParts", "enemyRed1.png").setScale(this.scale*.9);
                enemy.isAttacking = false;
                enemy.hasAttacked = false;
                enemy.type = 2;
                my.sprite.enemies.unshift(enemy);
            }else {
                let enemy = this.add.follower(my.curve2Left,i*(config.width/10)+40, 80, "spaceParts", "enemyRed1.png").setScale(this.scale*.9);
                enemy.isAttacking = false;
                enemy.hasAttacked = false;
                enemy.type = 2;
                my.sprite.enemies.unshift(enemy);
            }
            
        }
        //  row 3 of enemies
        for (let i = 0; i < 10; i++) {
            let enemy = this.add.follower(my.curve1,i*(config.width/10)+40, 130, "spaceParts", "enemyRed2.png").setScale(this.scale*.9);
            enemy.isAttacking = false;
            enemy.hasAttacked = false;
            enemy.type = 1;
            my.sprite.enemies.unshift(enemy);
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
        this.enemyBulletCooldown-=1;

        //check if the scene should restart
        if (my.sprite.enemies.length<=0) {
            this.restartCooldown-=1;
            if (this.restartCooldown<0) {
                //reset the paths so that the enemies follow the correct paths on restart
                this.resetPaths();
                this.scene.restart();
            }
        }

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
        // Make all of the bullets move
        for (let bullet of my.sprite.enemyBullet) {
            bullet.y += this.enemyBulletSpeed;
        }

        //check if any enemies have made it to the bottom of the screen
        for (let i = 0; i < my.sprite.enemies.length; i++) {
            const enemy = my.sprite.enemies[i];
            if (enemy.y>config.height) {
                this.earthHealth-=1;
                console.log("earth health="+this.earthHealth);
                // Remove the enemy from the enemies array
                my.sprite.enemies.splice(i, 1); // Remove the enemy at index i from the array
                // Destroy the enemy
                enemy.destroy();
                // Decrement i since we removed an element from the array
                i--;
            }
        }

        //remove any bullets and enemies that have gone offscreen or are inactive
        my.sprite.playerBullet = my.sprite.playerBullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.y > -(enemy.displayHeight/2));
        my.sprite.enemies = my.sprite.enemies.filter((enemy) => enemy.y < (config.height)+10);

        // Check for any bullets colliding with enemies
        for (let i = 0; i < my.sprite.enemies.length; i++) {
            const enemy = my.sprite.enemies[i];
            for (let j = 0; j< my.sprite.playerBullet.length; j++) {
                const bullet = my.sprite.playerBullet[j];
                if (this.collides(enemy, bullet)) {
                        // Remove the enemy from the enemies array
                        my.sprite.enemies.splice(i, 1); // Remove the enemy at index i from the array
                        // Destroy the enemy
                        enemy.destroy();
                        //destroy the bullet
                        my.sprite.playerBullet.splice(j, 1);
                        bullet.destroy();
                        // Decrement i since we removed an element from the array
                        i--;
                }
            }
        }

        //check for enemies and enemy bullets colliding with player
        for (let i = 0; i < my.sprite.enemies.length; i++) {
            const enemy = my.sprite.enemies[i];
            if (this.collides(my.sprite.playerShip, enemy)) {
                this.playerHealth-=1;
                console.log("player health="+this.playerHealth);
                // Remove the enemy from the enemies array
                my.sprite.enemies.splice(i, 1); // Remove the enemy at index i from the array
                // Destroy the enemy
                enemy.destroy();
                // Decrement i since we removed an element from the array
                i--;
            }
        }

        for (let i = 0; i < my.sprite.enemyBullet.length; i++) {
            const bullet = my.sprite.enemyBullet[i];
            if (this.collides(my.sprite.playerShip, bullet)) {
                this.playerHealth-=1;
                console.log("player health="+this.playerHealth);
                // Remove the bullet from the array
                my.sprite.enemyBullet.splice(i, 1); // Remove the enemy at index i from the array
                // Destroy the bullet
                bullet.destroy();
                // Decrement i since we removed an element from the array
                i--;
            }
        }

        for (const enemy of my.sprite.enemies) {
            //make certain attacking enemies shoot bullets
            if (enemy.isAttacking && enemy.type != 1) {
                //if enemy bullet cooldown has expired fire a bullet
                if (this.enemyBulletCooldown<0) {
                    my.sprite.bullet = this.add.sprite(enemy.x, enemy.y-(enemy.displayHeight/2), "spaceParts", "laserRed09.png");
                    my.sprite.bullet.setScale(this.scale);
                    my.sprite.enemyBullet.push(my.sprite.bullet);
                    //reset bullet cooldown
                    this.enemyBulletCooldown = 50;
                }
            }
        }

        // Check if an enemy should attack
        if (this.enemyCooldown < 0) {
            this.enemyCooldown = 120;
            let enemy = my.sprite.enemies.find(e => !e.hasAttacked);  // Find an active, non-attacking enemy
            if (enemy) {
                enemy.isAttacking = true;
            }
        }

        // Move attacking enemies along their path
        for (const enemy of my.sprite.enemies) {
            if (enemy.isAttacking && !enemy.hasAttacked) {
                enemy.hasAttacked = true;
                //path for bottom row enemies
                if (enemy.type == 3) {
                    my.enemyPath3.unshift(enemy.x, enemy.y);
                    my.curve3 = new Phaser.Curves.Spline(this.my.enemyPath3);
                    enemy.x = my.curve3.points[0].x;
                    enemy.y = my.curve3.points[0].y;
                    enemy.startFollow({
                        from: 0,
                        to: 1,
                        delay: 0,
                        duration: 6000,
                        rotateToPath: true,
                        rotationOffset: -90
                    });
                    my.enemyPath3.splice(0, 2);
                }
                if (enemy.type == 2) {
                    if (enemy.x>config.width/2) {
                        my.enemyPath2Left.unshift(enemy.x, enemy.y);
                        my.curve2Left = new Phaser.Curves.Spline(this.my.enemyPath2Left);
                        enemy.x = my.curve2Left.points[0].x;
                        enemy.y = my.curve2Left.points[0].y;
                        enemy.startFollow({
                            from: 0,
                            to: 1,
                            delay: 0,
                            duration: 3000,
                            rotateToPath: true,
                            rotationOffset: -90
                        });
                        my.enemyPath2Left.splice(0, 2);

                    }else{
                        my.enemyPath2Right.unshift(enemy.x, enemy.y);
                        my.curve2Right = new Phaser.Curves.Spline(this.my.enemyPath2Right);
                        enemy.x = my.curve2Right.points[0].x;
                        enemy.y = my.curve2Right.points[0].y;
                        enemy.startFollow({
                            from: 0,
                            to: 1,
                            delay: 0,
                            duration: 3000,
                            rotateToPath: true,
                            rotationOffset: -90
                        });
                        my.enemyPath2Right.splice(0, 2);

                    }
                    
                }
                if (enemy.type == 1) {
                    my.enemyPath1.unshift(enemy.x, enemy.y);
                    my.curve1 = new Phaser.Curves.Spline(this.my.enemyPath1);
                    enemy.x = my.curve1.points[0].x;
                    enemy.y = my.curve1.points[0].y;
                    enemy.startFollow({
                        from: 0,
                        to: 1,
                        delay: 0,
                        duration: 3000,
                        rotateToPath: true,
                        rotationOffset: -90
                    });
                    my.enemyPath1.splice(0, 2);
                }
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
         