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
        var tile = grid.createTile(x, y);
        tile.attr('fill', 'rgba(210,210,210,1.0)');
        tile.attr('stroke-width', '1');
        tile.attr('stroke', 'rgb(255,255,200)');
    }
}

window.addEventListener('resize', function (ev) {
    grid.resize(window.outerWidth, window.outerHeight);
});

grid.on('mouseover', function (tile, x, y) {
    tile.toFront();
    tile.attr('fill', 'rgba(255,127,127,0.8)');
});

grid.on('mouseout', function (tile) {
    tile.toBack();
    tile.attr('fill', 'rgba(210,210,210,1.0)');
});

grid.on('mousedown', function (tile, x, y) {
    if (grid.itemAt(x, y)) {
        grid.removeItem(x, y);
    }
    else grid.createItem('rack_0.png', x, y);
});
```

[Here is the example in action](http://substack.net/projects/datacenter/).

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

## grid.createTile(x, y)

Return a [raphael element](http://raphaeljs.com/reference.html#Element)
for a new tile at grid coordinates `(x,y)`.

## grid.tileAt(x, y)

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

# events

## grid.on('mouseover', function (tile, x, y) { ... })

Emitted when the mouse begins to hover over a tile.

`x` and `y` are in grid coordinates.

## grid.on('mouseout', function (tile) { ... })

Emitted when the mouse is no longer hovering over a tile.

## grid.on('mousedown', function (tile, x, y) { ... })

Emitted when the mouse button goes down over a tile.

`x` and `y` are in grid coordinates.

## grid.on('mouseup', function (tile, x, y) { ... })

Emitted when the mouse button goes up over a tile.

`x` and `y` are in grid coordinates.

## grid.on('click', function (tile, x, y) { ... })

Emitted when the mouse clicks on a tile.

`x` and `y` are in grid coordinates.

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
