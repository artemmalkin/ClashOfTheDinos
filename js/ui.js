class UserInterface {
    constructor() {
        this.scenes = {
            
        }
    }

    startListener() {
        const scenes = this.scenes;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent)) {
            document.addEventListener("touchstart", function (event) {
                const touch = event.touches[0];
                const x = touch.clientX - (window.innerWidth - canvas.offsetWidth) / 2;
                const y = touch.clientY - (window.innerHeight - canvas.offsetHeight) / 2;
                scenes[currentScene].sprites.forEach(sprite => {
                    if (sprite.x < x && x < sprite.x + sprite.frameWidth * sprite.scale &&
                        sprite.y < y && y < sprite.y + sprite.frameHeight * sprite.scale) {
                        scenes[currentScene].actions[sprite.name]?.()
                    }
                });
            });
        } else {
            document.addEventListener("mousedown", function (event) {
                if (event.which === 1) {
                    const x = event.clientX - (window.innerWidth - canvas.offsetWidth) / 2;
                    const y = event.clientY - (window.innerHeight - canvas.offsetHeight) / 2;
                    scenes[currentScene].sprites.forEach(sprite => {
                        if (sprite.x < x && x < sprite.x + sprite.frameWidth * sprite.scale &&
                            sprite.y < y && y < sprite.y + sprite.frameHeight * sprite.scale) {
                            scenes[currentScene].actions[sprite.name]?.()
                        }
                    })
                }
            });
        }
    }

    addScene(sceneName, sprites = [], actions = {}) {
        this.scenes[sceneName] = {};
        this.scenes[sceneName].sprites = sprites;
        this.scenes[sceneName].actions = actions;
    }

    draw(ctx, sceneName) {
        this.scenes[sceneName].sprites.forEach(sprite => sprite.draw(ctx))
    }
}