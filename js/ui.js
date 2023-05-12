class UserInterface {
    constructor(objects = []) {
        this.objects = objects;
        this.isActive = true;
        this.isHidden = false;
    }

    handlePress() {
        if (this.isActive) {
            this.objects.forEach(object => {
                switch (object.constructor) {
                    case Button:
                        if (mouse.isDown) {
                            if (object.position.x < mouse.start.x && mouse.start.x < object.position.x + object.width &&
                                object.position.y < mouse.start.y && mouse.start.y < object.position.y + object.height) {
                                object.state = 2;
                            } else {
                                object.state = 1;
                            }
                        } else {
                            object.state = 1;
                        }
                        
                        break;
                    default:
                        break;
                }

            });
        }
    }

    handleClick() {
        if (this.isActive) {
            if (mouse.start.x === mouse.end.x) {
                this.objects.forEach(object => {
                    switch (object.constructor) {
                        case Button:
                            if (object.position.x < mouse.end.x && mouse.end.x < object.position.x + object.width &&
                                object.position.y < mouse.end.y && mouse.end.y < object.position.y + object.height) {
                                object.action?.();
                            }
                            break;
                        default:
                            break;
                    }

                });
            }
        }
    }

    handleDrag() {
        if (this.isActive) {
            this.objects.forEach(object => {
                switch (object.constructor) {
                    case Button:
                        if (object.position.x < mouse.end.x && mouse.end.x < object.position.x + object.width &&
                            object.position.y < mouse.end.y && mouse.end.y < object.position.y + object.height) {
                            object.state = 2;
                        } else {
                            object.state = 1;
                        }
                        break;
                    default:
                        break;
                }

            });
        }
    }

    draw(ctx) {
        if (!this.isHidden) {
            this.objects.forEach(object => object.draw(ctx))
        }
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

        this.state = 1; // 0 - disabled, 1 - normal, 2 - pressed
        this.action = action;
        this.isActive = true;
    }

    draw(ctx) {
        if (this.isActive) {
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
}