// Fetches verified facts for the curated buildings from Wikidata + Wikipedia
// and stores them locally with citation URLs. Run: node scripts/fetch-sources.mjs
import { writeFile, mkdir } from 'node:fs/promises';

const stripHtml = (s) => (s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const BUILDINGS = [
  { id: 'chartres', qid: 'Q180274' },
  { id: 'notre-dame-paris', qid: 'Q2981' },
  { id: 'cologne', qid: 'Q4176' },
  { id: 'amiens', qid: 'Q106934' },
];

const UA = { 'User-Agent': 'ArchitectureExplorerPrototype/0.1 (interview prototype)' };
const getJson = async (url) => {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
};

const firstValue = (claims, p) => claims[p]?.[0]?.mainsnak?.datavalue?.value;

async function labels(qids) {
  if (!qids.length) return {};
  const d = await getJson(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${qids.join('|')}&props=labels&languages=en&format=json`);
  return Object.fromEntries(Object.entries(d.entities).map(([k, v]) => [k, v.labels?.en?.value ?? k]));
}

const out = { retrieved_at: new Date().toISOString(), buildings: [] };

for (const b of BUILDINGS) {
  const d = await getJson(`https://www.wikidata.org/wiki/Special:EntityData/${b.qid}.json`);
  const e = d.entities[b.qid];
  const c = e.claims;
  const coord = firstValue(c, 'P625');
  const inception = firstValue(c, 'P571');
  const styleIds = (c.P149 || []).map((s) => s.mainsnak?.datavalue?.value?.id).filter(Boolean);
  const countryId = firstValue(c, 'P17')?.id;
  const lab = await labels([...styleIds, countryId].filter(Boolean));
  // Image: Wikidata P18 -> Commons file -> licence + credit; downloaded locally.
  const fileName = firstValue(c, 'P18');
  if (!fileName) throw new Error(`no P18 image for ${b.qid}`);
  const ii = await getJson(
    `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=1600&format=json`);
  const info = Object.values(ii.query.pages)[0].imageinfo[0];
  const meta = info.extmetadata;
  const imgRes = await fetch(info.thumburl, { headers: UA });
  if (!imgRes.ok) throw new Error(`image download failed ${b.id}`);
  await mkdir(new URL('../public/img/', import.meta.url), { recursive: true });
  await writeFile(new URL(`../public/img/${b.id}.jpg`, import.meta.url), Buffer.from(await imgRes.arrayBuffer()));
  const title = e.sitelinks?.enwiki?.title;
  if (!title) throw new Error(`no enwiki sitelink for ${b.qid}`);
  const wp = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
  const rec = {
    id: b.id,
    qid: b.qid,
    name: e.labels.en.value,
    wikipedia_title: title,
    wikipedia_url: wp.content_urls?.desktop?.page,
    wikidata_url: `https://www.wikidata.org/wiki/${b.qid}`,
    coordinates: coord ? { lat: coord.latitude, lon: coord.longitude } : null,
    inception_wikidata: inception?.time ?? null,
    styles_wikidata: styleIds.map((s) => lab[s]),
    country: countryId ? lab[countryId] : null,
    wikipedia_extract: wp.extract,
    image: {
      local: `/img/${b.id}.jpg`,
      commons_file: fileName,
      commons_page: info.descriptionurl,
      license: meta.LicenseShortName?.value ?? null,
      license_url: meta.LicenseUrl?.value ?? null,
      author: stripHtml(meta.Artist?.value) || null,
    },
  };
  // Hard guardrail: refuse to emit a record missing verified core fields.
  for (const k of ['coordinates', 'wikipedia_url', 'wikipedia_extract']) {
    if (!rec[k]) throw new Error(`verification failed: ${b.id} missing ${k}`);
  }
  if (!rec.image.license || !rec.image.commons_page) throw new Error(`verification failed: ${b.id} image has no licence/credit`);
  out.buildings.push(rec);
  console.log('ok', b.id, rec.name, rec.styles_wikidata, rec.inception_wikidata, rec.coordinates);
}

await mkdir(new URL('../data/', import.meta.url), { recursive: true });
await writeFile(new URL('../data/sources.json', import.meta.url), JSON.stringify(out, null, 2));
console.log('wrote data/sources.json');
