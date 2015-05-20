var RenderLoop = require("../../");
var time = require("format-date");
var clock = RenderLoop('<h1>{time}</h1>', tick);

if (clock.browser) {
  clock.hook(document.querySelector('h1'));
}

module.exports = clock;

function tick () {
  clock.set('time', time('{hours}:{minutes}:{seconds}'));
  setTimeout(tick, 1000);
}
