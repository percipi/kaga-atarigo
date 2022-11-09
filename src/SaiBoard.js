var SaiBoard = function (board) {
    var i,j, newSaiBoardTime, moku;
    this.size = 5;   
    if (board){
        this.valueBoard = [];
        for (i=0; i<this.size; i++){
            this.valueBoard[i] = [];
            for (j=0; j<this.size; j++){
                this.valueBoard[i][j] = board[i][j];
            } 
        } 
    }
    else {
        this.valueBoard = [];
        for (i=0; i<this.size; i++){
            this.valueBoard[i] = [];
            for (j=0; j<this.size; j++){
                this.valueBoard[i][j] = 0;
            } 
        } 
    }
    
    this.EMPTY = 0;
    this.BLACK_STONE = 1;
    this.WHITE_STONE = 2;
    
    this.board = [];
    this.fields = [];
        for (var i=0; i<3; i++){
        this.fields[i] = [];    
    }
    
    for (var y=0; y<this.size; y++){
        this.board[y] = [];
        for (var x=0; x<this.size; x++){
            var field = new this.Moku(x,y,this.valueBoard[y][x]);
            this.board[y][x] = field;
            this.fields[this.valueBoard[y][x]].push(field);
        }
    }
    newSaiBoardTime = new Date();
    //add neighbours info for each field
    
    for (var y=0; y<this.size; y++){
        for (var x=0; x<this.size; x++){
            moku = this.board[y][x];
            moku.neighbors = this.nextToMoku(moku);
        }
    }
    timers.newSaiBoard += new Date() - newSaiBoardTime;
}
/*Public interface */

SaiBoard.prototype.getCapturedGroups = function (x,y,color) {
    var oppColor = this.getOppColor(color),
    moku = this.board[y][x];
    if (this.groups[oppColor].length === 0) {
        return [];
    }
    else {
        var capturedGroups = [];
        //kazde empty pole musi miec liste grup sasiadujacych
        for (var i=0; i<moku.neighbors.length; i++){
            if (moku.neighbors[i].notEmpty() && moku.neighbors[i].val === oppColor 
                && moku.neighbors[i].group.liberties === 1) {
                capturedGroups.push(moku.neighbors[i].group);
            }
        }
    return capturedGroups;
    }
}

SaiBoard.prototype.copyBoard = function (boardArg) {
    var moku, mokuArg, copyBoardTime = new Date();
    this.fields = [];
        for (var i=0; i<3; i++){
        this.fields[i] = [];    
    }
    for (i=0; i<this.size; i++){
        for (j=0; j<this.size; j++){
            this.valueBoard[i][j] = boardArg.valueBoard[i][j];
            moku = this.board[i][j];
            mokuArg = boardArg.board[i][j];
            moku.x = mokuArg.x;
            moku.y = mokuArg.y;
            moku.val = mokuArg.val;
            this.fields[moku.val].push(moku);
        } 
    }

    this.groups = [];
    for (var t=1; t<=2;t++){
        this.groups[t] = [];
        for (var i = 0; i<boardArg.groups[t].length; i++){
            var gr = boardArg.groups[t][i];
            new_gr = new this.Group([],gr.liberties);
            for (var j = 0; j< gr.stones.length; j++){
                //make references to stones from board in groups
                new_gr.stones[j] = this.board[gr.stones[j].y][gr.stones[j].x];
                //reference to group in every stone
                this.board[gr.stones[j].y][gr.stones[j].x].group = new_gr;
                }
            this.groups[t].push(new_gr);
        }    
    }
    timers.copyBoard += new Date() - copyBoardTime;
}

/*Private interface*/

SaiBoard.prototype.init = function () {
    
    this.groups = [];
    //create list of groups
    this.groups[this.BLACK_STONE] = this.getGroupsForStones(this.fields[this.BLACK_STONE], this.BLACK_STONE);
    this.groups[this.WHITE_STONE] = this.getGroupsForStones(this.fields[this.WHITE_STONE], this.WHITE_STONE);
}

//color of stone

//returns array of groups which contains stones passed as argument
SaiBoard.prototype.getGroupsForStones = function (stones, color) {
    var stones = stones, isC = false;
    var _alreadyInGroup = [];
    var groups = [];
    for (var i = 0; i < stones.length; i++) {
        if (!this.isMokuInArray(stones[i], _alreadyInGroup)) {
            var group = this.getGroup(stones[i]);
            //create reference from stone to his group
            for (var j=0; j<group.stones.length; j++) {
                group.stones[j].group = group;    
            }
            _alreadyInGroup = _alreadyInGroup.concat(group.stones);
            groups.push(group);
        }
    }
    return groups;
}


SaiBoard.prototype.getAllStones = function (color) {
    var res = [];
    for (var y = 0; y < this.length; y++) {
        for (var x = 0; x < this[y].length; x++) {
            if (this[y][x] === color) {
                res.push(new this.Moku(x, y, color));
            }
        }
    }
    return res;
}

SaiBoard.prototype.cloneBoard = function () {
    var clone = new SaiBoard(this.valueBoard);
    clone.groups = [];
    for (var t=1; t<=2;t++){
        clone.groups[t] = [];
        for (var i = 0; i<this.groups[t].length; i++){
            var gr = this.groups[t][i];
            new_gr = new this.Group([],gr.liberties);
            for (var j = 0; j< gr.stones.length; j++){
                //make references to stones from board in groups
                new_gr.stones[j] = clone.board[gr.stones[j].y][gr.stones[j].x];
                //reference to group in every stone
                clone.board[gr.stones[j].y][gr.stones[j].x].group = new_gr;
                }
            clone.groups[t].push(new_gr);
        }    
    }
    
    return clone;
}

// SaiBoard.prototype.getState = function () {
//     return {board: this.boardState, fields: this.fields, groups: this.groups} ;
// }

// SaiBoard.prototype.setState = function (state) {
//     for (var i = 0; i < state.board.length; i++) {
//             this.board[i] = state.board[i].slice();
//     }
//     this.fields[this.BLACK_STONE] = state.fields[this.BLACK_STONE].slice();
//     this.fields[this.WHITE_STONE] = state.fields[this.WHITE_STONE].slice();
//     for (var i = 0; i < state.groups[this.BLACK_STONE].length; i++) {
//             var groupToCopy = state.groups[this.BLACK_STONE][i];
//             this.groups[this.BLACK_STONE][i] = new this.Group(groupToCopy.stones.slice(), groupToCopy.liberties);
//     }
//     for (var i = 0; i < state.groups[this.WHITE_STONE].length; i++) {
//             var groupToCopy = state.groups[this.WHITE_STONE][i];
//             this.groups[this.WHITE_STONE][i] = new this.Group(groupToCopy.stones.slice(), groupToCopy.liberties);
//     }   
// }

SaiBoard.prototype.findGroupInAtari = function (color) {
    var i, g = this.groups[color];
    for (i=0; i<g.length; i++) {
        if (g[i].liberties == 1) return g[i];
    }
    return false;
}

//returns 1 if group removed, 0 if no, -1 if place not
SaiBoard.prototype.putStone = function (x, y, color) {
    var moku;
    if (this.isEmpty(x, y)) {
        var captured = this.getCapturedGroups(x,y,color); //gets array of captured groups
        //if it is legal move
        if (captured.length > 0) {
            this.valueBoard[y][x] = color;
            for (var i=0; i<captured.length; i++){
                for (var j=0; j<captured[i].stones.length; j++){
                    this.valueBoard[captured[i].stones[j].y][captured[i].stones[j].x] = 3;
                }
            }
            return 1;
        }
        if ((this.emptyNextTo({x: x, y: y}).length !== 0) || !this.isCreatingGroupWithNoLiberties(x, y, color)) {
            //var ifRemoved = 0;
            // for (var i = 0; i < captured.length; i++) {
            //     ifRemoved = this.removeGroup(captured[i]);
            // }

            //actualize board info
            this.valueBoard[y][x] = color;
            moku = this.board[y][x]; 
            //remove empty moku from fields
            var fe = this.fields[this.EMPTY];
            for (var i=0; i<fe.length;i++){
                if (fe[i] === moku){
                    fe.splice(i,1);
                    break;
                };    
            }
            //add moku color fields
            this.fields[color].push(moku);
            moku.val = color;
            //actualize groups ONLY IF nothing was captured
            //first actualize opponents groups
            var adjGr = moku.getAdjGroups(this.getOppColor(color));
            for (var i=0; i<adjGr.length; i++) {
                adjGr[i].liberties--;
            }
            //now own groups
            adjGr = moku.getAdjGroups(color);
            if (adjGr.length == 1){
                var gr = adjGr[0];
                gr.stones.push(moku);
                moku.group = gr;
                gr.liberties = this.getNoGroupLiberties(gr); 
            }
            if (adjGr.length > 1){
                var gr = new this.Group([],0);
                //need to mergre all adj groups into one
                for (var i=0; i< adjGr.length; i++){
                    gr.stones = gr.stones.concat(adjGr[i].stones);
                    this.groups[color].splice(this.groups[color].indexOf(adjGr[i]),1);
                    //this.tools.removeObjectFromArray(this.groups[color],adjGr[i]);
                }
                gr.stones.push(moku);
                this.groups[color].push(gr);
                for (var j = 0; j<gr.stones.length; j++){
                    gr.stones[j].group = gr;
                }
                gr.liberties = this.getNoGroupLiberties(gr);
            }
            if (adjGr.length == 0){
                var gr;
                gr = new this.Group([moku],this.emptyNextTo(moku).length);
                moku.group = gr;
                this.groups[color].push(gr);
            }
            return 0;
        }
        
    }
    return -1;
}

//does not need to check few things
SaiBoard.prototype.putStoneForSim = function (x, y, color) {
    var moku;
    //if ((this.emptyNextTo({x: x, y: y}).length !== 0) || !this.isCreatingGroupWithNoLiberties(x, y, color)) {
    //actualize board info
    this.valueBoard[y][x] = color;
    moku = this.board[y][x]; 
    //remove empty moku from fields
    var fe = this.fields[this.EMPTY];
    for (var i=0; i<fe.length;i++){
        if (fe[i] === moku){
            fe.splice(i,1);
            break;
        };    
    }
    //add moku color fields
    this.fields[color].push(moku);
    moku.val = color;
    //actualize groups ONLY IF nothing was captured
    //first actualize opponents groups
    var adjGr = moku.getAdjGroups(this.getOppColor(color));
    for (var i=0; i<adjGr.length; i++) {
        adjGr[i].liberties--;
    }
    //now own groups
    adjGr = moku.getAdjGroups(color);
    if (adjGr.length == 1){
        var gr = adjGr[0];
        gr.stones.push(moku);
        moku.group = gr;
        gr.liberties = this.getNoGroupLiberties(gr); 
    }
    if (adjGr.length > 1){
        var gr = new this.Group([],0);
        //need to mergre all adj groups into one
        for (var i=0; i< adjGr.length; i++){
            gr.stones = gr.stones.concat(adjGr[i].stones);
            this.groups[color].splice(this.groups[color].indexOf(adjGr[i]),1);
        }
        gr.stones.push(moku);
        this.groups[color].push(gr);
        for (var j = 0; j<gr.stones.length; j++){
            gr.stones[j].group = gr;
        }
        gr.liberties = this.getNoGroupLiberties(gr);
    }
    if (adjGr.length == 0){
        var gr;
        gr = new this.Group([moku],this.emptyNextTo(moku).length);
        moku.group = gr;
        this.groups[color].push(gr);
    }
    return 0;
}



SaiBoard.prototype.putStoneOnEmptyForSim = function (x, y, color) {
    var captured = this.isCaptured(x, y, color);
    if (captured === 1) {
        this.boardState[y][x] = color;
        return 1;
    }
    if ((this.emptyNextTo({x: x, y: y}).length !== 0) || !this.isCreatingGroupWithNoLiberties(x, y, color)) {
        this.boardState[y][x] = color;
        return 0;
    }
    return -1;
}

SaiBoard.prototype.isCaptured = function (x, y, color) {
    var oppStones = this.oppStonesNextTo({x: x, y: y, val: color}), isC = false;
    if (oppStones === 0) return 0;
    var _alreadyInGroup = [];
    var capturedGroups = [];
    for (var i = 0; i < oppStones.length; i++) {
        if (!this.isMokuInArray(oppStones[i], _alreadyInGroup)) {
            if (this.emptyNextTo(oppStones[i]).length > 1) continue;
            var group = this.getGroup(oppStones[i]);
            _alreadyInGroup = _alreadyInGroup.concat(group);
            var groupLiberties = this.getNoGroupLiberties(group);
            if (groupLiberties === 1) {
                return 1
            }
        }
    }
    return 0;
}

SaiBoard.prototype.getEmptyMoku = function () {
    var fields = this.fields[this.EMPTY], copyFields = [], moku, mokuArg; 
    for (i=0; i<fields.length; i++){        
            mokuArg = fields[i];           
            moku = {};
            moku.x = mokuArg.x;
            moku.y = mokuArg.y;
            moku.val = mokuArg.val;
            copyFields.push(moku);
    } 
    return copyFields;
}

SaiBoard.prototype.oneOrMoreLiberties = function (group) {
    var lib = 0, res = [];
    for (var i = 0; i < group.length; i++) {
        lib = this.emptyNextTo(group[i]);
        if (lib > 1) return 2;
        for (var j = 0; j < lib.length; j++) {
            if (!this.isMokuInArray(lib[j], res)) {
                //TODO bardzo nieladnie ale chce sprawdzic czy dziala
                //zamiast tego stworzyc obiekt boardAnalyzer
                if (!this.isMokuInArray(lib[j], group)) {
                    if (res.length > 0) return 2;
                    res.push(lib[j]);
                }

            }
        }
    }
    return res.length;
}

SaiBoard.prototype.isCreatingGroupWithNoLiberties = function (x, y, color) {
    var ownStones = this.ownStonesNextTo(x, y, color);
    //kL.log("isSuicide: ownStones: ", ownStones);
    if (ownStones.length !== 0) {
        var group = this.getGroup({x: x, y: y, val: color});
        //kL.log("isSuicide: Group: ", group);
        var lib = this.getNoGroupLiberties(group);
        //kL.log("isSuicide: Liberties: ", lib);
        if (lib === 0) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return true;
    }
}

SaiBoard.prototype.isSuicide = function (x, y, color) {
    if ((this.emptyNextTo({x: x, y: y}).length !== 0) || this.getCapturedGroups(x,y,color).length !== 0) {
        return false;
    }
    else {
        var ownStones = this.ownStonesNextTo(x,y,color);
        for (var i = 0; i<ownStones.length; i++){//uzyc getAdj groups!!
            if (ownStones[i].group.liberties > 1) return false; //TODO nie sprawdza czy grupy nie maja wspolnego oddechu
        }
    }
    return true;
}

SaiBoard.prototype.removeGroup = function (group) {
    for (var i = 0; i < group.length; i++) {
        this.boardState[group[i].y][group[i].x] = 0;
    }
    return (group.length > 0) ? 1 : 0;
}

SaiBoard.prototype.getNoGroupLiberties = function (group) {
    var lib = 0, res = [];
    for (var i = 0; i < group.stones.length; i++) {
        lib = this.emptyNextTo(group.stones[i]);
        for (var j = 0; j < lib.length; j++) {
            if (!this.isMokuInArray(lib[j], res)) {
                //TODO bardzo nieladnie ale chce sprawdzic czy dziala
                //zamiast tego stworzyc obiekt boardAnalyzer
                if (!this.isMokuInArray(lib[j], group.stones)) {
                    res.push(lib[j]);
                }

            }
        }
    }
    return res.length;
}


SaiBoard.prototype.getGroup = function (moku) {
    ////console.log("getGroup...");
    var _alreadyChecked = [], self = this,
        addNeighbours = function (moku, alreadyChecked) {
            ////console.log("addNeighbours... for stone:", moku);
            alreadyChecked.push(moku);
            var res = [moku];
            var n = self.ownStonesNextTo(moku.x,moku.y, moku.val);
            ////console.log("addNeighbours... ownStonesNextTo:", n);
            for (var i = 0; i < n.length; i++) {
                if (!self.isMokuInArray(n[i], alreadyChecked)) {
                    res = res.concat(addNeighbours(n[i], alreadyChecked));
                }
            }
            ////console.log("addNeighbours... result:", res);
            
            return res;
        };
    var group = addNeighbours(moku, _alreadyChecked);
    return new this.Group(group, this.getNoGroupLiberties({stones:group}));
}

SaiBoard.prototype.isMokuInArray = function (el, arr) {
    for (var i = 0; i < arr.length; i++) {
        if ((el.x === arr[i].x) && (el.y === arr[i].y)) {
            return true;
        }
    }
    return false;
}

SaiBoard.prototype.emptyNextTo = function (moku) {
    var neighbours = this.nextToMoku(moku),
        res = [];
    ////console.log("Neighbours length: ", neighbours.length);
    for (var i = 0; i < neighbours.length; i++) {
        ////console.log("Neighbours color: ", neighbours[i].val);
        ////console.log("Stones color: ", moku.val);
        if (neighbours[i].val === 0) {
            res.push(neighbours[i]);
        }
    }
    return res;
}

SaiBoard.prototype.ownStonesNextTo = function (x,y,color) {
    // var neighbours = this.nextToMoku(moku),
    //     oppStones = [];
    // ////console.log("Neighbours length: ", neighbours.length);
    // for (var i = 0; i < neighbours.length; i++) {
    //     ////console.log("Neighbours color: ", neighbours[i].val);
    //     ////console.log("Stones color: ", moku.val);
    //     if (neighbours[i].val === moku.val) {
    //         oppStones.push(neighbours[i]);
    //     }
    // }
    // return oppStones;
    var moku,n, r=[];
    moku = this.board[y][x];
    n = moku.neighbors;
    for (var i = 0; i< n.length; i++){
        if (color === n[i].val){
            r.push(n[i]);
        }
    }
    return r;
}

SaiBoard.prototype.oppStonesNextTo = function (moku) {
    var c = this.getOppColor(moku.val);
    var oppStones = [];
    var val = this.getValue(moku.x, moku.y - 1);
    if (val === c) {
        oppStones.push({x: moku.x, y: moku.y - 1, val: val});
    }
    val = this.getValue(moku.x + 1, moku.y);
    if (val === c) {
        oppStones.push({x: moku.x + 1, y: moku.y, val: val});
    }
    val = this.getValue(moku.x - 1, moku.y);
    if (val === c) {
        oppStones.push({x: moku.x - 1, y: moku.y, val: val});
    }
    val = this.getValue(moku.x, moku.y + 1);
    if (val === c) {
        oppStones.push({x: moku.x, y: moku.y + 1, val: val});
    }
    return oppStones;
}

SaiBoard.prototype.nextToMoku = function (moku) {
    var neig = [],x,y, val, board;
    x = moku.x;
    y = moku.y;
    board = this.board;
    val = this.getValue(x, y - 1);
    if (val !== -1) {
        neig.push(board[y-1][x]);
    }
    val = this.getValue(x + 1, y);
    if (val !== -1) {
        neig.push(board[y][x+1]);
    }
    val = this.getValue(x, y + 1);
    if (val !== -1) {
        neig.push(board[y+1][x]);
    }
    val = this.getValue(x - 1, y);
    if (val !== -1) {
        neig.push(board[y][x-1]);
    }
    return neig;
}

SaiBoard.prototype.isEmpty = function (x, y) {
    if (this.board[y][x].val === 0) {
        return true;
    }
    return false;
}

SaiBoard.prototype.getValue = function (x, y) {
    if ((x >= 0) && (y >= 0) && (x < this.size) && (y < this.size)) {
        return this.board[y][x].val;
    }
    return -1;
}

SaiBoard.prototype.getOppColor = function (color) {
    if (color === 1) {
        return 2
    }
    else if (color === 2) {
        return 1
    }
    return -1;
}

SaiBoard.prototype.toString = function () {
    var i, j, boardString = "";
    for (i=0; i<this.size; i++){
        boardString += this.boardState[i].toString() + "\n";
    }
    return boardString;
}

SaiBoard.prototype.isInAtari = function (x,y,color) {
    //doesn't check if kills group!
    var moku = this.board[y][x];
    if (this.emptyNextTo(moku).length > 1) return false;
    var adjGr = moku.getAdjGroups(color);
    /*for (var i=0; i<groups.length; i++){
        if (groups[i].liberties > 2) return false;
        if (groups[i].liberties > 1 && this.emptyNextTo(moku).length > 0) { //sprawdza czy nie zabiera ost oddechu nie sprawdza czy grupy nie maja wspolnego oddechu!
            return false; //optrzeba porzadnej analizy i testow
        }
    }*/
    if (adjGr.length > 0){
        //tymczasowe - poprawic!!
        moku.val = color;//!!!!
        var gr = new this.Group([],0);
        //need to mergre all adj groups into one
        for (var i=0; i< adjGr.length; i++){
            gr.stones = gr.stones.concat(adjGr[i].stones);
        }
        gr.stones.push(moku);
        var liberties = this.getNoGroupLiberties(gr);
        if (liberties > 1) {
            moku.val = 0;
            return false;
        }
        moku.val = 0;
    }
    return true;
}

SaiBoard.prototype.Moku = function (x, y, val) {
    this.x = x;
    this.y = y;
    this.val = val;
}

SaiBoard.prototype.Moku.prototype.notEmpty = function (){
    return (this.val !== 0);
}

SaiBoard.prototype.Moku.prototype.getAdjGroups = function (color) {
    var i, n = this.neighbors, groups = [];
    for (i=0; i<n.length; i++){
        if (n[i].val === color && groups.indexOf(n[i].group) === -1){
            groups.push(n[i].group);
        }
    }
    return groups;
}

SaiBoard.prototype.Group = function (stones, liberties) {
    this.stones = stones;
    this.liberties = liberties;
}

SaiBoard.prototype.getGroupLiberty = function (group) {
    var i, liberties = [], st, empty;
    st = group.stones;
    for (i=0; i<st.length; i++){
        empty = this.emptyNextTo(st[i]);                   
        if (empty.length > 0) return empty[0];
    }
}