import { cp, mkdir, readdir, readFile, writeFile, rm, open } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = root + '.cloudflare/site';
for (const name of await readdir(root + 'app/public/cache/gen')) {
  if (!name.endsWith('.mp4')) continue;
  const file = await open(root + 'app/public/cache/gen/' + name);
  const header = Buffer.alloc(64);
  try { await file.read(header, 0, 64, 0); } finally { await file.close(); }
  if (header.toString().startsWith('version https://git-lfs.github.com/')) throw new Error('Runtime media is still a Git LFS pointer. Run git lfs pull --include="app/public/**" before building.');
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(root + 'app/public', output, { recursive: true });
const records = JSON.parse(await readFile(root + 'app/public/data/buildings.json', 'utf8')).buildings;
const photos = {};
for (const filename of await readdir(root + 'app/data/dynamic')) {
  if (!filename.endsWith('.json')) continue;
  const data = JSON.parse(await readFile(root + 'app/data/dynamic/' + filename, 'utf8'));
  if (filename.endsWith('.scenephotos.json')) photos[filename.replace('.scenephotos.json', '')] = data;
  else if (data.id && !records.some(record => record.id === data.id)) records.push(data);
}
await writeFile(output + '/hosted-records.json', JSON.stringify({ records, photos }));

const appFile = output + '/js/app.js';
const app = await readFile(appFile, 'utf8');
await writeFile(appFile, app.replace('or type any building', 'or search saved buildings').replace('buildings ready, or type any real one. Photo and generate modes come next.', 'saved buildings ready. Live lookup and AI generation require the local app.'));
