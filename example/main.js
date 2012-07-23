var grid = require('../')(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

var images = [ 'rack_0.png' ].reduce(function (acc, file) {
    var im = acc[file] = new Image();
    im.src = file;
    return acc;
}, {});

var items = [];
function insertItem (item, pt) {
    var rec = { item : item, pt : pt };
    for (var i = 0; i < items.length; i++) {
        if (pt[1] < items[i].pt[1]) {
            items.splice(i, 0, rec);
            break;
        }
    }
    if (i === items.length) items.push(rec);
    
    items.forEach(function (it) {
        it.item.toFront();
    });
    
    tiles.forEach(function (t) {
        t.tile.toFront();
    });
}

var tiles = [];
function insertTile (tile, pt) {
    var rec = { tile : tile, pt : pt };
    for (var i = 0; i < tiles.length; i++) {
        if (pt[1] < tiles[i].pt[1]) {
            tiles.splice(i, 0, rec);
            break;
        }
    }
    if (i === tiles.length) tiles.push(rec);
    
    tiles.forEach(function (t) {
        t.tile.toFront();
    });
}

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        (function (x, y) {
            var under = grid.createTile(x, y);
            under.attr('fill', 'rgb(210,210,210)');
            under.attr('stroke-width', '1');
            under.attr('stroke', 'rgb(255,255,200)');
            
            var pt = grid.toWorld(x, y);
            
            var over = grid.createTile(x, y);
            over.attr('stroke', 'transparent');
            insertTile(over, pt);
            
            over.click(function () {
                var im = images['rack_0.png'];
                var item = grid.paper.image(
                    im.src,
                    pt[0] - im.width / 2, pt[1] - im.height + 25,
                    im.width, im.height
                );
                insertItem(item, pt);
            });
            
            over.mouseover(function () {
                over.attr('fill', 'rgba(255,127,127,0.8)');
            });
            over.mouseout(function () {
                over.attr('fill', 'transparent');
            });
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
