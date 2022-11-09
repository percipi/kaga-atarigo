/**
 * KagaMoveAnalyzer class provides interface for analyze value of move (from 0 to 1)
 * User: fan
 * Date: 29.09.13
 * Time: 18:28
 *
 * Uses board class which implements methods:
 * clone() - create new instance of board object
 *
 *
 *
 */

var showSim = false;

KagaMoveAnalyzer = function (goban, mediator) {
    this.NUMBER_OF_SIMS = 200;
    this.SIM_DEEP = 30; //min 4 to make sense
    this.goban = goban.cloneBoard();
    ////console.log(this.goban.toString());
    this.mediator = mediator;
}

KagaMoveAnalyzer.prototype.checkMove = function (color, move) {
    ////console.log("KagaMoveAnalyzer.checkMove move: ", move.x, ',',move.y);
    var checkBeforeSimTime, 
        oppColor, 
        currentColorToMove, 
        bezp,
        time,
        allSimsBeforeWhileTime=0, 
        allSimsWhileTime = 0,
        board,
        empty,
        ps;
    checkBeforeSimTime = new Date();
    time = new Date(); 
    board = this.goban.cloneBoard();
    oppColor = board.getOppColor(color);
    ps = board.putStone(move.x, move.y, color);
    if (showSim) this.mediator.gameDrawerSim.drawGame(board.valueBoard);
    ////console.log("Time after putStone (before sims): ", new Date() - time);
    timers.checkBeforeSim += new Date() - checkBeforeSimTime;
    if (ps === 1) { //move kills group - end of checking       
        //console.log('Found 100% move: ',move.x,move.y);
        return 1
    }
    else {
        var wins = 0, simGoban;
        simGoban = board.cloneBoard();
        for (var x = 0; x < this.NUMBER_OF_SIMS; x++) { //number of simulations
            var simBeforeWhileTime = new Date();
            ////console.log("Simulation no. ", x)
            simGoban.copyBoard(board);
            if (showSim) this.mediator.gameDrawerSim.drawGame(simGoban.valueBoard);
            //simulation starts with opponent move (human)
            currentColorToMove = oppColor;
            bezp = 0;
            ////console.log("Number of empty places: ", empty.length);
            //first goes computers opponent
            timers.simBeforeWhile += new Date() - simBeforeWhileTime;
            var simWhileTime = new Date();
            do {
                //if opponents group is in atari finish game with win for currentColorMove
                if (simGoban.findGroupInAtari(board.getOppColor(currentColorToMove))) {
                    ////console.log("findGroupInAtari: true");
                    ////console.log(simGoban);
                    ////console.log(newMove);
                    break; //current player wins!
                }
                var newMove, testMove, selectRandom = true;
                var grInAtari = simGoban.findGroupInAtari(currentColorToMove);
                if (grInAtari) {
                    //suicide!
                    testMove = simGoban.getGroupLiberty(grInAtari);
                    if (!simGoban.isSuicide(testMove.x, testMove.y, currentColorToMove)){
                        selectRandom = false;
                        newMove = testMove;
                    } 
                } 
                if (selectRandom)
                {
                    empty = simGoban.getEmptyMoku();
                    if (empty.length === 0) break;
                    var breaker = 0;
                    do {
                        var r = this.rand(empty.length);
                        newMove = empty[r];
                        empty.splice(r,1);
                        breaker++;
                        var isInAtari = simGoban.isInAtari(newMove.x, newMove.y, currentColorToMove);
                        var isSuicide = simGoban.isSuicide(newMove.x, newMove.y, currentColorToMove);
                    } while ((isInAtari || isSuicide) && breaker < 1000 && empty.length > 0);
                    if (breaker === 1000 || empty.length === 0) { //if cant find proper move should loose
                        currentColorToMove = board.getOppColor(currentColorToMove)
                        ////console.log('!!!!!!!!!!!!!!!!');
                        break;
                        
                    };
                }
                
                ////console.log("KMA.checkMove sim: ", newMove.x, ',',newMove.y,',',currentColorToMove);;
                //sprawdzic zakazane ruchy! wprowadzic legal do moku? (chyba nie)
                simGoban.putStoneForSim(newMove.x, newMove.y, currentColorToMove);
                if (showSim) this.mediator.gameDrawerSim.drawGame(simGoban.valueBoard);
                currentColorToMove = board.getOppColor(currentColorToMove);
                bezp++;
            } while (bezp < this.SIM_DEEP); //number of moves in simulation
            timers.simWhile += new Date() - simWhileTime;
            //if (x == 50) //console.log("Bezp: ", bezp);
            ////console.log('moves in sim: ', bezp)
            ////console.log('whole simulation time: ', new Date() - simTime);
            if ((currentColorToMove === color) && (bezp < this.SIM_DEEP)) {// if bezp == max than it was draw 
                //(brac pod uwage liczbe remisow?)
                wins++;
            }
            else if (bezp === 0) { //check move in atari!
                //console.log('Wins on ' + this.NUMBER_OF_SIMS + ':', wins);
                return 0;
            }
        }
    }
    //console.log('Wins on ' + this.NUMBER_OF_SIMS + ':', wins);
    ////console.log('All sims before while time: ', allSimsBeforeWhileTime);
    ////console.log('All sims while time: ', allSimsWhileTime);
    ////console.log('checkMove time: ', new Date() - time);
    return wins / this.NUMBER_OF_SIMS;
}

KagaMoveAnalyzer.prototype.rand = function (x) {
    return Math.floor(Math.random() * (x));
}