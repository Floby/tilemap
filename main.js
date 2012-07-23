var raphael = require('raphael-browserify');
var div = document.createElement('div');
var grid = raphael(div, 1000, 800);

function createTile (tx, ty) {
    var pt = fromTile(tx, ty);
    var x = pt[0], y = pt[1];
    
    var points = [
        [ x - 0.5, y ],
        [ x, y - 0.5 ],
        [ x + 0.5, y ],
        [ x, y + 0.5 ],
    ];
    var tile = grid.path(polygon(points.map(toWorld)));
    tile.attr('stroke-width', '3');
    tile.attr('fill', 'rgba(255,127,127,0.5)');
    tile.attr('stroke', 'rgba(127,0,127,0.5)');
    return tile;
}

function fromTile (x, y) {
    return [ x / 2 + y / 2, -x / 2 + y / 2 ];
}

function toWorld (pt) {
    var x = pt[0] + 5;
    var y = pt[1] + 5;
    return [ x * 100, y * 50 ];
}

function polygon (points) {
    var xs = points.map(function (p) { return p.join(',') });
    console.log('M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z');
    return 'M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z';
}

var t0 = createTile(0,0);
t0.attr('fill', 'rgba(127,255,127,0.5)');
t0.attr('stroke', 'rgba(0,127,127,0.5)');

var t1 = createTile(0,1);
var t2 = createTile(1,0);

var t3 = createTile(1,1);
t3.attr('fill', 'rgba(0,0,127,0.5)');
t3.attr('stroke', 'rgba(0,127,127,0.5)');

document.body.appendChild(div);
