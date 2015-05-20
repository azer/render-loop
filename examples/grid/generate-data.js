var fs = require("fs");
var doc = require('./data.json');
var nonsense = require("./nonsense");

var i = parseInt(process.argv[2]);
while (i--) {
  doc.push(nonsense());
}

console.log('done (%d)', doc.length);
fs.writeFileSync('data.json', JSON.stringify(doc, null, '\t'));
console.log('done');
