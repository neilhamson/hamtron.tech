const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function harness(overrides = {}, exists = true, fail = false) {
  const env = { NODE_ENV: 'development', HALF_ECHO_LOCAL_PREVIEW: 'true', ...overrides };
  const reads = [];
  const cache = new Map();
  function load(file) {
    file = path.resolve(file); if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const scopedRequire = spec => {
      if (spec === 'node:fs') return { existsSync: () => exists };
      if (spec === 'node:path') return path;
      if (spec === 'node:fs/promises') return { readFile: async p => { reads.push(p); if (fail) throw new Error('private filesystem diagnostic'); return Buffer.from('audio bytes'); } };
      if (spec.startsWith('.')) return load(path.resolve(path.dirname(file), spec + '.ts'));
      throw new Error(spec);
    };
    vm.runInNewContext('(function(require,module,exports,process){' + code + '\n})', { Response, Uint8Array })(scopedRequire, module, module.exports, { env, cwd: () => '/local-preview' });
    return module.exports;
  }
  return { route: load('app/api/half-echo/preview/no-respawn/route.ts'), reads };
}

test('production blocks preview even when the file and flag are present', async () => {
  const h = harness({ NODE_ENV: 'production' }); assert.equal((await h.route.GET()).status, 503); assert.equal(h.reads.length, 0);
});
test('disabled or absent local media is not read', async () => {
  for (const h of [harness({ HALF_ECHO_LOCAL_PREVIEW: 'false' }), harness({}, false)]) {
    assert.equal((await h.route.GET()).status, 503); assert.equal(h.reads.length, 0);
  }
});
test('enabled preview serves only the fixed MP3 path with audio headers', async () => {
  const h = harness(); const r = await h.route.GET();
  assert.equal(r.status, 200); assert.equal(r.headers.get('content-type'), 'audio/mpeg');
  assert.equal(r.headers.get('cache-control'), 'no-store'); assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(await r.text(), 'audio bytes'); assert.deepEqual(h.reads, ['/local-preview/.local-media/No_Respawn_Web.mp3']);
});
test('filesystem failures return a generic message', async () => {
  const h = harness({}, true, true); const r = await h.route.GET(); assert.equal(r.status, 404); assert.doesNotMatch(await r.text(), /filesystem|diagnostic|local-preview/);
});
