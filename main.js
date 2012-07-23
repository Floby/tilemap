var grid = require('./')(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

setInterval(function () {
    var x = Math.floor(Math.random() * 40) - 20;
    var y = Math.floor(Math.random() * 40) - 20;
    var t = grid.createTile(x, y);
    
    setTimeout(function () {
        t.remove();
    }, 5000);
}, 50);

window.addEventListener('keydown', function (ev) {
    var key = ev.keyIdentifier.toLowerCase();
    var dz = {
        187 : 1 / 0.9,
        189 : 0.9,
    }[ev.keyCode];
    if (dz) return grid.zoom(grid.zoomLevel * dz);
    
    var dxy = {
        down : [ 0, -1 ],
        up : [ 0, +1 ],
        left : [ -1, 0 ],
        right : [ +1, 0 ]
    }[key];
    
    if (dxy) {
        ev.preventDefault();
        grid.pan(dxy[0], dxy[1]);
    }
});

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});
