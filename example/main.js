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

grid.on('keydown', function (ev) {
    if (String.fromCharCode(ev.keyCode) === 'W') {
        grid.setMode({
            tile : 'point',
            point : 'tile'
        }[grid.mode] || 'tile');
    }
});

grid.on('mouseover', function (t, x, y) {
    t.toFront();
    if (t.type === 'tile') {
        t.attr('fill', 'rgba(255,127,127,0.8)');
    }
    else if (t.type === 'point' && !t.data('active')) {
        t.attr('fill', 'rgba(255,0,0,1)');
    }
});

grid.on('mouseout', function (t) {
    if (t.type === 'tile') {
        t.toBack();
        t.attr('fill', 'rgba(210,210,210,1.0)');
    }
    else if (t.type === 'point' && !t.data('active')) {
        t.toBack();
        t.attr('fill', 'transparent');
    }
});

grid.on('mousedown', function (t, x, y) {
    if (t.type === 'tile') {
        if (grid.itemAt(x, y)) {
            grid.removeItem(x, y);
        }
        else {
            var u = 'http://substack.net/projects/datacenter/rack_0.png';
            grid.createItem(u, x, y);
        }
    }
    else if (t.type === 'point') {
        if (t.data('active')) {
            t.attr('fill', 'transparent');
            t.data('active', false);
        }
        else {
            t.attr('fill', 'rgb(0,255,255,1)');
            t.data('active', true);
        }
    }
});
