// Merges VERIFIED facts (data/sources.json) with CURATED text (data/curated.json)
// into public/data/buildings.json. Refuses to build if any curated claim is not
// backed by a verbatim quote in the stored Wikipedia intro for that building.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = async (p) => readFile(new URL(p, root), 'utf8');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

export async function buildData() {
  const sources = JSON.parse(await read('data/sources.json'));
  const curated = JSON.parse(await read('data/curated.json'));
  const errors = [];
  const buildings = [];

  for (const src of sources.buildings) {
    const cur = curated.buildings[src.id];
    if (!cur) { errors.push(`${src.id}: no curated entry`); continue; }
    const intro = norm(await read(`data/intros/${cur.intro_file}`));
    const check = (quote, where) => {
      if (!quote || !intro.includes(norm(quote))) errors.push(`${src.id} ${where}: quote not found verbatim in Wikipedia intro`);
    };
    check(cur.construction_quote, 'construction');
    cur.attested_features.forEach((f, i) => {
      check(f.quote, `feature[${i}]`);
      if (!curated.glossary[f.feature]) errors.push(`${src.id} feature[${i}]: '${f.feature}' not in glossary`);
    });
    cur.scenes.forEach((s, i) => check(s.quote, `scene[${i}]`));
    if (!src.image?.license || !src.image?.commons_page) errors.push(`${src.id}: image lacks licence or credit`);

    buildings.push({
      id: src.id,
      name: src.name,
      city: cur.city,
      tagline: cur.tagline,
      verified: {
        status: 'VERIFIED',
        qid: src.qid,
        wikidata_url: src.wikidata_url,
        wikipedia_url: src.wikipedia_url,
        coordinates: src.coordinates,
        country: src.country,
        styles: src.styles_wikidata,
        inception: src.inception_wikidata,
        retrieved_at: sources.retrieved_at,
      },
      construction: { status: 'VERIFIED', quote: cur.construction_quote, source: src.wikipedia_url },
      image: { ...src.image, status: 'VERIFIED' },
      attested_features: cur.attested_features.map((f) => ({ ...f, status: 'VERIFIED', source: src.wikipedia_url })),
      scenes: cur.scenes.map((s) => ({
        ...s,
        caption_status: 'CURATED',
        plate_status: 'ILLUSTRATIVE',
        source: src.wikipedia_url,
      })),
    });
  }

  return { errors, data: { generated_at: new Date().toISOString(), glossary: curated.glossary, buildings } };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { errors, data } = await buildData();
  if (errors.length) {
    console.error('REFUSING TO BUILD. Unverified claims:\n- ' + errors.join('\n- '));
    process.exit(1);
  }
  await mkdir(new URL('public/data/', root), { recursive: true });
  await writeFile(new URL('public/data/buildings.json', root), JSON.stringify(data, null, 2));
  console.log(`built ${data.buildings.length} buildings, ${data.buildings.reduce((n, b) => n + b.scenes.length, 0)} scenes, all quotes verified`);
}
