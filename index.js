var struct = require("new-struct");
var format = require("format-text");
var debounce = require("debounce-fn");
var createElement = require("virtual-dom/create-element");
var diff = require("virtual-dom/diff");
var writePatches = require("virtual-dom/patch");
var virtualHTML = require("virtual-html");
var isNode = require("is-node");

var patch = debounce(applyPatches, 10);

var RenderLoop = struct({
  each: each,
  get: get,
  hook: hook,
  html: html,
  insert: insert,
  render: render,
  set: set
});

module.exports = NewRenderLoop;

function NewRenderLoop (template, options) {
  var updateFn;

  if (typeof options == 'function') {
    updateFn = options;
    options = {};
  } else {
    updateFn = options.updateFn;
  }

  return RenderLoop({
    browser: !isNode,
    clean: false,
    context: options.context || {},
    isReady: false,
    isRenderLoop: true,
    locked: options.locked || false,
    node: isNode,
    parent: options.parent,
    updateFn: updateFn,
    template: template
  });
}

function applyPatches (loop) {
  if (loop.locked) return;

  var vdom = virtualHTML(loop.html());
  var patches = diff(loop.vdom, vdom);

  writePatches(element(loop), patches);

  loop.vdom = vdom;

  if (loop.parent) resetDOM(loop.parent);
}

function each (loop, template, id, context) {
  if (arguments.length == 3) {
    context = id;
    id = ':root';
  }

  var i = context.length;
  var partials = [];

  while (i--) {
    partials[i] = NewRenderLoop(template, {
      parent: loop,
      locked: true,
      context: context[i]
    });
  }

  !loop.partials && (loop.partials = {});
  loop.partials[id] = partials;

  return partials;
}


function get (loop, key) {
  return loop.context[key];
}

function element (loop) {
  if (loop._element) return loop._element;

  loop.vdom = virtualHTML(loop.html());
  loop._element = createElement(loop.vdom);

  loop.partials && hookPartials(loop);

  return loop._element;
}

function hook (loop, element) {
  loop._element = element;
  loop.vdom = virtualHTML(element.outerHTML);

  var vdom = virtualHTML(loop.html());
  var patches = diff(loop.vdom, vdom);

  writePatches(loop._element, patches);

  loop.partials && hookPartials(loop);
}

function html (loop) {
  if (loop._html && loop.clean) return loop._html;

  if (!loop.isReady && loop.updateFn) loop.updateFn(loop);

  loop._html = loop.render();
  loop.clean = true;
  loop.isReady = true;

  return loop._html;
}

function insert (loop, parent) {
  parent.appendChild(element(loop));
}

function remove (loop) {
  err++;
}

function render (loop) {
  return format(loop.template, loop.context);
}

function set (loop, key, value) {
  loop.clean = false;

  if (arguments.length == 3) {
    loop.context[key] = adjustContext(value);
    if (!isNode) patch(loop);
    return value;
  }

  if (arguments.length != 2 || typeof key != 'object') return;

  var options = key;
  key = undefined;

  for (key in options) {
    loop.context[key] = adjustContext(options[key]);
  }

  console.log(options);

  if (!isNode) patch(loop);

  return loop.context;
}

function hookPartials (loop) {
  var selector;
  var parent;
  var i;
  for (selector in loop.partials) {
    if (selector == ':root') {
      parent = loop._element;
    } else {
      parent = loop._element.querySelector(selector);
    }

    if (!parent) throw new Error('Can not hook partials with given selector "' + selector + '" that has no matching elements.');

    i = loop.partials[selector].length;
    while (i--) {
      loop.partials[selector][i].hook(parent.children[i]);
      loop.partials[selector][i].locked = false;
    }
  }
}

function resetDOM (loop) {
  loop._html = loop._element.outerHTML;
  loop.vdom = virtualHTML(loop.html());
}

function adjustContext (value) {
  if (!Array.isArray(value)) return value;

  var mirror = [];

  var i = value.length;
  while (i--) {
    if (value[i] && value[i].isRenderLoop) {
      mirror[i] = value[i].html();
      continue;
    }

    mirror[i] = value[i];
  }

  return mirror.join('\n');
}
