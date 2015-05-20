## render-loop

Build HTML/DOM layouts that gets patched automatically with [Virtual DOM](http://npmjs.org/virtual-dom)

## Install

```bash
$ npm install render-loop
```

## Usage

A simple greeting layout:

```js
var RenderLoop = require('render-loop')

var loop = RenderLoop('<h1>{message}, {name}</h1>', function () {
  loop.set({
    message: 'good morning',
    name: 'azer'
  })
})

loop.html()
// => <h1>good morning, azer</h1>

loop.insert(document.body)

loop.set('message', 'good afternoon')

document.body.innerHTML
// => <h1>good afternoon, azer</h1>
```

A list layout:

```js
var prices = [
  { name: 'melon', price: '$3.99/lb' },
  { name: 'orange', price: '$2.49/lb' }
]

var html = {
  fruits: '<ul>{fruits}</ul>',
  fruit: '<li>{name}: {price}</li>'
}

var loop = RenderLoop(html.fruits, function () {
  loop.set('fruits', loop.each(html.fruit, prices));
})
```
