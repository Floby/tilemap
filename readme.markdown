# tilemap

Render [isometric](https://en.wikipedia.org/wiki/Axonometric_projection)
(simcity 2000-style) tile maps in the browser.

# example

``` js
var tilemap = require('tilemap');
var grid = tilemap(window.outerWidth, window.outerHeight);
grid.appendTo(document.body);

for (var x = -10; x < 10; x++) {
    for (var y = -10; y < 10; y++) {
        createTile(x, y);
    }
}

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});

function createTile (x, y) {
    var tile = grid.createTile(x, y);
    tile.element.attr('fill', 'rgba(210,210,210,1.0)');
    tile.element.attr('stroke-width', '1');
    tile.element.attr('stroke', 'rgb(255,255,200)');
    
    tile.on('mouseover', function () {
        tile.element.toFront();
        tile.element.attr('fill', 'rgba(255,127,127,0.8)');
    });
    
    tile.on('mouseout', function () {
        tile.element.toBack();
        tile.element.attr('fill', 'rgba(210,210,210,1.0)');
    });
    
    tile.on('mousedown', function () {
        if (grid.itemAt(tile.x, tile.y)) {
            grid.removeItem(tile.x, tile.y);
        }
        else grid.createItem(
            'http://substack.net/projects/datacenter/rack_0.png',
            tile.x, tile.y
        );
    });
}
```

[this example in action](http://substack.net/projects/datacenter/tiles.html)

[a more complete example](http://substack.net/projects/datacenter/)

# methods

```js
var tilemap = require('tilemap')
```

## var grid = tilemap(width, height)

Create a tilemap grid with `width` and `height` dimensions.

If you don't call `grid.tie()` by the nextTick, `grid.tie(window)` will be
called automatically.

## grid.tie(element)

Bind key and mouse listeners to `element` to control navigation and mouse
selection of individual tiles.

## grid.appendTo(target)

Append the grid html element to the `target` html element.

## grid.resize(width, height)

Resize the raphael svg screen and container html element.

## grid.move(x, y)

Move by the relative grid coordinates `(x,y)`.

## grid.moveTo(x, y)

Move to the absolute grid coordinates `(x,y)`.

## grid.pan(x, y)

Move by the relative screen coordinates `(x,y)`.

## grid.zoom(level)

Zoom to `level`. The default zoom level is `1`.

## var tile = grid.createTile(x, y)

Return a [raphael element](http://raphaeljs.com/reference.html#Element)
for a new tile at grid coordinates `(x,y)`.

## var tile = grid.tileAt(x, y)

Return the tile at grid coordinates `(x,y)` or `undefined` if there is no such
tile.

## grid.createItem(src, x, y, cb)

Create a new sprite item at the grid coordinates `(x,y)` with the image from
`src`.

Optionally get the 
[raphael element](http://raphaeljs.com/reference.html#Element)
for the sprite item in `cb(err, item)`.

## grid.itemAt(x, y)

Return the item at the grid coordinates `(x,y)` or `undefined` if there isn't an
item at `(x,y)`.

## grid.removeItem(x, y)

Remove the item at the grid coordinates `(x,y)`.

## grid.createWall(src, pt0, pt1, cb)

Like `grid.createItem()` except that walls will be inserted between points `pt0`
and `pt1`. Points should have `'x'` and `'y'` fields.

This function only draws straight walls. Either the `'x'` or the `'y'` must be
equal between `pt0` and `pt1` for the wall to be created. Otherwise nothing
happens.

# events

## grid.on('createPoint', function (point) { ... })

Emitted when a new point is created because a tile was created and more points
needed to be added.

## tile.on('mouseover', function () { ... })
## point.on('mouseover', function () { ... })

Emitted when the mouse begins to hover over a tile or point.

## tile.on('mouseout', function () { ... })
## point.on('mouseout', function () { ... })

Emitted when the mouse is no longer hovering over a tile or point.

## tile.on('mousedown', function () { ... })
## point.on('mousedown', function () { ... })

Emitted when the mouse button goes down over a tile or point.

## tile.on('mouseup', function () { ... })
## point.on('mouseup', function () { ... })

Emitted when the mouse button goes up over a tile or point.

## tile.on('click', function () { ... })
## point.on('click', function () { ... })

Emitted when the mouse clicks on a tile or point.

# install

With [npm](http://npmjs.org) do:

```
npm install tilemap
```

then just `require('tilemap')` in your `main.js` and then compile it with
[browserify](http://github.com/substack/node-browserify):

```
$ browserify main.js -o bundle.js
```

# license

MIT
