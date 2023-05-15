class BackgroundImage {
    constructor(image, frameWidth, frameHeight, frameRow, x, y, scale = 1) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameRow = frameRow;
        this.x = x;
        this.y = y;
        this.sy = this.frameRow * this.frameHeight;
        this.scale = scale;
        this.scaledFrameWidth = canvas.width * this.scale;
        this.scaledFrameHeight = canvas.height * this.scale;
    }

    drawDynamic(ctx, speed = 1) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, 0, this.sy, this.frameWidth, this.frameHeight, this.x - game.cameraWorldPosition.x * speed, this.y - game.cameraWorldPosition.y * speed, this.scaledFrameWidth, this.scaledFrameHeight);
    }

    drawStatic(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, 0, this.sy, this.frameWidth, this.frameHeight, this.x, this.y, this.scaledFrameWidth, this.scaledFrameHeight);
    }
}

class spriteImage {
    constructor(image, frameWidth, frameHeight, frameRow, frameCol, x, y, scale = 1) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameRow = frameRow;
        this.frameCol = frameCol;
        this.x = x;
        this.y = y;
        this.sx = this.frameCol * this.frameWidth;
        this.sy = this.frameRow * this.frameHeight;
        this.scale = scale;
        this.scaledFrameWidth = this.frameWidth * this.scale;
        this.scaledFrameHeight = this.frameHeight * this.scale;
    }

    draw(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, this.sx, this.sy, this.frameWidth, this.frameHeight, this.x, this.y, this.scaledFrameWidth, this.scaledFrameHeight);
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