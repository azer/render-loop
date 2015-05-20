var RenderLoop = require("../../");
var data = require("./data.json");
var shuffle = require("./shuffle");
var templates = require("./templates");
var grid = RenderLoop(templates.grid, update);

if (grid.browser) {
  grid.hook(document.querySelector('#grid'));

  setTimeout(function () {
    shuffle(grid, templates);
  }, 1000);

  window.grid = grid;
}

module.exports = grid;

function update () {
  grid.set({
    'count': data.length,
    'last-updated': 'N/A',
    'total-update': 0
  });

  console.time('creating rows');
  grid.set('rows', grid.rows = grid.each(templates.row, '.rows', data));
  console.timeEnd('creating rows');
}
