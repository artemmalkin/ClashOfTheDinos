class Character {
    constructor(image, frameWidth, frameHeight, states = {}, x, y, scale, isEnemy = false, collisionX, collisionWidth, speed = 3, hp = 100, attackDamage = 25, attackDuration = 2000) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameRow = states.frameRow;
        this.framesCount = states.frameCount;
        this.x = x;
        this.y = y;
        this.scale = scale;

        this.scaledFrameWidth = this.frameWidth * this.scale;
        this.scaledFrameHeight = this.frameHeight * this.scale;
        this.PositionRelativeCamera = () => ({ "x": this.x - game.cameraWorldPosition.x, "y": this.y - game.cameraWorldPosition.y });

        this.isEnemy = isEnemy;
        this.collision = () => ({ "x": collisionX * this.scale + this.PositionRelativeCamera().x, "width": collisionWidth * this.scale });
        this.states = states
        /*this.states = {
            "walking": { "frameRow": frameRow, "framesCount": framesCount, "frameDuration": frameDuration }
        };*/
        this.state = "";

        this.speed = speed;
        this.hp = hp;
        this.attackDamage = attackDamage;
        this.attackDuration = attackDuration
        this.lastAttackTime = 0;

        this.currentFrame = 0;
        this.lastUpdateTime = 0;
        this.frameDuration = states.frameDuration// * game.frameDuration; // время, которое каждый кадр должен оставаться на экране (в миллисекундах)

        this.setState(this.state);
    }

    setState(stateName) {
        if (stateName !== this.state) {
            this.currentFrame = 0;
            this.frameRow = this.states[stateName].frameRow;
            this.framesCount = this.states[stateName].framesCount;
            this.frameDuration = this.states[stateName].frameDuration;
            this.state = stateName;
        }
    }

    draw(ctx) {
        const now = Date.now();
        if (now - this.lastUpdateTime > this.frameDuration * game.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.framesCount;
            this.lastUpdateTime = now;
        }

        const sx = this.currentFrame * this.frameWidth;
        const sy = this.frameRow * this.frameHeight;
        const posRelativeCam = this.PositionRelativeCamera();

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, posRelativeCam.x, posRelativeCam.y, this.scaledFrameWidth, this.scaledFrameHeight);
        //this.drawCollisions(ctx)
        //this.drawHp()
    }

    drawCollisions(ctx) {
        const collision = this.collision();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 40;
        ctx.moveTo(collision.x, canvas.height)
        ctx.lineTo(collision.x + collision.width, canvas.height)
        ctx.stroke();
    }

    drawHp() {
        const collision = this.collision();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 40;
        ctx.moveTo(collision.x + collision.width / 2 - collision.width / 2 * this.hp / 2, canvas.height);
        ctx.lineTo((collision.x + collision.width) / 2 + (collision.width / 2) * this.hp / 2, canvas.height);
        ctx.stroke();
    }
}

