class Game {
    constructor() {
        this.cameraWorldPosition = { "x": 0, "y": 0 };
        this.status = 1;
        this.lastUpdateTime = 0;
        this.frameDuration = 30;

        this.spawnpoint = {
            "player": { "x": 180, "y": 620 },
            "enemy": { "x": 4100, "y": 620 }
        }
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
//new
/*let dinosaurs = [[], []]; // dinosaurs[0] - player, dinosaurs[1] - enemy

function checkCollisions() {
    if (game.fightStatus === false && dinosaurs[0].length >= 1 && dinosaurs[1].length >= 1) {
        const dinoPlayerCollision = dinosaurs[0][0].collision();
        const dinoEnemyCollision = dinosaurs[1][0].collision();

        if (dinoEnemyCollision.x > dinoPlayerCollision.x && dinoEnemyCollision.x < dinoPlayerCollision.x + dinoPlayerCollision.width) {
            game.fightStatus = true;
            dinosaurs[0][0].state = "attacking";
            dinosaurs[1][0].state = "attacking";
            dinosaurs[0][0].x -= 6;
            dinosaurs[1][0].x += 6;
        } else if (game.fightStatus === false) {
            dinosaurs[0][0].state = "walking";
            dinosaurs[1][0].state = "walking";
        }
    } else if (game.fightStatus === true) {
        if (dinosaurs[0].length >= 2) {
            dinosaurs[0].forEach(dino => {

            });
        }
    }
}*/


// old
let dinosaurs = [];
let attackingPair = [];

function checkCollisions() {
    let checkedPairs = [];

    for (dino in dinosaurs) {
        for (dino2 in dinosaurs) {
            if (!checkedPairs.includes([dinosaurs[dino], dinosaurs[dino2]]) || !checkedPairs.includes([dinosaurs[dino2], dinosaurs[dino]])) {
                checkedPairs.push([dinosaurs[dino], dinosaurs[dino2]]);
                const dino1Collision = dinosaurs[dino].collision();
                const dino2Collision = dinosaurs[dino2].collision();
                if (dino1Collision.x > dino2Collision.x && dino1Collision.x < dino2Collision.x + dino2Collision.width) {
                    if (dinosaurs[dino].isEnemy !== dinosaurs[dino2].isEnemy) {
                        game.fightStatus = true;
                        dinosaurs[dino].setState("attacking");
                        dinosaurs[dino2].setState("attacking");
                        attackingPair = dinosaurs[dino].isEnemy ? [dino2, dino] : [dino, dino2];

                        
                    } else {
                        dinosaurs[dino].setState("standing");
                        dinosaurs[dino2].setState("standing");
                    }
                    
                    dinosaurs[dino].x += 6;
                    dinosaurs[dino2].x -= 6;
                } else {
                    //dinosaurs[dino].state = dinosaurs[dino].state !== "attacking" && game.fightStatus !== "true" ? "walking" : dinosaurs[dino].state;
                    //dinosaurs[dino2].state = dinosaurs[dino2].state !== "attacking" && game.fightStatus !== "true" ? "walking" : dinosaurs[dino2].state;
                }
            }
        }
    }
}

function startGame() {
    resources.music.play()
    sprites.victory = new spriteImage(resources.victory, 250, 40, 0, 0, 0, 0, 1)
    tileset.grass = new PatternImage(resources.tileset, 45, 16, 6, 0, 6, 0, canvas.height - 86, 20, "x");
    backgrounds.main = new BackgroundImage(resources.background, 320, 180, 9, 0, 0, 1.2);
    backgrounds.cave1 = new BackgroundImage(resources.background, 320, 180, 8, 0, 0);
    backgrounds.cave2 = new BackgroundImage(resources.background, 320, 180, 12, canvas.width * 1.5, 0);

    //new
    /*dinosaurs[0].push(new Character(resources.diplodocus_p, 64, 64, 4, 6, 6, game.spawnpoint.player.x, game.spawnpoint.player.y, 8, false, 15, 32));
    dinosaurs[0].push(new Character(resources.diplodocus_p, 64, 64, 4, 6, 6, game.spawnpoint.player.x - 100, game.spawnpoint.player.y, 8, false, 15, 32));
    dinosaurs[1].push(new Character(resources.diplodocus_e, 64, 64, 4, 6, 6, game.spawnpoint.enemy.x, game.spawnpoint.enemy.y, 8, true, 15, 32));*/
    const diplodocusStates = {
        "walking": { "frameRow": 4, "framesCount": 6, "frameDuration": 6 },
        "attacking": { "frameRow": 12, "framesCount": 7, "frameDuration": 6 },
        "standing": { "frameRow": 0, "framesCount": 3, "frameDuration": 6 }
    };
    // old
    dinosaurs.push(new Character(resources.diplodocus_p, 64, 64, diplodocusStates, game.spawnpoint.player.x + 100, game.spawnpoint.player.y, 8, false, 15, 32));
    dinosaurs.push(new Character(resources.diplodocus_p, 64, 64, diplodocusStates, game.spawnpoint.player.x, game.spawnpoint.player.y, 8, false, 15, 32));
    dinosaurs.push(new Character(resources.diplodocus_e, 64, 64, diplodocusStates, game.spawnpoint.enemy.x, game.spawnpoint.enemy.y, 8, true, 15, 32));
    dinosaurs.push(new Character(resources.diplodocus_e, 64, 64, diplodocusStates, game.spawnpoint.enemy.x + 100, game.spawnpoint.enemy.y, 8, true, 15, 32));
    dinosaurs.push(new Character(resources.diplodocus_e, 64, 64, diplodocusStates, game.spawnpoint.enemy.x + 200, game.spawnpoint.enemy.y, 8, true, 15, 32));
    game.continueUpdate();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgrounds.main.drawDynamic(0.05);
    tileset.grass.draw(20);
    backgrounds.cave1.drawDynamic();
    backgrounds.cave2.drawDynamic();

    //new
    /*dinosaurs[0].forEach(dino => dino.draw());
    dinosaurs[1].forEach(dino => dino.draw());*/

    // old
    dinosaurs.forEach(dino => dino.draw());
    sprites.victory.draw(ctxUI);

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

        // new 
        /*dinosaurs[0].forEach(dino => {
            if (dino.hp <= 0) {
                dinosaurs[0].splice(dinosaurs[0].indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    dinosaurs[1][0].hp -= dino.attackDamage;
                    dino.lastAttackTime = now;
                    console.log("Player is attacking, Enemy hp: " + dinosaurs[1][0].hp);
                    if (dinosaurs[1][0].hp <= 0) {
                        game.fightStatus = false;
                        dino.state = "walking";
                    }
                }
            }
            dino.x += dino.state === "walking" ? 3 : 0;
        });
        dinosaurs[1].forEach(dino => {
            if (dino.hp <= 0) {
                dinosaurs[1].splice(dinosaurs[1].indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    dinosaurs[0][0].hp -= dino.attackDamage;
                    dino.lastAttackTime = now;
                    console.log("Enemy is attacking, Player hp: " + dinosaurs[0][0].hp);
                    if (dinosaurs[0][0].hp <= 0) {
                        game.fightStatus = false;
                        dino.state = "walking";
                    }
                }
            }
            dino.x += dino.state === "walking" ? -3 : 0;
        });
        checkCollisions();*/

        // old
        dinosaurs.forEach(dino => {
            if (dino.hp <= 0) {
                dinosaurs.splice(dinosaurs.indexOf(dino), 1);
            }
            if (dino.state === "attacking") {
                if (now - dino.lastAttackTime > dino.attackDuration) {
                    dinosaurs[attackingPair[dino.isEnemy ? 0 : 1]].hp -= dino.attackDamage;
                    dino.lastAttackTime = now;
                    //console.log("Dino is attacking, other dino's hp: " + dinosaurs[attackingPair[dino.isEnemy ? 0 : 1]].hp);
                    if (dinosaurs[attackingPair[dino.isEnemy ? 0 : 1]].hp <= 0) {
                        game.fightStatus = false;
                        dino.setState("walking");
                    }
                }
            }
            dino.x += dino.state === "walking" ? (dino.isEnemy ? -3 : 3) : 0
        });

        if (game.fightStatus === false) {
            dinosaurs.forEach(dino => {
                if (dino.state === "standing") {
                    dino.setState("walking");
                };
            });
        }
        checkCollisions();
    }
}


