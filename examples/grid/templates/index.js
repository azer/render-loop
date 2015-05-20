var fs = require("fs");
exports.grid = fs.readFileSync(__dirname + '/grid.html', 'utf8');
exports.row = fs.readFileSync(__dirname + '/row.html', 'utf8');
