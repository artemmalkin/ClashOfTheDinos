class Game {
    constructor() {
        this.cameraWorldPosition = { "x": 0, "y": 0 };
        this.status = 1;
        this.lastUpdateTime = 0;
        this.frameDuration = 30;
        this.originalFrameDuration = this.frameDuration;

        this.data = {};
    }

    pause() {
        this.frameDuration = Infinity;
        this.status = 0;
    }

    continue() {
        this.frameDuration = this.originalFrameDuration;
        this.status = 1;
    }

    stopUpdate() {
        this.status = -1;
    }

    continueUpdate() {
        this.status = 1;
        requestAnimationFrame(update);
    }
}

let game = new Game();

let mouse = new Mouse(canvasUI);
let lastMouseX = 0;


let UIController = new UIManager(canvasUI, ctxUI);
let playingUI = new UserInterface(canvasUI, mouse, UIController);
UIController.userInterfaces.push(playingUI);

let sprites = {};
let backgrounds = {};
let tileset = {};

let playerDinos = [];
let enemyDinos = [];
let diedDinos = [];

function checkCollisions() {
playerDinos.forEach(dino => {
    let dinoIndex = playerDinos.indexOf(dino)

    if (dinoIndex === 0 && enemyDinos.length > 0) {
        // If the dinosaur is first
        const dinoPlayerCollision = playerDinos[0].collision();
        const dinoEnemyCollision = enemyDinos[0].collision();
        if (dinoEnemyCollision.x < dinoPlayerCollision.x + dinoPlayerCollision.width) {
            // If it reaches the enemy's dinosaur - Fight Mode
            if (playerDinos[0].state !== "died") {
                if (playerDinos[0].setState("attacking")) {
                    playerDinos[0].lastAttackTime = Date.now();
                }
            }
            if (enemyDinos[0].state !== "died") {
                if (enemyDinos[0].setState("attacking")) {
                    enemyDinos[0].lastAttackTime = Date.now();
                }
            }
        } else {
            // If he didn't make it, let him move on.
            playerDinos[0].setState("walking");
            enemyDinos[0].setState("walking");
        }
    } else if (dinoIndex !== 0) {
        // If not the first one, we check if it has reached the dinosaur walking in front of it
        const dinoPlayerCollision = playerDinos[dinoIndex].collision();
        const NextDinoPlayerCollision = playerDinos[dinoIndex - 1].collision();
        if (NextDinoPlayerCollision.x < dinoPlayerCollision.x + dinoPlayerCollision.width) {
            // If reached - stop him
            dino.setState("standing");
            dino.speed = playerDinos[dinoIndex - 1].speed < dino.speed ? playerDinos[dinoIndex - 1].speed : dino.speed;
        } else {
            // If he didn't make it, let him move on.
            dino.setState("walking");
            if (NextDinoPlayerCollision.x > dinoPlayerCollision.x + dinoPlayerCollision.width * 1.2) {
                dino.speed = dino.originalSpeed;
            }
        }
    } else {
        // Check tha last one for the reached the enemy spawnpoint - attacking
        const dinoPlayerCollision = playerDinos[0].collision();
        if (dinoPlayerCollision.x + dinoPlayerCollision.width > game.data.spawnpoint.enemy.x - game.cameraWorldPosition.x) {
            playerDinos[0].isReachedBase = true;
            if (playerDinos[0].setState("attacking")) {
                playerDinos[0].lastAttackTime = Date.now();
            }
        }
    }
});

enemyDinos.forEach(dino => {
    let dinoIndex = enemyDinos.indexOf(dino)

    if (dinoIndex !== 0) {
        // If not the first one, we check if he has reached the dinosaur walking in front of him
        const dinoEnemyCollision = enemyDinos[dinoIndex].collision();
        const nextDinoEnemyCollision = enemyDinos[dinoIndex - 1].collision();
        if (dinoEnemyCollision.x < nextDinoEnemyCollision.x + nextDinoEnemyCollision.width) {
            // If he reached - stop him
            dino.setState("standing");
            dino.speed = enemyDinos[dinoIndex - 1].speed < dino.speed ? enemyDinos[dinoIndex - 1].speed : dino.speed;
        } else {
            // If he didn't make it, let him move on.
            dino.setState("walking");
            if (nextDinoEnemyCollision.x > dinoEnemyCollision.x + dinoEnemyCollision.width * 1.2) {
                dino.speed = dino.originalSpeed;
            }
        }
    } else {
        // Check the last one for the reached the player spawnpoint - attacking
        const dinoEnemyCollision = enemyDinos[0].collision();
        if (dinoEnemyCollision.x < game.data.spawnpoint.player.x + 250 - game.cameraWorldPosition.x) {
            enemyDinos[0].isReachedBase = true;
            if (enemyDinos[0].setState("attacking")) {
                enemyDinos[0].lastAttackTime = Date.now();
            }
        }
    }
}); 
}


function startGame() {
    // init sprites
    sprites.home = () => new spriteImage(resources.ui, 18, 18, 0, 2, 0, 0, 5);
    sprites.replay = () => new spriteImage(resources.ui, 18, 18, 0, 3, 0, 0, 5);
    sprites.volumeOn = () => new spriteImage(resources.ui, 18, 18, 1, 1, 0, 0, 5);
    sprites.volumeOff = () => new spriteImage(resources.ui, 18, 18, 1, 2, 0, 0, 5);
    sprites.up = () => new spriteImage(resources.ui, 18, 18, 0, 4, 0, 0, 7);
    sprites.pause = () => new spriteImage(resources.ui, 18, 18, 0, 0, 0, 0, 5);
    sprites.continue = () => new spriteImage(resources.ui, 18, 18, 0, 1, 0, 0, 5);
    sprites.dinoItemActive = () => new spriteImage(resources.ui, 18, 18, 1, 3, 0, 0, 7);
    sprites.dinoItemDisactive = () => new spriteImage(resources.diplodocus_p, 64, 64, 8, 1, -190, -190, 8);

    sprites.dinoItemDiplodocus = new spriteImage(resources.diplodocus_p, 26, 26, 0.9, 0.6, 0, 300, 7)

    tileset.grass = new PatternImage(resources.tileset, 40, 16, 13, 0, 6, 0, 872, 20, "x");
    backgrounds.main = new BackgroundImage(resources.background, 320, 180, 9, 0, 0, 1.2);
    backgrounds.cave1 = new BackgroundImage(resources.background, 320, 180, 8, -203, -290, 1.2);
    backgrounds.cave2 = new BackgroundImage(resources.background, 320, 180, 12, 2700, -310, 1.2);

    // init data
    playerDinos = [];
    enemyDinos = [];
    diedDinos = [];

    game.data.lvl = { "player": 1, "enemy": 1 };

    game.data.spawnpoint = {
        "player": { "x": 180, "y": 510, "hp": 1000 },
        "enemy": { "x": 4200, "y": 510, "hp": 1000 }
    };

    game.data.characterStates = {
        "diplodocus": {
            "walking": { "frameRow": 4, "framesCount": 6, "frameDuration": 6, "isLoop": true },
            "attacking": { "frameRow": 12, "framesCount": 7, "frameDuration": 6, "isLoop": true  },
            "standing": { "frameRow": 0, "framesCount": 3, "frameDuration": 6, "isLoop": true },
            "died": { "frameRow": 1, "framesCount": 4, "frameDuration": 36, "isLoop": false }
        },
        "diplodocusSub": {
            "walking": { "frameRow": 4, "framesCount": 6, "frameDuration": 8, "isLoop": true  },
            "attacking": { "frameRow": 12, "framesCount": 7, "frameDuration": 8, "isLoop": true  },
            "standing": { "frameRow": 0, "framesCount": 3, "frameDuration": 8, "isLoop": true },
            "died": { "frameRow": 1, "framesCount": 4, "frameDuration": 36, "isLoop": false }
        },
        "diplodocusAdult": {
            "walking": { "frameRow": 4, "framesCount": 6, "frameDuration": 12, "isLoop": true  },
            "attacking": { "frameRow": 12, "framesCount": 7, "frameDuration": 12, "isLoop": true  },
            "standing": { "frameRow": 0, "framesCount": 3, "frameDuration": 12, "isLoop": true },
            "died": { "frameRow": 1, "framesCount": 4, "frameDuration": 36, "isLoop": false }
        },
    }
    game.data.characters = {
        "junior": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.data.characterStates.diplodocus, game.data.spawnpoint.player.x, game.data.spawnpoint.player.y, 8, false, 15, 32),
            },
            "enemy": {
                "diplodocus": () => new Character(resources.diplodocus_e, 64, 64, game.data.characterStates.diplodocus, game.data.spawnpoint.enemy.x, game.data.spawnpoint.enemy.y, 8, true, 15, 32),
            }
        },
        "subadult": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.data.characterStates.diplodocusSub, game.data.spawnpoint.player.x - 100, game.data.spawnpoint.player.y - 190, 12, false, 15, 32, 2, 500, 250, 2500),
            },
            "enemy": {

            }
        },
        "adult": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.data.characterStates.diplodocusAdult, game.data.spawnpoint.player.x - 300, game.data.spawnpoint.player.y - 810, 25, false, 15, 32, 1, 1000, 500, 5000),
            },
            "enemy": {

            }
        }
    }

    // init ui

    playingUI.components = [
        new Button(true, sprites.up(), sprites.up(), sprites.up(), 115, 115, 800, 940, (button) => {
            if (game.status === 0) {
                button.state = 1;
                game.continue()
            } else {
                button.state = 2;
                game.pause()
            }
        }),
        new Button(false, sprites.home(), sprites.home(), sprites.home(), 90, 90, 790, 10, (button) => {

        }),
        new Button(false, sprites.replay(), sprites.replay(), sprites.replay(), 90, 90, 1040, 10, (button) => {
            game.stopUpdate()
            game = new Game();
            
            setTimeout(startGame, "100")
            
        }),
        new Button(false, sprites.volumeOn(), sprites.volumeOff(), sprites.volumeOff(), 90, 90, 915, 120, (button) => {
            button.state = button.state === 1 ? 2 : 1;
        }),
        new Button(true, sprites.pause(), sprites.continue(), sprites.pause(), 90, 90, 915, 10, (button) => {
            if (game.status === 0) {
                playingUI.components[1].isActive = false;
                playingUI.components[2].isActive = false;
                playingUI.components[3].isActive = false;
                button.state = 1;
                game.continue()
            } else {
                playingUI.components[1].isActive = true;
                playingUI.components[2].isActive = true;
                playingUI.components[3].isActive = true;
                button.state = 2;
                game.pause()
            }
        }),
        new Button(true, sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 126, 126, 10, 940, () => playerDinos.push(game.data.characters.junior.player.diplodocus())),
        new Button(true, sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 126, 126, 165, 940, () => playerDinos.push(game.data.characters.subadult.player.diplodocus())),
        new Button(true, sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 126, 126, 325, 940, () => playerDinos.push(game.data.characters.adult.player.diplodocus())),
        new Button(true, sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 126, 126, 485, 940, () => playerDinos.push(game.data.characters.subadult.player.diplodocus())),
        new Button(true, sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 126, 126, 645, 940, () => playerDinos.push(game.data.characters.subadult.player.diplodocus())),
    ]
    UIController.drawUI();


    // temp

    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.data.characters.junior.enemy.diplodocus())

    game.continueUpdate();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgrounds.main.drawDynamic(ctx, 0.1);
    tileset.grass.draw(ctx, 10);
    backgrounds.cave1.drawDynamic(ctx);
    backgrounds.cave2.drawDynamic(ctx);

    playerDinos.forEach(dino => dino.draw(ctx));
    enemyDinos.forEach(dino => dino.draw(ctx));
    diedDinos.forEach(dino => dino.draw(ctx));

    if (mouse.isDown) {
        game.cameraWorldPosition.x -= mouse.position.x - mouse.position.lastUpdatePosition.x;

        mouse.speed = Math.floor((mouse.position.x - mouse.position.lastUpdatePosition.x) / 3);
        
        mouse.position.lastUpdatePosition.x = mouse.position.x;
        mouse.position.lastUpdatePosition.y = mouse.position.y;
    } else {
        if (Math.abs(mouse.speed) > 1) {
            game.cameraWorldPosition.x -= mouse.speed;
            
            if (mouse.speed > 0) {
                mouse.speed -= 1
            } else {
                mouse.speed += 1
            }
        }
    }

    if (game.cameraWorldPosition.x < 0) {
        game.cameraWorldPosition.x = 0;
        mouse.speed = 0;
    } else if (game.cameraWorldPosition.x > 2880) {
        game.cameraWorldPosition.x = 2880;
        mouse.speed = 0;
    }

    fixedUpdate()
    if (game.status !== -1) {
        requestAnimationFrame(update);
    }
}

function fixedUpdate() {
    const now = Date.now();
    if (now - game.lastUpdateTime > game.frameDuration) {
        game.lastUpdateTime = now;
        
        diedDinos.forEach(dino => {
            if (dino.hp <= 0 && dino.currentFrame === dino.framesCount - 1) {
                diedDinos.splice(diedDinos.indexOf(dino), 1);
            }
        })
        playerDinos.forEach(dino => {
            if (dino.hp <= 0) {
                dino.setState("died");
                diedDinos.push(dino);
                playerDinos.splice(playerDinos.indexOf(dino), 1);
            }
            if (dino.state === "attacking") {

                if (now - dino.lastAttackTime > dino.attackDuration) {
                    if (enemyDinos.length > 0) {
                        enemyDinos[0].hp -= dino.attackDamage;
                        
                        console.log("Player is attacking, Enemy hp: " + enemyDinos[0].hp);
                        if (enemyDinos[0].hp <= 0) {
                            dino.setState("walking");
                        }
                    } else if (dino.isReachedBase) {
                        game.data.spawnpoint.enemy.hp -= dino.attackDamage;
                        console.log("Player is attacking the base, Base hp: " + game.data.spawnpoint.enemy.hp);
                        if (game.data.spawnpoint.enemy.hp <= 0) {
                            alert("You win!")
                        }
                    } else {
                        dino.setState("walking");
                    }
                    dino.lastAttackTime = now;
                }
            }
            dino.x += dino.state === "walking" ? dino.speed : 0;
        });

        enemyDinos.forEach(dino => {
            if (dino.hp <= 0) {
                dino.setState("died");
                diedDinos.push(dino);
                enemyDinos.splice(enemyDinos.indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    if (playerDinos.length > 0) {
                        playerDinos[0].hp -= dino.attackDamage;
                        console.log("Enemy is attacking, Player hp: " + playerDinos[0].hp);
                        if (playerDinos[0].hp <= 0) {
                            dino.setState("walking");
                        }
                    } else if (dino.isReachedBase) {
                        game.data.spawnpoint.player.hp -= dino.attackDamage;
                        console.log("Enemy is attacking the base, Base hp: " + game.data.spawnpoint.player.hp);
                        if (game.data.spawnpoint.player.hp <= 0) {
                            alert("You loose!")
                        }
                    } else {
                        dino.setState("walking");
                    }
                    dino.lastAttackTime = now;
                }
                
            }
            dino.x += dino.state === "walking" ? -dino.speed : 0;
        });

        checkCollisions();
    }
}


