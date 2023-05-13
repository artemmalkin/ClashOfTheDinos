class Game {
    constructor() {
        this.cameraWorldPosition = { "x": 0, "y": 0 };
        this.status = 1;
        this.lastUpdateTime = 0;
        this.frameDuration = 30;
        this.originalFrameDuration = this.frameDuration;

        this.data = {};
        this.userInterfaces = [];
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

    drawUI(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.userInterfaces.forEach(UI => UI.draw(ctx));
    }

}

let game = new Game();
let ui = new UserInterface();

let sprites = {};
let backgrounds = {};
let tileset = {};

let mouse = {
    "offsetFunction": () => {
        return {
            "x": (window.innerWidth - canvas.offsetWidth) / 2, "y": (window.innerHeight - canvas.offsetHeight) / 2
        }
    },
    "offset": {
        "x": (window.innerWidth - canvas.offsetWidth) / 2, "y": (window.innerHeight - canvas.offsetHeight) / 2
    },
    "isDown": false,
    "x": 0, "y": 0,
    "start": { "x": 0, "y": 0 },
    "end": { "x": 0, "y": 0 }
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {
    document.addEventListener("touchstart", function (event) {
        const touch = event.touches[0];
        mouse.x = Math.floor((touch.clientX - mouse.offset.x) / canvas.offsetWidth * canvas.width);
        mouse.y = Math.floor((touch.clientY - mouse.offset.y) / canvas.offsetHeight * canvas.height);
        mouse.isDown = true;

        mouse.start.x = mouse.x;
        mouse.start.y = mouse.y;
        mouse.end.x = mouse.x;
        mouse.end.y = mouse.y;

        game.userInterfaces.forEach(UI => { UI.handlePress(); })
        game.drawUI(ctxUI);
    });

    document.addEventListener("touchmove", function (event) {
        if (mouse.isDown) {
            const touch = event.touches[0];
            mouse.x = Math.floor((touch.clientX - mouse.offset.x) / canvas.offsetWidth * canvas.width);
            mouse.y = Math.floor((touch.clientY - mouse.offset.y) / canvas.offsetHeight * canvas.height);

            mouse.end.x = mouse.x;
            mouse.end.y = mouse.y;

            game.userInterfaces.forEach(UI => { UI.handleDrag(); })
            game.drawUI(ctxUI);
        }
    });

    document.addEventListener("touchend", function (event) {
        mouse.isDown = false;

        game.userInterfaces.forEach(UI => { UI.handleClick(); })
        game.userInterfaces.forEach(UI => { UI.handlePress(); })
        game.drawUI(ctxUI);
    });
} else {
    document.addEventListener("mousedown", function (event) {
        // Start pressing the left button on the mouse - set the MouseDown flag to true
        if (event.which === 1) {
            mouse.x = Math.floor((event.clientX - mouse.offset.x) / canvas.offsetWidth * canvas.width);
            mouse.y = Math.floor((event.clientY - mouse.offset.y) / canvas.offsetHeight * canvas.height);
            mouse.isDown = true;

            mouse.start.x = mouse.x;
            mouse.start.y = mouse.y;

            game.userInterfaces.forEach(UI => { UI.handlePress(); })
            game.drawUI(ctxUI);
        }
    });

    document.addEventListener("mousemove", function (event) {
        // Move cursor while holding LMB
        if (mouse.isDown) {
            mouse.x = Math.floor((event.clientX - mouse.offset.x) / canvas.offsetWidth * canvas.width);
            mouse.y = Math.floor((event.clientY - mouse.offset.y) / canvas.offsetHeight * canvas.height);

            mouse.end.x = mouse.x;
            mouse.end.y = mouse.y;

            game.userInterfaces.forEach(UI => { UI.handleDrag(); })
            game.userInterfaces.forEach(UI => { UI.handlePress(); })
            game.drawUI(ctxUI);
        }
    });

    document.addEventListener("mouseup", function (event) {
        // Releasing the cursor - set the isMouseDown flag to false
        if (event.which === 1) {
            mouse.x = Math.floor((event.clientX - mouse.offset.x) / canvas.offsetWidth * canvas.width);
            mouse.y = Math.floor((event.clientY - mouse.offset.y) / canvas.offsetHeight * canvas.height);
            mouse.isDown = false;

            mouse.end.x = mouse.x;
            mouse.end.y = mouse.y;
            
            game.userInterfaces.forEach(UI => { UI.handleClick(); })
            game.userInterfaces.forEach(UI => { UI.handlePress(); })
            game.drawUI(ctxUI);
        }
    });
}

playerDinos = [];
enemyDinos = [];
diedDinos = [];

function checkCollisions() {
/*    if (enemyDinos.length > 0) {*/
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
            }
        });
/*    } else {
        playerDinos.forEach(dino => dino.setState("walking"))
    }*/

/*    if (playerDinos.length > 0) {*/
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
            }
        });
/*    } else {
        enemyDinos.forEach(dino => dino.setState("walking"))
    }*/
    
}


function startGame() {
    // init sprites
    sprites.dinoItemActive = () => new spriteImage(resources.diplodocus_p, 64, 64, 8, 0, -190, -190, 8);
    sprites.dinoItemDisactive = () => new spriteImage(resources.diplodocus_p, 64, 64, 8, 1, -190, -190, 8);

    sprites.dinoItemDiplodocus = new spriteImage(resources.diplodocus_p, 26, 26, 0.9, 0.6, 0, 300, 7)

    tileset.grass = new PatternImage(resources.tileset, 45, 16, 6, 0, 6, 0, canvas.height - 86, 20, "x");
    backgrounds.main = new BackgroundImage(resources.background, 320, 180, 9, 0, 0, 1.2);
    backgrounds.cave1 = new BackgroundImage(resources.background, 320, 180, 8, 0, 0);
    backgrounds.cave2 = new BackgroundImage(resources.background, 320, 180, 12, canvas.width * 1.5, 0);

    // init data
    game.data.spawnpoint = {
        "player": { "x": 180, "y": 620 },
        "enemy": { "x": 4100, "y": 620 }
    };
    game.data.dinosMaxCount = 4;

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

    ui.objects = [
        new Button(sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 125, 135, 10, 930, () => playerDinos.push(game.data.characters.junior.player.diplodocus())),
        new Button(sprites.dinoItemActive(), sprites.dinoItemDisactive(), sprites.dinoItemActive(), 125, 135, 135, 930, () => playerDinos.push(game.data.characters.subadult.player.diplodocus()))
    ]
    game.userInterfaces.push(ui);
    game.drawUI(ctxUI);

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
    tileset.grass.draw(ctx, 20);
    backgrounds.cave1.drawDynamic(ctx);
    backgrounds.cave2.drawDynamic(ctx);

    playerDinos.forEach(dino => dino.draw(ctx));
    enemyDinos.forEach(dino => dino.draw(ctx));
    diedDinos.forEach(dino => dino.draw(ctx));

    fixedUpdate()
    if (game.status !== -1) {
        requestAnimationFrame(update);
    }
}

function fixedUpdate() {
    const now = Date.now();
    if (now - game.lastUpdateTime > game.frameDuration) {
        game.lastUpdateTime = now;

        if (mouse.isDown) {
            game.cameraWorldPosition.x += mouse.x > canvas.width * 0.5 ? 10 : -10;

            if (game.cameraWorldPosition.x < 0) {
                game.cameraWorldPosition.x = 0
            } else if (game.cameraWorldPosition.x > canvas.width * 1.5) {
                game.cameraWorldPosition.x = canvas.width * 1.5
            }
        }
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
                if (enemyDinos.length > 0) {
                    if (now - dino.lastAttackTime > dino.attackDuration) {
                        enemyDinos[0].hp -= dino.attackDamage;
                        dino.lastAttackTime = now;
                        console.log("Player is attacking, Enemy hp: " + enemyDinos[0].hp);
                        if (enemyDinos[0].hp <= 0) {
                            dino.setState("walking");
                        }
                    }
                } else {
                    dino.setState("walking");
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
                if (playerDinos.length > 0) {
                    if (now - dino.lastAttackTime > dino.attackDuration) {
                        playerDinos[0].hp -= dino.attackDamage;
                        dino.lastAttackTime = now;
                        console.log("Enemy is attacking, Player hp: " + playerDinos[0].hp);
                        if (playerDinos[0].hp <= 0) {
                            dino.setState("walking");
                        }
                    }
                } else {
                    dino.setState("walking");
                }
            }
            dino.x += dino.state === "walking" ? -dino.speed : 0;
        });

        checkCollisions();
    }
}


