var grid = require('../')(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        (function (x, y) {
            var tile = grid.createTile(x, y);
            tile.data('x', x);
            tile.data('y', y);
            tile.data('pt', grid.toWorld(x, y));
            
            tile.attr('fill', 'rgba(210,210,210,1.0)');
            tile.attr('stroke-width', '1');
            tile.attr('stroke', 'rgb(255,255,200)');
        })(x, y);
    }
}

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});

grid.on('mouseover', function (tile, x, y) {
    tile.toFront();
    tile.attr('fill', 'rgba(255,127,127,0.8)');
});

grid.on('mouseout', function (tile) {
    tile.toBack();
    tile.attr('fill', 'rgba(210,210,210,1.0)');
});

grid.on('mousedown', function (tile, x, y) {
    if (grid.itemAt(x, y)) {
        grid.removeItem(x, y);
    }
    else grid.createItem('rack_0.png', x, y);
});
