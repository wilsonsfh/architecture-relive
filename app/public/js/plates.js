// Illustrative plates: simple diagrams, NOT reconstructions or photographs.
const INK = '#1B1612', RUBY = '#9B2D30', AMBER = '#C98F2B', MOSS = '#4B6B55', STONE = '#D9CEB6';
const frame = (inner) => `<svg viewBox="0 0 400 300" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const pointedArch = (cx, base, w, h) => `M${cx - w} ${base} L${cx - w} ${base - h} Q${cx - w} ${base - h - w * 1.1} ${cx} ${base - h - w * 1.75} Q${cx + w} ${base - h - w * 1.1} ${cx + w} ${base - h} L${cx + w} ${base}`;
const roundArch = (cx, base, w, h) => `M${cx - w} ${base} L${cx - w} ${base - h} A${w} ${w} 0 0 1 ${cx + w} ${base - h} L${cx + w} ${base}`;
const ground = `<path class="draw" d="M20 270 H380"/>`;
const facade = (x, w, h, spire) => `<path class="draw" d="M${x} 270 V${270 - h} H${x + w} V270"/>${spire ? `<path class="draw" d="M${x} ${270 - h} L${x + w / 2} ${270 - h - 55} L${x + w} ${270 - h}"/>` : ''}`;

export const PLATES = {
  wall: () => frame(`${ground}
    <path class="draw" d="M20 250 L110 215 L200 235 L290 190 L380 205"/><path class="draw" d="M20 270 L110 240 L200 258 L290 218 L380 232"/>
    ${[[70, 222], [160, 226], [250, 205], [340, 196]].map(([x, y]) => `<path class="draw" d="M${x - 14} ${y} V${y - 38} H${x + 14} V${y}" stroke="${RUBY}"/><path class="draw" d="M${x - 14} ${y - 38} h8 v-8 h6 v8 h8" stroke="${RUBY}"/>`).join('')}`),
  dome: () => frame(`${ground}
    <path class="draw" d="M90 270 V190 H310 V270"/><path class="draw" d="M110 190 A90 90 0 0 1 290 190" stroke="${RUBY}"/>
    <path class="draw" d="M200 100 V70 M192 78 H208" stroke="${AMBER}"/><path class="draw" d="M150 190 V150 M200 190 V100 M250 190 V150" stroke="${AMBER}"/>
    <path class="draw" d="${roundArch(200, 270, 22, 40)}"/>`),
  columns: () => frame(`${ground}
    <path class="draw" d="M60 118 L200 70 L340 118 Z" stroke="${RUBY}"/><path class="draw" d="M70 128 H330"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path class="draw" d="M${88 + i * 56} 134 V262 M${104 + i * 56} 134 V262" stroke="${i % 2 ? INK : AMBER}"/>`).join('')}
    <path class="draw" d="M62 270 H338 M72 262 H328"/>`),
  layers: () => frame(`${ground}
    <path class="draw" d="M70 270 V235 H330 V270"/><path class="draw" d="M95 235 V205 H305 V235" stroke="${MOSS}"/>
    <path class="draw" d="M120 205 V175 H280 V205" stroke="${AMBER}"/><path class="draw" d="M145 175 V145 H255 V175" stroke="${RUBY}"/>
    <path class="draw" d="${pointedArch(200, 145, 20, 12)}" stroke="${RUBY}"/>`),
  'arch-shift': () => frame(`${ground}
    <path class="draw" d="${roundArch(120, 270, 45, 70)}" stroke="${MOSS}"/>
    <path class="draw" d="${pointedArch(280, 270, 45, 70)}" stroke="${RUBY}"/>
    <path class="draw" d="M195 150 H205 M200 145 V155" stroke="${AMBER}"/>`),
  rise: () => frame(`${ground}
    ${[0, 1, 2, 3, 4].map((i) => `<path class="draw" d="M${60 + i * 60} 270 V${230 - i * 28} H${100 + i * 60} V270" stroke="${i === 4 ? RUBY : INK}"/>`).join('')}
    <path class="draw" d="${pointedArch(320, 270, 18, 30)}" stroke="${RUBY}"/>`),
  buttress: () => frame(`${ground}
    <path class="draw" d="M140 270 V90 H200 V270"/><path class="draw" d="${pointedArch(170, 270, 14, 30)}"/>
    <path class="draw" d="M200 120 Q245 70 285 130" stroke="${RUBY}"/><path class="draw" d="M285 270 V110 L300 95 V270" stroke="${RUBY}"/>
    <path class="draw" d="${pointedArch(170, 190, 12, 40)}" stroke="${AMBER}"/>
    <path class="draw" d="M220 150 L245 125 M230 160 L255 135" stroke="${AMBER}"/>`),
  glass: () => frame(`${ground}
    ${[0, 1, 2].map((i) => `<path class="draw" d="${pointedArch(100 + i * 100, 270, 36, 100)}" stroke="${[RUBY, AMBER, MOSS][i]}"/><path class="draw" d="M${100 + i * 100} 270 V110 M${64 + i * 100} 190 H${136 + i * 100}" stroke="${[RUBY, AMBER, MOSS][i]}"/>`).join('')}`),
  pilgrims: () => frame(`${ground}
    <path class="draw" d="M30 262 Q130 240 200 255 T330 215" stroke="${AMBER}" stroke-dasharray="2 9"/>
    ${[0, 1, 2, 3].map((i) => `<circle cx="${70 + i * 55}" cy="${250 - (i % 2) * 6}" r="4" fill="${INK}"/>`).join('')}
    <path class="draw" d="M310 270 V150 H370 V270"/><path class="draw" d="${pointedArch(340, 270, 12, 28)}" stroke="${RUBY}"/>`),
  fracture: () => frame(`${ground}
    <path class="draw" d="M120 270 V120 H280 V270"/><path class="draw" d="${pointedArch(200, 270, 28, 60)}"/>
    <path class="draw" d="M205 120 L190 150 L215 175 L195 205 L210 235" stroke="${RUBY}" stroke-width="3.4"/>`),
  book: () => frame(`${ground}
    <path class="draw" d="M200 90 Q130 70 70 90 V230 Q130 215 200 235 Q270 215 330 230 V90 Q270 70 200 90 Z"/><path class="draw" d="M200 90 V235"/>
    <path class="draw" d="M95 120 H175 M95 145 H175 M95 170 H150" stroke="${AMBER}"/>
    <path class="draw" d="${pointedArch(265, 200, 22, 30)}" stroke="${RUBY}"/>`),
  restoration: () => frame(`${ground}
    <path class="draw" d="M110 270 V120 H290 V270"/><path class="draw" d="${pointedArch(200, 270, 28, 60)}"/>
    <path class="draw" d="M85 270 V80 M315 270 V80 M85 120 H315 M85 175 H315 M85 230 H315" stroke="${AMBER}"/>`),
  gap: () => frame(`${ground}
    <path class="draw" d="M50 270 V160 H130 V270"/><path class="draw" d="M270 270 V130 H350 V270" stroke="${MOSS}"/>
    <path class="draw" d="M140 215 H260" stroke="${RUBY}" stroke-dasharray="3 10"/>
    <path class="draw" d="M150 190 V240 M250 190 V240" stroke="${RUBY}"/>`),
  spires: () => frame(`${ground}
    <path class="draw" d="M90 270 V150 H170 V270"/><path class="draw" d="M230 270 V150 H310 V270"/>
    <path class="draw" d="M90 150 L130 40 L170 150"/><path class="draw" d="M230 150 L270 40 L310 150"/>
    <path class="draw" d="${pointedArch(200, 270, 16, 40)}" stroke="${RUBY}"/>`),
  volume: () => frame(`${ground}
    <path class="draw" d="M50 270 V180 H150 V270"/><path class="draw" d="M180 270 V90 H340 V270" stroke="${RUBY}"/>
    <path class="draw" d="${pointedArch(100, 270, 16, 30)}"/><path class="draw" d="${pointedArch(260, 270, 24, 50)}" stroke="${RUBY}"/>`),
};
export const plateSvg = (name) => (PLATES[name] || PLATES.rise)();
