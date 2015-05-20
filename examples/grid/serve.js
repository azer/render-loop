var serve = require("just-a-browserify-server");
var grid = require("./grid");

var build = {
  entry: './grid.js',
  transform: ['brfs']
};

serve(build, 'localhost:3000', function () {
  return {
    css: 'grid.css',
    title: 'grid example',
    content: grid.html()
  };
});
