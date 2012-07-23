var raphael = require('raphael-browserify');

module.exports = function (width, height) {
    return new TileMap(width, height);
};

function TileMap (width, height) {
    this.element = document.createElement('div');
    this.paper = raphael(this.element, width, height);
}

TileMap.prototype.resize = function (width, height) {
    this.paper.setSize(width, height);
}

TileMap.prototype.createTile = function (tx, ty) {
    var pt = fromTile(tx, ty);
    var x = pt[0], y = pt[1];
    
    var points = [
        [ x - 0.5, y ],
        [ x, y - 0.5 ],
        [ x + 0.5, y ],
        [ x, y + 0.5 ],
    ];
    var tile = this.paper.path(polygon(points.map(toWorld)));
    tile.attr('stroke-width', '1');
    tile.attr('fill', 'rgba(0,0,127,0.5)');
    tile.attr('stroke', 'rgba(0,0,64,0.5)');
    return tile;
}

function fromTile (x, y) {
    return [ x / 2 + y / 2, -x / 2 + y / 2 ];
}

function toWorld (pt) {
    var x = pt[0] + 6;
    var y = pt[1] + 6;
    return [ x * 100, y * 50 ];
}

function polygon (points) {
    var xs = points.map(function (p) { return p.join(',') });
    return 'M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z';
}

TileMap.prototype.appendTo = function (target) {
    target.appendChild(this.element);
};
