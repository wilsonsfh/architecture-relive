#!/usr/bin/env node
// Q7 progress feed. Reads local files only, never the network.
// Usage:
//   node analysis/q7-feed/feed.mjs           -> prints NO_CHANGE, or the message to send
//   node analysis/q7-feed/feed.mjs --commit  -> records the current state as sent
// The hash ignores timestamps, so an unchanged state is never re-sent.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const FEED_DIR = path.join(ROOT, 'analysis', 'q7-feed');
const HASH_FILE = path.join(FEED_DIR, '.last-sent-hash');
const SKIP = new Set(['node_modules', '.git', 'shots', '.DS_Store']);

const PROBLEMS = [
  { n: 1, name: 'Proof (desktop voice input)', paths: ['analysis/p1-walkthrough', 'analysis/p1-desktop-voice-input.md', 'analysis/p1-comparison.md'] },
  { n: 2, name: 'LOWKEY CABO (2-player 3D card game)', paths: ['analysis/p2-prototype'] },
  { n: 3, name: 'Patchbay (code-mode plugin harness)', paths: ['analysis/p3-prototype'] },
  { n: 4, name: 'TRACE (Chrome side-panel agent)', paths: ['analysis/p4-prototype'] },
  { n: 5, name: 'Relay (MCP terminal controller)', paths: ['relay', 'analysis/p5-audit'] },
  { n: 6, name: 'Glassbox (verifiable encrypted P2P chat)', paths: ['analysis/p6-prototype', 'analysis/p6-security'] },
];

function walk(abs, out) {
  let st;
  try { st = fs.statSync(abs); } catch { return; }
  if (st.isFile()) { out.push({ abs, mtime: st.mtimeMs }); return; }
  if (!st.isDirectory()) return;
  for (const name of fs.readdirSync(abs)) {
    if (SKIP.has(name) || name.startsWith('.')) continue;
    walk(path.join(abs, name), out);
  }
}

function statusSection(dir) {
  const candidates = ['PROGRESS.md', 'STATUS.md', 'FEATURES.md', 'README.md'];
  for (const c of candidates) {
    const f = path.join(ROOT, dir, c);
    if (!fs.existsSync(f)) continue;
    const text = fs.readFileSync(f, 'utf8');
    const m = text.match(/^##\s*Status[^\n]*\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/m);
    const body = (m ? m[1] : text.split(/^##\s/m).slice(-1)[0]).trim();
    return { file: path.join(dir, c), text: body.replace(/\n{2,}/g, '\n').slice(0, 700) };
  }
  return null;
}

function jobLines(n) {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'dashboard', 'status.json'), 'utf8'));
    const re = new RegExp(`(Problem|problem|P)\\s?${n}\\b`);
    return Object.entries(s.jobs || {})
      .filter(([, j]) => re.test(j.brief || ''))
      .map(([id, j]) => `${id} ${j.status}: ${j.brief}`);
  } catch { return []; }
}

function identities() {
  try {
    const d = fs.readFileSync(path.join(ROOT, 'analysis', '00-digest-all-problems.md'), 'utf8');
    return d.split('\n').filter((l) => /^\|\s*[1-7]\s*\|/.test(l)).join('\n');
  } catch { return ''; }
}

const sections = [];
const stable = [];
for (const p of PROBLEMS) {
  const files = [];
  for (const rel of p.paths) walk(path.join(ROOT, rel), files);
  files.sort((a, b) => b.mtime - a.mtime);
  const latest = files.slice(0, 4).map((f) => path.relative(ROOT, f.abs));
  const last = files[0] ? new Date(files[0].mtime).toISOString().slice(11, 16) + 'Z' : 'none';
  const dirForStatus = p.paths.find((x) => !x.endsWith('.md'));
  const st = dirForStatus ? statusSection(dirForStatus) : null;
  const jobs = jobLines(p.n);
  stable.push([p.n, files.length, latest.join(','), st?.text || '', jobs.join(',')].join('|'));
  sections.push([
    `### ${p.n}. ${p.name}`,
    `Files: ${files.length}, last write ${last}. Latest: ${latest.join(', ') || 'none'}`,
    jobs.length ? `Jobs: ${jobs.join('; ')}` : 'Jobs: none recorded',
    st ? `Status (${st.file}):\n${st.text}` : 'Status: no PROGRESS/STATUS file yet',
  ].join('\n'));
}

const hash = crypto.createHash('sha256').update(stable.join('\n')).digest('hex');
fs.mkdirSync(FEED_DIR, { recursive: true });

if (process.argv.includes('--commit')) {
  fs.writeFileSync(HASH_FILE, hash + '\n');
  console.log('COMMITTED ' + hash.slice(0, 12));
  process.exit(0);
}

const prev = fs.existsSync(HASH_FILE) ? fs.readFileSync(HASH_FILE, 'utf8').trim() : '';
if (prev === hash) { console.log('NO_CHANGE'); process.exit(0); }

const msg = [
  `Progress feed from the coordinator task (8 Questions breakdown), ${new Date().toISOString().slice(0, 16)}Z. Read-only information, no reply needed.`,
  'Purpose: keep Problem 7 distinct. Do not reuse these ideas, signature features, visual identities or skill showcases. Problem 7 must be a different kind of experience.',
  '',
  '## Taken identities (from analysis/00-digest-all-problems.md)',
  identities(),
  '',
  '## Current progress per problem',
  sections.join('\n\n'),
].join('\n');

fs.writeFileSync(path.join(FEED_DIR, 'latest.md'), msg + '\n');
console.log(msg);
