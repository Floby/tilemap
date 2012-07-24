var tilemap = require('../');
var grid = tilemap(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        (function (x, y) {
            var tile = grid.createTile(x, y);
            tile.element.attr('fill', 'rgba(210,210,210,1.0)');
            tile.element.attr('stroke-width', '1');
            tile.element.attr('stroke', 'rgb(255,255,200)');
        })(x, y);
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

grid.on('mouseover', function (t) {
    t.element.toFront();
    if (t.type === 'tile') {
        t.element.attr('fill', 'rgba(255,127,127,0.8)');
    }
    else if (t.type === 'point' && !t.active) {
        t.element.attr('fill', 'rgba(255,0,0,1)');
    }
});

grid.on('mouseout', function (t) {
    if (t.type === 'tile') {
        t.element.toBack();
        t.element.attr('fill', 'rgba(210,210,210,1.0)');
    }
    else if (t.type === 'point' && !t.active) {
        t.element.toBack();
        t.element.attr('fill', 'transparent');
    }
});

grid.on('mousedown', function (t) {
    if (t.type === 'tile') {
        if (grid.itemAt(t.x, t.y)) {
            grid.removeItem(t.x, t.y);
        }
        else {
            var u = 'http://substack.net/projects/datacenter/rack_0.png';
            grid.createItem(u, t.x, t.y);
        }
    }
    else if (t.type === 'point') {
        if (t.active) {
            t.element.attr('fill', 'transparent');
            t.active = false;
        }
        else {
            t.element.attr('fill', 'rgb(0,255,255,1)');
            t.active = true;
        }
    }
});
