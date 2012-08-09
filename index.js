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
    this.itemStack = [];
    this.itemSet = this.paper.set();
    this.images = {};
    
    this.points = {};
    
    this.tied = [];
    this.selected = [];
    
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
    ];
    var poly = points.map(function (pt) { return self.toWorld(pt[0], pt[1]) });
    
    var tile = new EventEmitter;
    tile.x = x;
    tile.y = y;
    tile.type = 'tile';
    tile.element = self.paper.path(polygon(poly));
    
    var pt = self.toWorld(x, y);
    tile.screenX = pt[0];
    tile.screenY = pt[1];
    
    self.tiles[x + ',' + y] = tile;
    
    var created = [];
    var pts = points.map(function (pt, ix) {
        var key = pt[0] + ',' + pt[1];
        var xy = self.toWorld(pt[0], pt[1]);
        var x = xy[0], y = xy[1];
        
        var point = self.points[key];
        if (!point) {
            point = self.points[key] = new EventEmitter;
            point.x = x;
            point.y = y;
            point.type = 'point';
            point.element = self.paper.circle(x - 5, y - 5, 10);
            point.element.attr('fill', 'transparent');
            point.element.attr('stroke', 'transparent');
            point.tiles = {};
            created.push(point);
        }
        var d = [ 's', 'e', 'n', 'w' ][ix];
        point.tiles[d] = tile;
        
        return point;
    });
    tile.points = { n : pts[0], w : pts[1], s : pts[2], e : pts[3] };
    
    created.forEach(function (pt) {
        self.emit('createPoint', pt);
    });
    
    return tile;
};

TileMap.prototype.tileAt = function (x, y) {
    return this.tiles[x + ',' + y];
};

TileMap.prototype.pointAt = function (x, y) {
    return this.points[x + ',' + y];
};

TileMap.prototype.createItem = function (src, x, y, cb) {
    var self = this;
    var im = new Image;
    var w = self.toWorld(x, y);
    
    im.addEventListener('load', function () {
        var item = new EventEmitter;
        item.element = self.paper.image(
            src,
            w[0] - im.width / 2, w[1] - im.height + 25,
            im.width, im.height
        );
        item.x = x;
        item.y = y;
        
        var pt = self.toWorld(x, y);
        item.screenX = pt[0];
        item.screenY = pt[1];
        
        for (var i = 0; i < self.itemStack.length; i++) {
            if (pt[1] <= self.itemStack[i].screenY) {
                self.itemStack.splice(i, 0, item);
                self.itemSet.splice(i, 0, item.element);
                break;
            }
        }
        if (i === self.itemStack.length) {
            self.itemStack.push(item);
            self.itemSet.push(item.element);
        }
        
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
        item.element.remove();
        for (var i = 0; i < this.itemStack.length; i++) {
            if (item === this.itemStack[i]) {
                this.itemStack.splice(i, 1);
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
        var e = Object.keys(ev).reduce(function (acc, key) {
            acc[key] = ev[key];
            return acc;
        }, {});
        var prevented = false;
        e.preventDefault = function () {
            prevented = true;
            ev.preventDefault();
        };
        self.emit('keydown', e);
        if (prevented) return;
        
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
    
    (function () {
        var selected = {};
        self.selected.push(selected);
        
        on.call(win, 'mousemove', function (ev) {
            var xy = self.fromWorld(
                (ev.clientX - self.size[0] / 2) / self.zoomLevel,
                (ev.clientY - self.size[1] / 2) / self.zoomLevel
            );
            
            var tx = Math.round(xy[0] + self.position[0]);
            var ty = Math.round(xy[1] + self.position[1]);
            var tile = self.tileAt(tx, ty);
            
            if (tile && tile !== selected.tile) {
                if (selected.tile) {
                    selected.tile.emit('mouseout', ev);
                    self.emit('mouseout', selected.tile, ev);
                }
                selected.tile = tile;
                tile.emit('mouseover', ev);
                self.emit('mouseover', tile, ev);
            }
            
            var px = Math.floor(xy[0] + self.position[0]) + 0.5;
            var py = Math.floor(xy[1] + self.position[1]) + 0.5;
            var pt = self.pointAt(px, py);
            
            if (pt && pt !== selected.pt) {
                if (selected.pt) {
                    selected.pt.emit('mouseout', ev);
                    self.emit('mouseout', selected.pt, ev);
                }
                selected.pt = pt;
                pt.emit('mouseover', ev);
                self.emit('mouseout', pt, ev);
            }
        });
        
        [ 'click', 'mousedown', 'mouseup' ].forEach(function (evName) {
            on.call(win, evName, function (ev) {
                if (selected.tile) {
                    selected.tile.emit(evName, ev);
                    self.emit(evName, selected.tile, ev);
                }
                if (selected.pt) {
                    selected.pt.emit(evName, ev);
                    self.emit(evName, selected.pt, ev);
                }
            });
        });
    })();
};

TileMap.prototype.release = function (mode) {
    this.selected.forEach(function (s) {
        if (s[mode]) s[mode].emit('mouseout');
    });
};
