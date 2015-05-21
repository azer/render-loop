var RenderLoop = require("./");
var createTest = require("prova");

test('rendering HTML for a simple greeting view', function (t) {
  t.plan(1);

  var loop = RenderLoop('<h1>{greeting}, {name}</h1>', function () {
    loop.set('greeting', 'good morning');
    loop.set({ name: 'azer' });
  });

  t.equal(loop.html(), '<h1>good morning, azer</h1>');
});

test('inserting and keeping a view updated', function (t) {
  t.plan(3);

  var loop = RenderLoop('<h1>{greeting}, {name}</h1>', function () {
    loop.set({ greeting: 'good morning', name: 'azer' });
  });

  loop.insert(document.body);
  t.equal(html(), '<h1>good morning, azer</h1>');

  loop.set({
    greeting: 'good afternoon',
    name: 'yo'
  });

  and(function () {
    t.equal(html(), '<h1>good afternoon, yo</h1>');
    loop.set('greeting', 'horas');

    and(function () {
      t.equal(html(), '<h1>horas, yo</h1>');
    });
  });
});

test('hook a loop with already existing DOM', function (t) {
  document.body.innerHTML = '<h1>good morning, <strong>azer</strong></h1>';

  t.plan(3);

  var h1 = document.querySelector('h1');
  var strong = document.querySelector('strong');

  var loop = RenderLoop('<h1>{greeting}, <strong>{name}</strong></h1>', function () {
    loop.set({ greeting:'good morning', name: 'yo' });
  });

  loop.hook(h1);

  and(function () {
    t.equal(html(), '<h1>good morning, <strong>yo</strong></h1>');
    t.equal(h1, document.querySelector('h1'));
    t.equal(strong, document.querySelector('strong'));
  });
});

test('a simple list layout using the each method', function (t) {
  t.plan(4);

  var prices = [
    { name: 'melon', price: '$3.99/lb' },
    { name: 'orange', price: '$2.49/lb' }
  ];

  var templates = {
    fruits: '<ul>{fruits}</ul>',
    fruit: '<li>{name}: {price}</li>'
  };

  var loop = RenderLoop(templates.fruits, function () {
    loop.set('fruits', loop.fruits = loop.each(templates.fruit, prices));
  });

  loop.insert(document.body);
  t.equal(html(), '<ul><li>melon: $3.99/lb</li>\n<li>orange: $2.49/lb</li></ul>');

  loop.fruits[0].set({
    price: '$1.99/lb'
  });

  and(function () {
    t.equal(html(), '<ul><li>melon: $1.99/lb</li>\n<li>orange: $2.49/lb</li></ul>');

    loop.fruits[1].set({
      name: 'orange (discount)',
      price: '$0.49/lb'
    });

    prices.push({
      name: 'grapes',
      price: '$4.59/lb'
    });

    loop.set('fruits', loop.fruits = loop.each(templates.fruit, prices));

    and(function () {
      t.equal(html(), '<ul><li>melon: $1.99/lb</li>\n<li>orange (discount): $0.49/lb</li>\n<li>grapes: $4.59/lb</li></ul>');

      loop.fruits[0].set('name', 'watermelon');
      loop.fruits[2].set('price', '$4.99/lb');

      and(function () {
        t.equal(html(), '<ul><li>watermelon: $1.99/lb</li>\n<li>orange (discount): $0.49/lb</li>\n<li>grapes: $4.99/lb</li></ul>');
      });
    });
  });
});

function and (fn) {
  setTimeout(fn, 100);
}

function reset () {
  document.body.innerHTML = '';
}

function test (title, fn) {
  createTest(title, function (t) {
    reset();
    fn(t);
  });
}

function html () {
  return document.body.innerHTML.trim();
}
