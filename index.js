var raphael = require('raphael-browserify');

module.exports = function (width, height) {
    return new TileMap(width, height);
};

function TileMap (width, height) {
    this.element = document.createElement('div');
    this.paper = raphael(this.element, width, height);
    this.size = [ width, height ];
    this.center = [ 0, 0 ];
}

TileMap.prototype.resize = function (width, height) {
    this.size = [ width, height ];
    this.paper.setSize(width, height);
}

TileMap.prototype.createTile = function (x, y) {
    var self = this;
    var points = [
        [ x - 0.5, y + 0.5 ],
        [ x - 0.5, y - 0.5 ],
        [ x + 0.5, y - 0.5 ],
        [ x + 0.5, y + 0.5 ]
    ].map(function (pt) { return self.toWorld(pt) });
    
    var tile = this.paper.path(polygon(points));
    tile.attr('stroke-width', '1');
    tile.attr('fill', 'rgba(0,0,127,0.5)');
    tile.attr('stroke', 'rgba(0,0,64,0.5)');
    return tile;
}

TileMap.prototype.toWorld = function (pt) {
    var x = pt[0] / 2 + pt[1] / 2;
    var y = -pt[0] / 2 + pt[1] / 2;
    
    var tx = x + (this.size[0] / 100 / 2) + this.center[0];
    var ty = y + (this.size[1] / 50 / 2) + this.center[1];
    return [ tx * 100, ty * 50 ];
}

function polygon (points) {
    var xs = points.map(function (p) { return p.join(',') });
    return 'M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z';
}

TileMap.prototype.appendTo = function (target) {
    target.appendChild(this.element);
};
