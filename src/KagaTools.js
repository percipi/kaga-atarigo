KagaTools = {
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
}