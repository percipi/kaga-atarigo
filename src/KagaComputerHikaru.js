KagaComputerHikaru = function (mediator) {
    this.mediator = mediator;
}

timers = {};

KagaComputerHikaru.prototype.makeMove = function (callback, goban, color) {
    //console.log("KagaComputerHikaru.makeMove()");
    timers.makeMove = new Date();
    timers.simBeforeWhile = 0;
    timers.simWhile = 0;
    timers.checkBeforeSim = 0;
    timers.newSaiBoard = 0;
    timers.copyBoard = 0;
    var empty, //creates array of empty places on goban
        len,
        moku = {},
        results = [],
        sim, board;
    board = goban.cloneBoard(); //sets state (situation on board) for private board
    empty = board.getEmptyMoku();
    len = empty.length;
    sim = new KagaMoveAnalyzer(board, this.mediator);
    ////console.log('Time before checkMove loop: ', new Date() - time);
    //make simulation for each empty place on board
    for (var i = 0; i < len; i++) {
        moku = empty[i];
        if (!board.isSuicide(moku.x, moku.y, color)) {
            //kombinuj
            //kL.startTime();
            results[i] = sim.checkMove(color, moku);
            //kL.logTime("Time: ");
            //kL.log(results[i]);
        } else results[i] = -1;
    }
    ////console.log('Time after checkMove loop: ', new Date() - time);
    var bestArray = [], best = 0;
    for (var i = 0; i < results.length; i++) {
        if (results[i]) {
            if (best < results[i]) best = results[i];
        }
    }
    for (var i = 0; i < results.length; i++) {
        if (results[i] === best) bestArray.push(empty[i]);
    }
    var breaker = 0;
    var lenBest = bestArray.length;
    while (breaker < 100) {
        var m = Math.floor(Math.random() * lenBest),
            moku = bestArray[m];
        //kL.log("random: ", m);
        breaker++;
        if (!board.isSuicide(moku.x, moku.y, color)) break;
    }

    //var breaker = 0;
    //while (breaker<100){
    //	var m = Math.floor(Math.random()*len),
    //	moku = empty[m];
    //	kL.log("random: ", m);
    //	if (!goban.isSuicide(moku.x,moku.y,color)) break;
    //}
    ////console.log('KagaComputerHikaru.makeMove time: ', kaga.logger.logTime());
    //console.log('new SaiBoard() time: ', timers.newSaiBoard);
    //console.log('copyBoard() time: ', timers.copyBoard);
    //console.log('checkMove before sim time: ', timers.checkBeforeSim);
    //console.log('sim before while time: ', timers.simBeforeWhile);
    //console.log('sim while time: ', timers.simWhile);  
    //console.log('makeMove Time on end: ', new Date() - timers.makeMove);
    //console.log('Wins: ', best);
    callback(moku);
}