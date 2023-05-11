class BackgroundImage {
    constructor(image, frameWidth, frameHeight, frameRow, x, y, scale = 1) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameRow = frameRow;
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    drawDynamic(ctx, speed = 1) {
        const sy = this.frameRow * this.frameHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, 0, sy, this.frameWidth, this.frameHeight, this.x - game.cameraWorldPosition.x * speed, this.y - game.cameraWorldPosition.y * speed, canvas.width * this.scale, canvas.height * this.scale);
    }

    drawStatic(ctx) {
        const sy = this.frameRow * this.frameHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, 0, sy, this.frameWidth, this.frameHeight, this.x, this.y, canvas.width * this.scale, canvas.height * this.scale);
    }
}

class spriteImage {
    constructor(image, frameWidth, frameHeight, frameRow, frameCol, x, y, scale = 1, name = "unnamed") {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameRow = frameRow;
        this.frameCol = frameCol;
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.name = name;
        this.isActive = true;
    }

    setActive(status = true) {
        this.isActive = status;
    }

    draw(ctx) {
        if (this.isActive) {
            const sx = this.frameCol * this.frameWidth;
            const sy = this.frameRow * this.frameHeight;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.image, sx, sy, this.frameWidth, this.frameHeight, this.x, this.y, this.frameWidth * this.scale, this.frameHeight * this.scale);
        }
    }
}

class PatternImage {
    constructor(image, frameWidth, frameHeight, scale, frameRow, frameCol, x, y) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.scale = scale;

        this.sx = frameCol * this.frameWidth;
        this.sy = frameRow * this.frameHeight;
        this.x = x;
        this.y = y;
    }

    draw(ctx, repeatCount, repeatAxis) {
        let n = 0;

        while (n < repeatCount) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.image, this.sx, this.sy, this.frameWidth, this.frameHeight, this.x - game.cameraWorldPosition.x + this.frameWidth * this.scale * n, this.y - game.cameraWorldPosition.y, this.frameWidth * this.scale, this.frameHeight * this.scale);
            n += 1;
        }
    }
}