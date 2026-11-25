// Pre-resolve the world-tour presets through the SAME guarded pipeline as typed names.
// Usage: node scripts/prefetch-presets.mjs [--model]   (--model uses OPENROUTER_API_KEY if set)
import { writeFile, rm } from 'node:fs/promises';
import { resolveBuilding, slug } from '../lib/resolve.mjs';
const useModel = process.argv.includes('--model');
const TITLES = [
  'Colosseum','Hagia Sophia','Taj Mahal','Sagrada Família','Great Wall of China','St. Peter\'s Basilica','Palace of Versailles',
  'Pantheon, Rome','Parthenon','Sultan Ahmed Mosque','Chrysler Building','Barbican Estate','Villa Savoye','Leaning Tower of Pisa',
  'Saint Basil\'s Cathedral','Peleș Castle','King\'s College Chapel, Cambridge','Radcliffe Camera','Sterling Memorial Library','Widener Library',
  'Elliott Hall of Music','Angkor Wat','Forbidden City','Alhambra','Florence Cathedral','Lincoln Memorial','Chichen Itza','Sydney Opera House','Golden Temple','Casa Batlló',
];
const out = [], failed = [];
let next = 0;
async function worker() {
  while (next < TITLES.length) {
    const t = TITLES[next++];
    try {
      if (useModel) await rm(new URL(`../data/dynamic/${slug(t)}.json`, import.meta.url), { force: true });
      const r = await resolveBuilding(t, { useModel, title: t });
      out.push({ id: r.id, name: r.name, city: r.city, style: r.verified.styles[0] || null, scenes: r.scenes.length, photos: r.photos.length, story: r.story_status });
      console.log('ok  ', t, '->', r.id, r.scenes.length, 'scenes', r.photos.length, 'photos', r.story_status);
    } catch (e) { failed.push({ t, why: e.message }); console.log('skip', t, '-', e.message); }
  }
}
await worker();
out.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(new URL('../public/data/presets.json', import.meta.url), JSON.stringify({ generated_at: new Date().toISOString(), presets: out, failed }, null, 1));
console.log(`done: ${out.length} presets, ${failed.length} skipped`);
