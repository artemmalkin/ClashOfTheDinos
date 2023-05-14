class Mouse {
    constructor(canvas) {
        this.position = { "x": 0, "y": 0 };
        this.isDown = false;
        this.canvas = canvas;

        this.offset = {
            "x": (window.innerWidth - this.canvas.offsetWidth) / 2,
            "y": (window.innerHeight - this.canvas.offsetHeight) / 2
        };

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
            .test(navigator.userAgent)) {
            document.addEventListener("touchstart", this.touchStart);

            document.addEventListener("touchmove", this.touchMove);

            document.addEventListener("touchend", this.touchEnd);
        } else {
            document.addEventListener("mousedown", this.mouseDown);

            document.addEventListener("mousemove", this.mouseMove);

            document.addEventListener("mouseup", this.mouseUp);
        }
    }


    mouseDown(event) {
        if (event.which === 1) {
            mouse.setPosition(event.offsetX, event.offsetY)
            mouse.isDown = true;
        }
    }

    mouseMove(event) {
        if (mouse.isDown) {
            mouse.setPosition(event.offsetX, event.offsetY)
        }
    }

    mouseUp(event) {
        if (event.which === 1) {
            mouse.setPosition(event.offsetX, event.offsetY)
            mouse.isDown = false;
        }
    }

    touchStart(event) {
        const touch = event.touches[0];
        console.log(touch.clientY - mouse.offset.y)
        mouse.setPosition(touch.clientX - mouse.offset.x, touch.clientY - mouse.offset.y);
        mouse.isDown = true;
    }

    touchMove(event) {
        const touch = event.touches[0];
        mouse.setPosition(touch.clientX - mouse.offset.x, touch.clientY - mouse.offset.y);
    }

    touchEnd(event) {
        mouse.isDown = false;
    }

    setPosition(offsetX, offsetY) {
        this.position.x = Math.floor(offsetX / this.canvas.offsetWidth * this.canvas.width);
        this.position.y = Math.floor(offsetY / this.canvas.offsetHeight * this.canvas.height);
    }
}

class Component {
    constructor(width = 0, height = 0, x = 0, y = 0) {
        this.isActive = true;
        this.position = { "x": x, "y": y };
        this.width = width;
        this.height = height;
    }
}

class UserInterface {
    constructor(canvas, mouse, UIManager, components = []) {
        this.UIManager = UIManager;
        this.components = components;
        this.isActive = true;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.onclick = (event) => {
            if (this.isActive) {
                this.handleClick(event);
            }
        }

        this.mouse = mouse;
    }

    handleClick(event) {
        this.components.forEach(component => {
            switch (component.constructor) {
                case Button:
                    if (component.position.x < this.mouse.position.x && this.mouse.position.x < component.position.x + component.width &&
                        component.position.y < this.mouse.position.y && this.mouse.position.y < component.position.y + component.height) {
                        
                        component.action?.();
                        this.UIManager.drawUI();
                    }
                    break;
                default:
                    break;
            }

        });
    }

    draw(ctx) {
        this.components.forEach(component => component.draw(ctx))
    }
}

class UIManager {
    constructor(userInterfaces = []) {
        this.userInterfaces = userInterfaces;
    }

    drawUI() {
        this.userInterfaces.forEach(UI => UI.draw(UI.ctx));
    }
}

class Button extends Component {
    constructor(normalSprite, pressedSprite, disabledSprite, width, height, x, y, action) {
        super(width, height, x, y)
        this.normalSprite = normalSprite;
        this.pressedSprite = pressedSprite;
        this.disabledSprite = disabledSprite;

        this.state = 1; // 0 - disabled, 1 - normal, 2 - pressed
        this.action = action;


        this.normalSprite.x += this.position.x;
        this.normalSprite.y += this.position.y;
        this.pressedSprite.x += this.position.x;
        this.pressedSprite.y += this.position.y;
        this.disabledSprite.x += this.position.x;
        this.disabledSprite.y += this.position.y;
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

