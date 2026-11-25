// Guardrails shared by the UI and the tests. Pure functions, no DOM.

const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function aliases(b) {
  const city = b.city.split(',')[0];
  return [b.name, `${city} cathedral`, city, b.id.replace(/-/g, ' ')].map(fold);
}

// Resolve a typed name ONLY against the verified set. Never invents a building.
export function resolveName(query, buildings) {
  const q = fold(query || '');
  if (q.length < 3) return { kind: 'too-short' };
  const exact = buildings.filter((b) => aliases(b).some((a) => a === q || a.includes(q) || q.includes(a)));
  if (exact.length === 1) return { kind: 'match', building: exact[0] };
  if (exact.length > 1) return { kind: 'ambiguous', options: exact };
  const words = q.split(' ').filter((w) => w.length > 2 && w !== 'cathedral' && w !== 'the');
  const near = buildings.filter((b) => words.some((w) => aliases(b).some((a) => a.includes(w.slice(0, 4)))));
  return { kind: 'unconfirmed', suggestions: near.length ? near : buildings.slice(0, 3) };
}

// Is this glossary feature attested for this specific building by its source?
export function featureAttestation(building, featureKey) {
  const hit = building.attested_features.find((f) => f.feature === featureKey);
  return hit ? { status: 'VERIFIED', quote: hit.quote, source: hit.source } : { status: 'GENERAL' };
}

// Deterministic-free random pick that never repeats the current building.
export function pickRandom(buildings, currentId, rand = Math.random) {
  const pool = buildings.filter((b) => b.id !== currentId);
  return pool[Math.floor(rand() * pool.length)] ?? buildings[0];
}

export function yearFromWikidata(t) {
  const m = /^([+-])(\d+)-/.exec(t || '');
  return m ? Number(m[2]) * (m[1] === '-' ? -1 : 1) : null;
}
