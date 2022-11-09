KagaLogger = function () {
    this.startPoint = 0;
};

KagaLogger.prototype.log = function () {
    var args = Array.prototype.slice.call(arguments);
    ////console.log.apply(console, args);
    ////console.log(arguments);
    document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + "," + args[0];
};

KagaLogger.prototype.logn = function () {
    var args = Array.prototype.slice.call(arguments);
    ////console.log.apply(console, args);
    ////console.log(arguments);
    document.getElementById("log").innerHTML = document.getElementById("log").innerHTML + "<br />" + args[0];
};

KagaLogger.prototype.startTime = function () {
    this.startPoint = new Date();
};

KagaLogger.prototype.logTime = function () {
    this.logn(new Date() - this.startPoint);
};


window.kaga = window.kaga || {};
kaga.logger = {
    startTime: function () {
        this.startPoint = new Date();
    },
    logTime: function () {
        return (new Date() - this.startPoint);  
    }
}
