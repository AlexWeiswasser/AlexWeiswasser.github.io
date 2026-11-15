// Turns each <script type="text/plain" class="code"> block on a game page
// into a formatted code box. This is what lets you paste C# exactly as it is,
// without changing any < or > characters.
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
