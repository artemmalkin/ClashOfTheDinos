class Game {
    constructor() {
        this.cameraWorldPosition = { "x": 0, "y": 0 };
        this.status = 1;
        this.lastUpdateTime = 0;
        this.frameDuration = 30;

        this.spawnpoint = {
            "player": { "x": 180, "y": 620 },
            "enemy": { "x": 4100, "y": 620 }
        };
        this.characterStates = {}
        this.characters = {};
        this.dinosMaxCount = 4;
        this.fightStatus = false;
    }

    pause() {
        this.frameDuration = Infinity;
        this.status = 0;
    }

    continue() {
        this.frameDuration = 30;
        this.status = 1;
        //requestAnimationFrame(update);
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

let sprites = {};
let backgrounds = {};
let tileset = {};
let mousePosition = { "x": 0, "y": 0 };


let isMouseDown = false;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {
    document.addEventListener("touchstart", function (event) {
        const touch = event.touches[0];
        mousePosition.x = touch.clientX;
        mousePosition.y = touch.clientY;
        isMouseDown = true;
    });

    document.addEventListener("touchmove", function (event) {
        if (isMouseDown) {
            const touch = event.touches[0];
            mousePosition.x = touch.clientX;
            mousePosition.y = touch.clientY;
        }
    });

    document.addEventListener("touchend", function (event) {
        isMouseDown = false;
        const touch = event.touches[0];
        mousePosition.x = touch.clientX;
        mousePosition.y = touch.clientY;
    });
} else {
    document.addEventListener("mousedown", function (event) {
        // Начало зажатия левой кнопки на мыши - ставим флаг isMouseDown в true
        if (event.which === 1) {
            mousePosition.x = event.clientX;
            mousePosition.y = event.clientY;
            isMouseDown = true;
        }
    });

    document.addEventListener("mousemove", function (event) {
        // Перемещение курсора при зажатой ЛКМ
        if (isMouseDown) {
            mousePosition.x = event.clientX;
            mousePosition.y = event.clientY;
        }
    });

    document.addEventListener("mouseup", function (event) {
        // Отпускание курсора - ставим флаг isMouseDown в false
        if (event.which === 1) {
            mousePosition.x = event.clientX;
            mousePosition.y = event.clientY;
            isMouseDown = false;
        }
    });
}

playerDinos = [];
enemyDinos = [];

function checkCollisions() {
    if (enemyDinos.length > 0) {
        playerDinos.forEach(dino => {
            let dinoIndex = playerDinos.indexOf(dino)

            if (dinoIndex === 0) {
                // Если динозавр крайний
                const dinoPlayerCollision = playerDinos[0].collision();
                const dinoEnemyCollision = enemyDinos[0].collision();
                if (dinoEnemyCollision.x < dinoPlayerCollision.x + dinoPlayerCollision.width) {
                    // Если он дошёл до динозавра врага - Режим боя
                    game.fightStatus = true;
                    playerDinos[0].setState("attacking");
                    enemyDinos[0].setState("attacking");
                } else {
                    // Если не дошёл - пусть идёт дальше
                    playerDinos[0].setState("walking");
                    enemyDinos[0].setState("walking");
                }
            } else {
                // Если не крайний - проверяем, дошёл ли до идущего перед ним динозавра
                const dinoPlayerCollision = playerDinos[dinoIndex].collision();
                const NextDinoPlayerCollision = playerDinos[dinoIndex - 1].collision();
                if (NextDinoPlayerCollision.x < dinoPlayerCollision.x + dinoPlayerCollision.width) {
                    // Если дошёл - останавливаем динозавра
                    dino.setState("standing");
                } else {
                    // Если не дошёл - пусть идёт дальше
                    dino.setState("walking");
                }
            }
        });
    } else {
        playerDinos.forEach(dino => dino.setState("walking"))
    }

    if (playerDinos.length > 0) {
        enemyDinos.forEach(dino => {
            let dinoIndex = enemyDinos.indexOf(dino)

            if (dinoIndex !== 0) {
                // Если не крайний - проверяем, дошёл ли до идущего перед ним динозавра
                const dinoEnemyCollision = enemyDinos[dinoIndex].collision();
                const nextDinoEnemyCollision = enemyDinos[dinoIndex - 1].collision();
                if (dinoEnemyCollision.x < nextDinoEnemyCollision.x + nextDinoEnemyCollision.width) {
                    // Если дошёл - останавливаем динозавра
                    dino.setState("standing");
                } else {
                    // Если не дошёл - пусть идёт дальше
                    dino.setState("walking");
                }
            }
        });
    } else {
        enemyDinos.forEach(dino => dino.setState("walking"))
    }
    
}


function startGame() {
    resources.music.play()
    sprites.victory = new spriteImage(resources.victory, 250, 40, 0, 0, 0, 0, 1)
    tileset.grass = new PatternImage(resources.tileset, 45, 16, 6, 0, 6, 0, canvas.height - 86, 20, "x");
    backgrounds.main = new BackgroundImage(resources.background, 320, 180, 9, 0, 0, 1.2);
    backgrounds.cave1 = new BackgroundImage(resources.background, 320, 180, 8, 0, 0);
    backgrounds.cave2 = new BackgroundImage(resources.background, 320, 180, 12, canvas.width * 1.5, 0);

    game.characterStates = {
        "diplodocus": {
            "walking": { "frameRow": 4, "framesCount": 6, "frameDuration": 6 },
            "attacking": { "frameRow": 12, "framesCount": 7, "frameDuration": 6 },
            "standing": { "frameRow": 0, "framesCount": 3, "frameDuration": 6 }
        },
    }
    game.characters = {
        "junior": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.characterStates.diplodocus, game.spawnpoint.player.x, game.spawnpoint.player.y, 8, false, 15, 32),
            },
            "enemy": {
                "diplodocus": () => new Character(resources.diplodocus_e, 64, 64, game.characterStates.diplodocus, game.spawnpoint.enemy.x, game.spawnpoint.enemy.y, 8, true, 15, 32),
            }
        },
        "subadult": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.characterStates.diplodocus, game.spawnpoint.player.x - 100, game.spawnpoint.player.y - 190, 12, false, 15, 32, 2, 500, 250, 2500),
            },
            "enemy": {

            }
        },
        "adult": {
            "player": {
                "diplodocus": () => new Character(resources.diplodocus_p, 64, 64, game.characterStates.diplodocus, game.spawnpoint.player.x - 300, game.spawnpoint.player.y - 810, 25, false, 15, 32, 1, 1000, 500, 5000),
            },
            "enemy": {

            }
        }
    }

    playerDinos.push(game.characters.junior.player.diplodocus())
    playerDinos.push(game.characters.junior.player.diplodocus())
    playerDinos.push(game.characters.subadult.player.diplodocus())
    playerDinos.push(game.characters.adult.player.diplodocus())

    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())
    enemyDinos.push(game.characters.junior.enemy.diplodocus())

    game.continueUpdate();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgrounds.main.drawDynamic(0.05);
    tileset.grass.draw(20);
    backgrounds.cave1.drawDynamic();
    backgrounds.cave2.drawDynamic();

    //sprites.victory.draw(ctxUI);

    playerDinos.forEach(dino => dino.draw());
    enemyDinos.forEach(dino => dino.draw());

    fixedUpdate()
    if (game.status !== -1) {
        requestAnimationFrame(update);
    }
}

function fixedUpdate() {
    const now = Date.now();
    if (now - game.lastUpdateTime > game.frameDuration) {
        game.lastUpdateTime = now;

        if (isMouseDown) {
            game.cameraWorldPosition.x += mousePosition.x > window.innerWidth * 0.5 ? 10 : -10;

            if (game.cameraWorldPosition.x < 0) {
                game.cameraWorldPosition.x = 0
            } else if (game.cameraWorldPosition.x > canvas.width * 1.5) {
                game.cameraWorldPosition.x = canvas.width * 1.5
            }
        }

        playerDinos.forEach(dino => {
            if (dino.hp <= 0) {
                playerDinos.splice(playerDinos.indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    enemyDinos[0].hp -= dino.attackDamage;
                    dino.lastAttackTime = now;
                    console.log("Player is attacking, Enemy hp: " + enemyDinos[0].hp);
                    if (enemyDinos[0].hp <= 0) {
                        game.fightStatus = false;
                        dino.setState("walking");
                    }
                }
            }
            dino.x += dino.state === "walking" ? dino.speed : 0;
        });

        enemyDinos.forEach(dino => {
            if (dino.hp <= 0) {
                enemyDinos.splice(enemyDinos.indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    playerDinos[0].hp -= dino.attackDamage;
                    dino.lastAttackTime = now;
                    console.log("Enemy is attacking, Player hp: " + playerDinos[0].hp);
                    if (playerDinos[0].hp <= 0) {
                        game.fightStatus = false;
                        dino.setState("walking");
                    }
                }
            }
            dino.x += dino.state === "walking" ? -dino.speed : 0;
        });

        checkCollisions();
    }
}


