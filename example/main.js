var grid = require('../')(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

var images = [ 'rack_0.png' ].reduce(function (acc, file) {
    var im = acc[file] = new Image();
    im.src = file;
    return acc;
}, {});

var itemSet = grid.paper.set();
function insertItem (item, pt) {
    item.data('pt', pt);
    
    for (var i = 0; i < itemSet.length; i++) {
        if (pt[1] < itemSet[i].data('pt')[1]) {
            itemSet.splice(i, 0, item);
            break;
        }
    }
    if (i === itemSet.length) itemSet.push(item);
    
    itemSet.toFront();
}

var tileSet = grid.paper.set();

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        (function (x, y) {
            var tile = grid.createTile(x, y);
            tile.data('x', x);
            tile.data('y', y);
            tile.data('pt', grid.toWorld(x, y));
            
            tile.attr('fill', 'rgba(210,210,210,1.0)');
            tile.attr('stroke-width', '1');
            tile.attr('stroke', 'rgb(255,255,200)');
            
            tileSet.push(tile);
        })(x, y);
    }
}

window.addEventListener('keydown', function (ev) {
    var key = ev.keyIdentifier.toLowerCase();
    var dz = {
        187 : 1 / 0.9,
        189 : 0.9,
    }[ev.keyCode];
    if (dz) return grid.zoom(grid.zoomLevel * dz);
    if (ev.keyCode === 49) return grid.zoom(1);
    
    var dxy = {
        down : [ 0, -1 ],
        up : [ 0, +1 ],
        left : [ -1, 0 ],
        right : [ +1, 0 ]
    }[key];
    
    if (dxy) {
        ev.preventDefault();
        grid.pan(dxy[0], dxy[1]);
    }
});

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});

var selected = null;
window.addEventListener('mousemove', function (ev) {
    var xy = grid.fromWorld(
        (ev.clientX - grid.size[0] / 2) / grid.zoomLevel,
        (ev.clientY - grid.size[1] / 2) / grid.zoomLevel
    );
    var x = Math.round(xy[0] + grid.position[0]);
    var y = Math.round(xy[1] + grid.position[1]);
    
    if (selected) {
        selected.toBack();
        selected.attr('fill', 'rgba(210,210,210,1.0)');
    }
    
    for (var i = 0; i < tileSet.length; i++) {
        var px = tileSet[i].data('x');
        var py = tileSet[i].data('y');
        if (px === x && py === y) {
            selected = tileSet[i];
            selected.toFront();
            selected.attr('fill', 'rgba(255,127,127,0.8)');
            return;
        }
    }
});

window.addEventListener('mousedown', function (ev) {
    if (!selected) return;
    var pt = selected.data('pt');
    
    var im = images['rack_0.png'];
    var item = grid.paper.image(
        im.src,
        pt[0] - im.width / 2, pt[1] - im.height + 25,
        im.width, im.height
    );
    insertItem(item, pt);
});
