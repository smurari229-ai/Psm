import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scriptStart = html.lastIndexOf('<script>') + '<script>'.length;\nconst scriptEnd = html.indexOf('</script>', scriptStart);\nassert.ok(scriptStart >= '<script>'.length && scriptEnd > scriptStart, 'app should include its inline script');\nconst appScript = html.slice(scriptStart, scriptEnd);

test('page has mobile metadata and required business form controls', () => {
  assert.match(html, /<meta name="viewport"/i);
  assert.match(html, /<form id="kitForm"/);
  for (const id of ['business', 'category', 'language', 'offer', 'area', 'tone', 'caption', 'whatsapp', 'calendar', 'ads']) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  assert.match(html, /data-copy="caption"/);
  assert.match(html, /data-copy="whatsapp"/);
  assert.match(html, /data-copy="calendar"/);
  assert.match(html, /data-copy="ads"/);
  assert.doesNotMatch(html, /<script\\s+[^>]*src=/i, 'MVP should not rely on remote scripts');
});

test('inline JavaScript parses successfully', () => {
  assert.doesNotThrow(() => new vm.Script(appScript));
});

function makeApp() {
  const elements = new Map();
  const getElementById = id => {
    if (!elements.has(id)) elements.set(id, {
      id, value: '', textContent: '', innerHTML: '',
      listeners: {},
      classList: { add() {}, remove() {}, contains() { return false; } },
      addEventListener(type, cb) { this.listeners[type] = cb; },
      scrollIntoView() {}
    });
    return elements.get(id);
  };
  const document = {
    getElementById,
    querySelectorAll() { return []; },
    createElement() { return { value: '', style: {}, select() {}, remove() {} }; },
    body: { appendChild() {} },
    execCommand() { return true; }
  };
  const context = { document, navigator: {}, setTimeout, clearTimeout, console };
  vm.runInNewContext(appScript, context);
  return { elements, getElementById };
}

test('submit generates caption, WhatsApp message and seven-day plan', () => {
  const app = makeApp();
  const $ = app.getElementById;
  $('business').value = 'Test Bakery';
  $('category').value = 'food';
  $('language').value = 'hinglish';
  $('offer').value = 'Fresh bread combo';
  $('area').value = 'Pune';
  $('tone').value = 'friendly';
  let prevented = false;
  $('kitForm').listeners.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.match($('caption').textContent, /Test Bakery/);
  assert.match($('caption').textContent, /Fresh bread combo/);
  assert.match($('whatsapp').textContent, /Test Bakery/);
  assert.match($('whatsapp').textContent, /Fresh bread combo/);
  assert.equal(($('calendar').innerHTML.match(/<li>/g) || []).length, 7);
  assert.equal(($('ads').innerHTML.match(/<li>/g) || []).length, 3);
});

test('Hindi and English modes produce language-specific promotional text', () => {
  for (const [language, expected] of [['hindi', 'नमस्ते'], ['english', 'Hello from']]) {
    const app = makeApp();
    const $ = app.getElementById;
    $('business').value = 'Local Studio';
    $('category').value = 'other';
    $('language').value = language;
    $('offer').value = 'Weekend special';
    $('tone').value = 'premium';
    $('kitForm').listeners.submit({ preventDefault() {} });
    assert.ok($('whatsapp').textContent.includes(expected), language + ' message should use the selected language');
    assert.match($('caption').textContent, /Weekend special/);
  }
});

test('user-provided text is escaped in generated list markup', () => {
  const app = makeApp();
  const $ = app.getElementById;
  $('business').value = '<img src=x onerror=alert(1)>';
  $('category').value = 'other';
  $('language').value = 'english';
  $('offer').value = '<script>alert(1)</script>';
  $('tone').value = 'friendly';
  $('kitForm').listeners.submit({ preventDefault() {} });
  assert.doesNotMatch($('ads').innerHTML, /<script>/i);
  assert.doesNotMatch($('ads').innerHTML, /<img/i);
  assert.match($('ads').innerHTML, /&lt;script&gt;/i);
});
