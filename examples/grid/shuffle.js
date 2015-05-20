var generate = require("./nonsense");
var ctr = 0;

module.exports = shuffle;

function shuffle (grid) {
  var i = 1;
  var index;
  var row;

  while (i--) {
    row = generate();
    index = Math.floor(Math.random() * grid.rows.length);
    grid.rows[index].set(row);
    flash(grid.rows[index]);

    grid.set('last-updated', row.id);
    grid.set('total-update', ++ctr);
  }

  setTimeout(shuffle, 1000, grid);
}

function flash (row) {
  row._element.classList.add('highlighted');

  setTimeout(function () {
    row._element.classList.remove('highlighted');
  }, 3000);
}
