// node --test test/  — no browser, no network, no model.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildData } from '../scripts/build-data.mjs';
import { resolveName, featureAttestation, pickRandom } from '../public/js/guard.js';
import { buildNave, HOTSPOTS, DIM, pointed } from '../public/js/nave.js';
import { resolvePath, server } from '../server.mjs';

const { errors, data } = await buildData();
const B = data.buildings;

test('every curated claim is backed by a verbatim Wikipedia quote', () => assert.deepEqual(errors, []));

test('every building has verified core fields and a licensed, credited image', () => {
  assert.ok(B.length >= 3);
  for (const b of B) {
    assert.match(b.verified.qid, /^Q\d+$/);
    assert.ok(b.verified.coordinates.lat && b.verified.coordinates.lon, b.id);
    assert.ok(b.verified.wikipedia_url.startsWith('https://en.wikipedia.org/'));
    assert.ok(b.verified.styles.some((s) => /gothic/i.test(s)), `${b.id} style`);
    assert.ok(b.image.license && b.image.commons_page && b.image.author, `${b.id} image credit`);
    assert.ok(b.scenes.length >= 4);
    for (const s of b.scenes) { assert.equal(s.plate_status, 'ILLUSTRATIVE'); assert.ok(s.quote && s.source); }
  }
});

test('image files exist locally', async () => {
  for (const b of B) assert.ok((await readFile(new URL(`../public${b.image.local}`, import.meta.url))).length > 10000);
});

test('name resolution only returns verified buildings and refuses unknowns', () => {
  assert.equal(resolveName('chartres', B).building.id, 'chartres');
  assert.equal(resolveName('Notre Dame de Paris', B).building.id, 'notre-dame-paris');
  assert.equal(resolveName('Kölner Dom Cologne', B).building.id, 'cologne');
  const unk = resolveName('Hogwarts Castle', B);
  assert.equal(unk.kind, 'unconfirmed');
  assert.ok(unk.suggestions.every((s) => B.includes(s)));
  assert.equal(resolveName('ab', B).kind, 'too-short');
  assert.equal(resolveName('<script>alert(1)</script>', B).kind, 'unconfirmed');
});

test('features are only marked verified when the source names them for that building', () => {
  const chartres = B.find((b) => b.id === 'chartres'), paris = B.find((b) => b.id === 'notre-dame-paris'), cologne = B.find((b) => b.id === 'cologne');
  assert.equal(featureAttestation(chartres, 'flying-buttress').status, 'VERIFIED');
  assert.equal(featureAttestation(paris, 'rib-vault').status, 'VERIFIED');
  assert.equal(featureAttestation(cologne, 'rib-vault').status, 'GENERAL');
  assert.equal(featureAttestation(chartres, 'rose-window').status, 'GENERAL');
});

test('random never repeats the current building', () => {
  for (let i = 0; i < 50; i++) assert.notEqual(pickRandom(B, 'chartres').id, 'chartres');
});

test('3D nave builds, every hotspot has geometry, and framings are sane', () => {
  const { group, features } = buildNave();
  let meshes = 0; group.traverse((o) => { if (o.isMesh) meshes++; });
  assert.ok(meshes > 150, `meshes=${meshes}`);
  for (const h of HOTSPOTS) {
    assert.ok(features[h.key]?.length, `no geometry for ${h.key}`);
    assert.ok(data.glossary[h.key], `no glossary for ${h.key}`);
    assert.ok([...h.cam, ...h.target, ...h.pin].every(Number.isFinite));
  }
  assert.ok(Math.abs(pointed(0, 5) - 5 * Math.sqrt(3)) < 1e-9);
  assert.equal(pointed(5, 5), 0);
  assert.ok(DIM.spring > DIM.triforiumTop);
});

test('server: path traversal is blocked and only GET is served', async () => {
  assert.equal(resolvePath('/../server.mjs'), null);
  assert.equal(resolvePath('/%2e%2e/server.mjs'), null);
  assert.equal(resolvePath('/a%00b'), null);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const ok = await fetch(base + '/'); assert.equal(ok.status, 200);
  assert.match(ok.headers.get('content-security-policy'), /script-src 'self' 'sha256-/);
  assert.equal((await fetch(base + '/%2e%2e/%2e%2e/etc/passwd')).status >= 400, true);
  assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
  assert.equal((await fetch(base + '/data/buildings.json')).status, 200);
  assert.equal((await fetch(base + '/js/app.js')).status, 200);
  server.close();
});
