// Grounded building resolver. Server-side only.
// Facts come from Wikipedia + Wikidata. Photos only from Commons with a CC/PD licence.
// Story scenes are either EXTRACTED (verbatim sentences) or MODEL-SUGGESTED captions
// whose quote must appear verbatim in the article text. Nothing else is shown.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { suggestScenes } from './llm.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const CACHE_JSON = ROOT + 'data/dynamic/';
const CACHE_IMG = ROOT + 'public/cache/';
const UA = 'ArchitectureMagic/0.1 (local interview prototype; contact via Manus)';
const T = 12000;

export const norm = (s) => String(s).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();
export const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// One request at a time, ~350 ms apart: polite to Wikimedia and avoids 429s.
let lastReq = 0, chain = Promise.resolve();
const pace = () => (chain = chain.then(async () => { const w = lastReq + 350 - Date.now(); if (w > 0) await new Promise((r) => setTimeout(r, w)); lastReq = Date.now(); }));
async function getJSON(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await pace();
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' }, signal: AbortSignal.timeout(T) });
      if (r.status === 429 || r.status >= 500) { const ra = Number(r.headers.get('retry-after')); throw Object.assign(new Error('retry ' + r.status), { wait: ra ? Math.min(ra, 20) * 1000 : 0 }); }
      if (!r.ok) throw Object.assign(new Error('http ' + r.status), { fatal: true });
      return await r.json();
    } catch (e) {
      if (e.fatal || attempt === 4) throw e;
      await new Promise((res) => setTimeout(res, e.wait || 1500 * 2 ** attempt));
    }
  }
}
const WP = 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&';

// Glossary keys we can attest from text (only when the article itself uses the term).
const FEATURE_WORDS = {
  'nave': /\bnave\b/i, 'pointed-arch': /\bpointed arch/i, 'rib-vault': /\brib(bed)? vault/i,
  'flying-buttress': /\bflying buttress/i, 'triforium': /\btriforium/i, 'clerestory': /\bclerestor/i,
  'rose-window': /\brose window/i,
};
// Illustration choice for a scene: keyword -> plate. Plates are illustrative only.
const PLATE_WORDS = [
  [/\bwall|fortif|rampart|garrison/i, 'wall'], [/\bdome|cupola/i, 'dome'], [/\bcolumn|portico|colonnade|temple/i, 'columns'],
  [/\bminaret|tower|spire|steeple/i, 'spires'], [/\bfire|collapse|destroy|bomb|earthquake|damage/i, 'fracture'],
  [/\brestor|renovat|rebuil|reconstruct/i, 'restoration'], [/\bglass|window/i, 'glass'], [/\bbuttress/i, 'buttress'],
  [/\bpilgrim|visitor|tourist|touris/i, 'pilgrims'], [/\bunesco|heritage|listed|museum/i, 'book'],
];
const pickPlate = (s, i) => (PLATE_WORDS.find(([re]) => re.test(s)) || [null, ['rise', 'arch-shift', 'volume', 'layers'][i % 4]])[1];

async function searchTitle(q) {
  const d = await getJSON(WP + 'action=query&list=search&srlimit=5&srprop=&srsearch=' + encodeURIComponent(q));
  return d.query?.search?.map((s) => s.title) || [];
}
async function pageBundle(title) {
  const d = await getJSON(WP + 'action=query&redirects=1&prop=extracts|pageprops|coordinates|description|images&explaintext=1&exsectionformat=wiki&imlimit=40&titles=' + encodeURIComponent(title));
  const p = d.query?.pages?.[0];
  if (!p || p.missing) return null;
  return p;
}
async function wikidata(qid) {
  const e = (await getJSON(`https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`)).entities[qid];
  const claim = (P) => e.claims?.[P]?.map((c) => c.mainsnak?.datavalue?.value).filter(Boolean) || [];
  const ids = [...claim('P149'), ...claim('P17'), ...claim('P131'), ...claim('P31')].map((v) => v.id).filter(Boolean);
  let labels = {};
  if (ids.length) {
    const L = await getJSON(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=labels&languages=en&ids=${[...new Set(ids)].slice(0, 45).join('|')}`);
    for (const [id, v] of Object.entries(L.entities || {})) labels[id] = v.labels?.en?.value;
  }
  const lab = (P) => claim(P).map((v) => labels[v.id]).filter(Boolean);
  const coord = claim('P625')[0];
  return {
    qid, label: e.labels?.en?.value,
    coordinates: coord ? { lat: coord.latitude, lon: coord.longitude } : null,
    styles: lab('P149'), country: lab('P17')[0] || null, located_in: lab('P131')[0] || null,
    instance_of: lab('P31'), inception: claim('P571')[0]?.time || null,
  };
}
// Split plain-text article into [{heading, sentence}] for the first few sections.
function sentences(extract) {
  const out = []; let heading = 'Overview';
  for (const block of extract.split('\n')) {
    const h = /^==+\s*(.+?)\s*==+$/.exec(block.trim());
    if (h) { heading = h[1]; continue; }
    if (/^(See also|References|Notes|Further reading|External links|Bibliography|Sources|Gallery|Citations)$/i.test(heading)) continue;
    for (const s of block.match(/[^.!?]+[.!?]+(?=\s|$)/g) || []) {
      const t = s.trim();
      if (t.length > 40 && t.length < 320) out.push({ heading, sentence: t });
    }
  }
  return out;
}
const YEAR = /\b(1[0-9]{3}|20[0-2][0-9]|[1-9][0-9]{2}) ?(BC|BCE|AD|CE)?\b(?!\s?(m|km|metres|meters|miles?|li|ft|feet|tonnes?|kg|years?)\b)|\b(\d{1,2})(st|nd|rd|th) century( BC)?/;
function extractScenes(sents, url) {
  const dated = sents.filter((s) => YEAR.test(s.sentence) && !/^Overview$/.test(s.heading) || YEAR.test(s.sentence));
  const seen = new Set(); const picked = [];
  for (const s of dated) {
    const y = YEAR.exec(s.sentence)[0];
    if (seen.has(y)) continue; seen.add(y); picked.push({ ...s, year: y });
    if (picked.length >= 6) break;
  }
  const yr = (y) => { const m = /(\d+)/.exec(y); let n = m ? +m[1] : 0; if (/century/.test(y)) n = n * 100 - 50; if (/BC/.test(y)) n = -n; return n; };
  picked.sort((a, b) => yr(a.year) - yr(b.year));
  return picked.map((s, i) => ({
    year: s.year, title: s.heading, caption: s.sentence, quote: s.sentence, plate: pickPlate(s.sentence, i),
    caption_status: 'EXTRACTED', plate_status: 'ILLUSTRATIVE', source: url,
  }));
}
const OK_LICENCE = /^(cc[- ]by|cc[- ]by[- ]sa|cc0|public domain|pd)/i;
async function photos(fileTitles, id, max = 6) {
  const files = fileTitles.filter((t) => /\.(jpe?g)$/i.test(t) && !/logo|map|plan|coat|flag|icon|seal|signature/i.test(t)).slice(0, 24);
  if (!files.length) return [];
  const d = await getJSON('https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&action=query&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1280&titles=' + encodeURIComponent(files.join('|')));
  const out = [];
  await mkdir(CACHE_IMG, { recursive: true });
  for (const p of d.query?.pages || []) {
    const ii = p.imageinfo?.[0]; if (!ii || out.length >= max) continue;
    const md = ii.extmetadata || {};
    const lic = md.LicenseShortName?.value || '';
    if (!OK_LICENCE.test(lic) || ii.width < 800 || ii.width < ii.height * 0.6) continue;
    const author = (md.Artist?.value || 'Wikimedia Commons').replace(/<[^>]+>/g, '').trim().slice(0, 80);
    const local = `/cache/${id}-${out.length}.jpg`;
    try {
      await pace();
      const r = await fetch(ii.thumburl, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(T) });
      if (!r.ok) continue;
      await writeFile(ROOT + 'public' + local, Buffer.from(await r.arrayBuffer()));
    } catch { continue; }
    out.push({ local, commons_page: ii.descriptionurl, license: lic, license_url: md.LicenseUrl?.value || null, author, status: 'VERIFIED', file: p.title.replace(/^File:/, '') });
  }
  return out;
}

export class Refusal extends Error { constructor(msg, extra = {}) { super(msg); this.refusal = true; Object.assign(this, extra); } }

// Main entry. `q` is a user-typed name or a Wikipedia title. Returns a building record.
export async function resolveBuilding(q, { useModel = true, title: knownTitle } = {}) {
  q = String(q || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 80);
  if (q.length < 3) throw new Refusal('Type at least three letters.');
  const key = slug(knownTitle || q);
  const cached = CACHE_JSON + key + '.json';
  if (existsSync(cached)) return JSON.parse(await readFile(cached, 'utf8'));

  const titles = knownTitle ? [knownTitle] : await searchTitle(q);
  if (!titles.length) throw new Refusal(`I can't find a Wikipedia article for “${q}”.`);
  let page = null, wd = null;
  for (const t of titles.slice(0, 3)) {
    const p = await pageBundle(t);
    const qid = p?.pageprops?.wikibase_item;
    if (!qid) continue;
    const w = await wikidata(qid);
    if (!w.coordinates) continue; // no coordinates: fictional, abstract or not a place
    page = p; wd = w; break;
  }
  if (!page) throw new Refusal(`I can't confirm “${q}” as a real place with coordinates, so I won't make one up.`);

  const url = 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title.replace(/ /g, '_'));
  const id = slug(page.title);
  const sents = sentences(page.extract || '');
  const text = norm(page.extract || '');
  let scenes = null, storyStatus = 'EXTRACTED', model = null;
  if (useModel) {
    try {
      const r = await suggestScenes(page.title, sents.slice(0, 120).map((s) => `[${s.heading}] ${s.sentence}`).join('\n'));
      if (r) {
        const ok = r.scenes.filter((s) => s.quote && text.includes(norm(s.quote)) && s.title && s.caption);
        if (ok.length >= 3) {
          scenes = ok.slice(0, 6).map((s, i) => ({ year: String(s.year || '').slice(0, 24), title: String(s.title).slice(0, 60), caption: String(s.caption).slice(0, 220), quote: s.quote, plate: pickPlate(s.quote + ' ' + s.caption, i), caption_status: 'MODEL-SUGGESTED', plate_status: 'ILLUSTRATIVE', source: url }));
          storyStatus = 'MODEL-SUGGESTED'; model = r.model;
        }
      }
    } catch (e) { console.error('model storyline failed:', e.status || e.code || e.message); }
  }
  if (!scenes) scenes = extractScenes(sents, url);
  if (scenes.length < 2) throw new Refusal(`I found ${page.title} but its article has too little dated history for a storyline.`);

  const attested = [];
  for (const [feature, re] of Object.entries(FEATURE_WORDS)) {
    const s = sents.find((x) => re.test(x.sentence));
    if (s) attested.push({ feature, quote: s.sentence, status: 'VERIFIED', source: url });
  }
  const pics = await photos((page.images || []).map((i) => i.title), id).catch(() => []);
  const gothic = [...wd.styles, page.description || ''].some((s) => /gothic/i.test(s));
  const construction = sents.find((s) => /\b(built|constructed|construction|completed|erected)\b/i.test(s.sentence) && YEAR.test(s.sentence));
  const rec = {
    id, name: wd.label || page.title, city: [wd.located_in, wd.country].filter(Boolean).join(', ') || page.description || '',
    tagline: page.description ? page.description[0].toUpperCase() + page.description.slice(1) + '.' : '',
    origin: 'resolver', story_status: storyStatus, model, gothic,
    verified: {
      status: 'VERIFIED', qid: wd.qid, wikidata_url: `https://www.wikidata.org/wiki/${wd.qid}`, wikipedia_url: url,
      coordinates: wd.coordinates, country: wd.country, styles: wd.styles, instance_of: wd.instance_of,
      inception: wd.inception, retrieved_at: new Date().toISOString(),
    },
    construction: construction ? { status: 'VERIFIED', quote: construction.sentence, source: url } : null,
    image: pics[0] || null, photos: pics, attested_features: attested, scenes,
  };
  await mkdir(CACHE_JSON, { recursive: true });
  await writeFile(CACHE_JSON + key + '.json', JSON.stringify(rec, null, 1));
  if (key !== id) await writeFile(CACHE_JSON + id + '.json', JSON.stringify(rec, null, 1));
  return rec;
}
export async function cachedById(id) {
  const f = CACHE_JSON + slug(id) + '.json';
  return existsSync(f) ? JSON.parse(await readFile(f, 'utf8')) : null;
}

// ---- Per-scene photos: Commons full-text search per scene. Closest OPEN match, never claimed exact. ----
const STOP = new Set('which their there where these those about after before during under between would could should while other later built first early among within through since because however also being were been have from with that this into over only then than more most such many some both each very upon what when'.split(' '));
const keywords = (sc) => [...new Set((sc.quote.match(/[A-Za-z\u00C0-\u017F]{5,}/g) || []).map((w) => w.toLowerCase()).filter((w) => !STOP.has(w)))].slice(0, 4).join(' ');
const BAD_FILE = /\bmap\b|maps|sheet|loc[ _-]|library of congress|outline|atlas|chart|manuscript|book|page|guang|yu tu|logo|map|plan|coat|flag|icon|seal|signature|diagram|drawing|engraving|stamp|coin|portrait|poster|\.svg|\.pdf|\.tif|\.png|\.gif/i;
async function findPhoto(query, id, n, used, name = '') {
  const nameWords = name.toLowerCase().split(/[^a-z\u00c0-\u017f]+/).filter((w) => w.length > 3 && !STOP.has(w));
  const d = await getJSON('https://commons.wikimedia.org/w/api.php?format=json&formatversion=2&action=query&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=' + encodeURIComponent(query + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1280');
  for (const p of (d.query?.pages || []).sort((a, b) => a.index - b.index)) {
    const ii = p.imageinfo?.[0]; if (!ii || used.has(p.title) || BAD_FILE.test(p.title) || !/\.jpe?g$/i.test(p.title)) continue;
    if (nameWords.length && !nameWords.some((w) => p.title.toLowerCase().includes(w))) continue;
    const md = ii.extmetadata || {}, lic = md.LicenseShortName?.value || '';
    if (!OK_LICENCE.test(lic) || ii.width < 900) continue;
    const local = `/cache/${id}-s${n}.jpg`;
    try { await pace(); const r = await fetch(ii.thumburl, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(T) }); if (!r.ok) continue; await writeFile(ROOT + 'public' + local, Buffer.from(await r.arrayBuffer())); } catch { continue; }
    used.add(p.title);
    return { local, commons_page: ii.descriptionurl, license: lic, license_url: md.LicenseUrl?.value || null, author: (md.Artist?.value || 'Wikimedia Commons').replace(/<[^>]+>/g, '').trim().slice(0, 80), file: p.title.replace(/^File:/, ''), match: 'closest open photo by keyword search', status: 'VERIFIED' };
  }
  return null;
}
const sceneLocks = new Map();
export async function scenePhotos(rec) {
  const f = CACHE_JSON + slug(rec.id) + '.scenephotos.json';
  if (existsSync(f)) return JSON.parse(await readFile(f, 'utf8'));
  if (sceneLocks.has(rec.id)) return sceneLocks.get(rec.id);
  const job = (async () => {
    await mkdir(CACHE_IMG, { recursive: true }); await mkdir(CACHE_JSON, { recursive: true });
    const used = new Set(), out = [];
    for (let i = 0; i < rec.scenes.length; i++) {
      const q = `${rec.name} ${keywords(rec.scenes[i])}`;
      let ph = null;
      try { ph = await findPhoto(q, slug(rec.id), i, used, rec.name); if (!ph) ph = await findPhoto(`${rec.name} ${rec.scenes[i].title}`, slug(rec.id), i, used, rec.name); if (!ph) ph = await findPhoto(rec.name, slug(rec.id), i, used, rec.name); } catch (e) { console.error('scene photo', rec.id, i, e.message); }
      out.push(ph);
    }
    if (out.some(Boolean)) await writeFile(f, JSON.stringify(out, null, 1)); // never cache a total miss (could be a rate limit)
    return out;
  })().finally(() => sceneLocks.delete(rec.id));
  sceneLocks.set(rec.id, job);
  return job;
}
export async function anyRecord(id) {
  const r = await cachedById(id); if (r) return r;
  try { const d = JSON.parse(await readFile(ROOT + 'public/data/buildings.json', 'utf8')); return d.buildings.find((b) => b.id === id) || null; } catch { return null; }
}
