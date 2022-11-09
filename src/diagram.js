//console.log("Starting diagram.js script...");
(function() {
	//console.log("Declaring Diagram function...");
	Diagram = function(){}
	Diagram.prototype.createDiagram = function (id, positions) {
		var defaults = {
		background:"#C49837",
		borderWidth:20,
		stoneSize:30,
		boardSize:9,
		lineWidth: 1
		},
		cfg = defaults, HEIGHT, WIDTH;
		cfg.boardSize = positions.length;
		HEIGHT = cfg.borderWidth*2 + cfg.boardSize*cfg.lineWidth + (cfg.boardSize-1)*cfg.stoneSize;
		WIDTH = HEIGHT;
		container = document.getElementById(id);
		//console.log(HEIGHT);
		//console.log(WIDTH);
		container.width = WIDTH;
		container.height = HEIGHT;
		var ctx = container.getContext('2d');
		var diagramDrawer = new DiagramDrawer(ctx,{boardSize:cfg.boardSize});
		diagramDrawer.drawDiagram(positions);		
	}
	
	DiagramDrawer = function (ctx,cfg) {
		var defaults = {
			background:"#C49837",
			borderWidth:20,
			stoneSize:30,
			boardSize:9,
			lineWidth: 1
			};
		this.cfg = simpleExtend(defaults, cfg);
		this.width = this.height = this.cfg.borderWidth*2 + this.cfg.boardSize*this.cfg.lineWidth + (this.cfg.boardSize-1)*this.cfg.stoneSize;
		this.ctx = ctx;
	}
	
	DiagramDrawer.prototype.drawDiagram = function(positions) {
		this.drawBoard();
		for (var y=0; y<positions.length; y++){
			for (var x=0; x<positions[y].length; x++){
				if (positions[y][x] !== 0){
					this.drawStone(x,y,positions[y][x]);
				}
			}
		}		
	},
	
	DiagramDrawer.prototype.drawBoard = function(){
		this.ctx.fillStyle = this.cfg.background;
		//console.log("Drawing board...");
		this.ctx.fillRect(0,0,this.width, this.height);
		this.ctx.fillStyle = "#000000";
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;
		var linePosY;
		for(i=0; i<this.cfg.boardSize;i++){
			linePosY = this.cfg.borderWidth+i*(this.cfg.stoneSize+this.cfg.lineWidth);
			this.ctx.moveTo(this.cfg.borderWidth, linePosY);
			this.ctx.lineTo(this.width - this.cfg.borderWidth, linePosY);
		}
		var linePosX;
		for(i=0; i<this.cfg.boardSize;i++){
			linePosX = this.cfg.borderWidth+i*(this.cfg.stoneSize+this.cfg.lineWidth);
			this.ctx.moveTo(linePosX, this.cfg.borderWidth);
			this.ctx.lineTo(linePosX, this.width - this.cfg.borderWidth);
		}
		this.ctx.stroke();
	}
	
	DiagramDrawer.prototype.drawStone = function(x,y,color) {
		var colorValue = "#ffffff";
		if (color === 1) {
			colorValue = "#000000";
		}
		this.ctx.fillStyle = colorValue;
		this.ctx.beginPath();
		this.ctx.arc(this.pos2pixel(x),this.pos2pixel(y),this.cfg.stoneSize/2,0,2*Math.PI);
		this.ctx.fill();
	}
	
	DiagramDrawer.prototype.pos2pixel = function(x) {
		return x*(this.cfg.stoneSize+1)+this.cfg.borderWidth;
		//return 100;
	}
	
	var simpleClone = function(a){
		var c = {};
		for (var p in a){
			c[p] = a[p];
		}
		return c;
	}
	
	var simpleExtend = function(a,b) {
		var c = simpleClone(a);
		for (var p in b){
			c[p] = b[p];
		}
		return c;
	}
	
	window.diagram = new Diagram();
})();