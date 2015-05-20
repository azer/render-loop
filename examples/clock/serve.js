var serve = require("just-a-browserify-server");
var view = require("./");

serve('./index.js', 'localhost:3000', function () {
  return {
    css: 'clock.css',
    title: 'clock example',
    content: view.html()
  };
});
