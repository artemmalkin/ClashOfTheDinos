class UserInterface {
    constructor(objects = []) {
        this.objects = objects;
        this.mouseStart = { "x": 0, "y": 0 };
        this.mouseEnd = { "x": 0, "y": 0 };
    }

    startEventListener(ctx) {
        const ui = this;
        const objects = this.objects;
        const mouseStart = { "x": 0, "y": 0 };
        const mouseEnd = { "x": 0, "y": 0 };
        const mousePositionXInCanvas = () => mousePosition.x - (window.innerWidth - canvas.offsetWidth) / 2;
        const mousePositionYInCanvas = () => mousePosition.y - (window.innerHeight - canvas.offsetHeight) / 2;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent)) {
            document.addEventListener("touchmove", function (event) {
                mouseEnd.x = mousePositionXInCanvas()
                mouseEnd.y = mousePositionYInCanvas()
                
            });
            document.addEventListener("touchend", function (event) {
                if (mouseStart.x === mouseEnd.x) {
                    
                    objects.forEach(object => {
                        switch (object.constructor) {
                            case Button:
                                if (object.position.x < mouseEnd.x && mouseEnd.x < object.position.x + object.width &&
                                    object.position.y < mouseEnd.y && mouseEnd.y < object.position.y + object.height) {
                                    object.action?.();
                                }
                                break;
                            default:
                                break;
                        }
                        
                    });
                }
            });
            document.addEventListener("touchstart", function (event) {
                mouseStart.x = mousePositionXInCanvas()
                mouseStart.y = mousePositionYInCanvas()
                mouseEnd.x = mouseStart.x;
                mouseEnd.y = mouseStart.y;
            });
        } else {
            document.addEventListener("mousedown", function (event) {
                if (event.which === 1) {
                    mouseStart.x = mousePositionXInCanvas()
                    mouseStart.y = mousePositionYInCanvas()

                    objects.forEach(object => {
                        switch (object.constructor) {
                            case Button:
                                if (object.position.x < mouseStart.x && mouseStart.x < object.position.x + object.width &&
                                    object.position.y < mouseStart.y && mouseStart.y < object.position.y + object.height) {
                                    object.state = 0;

                                    ui.draw(ctx);
                                }
                                break;
                            default:
                                break;
                        }

                    });
                }
            });
            document.addEventListener("mouseup", function (event) {
                if (event.which === 1) {
                    mouseEnd.x = mousePositionXInCanvas()
                    mouseEnd.y = mousePositionYInCanvas()
                    if (mouseStart.x === mouseEnd.x) {
                        
                        objects.forEach(object => {
                            switch (object.constructor) {
                                case Button:
                                    if (object.position.x < mouseEnd.x && mouseEnd.x < object.position.x + object.width &&
                                        object.position.y < mouseEnd.y && mouseEnd.y < object.position.y + object.height) {
                                        object.action?.();
                                    }
                                    break;
                                default:
                                    break;
                            }

                        });
                    }
                    
                }
            });
        }
    }

    draw(ctx) {
        this.objects.forEach(object => object.draw(ctx))
    }
}

class Button {
    constructor(normalSprite, pressedSprite, disabledSprite, width, height, x, y, action) {
        this.normalSprite = normalSprite;
        this.pressedSprite = pressedSprite;
        this.disabledSprite = disabledSprite;
        this.width = width;
        this.height = height;
        this.position = { "x": x, "y": y };

        this.state = 1; // 1 - normal, 2 - pressed, 3 - disabled
        this.action = action;
    }

    draw(ctx) {
        switch (this.state) {
            case 0:
                this.disabledSprite.draw(ctx);
                break;
            case 1:
                this.normalSprite.draw(ctx);
                break;
            case 2:
                this.pressedSprite.draw(ctx);
                break;
            default:
                console.error(`Wrong state '${this.state}'`)
        }
    }
}