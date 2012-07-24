var tilemap = require('../');
var grid = tilemap(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        var tile = grid.createTile(x, y);
        tile.attr('fill', 'rgba(210,210,210,1.0)');
        tile.attr('stroke-width', '1');
        tile.attr('stroke', 'rgb(255,255,200)');
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
    else grid.createItem(
        'http://substack.net/projects/datacenter/rack_0.png',
        x, y
    );
});
