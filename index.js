var raphael = require('raphael-browserify');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

module.exports = function (width, height) {
    return new TileMap(width, height);
};

function TileMap (width, height) {
    EventEmitter.call(this);
    
    this.element = document.createElement('div');
    this.paper = raphael(this.element, width, height);
    this.size = [ width, height ];
    this.zoomLevel = 1;
    
    this.tiles = {};
    this.items = {};
    this.itemSet = this.paper.set();
    this.images = {};
    this.tied = [];
    
    this.moveTo(0, 0);
    
    var self = this;
    process.nextTick(function () {
        if (self.tied.length === 0) {
            self.tie(window);
        }
    });
}

util.inherits(TileMap, EventEmitter);

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
    tile.data('x', x);
    tile.data('y', y);
    tile.data('pt', self.toWorld(x, y));
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
        
        var pt = self.toWorld(x, y);
        item.data('pt', pt);
        
        for (var i = 0; i < self.itemSet.length; i++) {
            if (pt[1] <= self.itemSet[i].data('pt')[1]) {
                self.itemSet.splice(i, 0, item);
                break;
            }
        }
        if (i === self.itemSet.length) self.itemSet.push(item);
        
        self.itemSet.toFront();
        self.items[x + ',' + y] = item;
        
        if (typeof cb === 'function') cb(null, item);
    });
    im.addEventListener('error', cb);
    im.src = src;
};

TileMap.prototype.removeItem = function (x, y) {
    var item = this.itemAt(x, y);
    if (item) {
        delete this.items[x + ',' + y];
        item.remove();
        for (var i = 0; i < this.itemSet.length; i++) {
            if (item === this.itemSet[i]) {
                this.itemSet.splice(i, 1);
                break;
            }
        }
        this.itemSet.toFront();
    }
};

TileMap.prototype.itemAt = function (x, y) {
    return this.items[x + ',' + y];
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

TileMap.prototype.tie = function (win) {
    var self = this;
    self.tied.push(win);
    
    var on = typeof win.addEventListener === 'function'
        ? win.addEventListener
        : win.on
    ;
    on.call(win, 'keydown', function (ev) {
        var key = ev.keyIdentifier.toLowerCase();
        var dz = {
            187 : 1 / 0.9,
            189 : 0.9,
        }[ev.keyCode];
        if (dz) return self.zoom(self.zoomLevel * dz);
        if (ev.keyCode === 49) return self.zoom(1);
        
        var dxy = {
            down : [ 0, -1 ],
            up : [ 0, +1 ],
            left : [ -1, 0 ],
            right : [ +1, 0 ]
        }[key];
        
        if (dxy) {
            ev.preventDefault();
            self.pan(dxy[0], dxy[1]);
        }
    });
    
    var selected = null;
    on.call(win, 'mousemove', function (ev) {
        var xy = self.fromWorld(
            (ev.clientX - self.size[0] / 2) / self.zoomLevel,
            (ev.clientY - self.size[1] / 2) / self.zoomLevel
        );
        var x = Math.round(xy[0] + self.position[0]);
        var y = Math.round(xy[1] + self.position[1]);
        
        var tile = self.tileAt(x, y);
        if (tile === selected) return;
        
        if (selected) {
            self.emit('mouseout', selected);
            selected = null;
        }
        
        if (tile) {
            selected = tile;
            self.emit('mouseover', tile, x, y);
        }
    });
    
    [ 'click', 'mousedown', 'mouseup' ].forEach(function (evName) {
        on.call(win, evName, function (ev) {
            if (!selected) return;
            var x = selected.data('x');
            var y = selected.data('y');
            self.emit(evName, selected, x, y);
        });
    });
};
