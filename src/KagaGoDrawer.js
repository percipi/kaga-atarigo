var KagaGoDrawer = function (canvas, cfg) {
    var defaults = {
        background: "#C49837",
        borderWidth: 20,
        stoneSize: 30,
        boardSize: 5,
        lineWidth: 1,
        black: "#000000",
        white: "#ffffff",
        removed:"#ff0000"
    };

    var tools = {
        simpleClone: function (a) {
            var c = {};
            for (var p in a) {
                c[p] = a[p];
            }
            return c;
        },
        simpleExtend: function (a, b) {
            var c = this.simpleClone(a);
            for (var p in b) {
                c[p] = b[p];
            }
            return c;
        }
    };

    this.cfg = tools.simpleExtend(defaults, cfg);
    this.width = this.height = this.cfg.borderWidth * 2 + this.cfg.boardSize * this.cfg.lineWidth + (this.cfg.boardSize - 1) * this.cfg.stoneSize;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d');
}

KagaGoDrawer.prototype.drawGame = function (positions, sim) {
    if (sim) {
        this.cfg.white = "#EDB2BF";
        this.cfg.black = "#35358F";
    } else {
        this.cfg.white = "#ffffff";
        this.cfg.black = "#000000";
        this.cfg.removed = "#ff0000";
    }
    this.drawBoard();
    for (var y = 0; y < positions.length; y++) {
        for (var x = 0; x < positions[y].length; x++) {
            if (positions[y][x] !== 0) {
                this.drawStone(x, y, positions[y][x]);
            }
        }
    }
},

KagaGoDrawer.prototype.drawBoard = function () {
    this.ctx.fillStyle = this.cfg.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#000000";
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    var linePosY;
    for (i = 0; i < this.cfg.boardSize; i++) {
        linePosY = this.cfg.borderWidth + i * (this.cfg.stoneSize + this.cfg.lineWidth);
        this.ctx.moveTo(this.cfg.borderWidth, linePosY);
        this.ctx.lineTo(this.width - this.cfg.borderWidth, linePosY);
    }
    var linePosX;
    for (i = 0; i < this.cfg.boardSize; i++) {
        linePosX = this.cfg.borderWidth + i * (this.cfg.stoneSize + this.cfg.lineWidth);
        this.ctx.moveTo(linePosX, this.cfg.borderWidth);
        this.ctx.lineTo(linePosX, this.width - this.cfg.borderWidth);
    }
    this.ctx.stroke();
}

KagaGoDrawer.prototype.drawStone = function (x, y, color) {
    var colorValue = this.cfg.white;
    if (color === 1) {
        colorValue = this.cfg.black;
    };
    if (color === 3) {
        colorValue = this.cfg.removed;
    }
    this.ctx.fillStyle = colorValue;
    this.ctx.beginPath();
    this.ctx.arc(this.pos2pixel(x), this.pos2pixel(y), this.cfg.stoneSize / 2, 0, 2 * Math.PI);
    this.ctx.fill();
}

KagaGoDrawer.prototype.pos2pixel = function (x) {
    return x * (this.cfg.stoneSize + 1) + this.cfg.borderWidth;
}

KagaGoDrawer.prototype.pixel2pos = function (x) {
    return Math.floor((x - this.cfg.borderWidth + this.cfg.stoneSize / 2) / (this.cfg.stoneSize + 1));
}