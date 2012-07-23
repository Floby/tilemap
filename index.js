var raphael = require('raphael-browserify');

module.exports = function (width, height) {
    return new TileMap(width, height);
};

function TileMap (width, height) {
    this.element = document.createElement('div');
    this.paper = raphael(this.element, width, height);
    this.size = [ width, height ];
    this.position = [ 0, 0 ];
    this.tiles = this.paper.set();
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
    ].map(function (pt) { return self.toWorld(pt[0], pt[1]) });
    
    var tile = this.paper.path(polygon(points));
    tile.transform('t' + self.position[0] + ',' + self.position[1]);
    tile.attr('stroke-width', '1');
    tile.attr('fill', 'rgba(0,0,127,0.5)');
    tile.attr('stroke', 'rgba(0,0,64,0.5)');
    self.tiles.push(tile);
    
    return tile;
}

TileMap.prototype.move = function (x, y) {
    this.moveTo(this.position[0] + x, this.position[1] + y);
};

TileMap.prototype.moveTo = function (x, y) {
    this.position = [ x, y ];
    this.tiles.transform('t' + x + ',' + y);
};

TileMap.prototype.toWorld = function (x, y) {
    var tx = x / 2 + y / 2;
    var ty = -x / 2 + y / 2;
    
    var ox = tx + this.size[0] / 100 / 2;
    var oy = ty + this.size[1] / 50 / 2;
    return [ ox * 100, oy * 50 ];
}

function polygon (points) {
    var xs = points.map(function (p) { return p.join(',') });
    return 'M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z';
}

TileMap.prototype.appendTo = function (target) {
    target.appendChild(this.element);
};
