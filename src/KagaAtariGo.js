KagaAtariGo = function (id) {
    var self = this;
    var endOfGame = function (winner) {
        var colorName;
        if (winner === 1) {
            colorName = "czarny";
        }
        else {
            colorName = "biały";
        }
        alert("Koniec gry, wygrał " + colorName + ".");
        self.game = new KagaGoGame(self, endOfGame);
    };
    this.kL = new KagaLogger();
    this.canvas = document.getElementById(id);
    this.canvasSim = document.getElementById("sim");
    this.gameDrawer = new KagaGoDrawer(this.canvas);
    //this.gameDrawerSim = new KagaGoDrawer(this.canvasSim);
    this.game = new KagaGoGame(this, endOfGame);
}


KagaAtariGo.prototype.listenOnClick = function (callback2) {
    var self = this;
    this.canvas.onclick = function (event) {
        //kL.startTime();
        var x = event.pageX - self.canvas.offsetLeft;
        var y = event.pageY - self.canvas.offsetTop;
        var posX = self.gameDrawer.pixel2pos(x),
            posY = self.gameDrawer.pixel2pos(y);
        callback2({x: posX, y: posY}, function () {
            self.canvas.onclick = undefined
        });
    }
}