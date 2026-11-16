// This file runs on every game page. It does four things, in order:
//   1. fills in the page's text from game-text.js
//   2. turns the pasted code blocks into formatted code boxes
//   3. builds the row of tabs for each code selector
//   4. builds the navigation bar at the top of the page
//   5. fills each image slot with whichever file exists: a video, a GIF or a still image

// ---------------------------------------------------------------------------
// 1. Text. All the writing for the game pages lives in game-text.js. Each
//    element with a data-text="..." attribute gets its text from there.
// ---------------------------------------------------------------------------
(function () {
  var page = document.body.getAttribute('data-page');
  if (!page) return;

  if (typeof window.GAME_TEXT !== 'string') {
    var note = document.createElement('p');
    note.className = 'missing-text';
    note.textContent = '[game-text.js did not load. Check that it is in the same folder as this page, then press Ctrl+F5.]';
    document.body.insertBefore(note, document.body.firstChild);
    return;
  }

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

// ---------------------------------------------------------------------------
// 4. Navigation bar: main menu on the left, this page's sections in the
//    middle, the next project on the right. It stays at the top while scrolling.
// ---------------------------------------------------------------------------
(function () {
  var page = document.body.getAttribute('data-page');
  if (!page) return;

  // The game pages, in the same order as on the home page.
  // "Next project" follows this list, and the last one leads back to the first.
  var PROJECTS = [
    ['fish-party', 'Fish Party'],
    ['mage', 'MAGE'],
    ['lighthouse', 'Lighthouse Time Machine'],
    ['little-cowboy', 'Little Cowboy'],
    ['perfect-princess-plan', 'Perfect Princess Plan']
  ];
  var here = 0;
  PROJECTS.forEach(function (p, i) { if (p[0] === page) here = i; });
  var next = PROJECTS[(here + 1) % PROJECTS.length];

  function link(className, href, label) {
    var a = document.createElement('a');
    if (className) a.className = className;
    a.href = href;
    a.textContent = label;
    return a;
  }

  var nav = document.createElement('nav');
  nav.className = 'site-nav game-nav';
  nav.appendChild(link('nav-home', 'index.html#' + page, '\u2190 Main Menu'));

  var middle = document.createElement('div');
  middle.className = 'nav-links';
  document.querySelectorAll('.part').forEach(function (section, i) {
    var heading = section.querySelector('h2');
    if (!heading) return;
    section.id = 'section-' + (i + 1);
    middle.appendChild(link('', '#' + section.id, heading.textContent));
  });
  nav.appendChild(middle);

  nav.appendChild(link('nav-next', next[0] + '.html', 'Next: ' + next[1] + ' \u2192'));

  document.body.insertBefore(nav, document.body.firstChild);
  document.body.classList.add('has-nav');
})();

// ---------------------------------------------------------------------------
// 5. Image slots. Each slot is named after a file, for example
//    media/fish-party-1. The slot shows whichever of these exists, trying them
//    in this order, so a video or GIF with the right name replaces a still image:
//        .mp4  .webm  .gif  .png  .jpg  .jpeg  .webp
//    Every slot starts loading as soon as the page opens.
// ---------------------------------------------------------------------------
(function () {
  var TYPES = ['mp4', 'webm', 'gif', 'png', 'jpg', 'jpeg', 'webp'];

  function fill(slot) {
    var file = slot.getAttribute('data-file');
    if (!file) return;
    var base = file.replace(/\.[a-z0-9]+$/i, '');

    var existing = slot.querySelector('img');
    if (existing) existing.onerror = null;          // this code takes over from the page's own fallback
    if (existing) existing.loading = 'eager';       // load now, even if the page marked it to wait
    var caption = slot.parentNode.querySelector('figcaption');
    var alt = slot.getAttribute('data-alt') || (existing && existing.getAttribute('alt')) || (caption && caption.textContent) ||
              (slot.classList.contains('hero-shot') ? 'Title screen' : '');

    function show(element, url) {
      slot.classList.remove('missing');
      if (existing && existing.parentNode === slot && existing.getAttribute('src') === url) return;  // already showing it
      slot.textContent = '';
      slot.appendChild(element);
      if (element.tagName === 'VIDEO') { var playing = element.play(); if (playing && playing.catch) playing.catch(function () {}); }
    }

    function attempt(i) {
      if (i >= TYPES.length) {                       // nothing with this name exists yet
        slot.textContent = '';
        slot.classList.add('missing');
        slot.setAttribute('data-file', base + '  (.png, .gif or .mp4)');
        return;
      }
      var url = base + '.' + TYPES[i];
      if (TYPES[i] === 'mp4' || TYPES[i] === 'webm') {
        var video = document.createElement('video');
        video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('aria-label', alt);
        video.onloadeddata = function () { show(video, url); };
        video.onerror = function () { attempt(i + 1); };
        video.src = url;
      } else {
        var image = new Image();
        image.alt = alt;
        image.onload = function () { show(image, url); };
        image.onerror = function () { attempt(i + 1); };
        image.src = url;
      }
    }
    attempt(0);
  }

  // Every slot starts loading as soon as the page opens
  document.querySelectorAll('.media[data-file]').forEach(fill);
})();
