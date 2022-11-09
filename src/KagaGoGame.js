KagaGoGame = function (mediator, endOfGameCallback) {
    var self = this;
    var nextMove = function (moku, callback) {
        var _moveResult = self.board.putStone(moku.x, moku.y, self.playerToMove);
        if (_moveResult !== -1) {
            if (callback) callback();
            self.mediator.gameDrawer.drawGame(self.board.valueBoard);
            if (_moveResult === 1) {
                self.mediator.gameDrawer.drawGame(self.board.valueBoard);
                self.endCallback(self.playerToMove);
            }
            else {
                self.playerToMove = self.getOppColor(self.playerToMove);
                //self.player[self.playerToMove].makeMove(function(m,c){setTimeout(function(){nextMove(m,c)},1000)}, self.board, self.playerToMove);
                self.player[self.playerToMove].makeMove(nextMove, self.board, self.playerToMove);
            }
        }
        ;
        return -1;
    }
    this.board = new SaiBoard();
    this.board.init();
    this.mediator = mediator;
    this.mediator.gameDrawer.drawGame(this.board.valueBoard);
    this.playerToMove = 1;
    this.endCallback = endOfGameCallback;
    this.player = [];
    this.player[1] = new KagaPlayer(1, mediator);
    this.player[2] = new KagaComputerHikaru(mediator);
    //kL.startTime();
    this.player[1].makeMove(nextMove, this.board, this.playerToMove);
    //if (this.makeMove(this.player2.getMove(this.board, this.playerToMove)) === 1) break;
    //kL.logTime("Move time: ");
    //alert("następny ruch");


    //this.mediator.listenOnClick();

}
KagaGoGame.prototype.getOppColor = function (color) {
    return (color === 1) ? 2 : 1;
}