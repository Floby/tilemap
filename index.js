var raphael = require('raphael-browserify');

module.exports = function (width, height) {
    return new TileMap(width, height);
};

function TileMap (width, height) {
    this.element = document.createElement('div');
    this.paper = raphael(this.element, width, height);
    this.size = [ width, height ];
    this.zoomLevel = 1;
    
    this.tiles = {};
    this.itemSet = this.paper.set();
    this.images = {};
    
    this.moveTo(0, 0);
}

TileMap.prototype.resize = function (width, height) {
    this.size = [ width, height ];
    this.paper.setSize(width, height);
    this._setView();
};

TileMap.prototype.createTile = function (x, y) {
    var self = this;
    var points = [
        [ x - 0.5, y + 0.5 ],
        [ x - 0.5, y - 0.5 ],
        [ x + 0.5, y - 0.5 ],
        [ x + 0.5, y + 0.5 ]
    ].map(function (pt) { return self.toWorld(pt[0], pt[1]) });
    
    var tile = this.paper.path(polygon(points));
    this.tiles[x + ',' + y] = tile;
    return tile;
};

TileMap.prototype.tileAt = function (x, y) {
    return this.tiles[x + ',' + y];
};

TileMap.prototype.createItem = function (src, x, y, cb) {
    var self = this;
    var im = new Image;
    var w = self.toWorld(x, y);
    
    im.addEventListener('load', function () {
        var item = self.paper.image(
            src,
            w[0] - im.width / 2, w[1] - im.height + 25,
            im.width, im.height
        );
        item.data('x', x);
        item.data('y', y);
        
        for (var i = 0; i < self.itemSet.length; i++) {
            if (y < self.itemSet[i].data('y')) {
                self.itemSet.splice(i, 0, item);
                break;
            }
        }
        if (i === self.itemSet.length) self.itemSet.push(item);
        
        self.itemSet.toFront();
        self.items[x + ',' + y] = item;
        
        if (typeof cb === 'function') cb(item);
    });
    im.src = src;
};

TileMap.prototype.move = function (x, y) {
    this.moveTo(this.position[0] + x, this.position[1] + y);
};

TileMap.prototype.moveTo = function (x, y) {
    this.position = [ x, y ];
    this._setView();
};

TileMap.prototype.pan = function (x, y) {
    var tx = x / 2 + y / 2;
    var ty = x / 2 - y / 2;
    
    this.move(
        tx / Math.pow(this.zoomLevel, 0.5),
        ty / Math.pow(this.zoomLevel, 0.5)
    );
};

TileMap.prototype.zoom = function (level) {
    this.zoomLevel = level;
    this._setView();
};

TileMap.prototype._setView = function () {
    var w = this.size[0] / this.zoomLevel;
    var h = this.size[1] / this.zoomLevel;
    
    var pt = this.toWorld(this.position[0], this.position[1]);
    var x = pt[0] - w / 2;
    var y = pt[1] - h / 2;
    
    this.paper.setViewBox(x, y, w, h);
};

TileMap.prototype.toWorld = function (x, y) {
    var tx = x / 2 + y / 2;
    var ty = -x / 2 + y / 2;
    return [ tx * 100, ty * 50 ];
};

TileMap.prototype.fromWorld = function (tx, ty) {
    var x = tx / 100;
    var y = ty / 50;
    return [ x - y, x + y ];
};

function polygon (points) {
    var xs = points.map(function (p) { return p.join(',') });
    return 'M' + xs[0] + ' L' + xs.slice(1).join(' ') + ' Z';
}

TileMap.prototype.appendTo = function (target) {
    target.appendChild(this.element);
};
