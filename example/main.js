var tilemap = require('../');
var grid = tilemap(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);
grid.on('createPoint', onCreatePoint);

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        createTile(x, y);
    }
}

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});

var mode = 'tile';
grid.on('keydown', function (ev) {
    if (String.fromCharCode(ev.keyCode) === 'W') {
        grid.release(mode);
        mode = {
            tile : 'point',
            point : 'tile'
        }[mode];
        
        if (selectedPoint) {
            var s = selectedPoint;
            selectedPoint = null;
            s.emit('mouseout');
        }
    }
});

var selectedPoint = null;
function onCreatePoint (pt) {
    pt.on('mouseover', function () {
        if (mode !== 'point') return;
        
        if (!selectedPoint
        || selectedPoint.x === pt.x
        || selectedPoint.y === pt.y) {
            pt.element.toFront();
            pt.element.attr('fill', 'rgba(255,0,0,1)');
        }
    });
    
    pt.on('mouseout', function () {
        if (mode !== 'point') return;
        
        if (pt !== selectedPoint) {
            pt.element.attr('fill', 'transparent');
        }
    });
    
    pt.on('mousedown', function () {
        if (mode !== 'point') return;
        if (!selectedPoint) {
            pt.element.attr('fill', 'rgb(0,255,255,1)');
            selectedPoint = pt;
            return;
        }
        
        if (selectedPoint.x !== pt.x && selectedPoint.y !== pt.y) {
            selectedPoint.element.attr('fill', 'transparent');
            selectedPoint = null;
            return;
        }
        
        var walls = {
            left : 'http://substack.net/projects/datacenter/wall_left.png',
            right : 'http://substack.net/projects/datacenter/wall_right.png'
        };
        
        if (selectedPoint.y === pt.y) {
            var x0 = Math.min(selectedPoint.x, pt.x);
            var xt = Math.max(selectedPoint.x, pt.x);
            for (var x = x0; x < xt; x++) {
                grid.createItem(walls.right, x + 0.75, pt.y - 0.25);
            }
        }
        else {
            var y0 = Math.min(selectedPoint.y, pt.y);
            var yt = Math.max(selectedPoint.y, pt.y);
            for (var y = y0; y < yt; y++) {
                grid.createItem(walls.left, pt.x + 0.25, y + 0.25);
            }
        }
        
        selectedPoint.element.attr('fill', 'transparent');
        pt.element.attr('fill', 'transparent');
        selectedPoint = null;
    });
}

function createTile (x, y) {
    var tile = grid.createTile(x, y);
    tile.element.attr('fill', 'rgba(210,210,210,1.0)');
    tile.element.attr('stroke-width', '1');
    tile.element.attr('stroke', 'rgb(255,255,200)');
    
    tile.on('mouseover', function () {
        if (mode !== 'tile') return;
        
        tile.element.toFront();
        tile.element.attr('fill', 'rgba(255,127,127,0.8)');
    });
    
    tile.on('mouseout', function () {
        if (mode !== 'tile') return;
        
        tile.element.toBack();
        tile.element.attr('fill', 'rgba(210,210,210,1.0)');
    });
    
    tile.on('mousedown', function () {
        if (mode !== 'tile') return;
        
        if (grid.itemAt(tile.x, tile.y)) {
            grid.removeItem(tile.x, tile.y);
        }
        else {
            var u = 'http://substack.net/projects/datacenter/rack_0.png';
            grid.createItem(u, tile.x, tile.y);
        }
    });
    
    return tile;
}
