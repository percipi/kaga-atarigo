KagaPlayer = function (type, mediator) {
    this.type = type;
    this.mediator = mediator;
}

KagaPlayer.prototype.makeMove = function (callback, goban, color) {
    if (this.type === 0) {
        //var empty = goban.getEmptyMoku(),
        this.mediator.kL.startTime();
        var analyzer = new KagaAnalyzer(this.mediator);
        analyzer.init(goban.valueBoard.length);
        this.mediator.kL.logTime("Init analyzer: ");
        this.mediator.kL.startTime();
        var empty = analyzer.getSafeEmptyMokuA(goban.valueBoard, color);
        this.mediator.kL.logTime("first safe empty: ");
        var len = empty.length,
            moku = {},
            results = [],
            sim;
        this.mediator.kL.log("LEN ", len);
        for (var i = 0; i < len; i++) {
            moku = empty[i];
            //kombinuj
            sim = new KagaGameSimulation(goban, this.mediator);
            //kL.startTime();
            results[i] = sim.checkMove(color, moku);
            //kL.logTime("Time: ");
            //kL.log(results[i]);
        }
        var bestArray = [], best = 0;
        for (var i = 0; i < results.length; i++) {
            if (results[i]) {
                if (best < results[i]) best = results[i];
            }
        }
        this.mediator.kL.log("Best: " + best);
        for (var i = 0; i < results.length; i++) {
            if (results[i] === best) bestArray.push(empty[i]);
        }
        var breaker = 0;
        var lenBest = bestArray.length;
        while (breaker < 100) {
            var m = Math.floor(Math.random() * lenBest),
                moku = bestArray[m];
            //kL.log("random: ", m);
            if (!goban.isSuicide(moku.x, moku.y, color)) break;
        }

        //var breaker = 0;
        //while (breaker<100){
        //	var m = Math.floor(Math.random()*len),
        //	moku = empty[m];
        //	kL.log("random: ", m);
        //	if (!goban.isSuicide(moku.x,moku.y,color)) break;
        //}
        callback(moku);
    }
    else {
        this.mediator.listenOnClick(function (moku, cb) {
            callback(moku, cb);
        });
    }
}

KagaGameSimulation = function (goban, mediator) {
    this.goban = new SaiBoard();
    this.mediator = mediator;
    this.goban.setPosition(goban.boardState);
}

KagaGameSimulation.prototype.checkMove = function (color, move) {
    if (this.goban.putStone(move.x, move.y, color) === 1) {
        return 2
    }
    else {
        var wins = 0;
        for (var x = 0; x < 2; x++) {
            var simGoban = new SaiBoard();
            simGoban.setPosition(this.goban.boardState);
            this.mediator.gameDrawer.drawGame(simGoban.boardState, 1);
            var color2 = this.goban.getOppColor(color);
            var bezp = 0;
            //var empty = this.mediator.analyzer.getSafeEmptyMoku(simGoban.boardState, color);
            //var empty = this.mediator.analyzer.getSafeEmptyMoku(simGoban.boardState, color2);
            do {
                //if (this.mediator.analyzer.findGroupInAtari(simGoban.boardState, this.goban.getOppColor(color2))){
                //break;
                //};
                this.mediator.kL.startTime();
                var empty = this.mediator.analyzer.getSafeEmptyMoku(simGoban.boardState, color2);
                this.mediator.kL.logTime("first safe empty");
                var r = this.rand(empty.length)
                var newMove = empty[r];
                var v = simGoban.putStoneOnEmptyForSim(newMove.x, newMove.y, color2);
                this.mediator.gameDrawer.drawGame(simGoban.boardState, 1);
                if ((v !== -1) && (v != 1)) {
                    //empty.splice(r,1);
                    color2 = this.goban.getOppColor(color2)
                }
                ;
                bezp++;
            } while ((v !== 1) && (bezp < 30));
            if (color2 === color) {
                wins++;
            }
            else if (bezp === 0) {
                return 0;
            }
        }
    }
    return wins / 2;
}

KagaGameSimulation.prototype.rand = function (x) {
    return Math.floor(Math.random() * (x));
}