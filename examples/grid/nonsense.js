var dict = require("toba-batak-dictionary");
var edge = dict.length;

module.exports = row;

function row () {
  return {
    id: Math.floor(Math.random() * 999999999),
    name: nonsense(1).replace(/[^\w].+/, ''),
    surname: nonsense(1).toUpperCase().replace(/[^\w].+/, ''),
    income: 25 + Math.floor(Math.random() * 150),
    tribe: nonsense(1).toUpperCase().replace(/[^\w].+/, ''),
    village: nonsense(1).replace(/[^\w].+/, ''),
    hobbies: nonsense(10),
    'css-classes': ''
  };
}

function nonsense (len) {
  var buf = '';
  var i = len || (2 + Math.floor(Math.random() * 5));

  while (i--) {
    buf += dict[Math.floor(Math.random() * edge)].batak + ' ';
  }

  return capitalize(buf.trim());
}

function capitalize (str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}
