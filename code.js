// This file runs on every game page. It does three things, in order:
//   1. fills in the page's text from game-text.js
//   2. turns the pasted code blocks into formatted code boxes
//   3. builds the row of tabs for each code selector

// ---------------------------------------------------------------------------
// 1. Text. All the writing for the game pages lives in game-text.js. Each
//    element with a data-text="..." attribute gets its text from there.
// ---------------------------------------------------------------------------
(function () {
  var page = document.body.getAttribute('data-page');
  if (!page) return;

  // Read game-text.js into { pageName: { key: [lines], 'key.title': 'label' } }
  var pages = {}, current = null, key = null, section = 0;
  String(window.GAME_TEXT || '').split('\n').forEach(function (raw) {
    var line = raw.trim(), m;
    if ((m = /^=+\s*PAGE:\s*([a-z0-9-]+)\s*=*$/i.exec(line))) {
      current = pages[m[1].toLowerCase()] = {}; key = null; section = 0; return;
    }
    if (!current) return;
    if (/^PREFACE$/.test(line)) { key = 'preface'; current[key] = []; return; }
    if ((m = /^SECTION\s+(\d+)\s*:\s*(.*)$/.exec(line))) {
      section = m[1]; key = 's' + section;
      current[key] = []; current[key + '.title'] = m[2]; return;
    }
    if ((m = /^OPTION\s+(\d+)\s*:\s*(.*)$/.exec(line))) {
      key = 's' + section + '.o' + m[1];
      current[key] = []; current[key + '.title'] = m[2]; return;
    }
    if (/^CAPTION$/.test(line)) { key = 's' + section + '.caption'; current[key] = []; return; }
    if (key) current[key].push(line);
  });
  var text = pages[page] || {};

  // Lines separated by an empty line become separate paragraphs
  function paragraphs(lines) {
    var out = [], buffer = [];
    lines.concat(['']).forEach(function (line) {
      if (line) { buffer.push(line); }
      else if (buffer.length) { out.push(buffer.join(' ')); buffer = []; }
    });
    return out;
  }

  // Tab labels
  document.querySelectorAll('[data-text-label]').forEach(function (el) {
    var label = text[el.getAttribute('data-text-label')];
    if (label) el.setAttribute('data-name', label);
  });

  document.querySelectorAll('[data-text]').forEach(function (el) {
    var name = el.getAttribute('data-text');
    var value = text[name];

    // Section headings
    if (/\.title$/.test(name)) { if (value) el.textContent = value; return; }

    // Nothing with this name in game-text.js: say so on the page
    if (value === undefined) {
      el.textContent = '[No text found in game-text.js for: ' + page + ' / ' + name + ']';
      el.classList.add('missing-text');
      return;
    }

    var paras = paragraphs(value);
    if (!paras.length) { el.hidden = true; return; }   // left empty on purpose: show nothing

    if (el.tagName === 'FIGCAPTION') { el.textContent = paras.join(' '); return; }
    el.textContent = '';
    paras.forEach(function (p) {
      var node = document.createElement('p');
      node.textContent = p;
      el.appendChild(node);
    });
  });
})();

// ---------------------------------------------------------------------------
// 2. Code boxes. Turns each <script type="text/plain" class="code"> block
//    into a formatted code box. This is what lets you paste C# exactly as it
//    is, without changing any < or > characters.
// ---------------------------------------------------------------------------
document.querySelectorAll('script.code').forEach(function (block) {
  var lines = block.textContent.replace(/\t/g, '    ').split('\n');

  // Drop empty lines at the start and end
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

  // Remove indentation shared by every line, so pasted code starts at the left edge
  var indent = Math.min.apply(null, lines
    .filter(function (line) { return line.trim() !== ''; })
    .map(function (line) { return line.match(/^ */)[0].length; }));
  if (!isFinite(indent)) indent = 0;

  var code = document.createElement('code');
  code.textContent = lines.map(function (line) { return line.slice(indent); }).join('\n');
  var pre = document.createElement('pre');
  pre.appendChild(code);
  block.replaceWith(pre);
});

// ---------------------------------------------------------------------------
// 3. Code selector. Every <div class="code-tabs"> holds several
//    <div class="tab" data-name="...">. This builds a row of tabs from the
//    names and shows one at a time, with its code and its description.
// ---------------------------------------------------------------------------
document.querySelectorAll('.code-tabs').forEach(function (group) {
  var tabs = Array.prototype.filter.call(group.children, function (el) {
    return el.classList.contains('tab');
  });
  if (tabs.length < 2) return;

  var bar = document.createElement('div');
  bar.className = 'tab-bar';
  bar.setAttribute('role', 'tablist');

  function show(index) {
    tabs.forEach(function (tab, i) {
      tab.hidden = i !== index;
      bar.children[i].setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  tabs.forEach(function (tab, i) {
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.textContent = tab.getAttribute('data-name') || 'Part ' + (i + 1);
    button.addEventListener('click', function () { show(i); });
    bar.appendChild(button);
  });

  group.insertBefore(bar, tabs[0]);
  show(0);
});
