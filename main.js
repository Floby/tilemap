var grid = require('./')(1100, 800);
grid.appendTo(document.body);

setInterval(function () {
    var x = Math.floor(Math.random() * 10) - 5;
    var y = Math.floor(Math.random() * 10) - 5;
    var t = grid.createTile(x, y);
    
    setTimeout(function () {
        t.remove();
    }, 5000);
}, 50);
