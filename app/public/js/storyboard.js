// Line-art storyboard per scene: cream paper, thin black line, red accents only, small living animations.
// Procedural: the SCENE TEXT (title + caption) picks the building elevation and the action motifs.
// Illustrative only. Figures are anonymous stick figures; nothing here depicts a real person.
const K = '#1B1612', R = '#C23B2E';
const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) / 4294967296; };
const P = (d, o = '') => `<path class="draw" pathLength="1000" d="${d}" ${o}/>`;
const Pr = (d, o = '') => P(d, `stroke="${R}" ${o}`);
const fig = (x, y, c = K) => `<g stroke="${c}"><circle class="draw" pathLength="1000" cx="${x}" cy="${y - 10}" r="2.4"/>${P(`M${x} ${y - 7}V${y + 3}M${x - 3} ${y + 10}L${x} ${y + 3}L${x + 3} ${y + 10}M${x - 4} ${y - 2}L${x} ${y - 5}L${x + 4} ${y - 2}`)}</g>`;
const arch = (cx, base, w, h) => `M${cx - w} ${base}V${base - h}Q${cx - w} ${base - h - w * 1.1} ${cx} ${base - h - w * 1.7}Q${cx + w} ${base - h - w * 1.1} ${cx + w} ${base - h}V${base}`;
const hatch = (x, y, w, h, step = 6) => { let d = ''; for (let i = 0; i < w + h; i += step) { const x1 = Math.min(i, w), y1 = i > w ? i - w : 0, x2 = i > h ? i - h : 0, y2 = Math.min(i, h); d += `M${x + x1} ${y + y1}L${x + x2} ${y + y2}`; } return P(d, 'stroke-width=".7" opacity=".6"'); };

/* --- building elevations --- */
const gothic = () => [
  P('M130 250V125H270V250'), P('M130 125V90H172V250M228 90V250M228 90H270'), P('M130 90L151 38L172 90M228 90L249 38L270 90'),
  Pr(arch(200, 250, 20, 38)), `<g class="sb-spin" stroke="${R}"><circle class="draw" pathLength="1000" cx="200" cy="150" r="18"/>${Pr('M200 132V168M182 150H218M187 137L213 163M213 137L187 163')}</g>`,
  P(arch(151, 130, 5, 14)), P(arch(249, 130, 5, 14)), P(arch(151, 205, 5, 14)), P(arch(249, 205, 5, 14)), hatch(246, 95, 24, 155, 7), P('M130 125H270', 'stroke-dasharray="3 3"'),
].join('');
const dome = () => [
  P('M110 250V190H290V250'), P('M125 190A75 75 0 0 1 275 190'), Pr('M150 190A50 50 0 0 1 250 190'), P('M200 115V92M193 99H207'),
  ...[0, 1, 2, 3, 4].map((i) => P(arch(135 + i * 32.5, 250, 9, 24))), hatch(250, 195, 40, 55, 7), P('M300 250V150M296 150H304M300 150L300 120', 'stroke-width=".9"'),
].join('');
const wall = () => [
  P('M0 215L60 190L120 205L190 160L260 175L330 135L400 150'), P('M0 232L60 207L120 222L190 177L260 192L330 152L400 167'),
  ...[[60, 190], [190, 160], [330, 135]].map(([x, y]) => P(`M${x - 14} ${y + 6}V${y - 30}H${x + 14}V${y + 6}`) + Pr(`M${x - 14} ${y - 30}h7v-7h7v7h7v-7h7`) + P(`M${x - 4} ${y + 6}V${y - 8}H${x + 4}V${y + 6}`)),
  hatch(40, 207, 30, 25, 5), P('M0 250H400'),
].join('');
const classical = () => [
  P('M110 130L200 85L290 130Z'), Pr('M120 124H280', 'stroke-width=".8"'), P('M110 130H290'),
  ...[0, 1, 2, 3, 4, 5].map((i) => P(`M${126 + i * 29.6} 136V236M${136 + i * 29.6} 136V236`)), P('M104 236H296M98 244H302M92 250H308'), hatch(262, 136, 28, 100, 6),
].join('');
const block = () => [P('M140 250V100H260V250'), P('M140 100H260'), ...[0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2].map((c) => P(`M${160 + c * 32} ${120 + r * 24}h16v14h-16z`, r === 2 && c === 1 ? `stroke="${R}"` : ''))), hatch(244, 104, 16, 146, 6)].join('');


/* --- building-specific elevations (picked by building id first) --- */
const spire = (x, base, top, w) => P(`M${x - w} ${base}L${x} ${top}L${x + w} ${base}`) + P(`M${x - w / 2} ${base - (base - top) * .45}H${x + w / 2}`, 'stroke-width=".7"');
const notreDame = () => [P('M120 250V110H280V250'), P('M120 110H280'), P('M120 110V80H168V250M232 80V250M232 80H280V110'), P('M126 80h6v-6h6v6h6v-6h6v6h6v-6h6v6M232 80h6v-6h6v6h6v-6h6v6h6v-6h6v6'),
  P('M200 110L200 62M194 80L200 62L206 80'), Pr(arch(200, 250, 14, 28)), P(arch(144, 250, 8, 22)), P(arch(256, 250, 8, 22)), `<g class="sb-spin" stroke="${R}"><circle class="draw" pathLength="1000" cx="200" cy="150" r="16"/>${Pr('M200 134V166M184 150H216M189 139L211 161M211 139L189 161')}</g>`, hatch(250, 115, 30, 135, 7)].join('');
const chartres = () => [P('M130 250V130H270V250'), P('M130 130V100H165V250M235 112V250M235 112H270'), spire(147, 100, 20, 17), P('M235 112V92H270V112'), P('M232 92L252 52L273 92M243 70H261'), Pr(arch(200, 250, 18, 30)), `<g class="sb-spin" stroke="${R}"><circle class="draw" pathLength="1000" cx="200" cy="164" r="17"/>${Pr('M200 147V181M183 164H217M188 152L212 176M212 152L188 176')}</g>`, hatch(245, 118, 25, 132, 7)].join('');
const cologne = () => [P('M130 250V120H270V250'), P('M130 120V70H178V250M222 70V250M222 70H270V120'), spire(154, 70, 12, 24), spire(246, 70, 12, 24), P('M154 70V120M246 70V120', 'stroke-width=".7"'), Pr(arch(200, 250, 16, 34)), P(arch(154, 250, 8, 26)), P(arch(246, 250, 8, 26)), hatch(250, 125, 20, 125, 7)].join('');
const sagrada = () => [P('M110 250V150H290V250'), ...[0, 1, 2, 3].map((i) => P(`M${128 + i * 48} 150Q${128 + i * 48} 60 ${140 + i * 48} 20Q${152 + i * 48} 60 ${152 + i * 48} 150`) + Pr(`M${140 + i * 48} 20V10M${136 + i * 48} 14H${144 + i * 48}`)), Pr(arch(200, 250, 18, 30)), hatch(262, 155, 28, 95, 7)].join('');
const chrysler = () => [P('M165 250V120H235V250'), P('M165 120L200 40L235 120'), ...[0, 1, 2, 3].map((i) => Pr(`M${178 + i * 2} ${112 - i * 14}Q200 ${90 - i * 14} ${222 - i * 2} ${112 - i * 14}`)), P('M200 40V16'), ...[0, 1, 2, 3, 4, 5, 6].map((r) => P(`M175 ${135 + r * 16}h50`, 'stroke-width=".7"')), hatch(220, 125, 15, 125, 6)].join('');
const sydney = () => [P('M60 250Q70 150 140 110Q130 190 150 250'), P('M130 250Q150 120 230 80Q215 180 245 250'), P('M220 250Q250 140 330 120Q310 200 340 250'), Pr('M60 250H340'), P('M70 250V268H330V250', 'stroke-width=".9"'), hatch(140, 130, 20, 118, 8)].join('');
const pagoda = () => [P('M110 250V215H290V250'), ...[0, 1, 2].map((i) => P(`M${120 + i * 14} ${215 - i * 48}H${280 - i * 14}V${181 - i * 48}H${120 + i * 14}Z`) + Pr(`M${100 + i * 14} ${181 - i * 48}Q${200} ${166 - i * 48} ${300 - i * 14} ${181 - i * 48}`)), P('M200 38V18'), ...[0, 1, 2, 3].map((i) => P(`M${150 + i * 32} 250V220`, 'stroke-width=".8"'))].join('');
const onion = () => [P('M110 250V190H290V250'), ...[[150, 150, 24], [200, 120, 32], [250, 150, 24]].map(([x, y, w]) => P(`M${x - w * .6} ${y + 40}V${y + 20}Q${x - w * 1.1} ${y - 4} ${x} ${y - 36}Q${x + w * 1.1} ${y - 4} ${x + w * .6} ${y + 20}V${y + 40}`) + Pr(`M${x} ${y - 36}V${y - 50}`)), P('M140 250V190M200 250V160M260 250V190', 'stroke-width=".8"'), hatch(262, 195, 28, 55, 6)].join('');
const pisa = () => [P('M170 250L176 100M230 250L240 100M176 100H240'), ...[0, 1, 2, 3, 4, 5].map((i) => P(`M${172 + i * 1.2} ${235 - i * 22}H${232 + i * 1.7}`, 'stroke-width=".8"')), Pr('M178 100L240 100L236 80H182Z'), hatch(215, 110, 20, 135, 7)].join('');
const BYID = { 'notre-dame-paris': notreDame, chartres, cologne, 'sagrada-familia': sagrada, 'chrysler-building': chrysler, 'sydney-opera-house': sydney, 'forbidden-city': pagoda, 'golden-temple': pagoda, 'angkor-wat': pagoda, 'saint-basil-s-cathedral': onion, 'leaning-tower-of-pisa': pisa };

/* --- motifs --- */
const crane = (x = 320, idle = false) => `${P(`M${x} 250V80M${x - 5} 250V80`)}${P(`M${x - 70} 84H${x + 28}M${x} 80L${x - 56} 84M${x} 80L${x + 22} 84`)}<g class="${idle ? '' : 'sb-hook'}">${P(`M${x - 50} 84V138`, `stroke="${R}"`)}${Pr(`M${x - 58} 138h16v14h-16z`)}</g>`;
const scaffold = (x, y, w, h) => { let d = `M${x} ${y}V${y + h}M${x + w} ${y}V${y + h}`; for (let j = 0; j <= h; j += 18) d += `M${x} ${y + j}H${x + w}`; for (let j = 0; j < h; j += 36) d += `M${x} ${y + j}L${x + w} ${y + j + 18}M${x + w} ${y + j + 18}L${x} ${y + j + 36}`; return P(d, 'stroke-width=".8"'); };
const masons = (xs) => xs.map((x, i) => `<g class="sb-bob" style="animation-delay:${i * 0.4}s">${fig(x, 238)}${P(`M${x + 5} 232h7v6h-7z`, `stroke="${R}"`)}</g>`).join('');
const flames = (cx, cy) => [0, 1, 2, 3, 4].map((i) => `<g class="sb-flame" style="animation-delay:${i * 0.13}s">${Pr(`M${cx - 30 + i * 15} ${cy}Q${cx - 36 + i * 15} ${cy - 22} ${cx - 28 + i * 15} ${cy - 40 - (i % 2) * 12}Q${cx - 20 + i * 15} ${cy - 20} ${cx - 15 + i * 15} ${cy}`)}</g>`).join('') + `<g class="sb-smoke">${P(`M${cx - 10} ${cy - 50}q-14 -14 0 -26q14 -12 0 -26`, 'stroke-width=".8"')}${P(`M${cx + 12} ${cy - 46}q-14 -14 0 -26q14 -12 0 -26`, 'stroke-width=".8"')}</g>`;
const crowd = (flag) => [60, 80, 98, 300, 322, 346].map((x, i) => `<g class="sb-bob" style="animation-delay:${i * 0.2}s">${fig(x, 240)}</g>`).join('') + (flag ? `<g>${P('M82 238V195')}<g class="sb-wave">${Pr('M82 195q14 -8 28 0t28 0v18q-14 8 -28 0t-28 0z')}</g></g>` : '');
const crack = () => Pr('M205 80L193 112L212 138L196 170L210 204L200 250', 'stroke-width="1.8"');
const book = () => P('M70 232Q110 218 150 232V268Q110 254 70 268ZM150 232Q190 218 230 232V268Q190 254 150 268Z', 'transform="translate(80 -30) scale(1 .9)"') + Pr('M215 205q10 -6 20 0M215 214q10 -6 20 0', 'transform="translate(80 -30)"');
const walkers = () => P('M20 262Q120 244 200 258T380 240', 'stroke-dasharray="2 7" stroke-width=".9"') + [30, 62, 96, 128].map((x, i) => `<g class="sb-walk" style="animation-delay:${i * 0.5}s">${fig(x, 247 - (i % 2) * 2)}</g>`).join('');
const shrine = () => `<g class="sb-bob">${Pr('M60 205h56l-6 -16h-44z')}${Pr('M88 189v-12M82 183h12')}${[66, 78, 98, 110].map((x) => fig(x, 228)).join('')}</g>`;
const rose = () => `<g class="sb-spin" stroke="${R}">${Pr('M330 110m-26 0a26 26 0 1 0 52 0a26 26 0 1 0 -52 0')}${Pr('M330 84V136M304 110H356M311 91L349 129M349 91L311 129')}${Pr('M330 110m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0')}</g>`;
const buttress = () => `${Pr('M270 150Q310 100 330 170')}${P('M330 250V150L342 138V250')}${Pr('M270 190Q300 160 330 200')}`;

const sun = (x, y) => `<g class="sb-sun">${Pr(`M${x - 12} ${y}a12 12 0 1 0 24 0a12 12 0 1 0 -24 0`)}${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = i * Math.PI / 4; return Pr(`M${x + Math.cos(a) * 17} ${y + Math.sin(a) * 17}L${x + Math.cos(a) * 23} ${y + Math.sin(a) * 23}`, 'stroke-width=".8"'); }).join('')}</g>`;
const cloud = (x, y, k) => `<g class="sb-cloud" style="animation-delay:${k}s">${P(`M${x} ${y}h46M${x + 10} ${y + 5}h50M${x - 6} ${y - 5}h30`, 'stroke-width=".8"')}</g>`;
const bird = (x, y, k) => `<g class="sb-bird" style="animation-delay:-${k}s">${P(`M${x} ${y}q4 -5 8 0q4 -5 8 0`, 'stroke-width="1"')}</g>`;

export function storyboard(scene, b, idx = 0) {
  const t = `${scene.title} ${scene.caption} ${b.name}`.toLowerCase(), n = (re) => re.test(t);
  const r = hash(`${b.id}${scene.title}`);
  // 1. building elevation from the building name and style
  let el;
  if (BYID[b.id]) el = BYID[b.id]();
  else if (n(/wall of china|great wall|fortif|rampart/)) el = wall();
  else if (n(/dome|mosque|hagia|pantheon|taj|capitol|basilica of st|santa maria del fiore|florence cathedral|sophia/)) el = dome();
  else if (n(/colosseum|parthenon|lincoln memorial|temple of|classical|neoclass|\broman\b|pisa/)) el = classical();
  else if (b.gothic || n(/cathedral|gothic|notre|chartres|cologne|amiens|abbey|minster|church|chapel|collegiate|sagrada/)) el = gothic();
  else el = block();
  // 2. action motifs from the scene text, each with a short hand-lettered label.
  // choose() maps text -> motif; if the previous step got the same motif, rotate to a different one so steps never look alike.
  const spare = [
    ['foundations', () => [scaffold(112, 110, 58, 140), masons([88, 300])]], ['pilgrims', () => [walkers()]], ['the book', () => [book()]], ['stained glass', () => [rose()]],
    ['relics', () => [shrine()]], ['flying buttress', () => [buttress()]], ['rebuilding', () => [crane(330), masons([96, 280])]],
  ];
  const choose = (tx, bld) => {
    const q = (re) => re.test(tx);
    if (q(/fire|burn|blaze|flame/)) return ['fire', () => [flames(200, 120), crowd(false)]];
    if (q(/revolution|desecrat|destroy|damag|fractur|sack|collaps|ruin/)) return [q(/revolution/) ? 'revolution' : 'damage', () => [crowd(true), crack()]];
    if (q(/novel|book|hugo|wrote|writ|manuscript|poem/)) return ['the book', () => [book()]];
    if (q(/halt|stop|stalled|unfinished|abandon|paus/)) return ['work halts', () => [crane(320, true), P('M150 120L250 120', 'stroke-dasharray="3 6"'), Pr('M200 100V130')]];
    if (q(/restor|repair|reopen|rebuil|renovat/)) return ['restoration', () => [scaffold(112, 110, 58, 140), crane(330), masons([90, 280])]];
    if (q(/buttress|vault|\brib\b|height|tall|taller|tallest|props/)) return [q(/buttress|props/) ? 'flying buttress' : q(/vault|\brib\b/) ? 'rib vault' : 'height', () => [buttress()]];
    if (q(/glass|window|rose|light/)) return [q(/rose/) ? 'rose window' : 'stained glass', () => [rose()]];
    if (q(/pilgrim|travel|visitor|tourist|destination|journey|trade/)) return [q(/pilgrim/) ? 'pilgrims' : 'visitors', () => [walkers()]];
    if (q(/relic|reliquary|shrine|kings|saint|bones/)) return ['relics', () => [shrine()]];
    if (q(/built|build|construct|began|begun|foundation|rise|raise|erect|complet|dynasty|ordered|commission/) && !bld) return ['masons at work', () => [scaffold(112, 110, 58, 140), crane(330), masons([88, 276, 296])]];
    if (bld) return ['builders', () => [masons([40, 340])]];
    return null;
  };
  const building = n(/wall of china|great wall/);
  const txt = (sc) => `${sc.title} ${sc.caption} ${b.name}`.toLowerCase();
  const prev = idx > 0 && b.scenes && b.scenes[idx - 1] ? choose(txt(b.scenes[idx - 1]), building) : null;
  let pick = choose(t, building);
  if (!pick || (prev && pick[0] === prev[0])) pick = spare.filter((x) => !prev || x[0] !== prev[0])[(idx + Math.floor(r * 7)) % (prev ? 6 : 7)];
  const rotated = !choose(t, building) || (prev && choose(t, building)[0] === prev[0]);
  const m = [{ label: rotated ? '' : pick[0], svg: pick[1]().join('') }]; // a rotated motif is decoration, so it gets no label that could mislead
  const ground = P('M0 250H400') + P('M0 256H400', 'stroke-width=".6" opacity=".5"') + hatch(0, 250, 400, 10, 9);
  const sky = sun(50 + r * 40, 52) + cloud(220 + r * 50, 48, 0) + cloud(70, 90, -3) + bird(120 + r * 60, 38, 0) + bird(260, 62, 5) + bird(310, 30, 9);
  const hand = `font-family="Caveat, 'Bradley Hand', 'Segoe Print', cursive" stroke="none"`;
  const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const lbl = (x, y, txt, red, cls = '') => `<g class="sb-lbl ${cls}">${P(`M${x} ${y + 4}h${Math.min(120, txt.length * 6.5)}`, `stroke-width=".8"${red ? ` stroke="${R}"` : ''}`)}<text x="${x}" y="${y}" font-size="15" fill="${red ? R : K}" ${hand}>${esc(txt)}</text></g>`;
  const labels = (scene.year ? lbl(14, 24, String(scene.year).slice(0, 18), true) : '') + lbl(14, 284, String(b.name).slice(0, 40)) + m.filter((a) => a.label).map((a) => lbl(282, 284, a.label, true, 'act')).join('');
  // Layer order = animation order: ground, building, action, labels; sky drifts throughout.
  return `<svg viewBox="0 0 400 300" role="img" aria-label="Line-art storyboard for: ${esc(scene.title)}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${K}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><g class="sb-L sb-sky">${sky}</g><g class="sb-L sb-ground">${ground}</g><g class="sb-L sb-bld">${el}</g>${m.map((a) => `<g class="sb-L sb-act">${a.svg}</g>`).join('')}<g class="sb-L sb-labels">${labels}</g></svg>`;
}
