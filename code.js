// 1. Turns each <script type="text/plain" class="code"> block on a game page
//    into a formatted code box. This is what lets you paste C# exactly as it is,
//    without changing any < or > characters.
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

// 2. Code selector. Every <div class="code-tabs"> holds several
//    <div class="tab" data-name="...">. This builds a row of buttons from the
//    names and shows one tab at a time, with its code and its description.
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
