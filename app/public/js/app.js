import { resolveName, featureAttestation, pickRandom, yearFromWikidata } from '/js/guard.js';
import { storyboard } from '/js/storyboard.js';

const app = document.getElementById('app');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Capture mode for promo recording: ?capture=1 or press C. Hides controls, pins and hints.
const CAPTURE = new URLSearchParams(location.search).has('capture');
document.body.classList.toggle('capture', CAPTURE);
addEventListener('keydown', (e) => { if ((e.key === 'c' || e.key === 'C') && !/INPUT|TEXTAREA/.test(e.target.tagName)) document.body.classList.toggle('capture'); });
let DATA = null;
let current = null;       // currently shown screen element
let teardown = null;      // cleanup for the current screen
let lastId = null;

const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DYN = new Map(); // resolver records fetched this session
let PRESETS = [];
const byId = async (id) => {
  const local = DATA.buildings.find((b) => b.id === id);
  if (local) return local;
  if (DYN.has(id)) return DYN.get(id);
  const r = await fetch('/api/b?id=' + encodeURIComponent(id));
  if (!r.ok) return null;
  const b = await r.json(); DYN.set(id, b); return b;
};
const pool = () => [...DATA.buildings.map((b) => b.id), ...PRESETS.map((p) => p.id)];
const randomId = (cur) => { const p = pool().filter((x) => x !== cur); return p[Math.floor(Math.random() * p.length)]; };

// Split text into words so headlines can pop in word by word.
const words = (text) => text.split(' ').map((w) => `<span class="word"><span>${esc(w)}</span></span>`).join(' ');
const popWords = (root, delay = 0) => {
  if (reduce) return;
  gsap.from(root.querySelectorAll('.word > span'), { yPercent: 110, duration: 0.7, ease: 'expo.out', stagger: 0.06, delay });
};
const rise = (nodes, delay = 0) => { if (!reduce) gsap.from(nodes, { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08, delay }); };

async function show(node, { onEnter } = {}) {
  const old = current, oldTeardown = teardown;
  teardown = null;
  app.appendChild(node);
  current = node;
  if (old) {
    if (!reduce) await gsap.to(old, { opacity: 0, duration: 0.25, ease: 'power2.in' });
    oldTeardown?.();
    old.remove();
  }
  if (!reduce) gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  onEnter?.();
}

/* ---------------- Home ---------------- */
function home() {
  const node = el(`<section class="screen home">
    <h1 aria-label="Gothic, explained.">${words('Gothic,')} <em>${words('explained.')}</em></h1>
    <p class="sub">A real cathedral. Its story. Its inside.</p>
    <button class="cta" id="random">Show me one</button>
    <div class="showcase" aria-label="Full experience">
      <h2 class="sc-h">Full experience <span>AI images, clips and animated line storyboards</span></h2>
      <div class="sc-row">${['chartres', 'cologne', 'notre-dame-paris'].map((id) => DATA.buildings.find((x) => x.id === id)).filter(Boolean).map((x) => `<button class="sc-card" data-go="/b/${x.id}/story">${x.image ? `<img src="${x.image.local}" alt="" loading="lazy">` : ''}<span class="sc-t">${esc(x.name)}</span><span class="sc-s">${esc(x.city)} · Play its story</span></button>`).join('')}</div>
    </div>
    <form class="ask" id="ask" autocomplete="off">
      <input id="q" aria-label="Type a building name" placeholder="or type any building" maxlength="80">
      <div class="msg" id="msg" role="status"></div>
    </form>
    <p class="foot">${pool().length} buildings ready, or type any real one. Photo and generate modes come next.</p>
  </section>`);
  show(node, { onEnter: () => { popWords(node); rise(node.querySelectorAll('.sub, .cta, .ask'), 0.35); } });
  node.querySelector('#random').addEventListener('click', () => go(`/b/${randomId(lastId)}`));
  const msg = node.querySelector('#msg');
  let busy = false;
  node.querySelector('#ask').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const q = node.querySelector('#q').value;
    const r = resolveName(q, DATA.buildings);
    if (r.kind === 'match') return go(`/b/${r.building.id}`);
    if (r.kind === 'too-short') { msg.textContent = 'Type at least three letters.'; return; }
    const pre = PRESETS.find((p) => p.name.toLowerCase() === q.trim().toLowerCase());
    if (pre) return go(`/b/${pre.id}`);
    busy = true; msg.innerHTML = '<span class="looking">Checking Wikipedia and Wikidata…</span>';
    try {
      const res = await fetch('/api/resolve?q=' + encodeURIComponent(q.trim()));
      const data = await res.json();
      if (data.building) { DYN.set(data.building.id, data.building); return go(`/b/${data.building.id}`); }
      const near = r.kind === 'ambiguous' ? r.options : r.suggestions;
      msg.innerHTML = `${esc(data.refusal || 'Not found.')}<br>Try one I know:` + near.slice(0, 3).map((b) => `<button type="button" data-id="${b.id}">${esc(b.name)}</button>`).join('');
      msg.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => go(`/b/${b.dataset.id}`)));
    } catch { msg.textContent = 'Could not reach the sources. The ready buildings still work.'; }
    finally { busy = false; }
  });
}

/* ---------------- Result ---------------- */
function result(b) {
  lastId = b.id;
  const year = yearFromWikidata(b.verified.inception);
  const style = b.verified.styles.find((s) => /gothic/i.test(s)) || b.verified.styles[0] || 'Not listed in Wikidata';
  const dyn = b.origin === 'resolver', canInside = !dyn || b.gothic;
  const img = b.image;
  const node = el(`<section class="screen result">
    <button class="back" data-go="/">← Back</button>
    <figure class="photo">${img ? `<img src="${img.local}" alt="${esc(b.name)}, ${esc(b.city)}">
      <figcaption class="credit">Photo: ${esc(img.author || 'Wikimedia Commons')}, <a href="${img.commons_page}" target="_blank" rel="noopener">${esc(img.license)}</a></figcaption>` : '<p class="nophoto">No openly licensed photo found, so none is shown.</p>'}</figure>
    <div class="info">
      <h2 aria-label="${esc(b.name)}">${words(b.name)}</h2>
      <p class="city">${esc(b.city)}. ${esc(b.tagline)}</p>
      <div class="facts">
        <div class="fact"><b>Style</b><span>${esc(style.replace(/^classic gothic$/i, 'Classic Gothic'))}</span></div>
        <div class="fact"><b>Wikidata start</b><span>${year ?? 'n/a'}</span></div>
      </div>
      <div class="actions">
        <button class="cta" data-go="/b/${b.id}/story">Its story</button>
        ${canInside ? `<button class="cta alt" data-go="/b/${b.id}/inside">Step inside</button>` : ''}
        <button class="link" id="again">Another</button>
      </div>
      <p class="sources">Green dot: checked against <a href="${b.verified.wikidata_url}" target="_blank" rel="noopener">Wikidata ${b.verified.qid}</a> and
        <a href="${b.verified.wikipedia_url}" target="_blank" rel="noopener">Wikipedia</a>, retrieved ${b.verified.retrieved_at.slice(0, 10)}.
        ${b.construction ? `Construction: “${esc(b.construction.quote)}”.` : ''}
        ${dyn ? `<br>Looked up live. ${b.story_status === 'MODEL-SUGGESTED' ? `Story captions suggested by ${esc(b.model)}; every quote checked word for word against Wikipedia.` : 'Story lines are copied word for word from Wikipedia.'}${canInside ? '' : ' The walk-inside model is Gothic only, so it is hidden here.'}` : ''}</p>
    </div>
  </section>`);
  show(node, { onEnter: () => { popWords(node.querySelector('h2')); rise(node.querySelectorAll('.city, .facts, .actions, .sources'), 0.25); if (!reduce) gsap.from(node.querySelector('.photo'), { scale: 0.96, opacity: 0, duration: 0.8, ease: 'expo.out' }); } });
  node.querySelector('#again').addEventListener('click', () => go(`/b/${randomId(b.id)}`));
}

/* ---------------- Storyline ---------------- */
const CLIPS = new Set(['notre-dame-paris-s4', 'chartres-s2', 'cologne-s3']); // hero scenes with a generated clip
function story(b) {
  const scenes = b.scenes, last = scenes.length - 1, dur = 7;
  const photos = (b.photos && b.photos.length ? b.photos : [b.image]).filter(Boolean);
  let i = 0, playing = true, finished = false, tl = null, timer = null, sp = null;
  const node = el(`<section class="screen story">
    <button class="back" data-go="/b/${b.id}">← ${esc(b.name)}</button>
    <button class="closex" id="closex" aria-label="Close story">Close ✕</button>
    <div class="stage wide">
      <div class="trio"><div class="plate sb"><span class="tag">Line storyboard, illustrative</span><div id="plate"></div></div>
      <figure class="shot" id="shot"></figure><figure class="shot" id="clip"></figure></div>
      <div class="scene" id="scene"></div>
    </div>
    <div class="dots" id="dots">${scenes.map((_, k) => `<button aria-label="Scene ${k + 1}" data-k="${k}"><i><b></b></i></button>`).join('')}</div>
    <div class="ctrl"><button id="prev" aria-label="Previous scene">← Back</button><button id="pp" class="main">Pause</button><button id="next" aria-label="Next scene">Next →</button></div>
  </section>`);
  const dots = [...node.querySelectorAll('#dots button')], bars = dots.map((d) => d.querySelector('b'));
  const pp = node.querySelector('#pp'), sc = node.querySelector('#scene');
  const label = () => { pp.textContent = finished ? 'Replay' : playing ? 'Pause' : 'Play'; };
  const render = (k, dir = 1) => {
    i = Math.max(0, Math.min(last, k)); finished = false;
    const s = scenes[i];
    sc.innerHTML = `<div class="year">${esc(s.year)}</div><h2>${esc(s.title)}</h2><p>${esc(s.caption)}</p>
      <details class="quote"><summary>Source line</summary><blockquote>“${esc(s.quote)}”<br><a href="${s.source}" target="_blank" rel="noopener">Wikipedia</a></blockquote></details>`;
    node.querySelector('#plate').innerHTML = storyboard(s, b, i);
    const ph = sp && sp[i] && !sp.slice(0, i).some((q) => q && q.local === sp[i].local) ? sp[i] : null, shot = node.querySelector('#shot'), clip = node.querySelector('#clip'), at = i;
    shot.innerHTML = ''; clip.innerHTML = '';
    const cap = (tag, txt) => `<figcaption><span class="tag">${tag}</span>${txt}</figcaption>`;
    const none = (tag, txt) => `<div class="ph"><span>${tag}</span></div>${cap(tag, txt)}`;
    const pop = () => { if (!reduce) gsap.from([...shot.children, ...clip.children].filter((x) => x.tagName !== 'FIGCAPTION'), { opacity: 0, scale: 1.04, duration: 0.6, ease: 'expo.out', stagger: 0.1 }); };
    const genSrc = `/cache/gen/${b.id}-s${at}.jpg`, vidSrc = `/cache/gen/${b.id}-s${at}.mp4`, im = new Image();
    // Each step maps to ITS OWN files (<id>-s<step>); nothing is reused across steps. No file -> labelled placeholder, never another step's image.
    im.onload = () => {
      if (at !== i) return;
      shot.innerHTML = `<img src="${genSrc}" alt="AI-generated illustration of this step">${cap('AI-generated illustration', 'Imagined from the text; not a photo or a record of the event.')}`;
      clip.innerHTML = `<video muted autoplay loop playsinline preload="auto" poster="${genSrc}"></video>${cap('AI-generated animation', 'Moving version of the same image.')}`;
      const v = clip.querySelector('video'); v.muted = true; v.defaultMuted = true; v.playsInline = true;
      v.addEventListener('error', () => { if (at === i) clip.innerHTML = `<img class="pan" src="${genSrc}" alt="">${cap('Animated still', 'Slow pan of the illustration. No video for this step yet.')}`; }, { once: true });
      v.src = vidSrc; v.load(); const pl = v.play(); if (pl && pl.catch) pl.catch(() => {});
      pop();
    };
    im.onerror = () => {
      if (at !== i) return;
      shot.innerHTML = ph ? `<img src="${ph.local}" alt="${esc(b.name)}, a photo related to this step">${cap('Open photo, not of this moment', `${esc(ph.author || 'Wikimedia Commons')}, <a href="${ph.commons_page}" target="_blank" rel="noopener">${esc(ph.license)}</a>`)}` : none('No AI image for this step yet', 'Nothing is shown rather than repeating another step.');
      clip.innerHTML = none('No AI animation for this step yet', 'The line storyboard on the left is animated.');
      pop();
    };
    im.src = genSrc;
    dots.forEach((d, n) => d.classList.toggle('done', n < i));
    node.querySelector('#prev').disabled = i === 0; node.querySelector('#next').disabled = i === last;
    tl?.kill(); timer?.kill();
    gsap.set(bars, { scaleX: (n) => (n < i ? 1 : 0) });
    node.classList.toggle('paused', !playing);
    const q = (sel) => node.querySelectorAll('#plate ' + sel);
    const done = () => { if (i < last) render(i + 1); else { playing = false; finished = true; node.classList.add('paused'); label(); } };
    // ONE master timeline per step: text, sky, ground, building, then the action, then hand-lettered labels.
    // Play/pause/back/next all drive this timeline. The progress bar follows it.
    tl = gsap.timeline({ paused: !playing, onUpdate: () => gsap.set(bars[i], { scaleX: tl.progress() }), onComplete: done });
    tl.to({}, { duration: dur }, 0);
    if (reduce) { q('.draw').forEach((p) => (p.style.strokeDashoffset = 0)); }
    else {
      const act = q('.sb-act'), lbls = [...q('.sb-lbl')], actLbl = lbls.filter((l) => l.classList.contains('act')), baseLbl = lbls.filter((l) => !l.classList.contains('act'));
      gsap.set(q('.sb-lbl text'), { opacity: 0, x: -8 });
      tl.from(sc.children, { y: 24 * dir, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.07 }, 0)
        .from(q('.sb-sky'), { opacity: 0, duration: 1, ease: 'power2.out' }, 0)
        .to(q('.sb-sky .draw'), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: { amount: 0.6 } }, 0)
        .to(q('.sb-ground .draw'), { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: { amount: 0.4 } }, 0.2)
        .to(q('.sb-bld .draw'), { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: { amount: 1.6 } }, 0.9)
        .to(baseLbl.flatMap((g) => [...g.querySelectorAll('.draw')]), { strokeDashoffset: 0, duration: 0.5, stagger: 0.5 }, 0.5)
        .to(baseLbl.map((g) => g.querySelector('text')), { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.5 }, 0.6);
      act.forEach((g, k) => {
        const t0 = 3.0 + k * 0.4;
        tl.from(g, { y: 22, opacity: 0, duration: 0.9, ease: 'expo.out' }, t0)
          .to(g.querySelectorAll('.draw'), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: { amount: 1.2 } }, t0);
      });
      tl.to(actLbl.flatMap((g) => [...g.querySelectorAll('.draw')]), { strokeDashoffset: 0, duration: 0.5, stagger: 0.3 }, 4.6)
        .to(actLbl.map((g) => g.querySelector('text')), { opacity: 1, x: 0, duration: 0.5, ease: 'expo.out', stagger: 0.3 }, 4.7);
    }
    label();
  };
  fetch('/api/scene-photos?id=' + encodeURIComponent(b.id)).then((r) => r.json()).then((d) => { sp = d.photos || null; if (node.isConnected) { const t = tl && tl.progress(); render(i); tl.progress(t || 0); } }).catch(() => {});
  const toggle = () => {
    if (finished) { playing = true; render(0); return; }
    playing = !playing; tl.paused(!playing); node.classList.toggle('paused', !playing); label();
  };
  const step = (n) => render(i + n, n);
  pp.addEventListener('click', toggle);
  node.querySelector('#prev').addEventListener('click', () => step(-1));
  node.querySelector('#next').addEventListener('click', () => step(1));
  node.querySelector('#closex').addEventListener('click', () => go(`/b/${b.id}`));
  dots.forEach((d) => d.addEventListener('click', () => render(Number(d.dataset.k))));
  const key = (e) => {
    if (e.key === 'Escape') go(`/b/${b.id}`);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === ' ' && !['BUTTON', 'SUMMARY'].includes(e.target.tagName)) { e.preventDefault(); toggle(); }
  };
  addEventListener('keydown', key);
  show(node, { onEnter: () => render(0) });
  teardown = () => { removeEventListener('keydown', key); tl?.kill(); };
}

/* ---------------- Inside (Three.js) ---------------- */
async function inside(b) {
  const node = el(`<section class="screen inside dark">
    <button class="back" data-go="/b/${b.id}">← ${esc(b.name)}</button>
    <div class="badge-model">Simplified model of a typical Gothic nave. Not a scan, not ${esc(b.name)}'s actual interior.</div>
    <button class="tourbtn" id="tour">Walk through</button>
    <div id="gl"></div><div class="pins" id="pins"></div>
    <div class="term" id="term"></div>
    <p class="hint" id="hint">Drag to look. Tap a label.</p>
  </section>`);
  await show(node);
  let THREE, OrbitControls, nave;
  try {
    THREE = await import('three');
    ({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'));
    nave = await import('/js/nave.js');
  } catch (e) { node.querySelector('#gl').innerHTML = '<p class="nowebgl">The 3D view could not load here.</p>'; console.error(e); return; }

  const host = node.querySelector('#gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
  catch (e) { host.innerHTML = '<p class="nowebgl">This browser can’t show the 3D view (WebGL is unavailable).</p>'; return; }
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15110e);
  scene.fog = new THREE.Fog(0x15110e, 40, 130);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
  camera.position.set(...nave.START_VIEW.cam); camera.far = 900; camera.updateProjectionMatrix();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.target.set(...nave.START_VIEW.target);
  controls.minDistance = 2; controls.maxDistance = 70; controls.maxPolarAngle = Math.PI * 0.62;

  const { group } = nave.buildNave();
  scene.add(group);
  let disposeEnv = () => {};
  try { disposeEnv = (await import('/js/env.js')).dress(THREE, scene, group, renderer); } catch (e) { console.error('environment failed, showing bare nave', e); }
  scene.add(new THREE.HemisphereLight(0xfff0d6, 0x2a1d14, 0.55));
  const sun = new THREE.DirectionalLight(0xffe2b0, 0.6); sun.position.set(-30, 40, 10); scene.add(sun);
  [-12, -20, -28].forEach((z) => { const l = new THREE.PointLight(0xffd9a0, 160, 60); l.position.set(0, 14, z); scene.add(l); });

  const size = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  size(); addEventListener('resize', size);

  // Pins: real buttons projected from 3D anchors.
  const pinsEl = node.querySelector('#pins');
  const glossary = DATA.glossary;
  const pins = nave.HOTSPOTS.map((h) => {
    const g = glossary[h.key];
    const btn = el(`<button class="pin">${esc(g.term)}</button>`);
    pinsEl.appendChild(btn);
    btn.addEventListener('click', () => focus(h, btn));
    return { h, btn, v: new THREE.Vector3(...h.pin) };
  });
  const termEl = node.querySelector('#term');
  const showTerm = (h) => {
    const g = glossary[h.key], att = featureAttestation(b, h.key);
    termEl.innerHTML = `<h3>${esc(g.term)}</h3><p>${esc(g.definition)}</p>` + (att.status === 'VERIFIED'
      ? `<p class="att"><b>Named for ${esc(b.name)}:</b> “${esc(att.quote)}” <a href="${att.source}" target="_blank" rel="noopener">Source</a></p>`
      : `<p class="att">A general Gothic feature. The source I checked does not mention it for ${esc(b.name)}.</p>`);
    if (!reduce) gsap.from(termEl.children, { y: 18, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.07 });
    node.querySelector('#hint').style.display = 'none';
  };
  let flying = null;
  function focus(h, btn) {
    stopTour();
    pins.forEach((p) => p.btn.classList.toggle('on', p.btn === btn));
    showTerm(h);
    flying?.kill();
    if (reduce) { camera.position.set(...h.cam); controls.target.set(...h.target); return; }
    flying = gsap.timeline({ defaults: { duration: 1.5, ease: 'power3.inOut' } })
      .to(camera.position, { x: h.cam[0], y: h.cam[1], z: h.cam[2] }, 0)
      .to(controls.target, { x: h.target[0], y: h.target[1], z: h.target[2] }, 0);
  }
  // Guided walk-through: chain the tour stops, showing each stop's term.
  const tourBtn = node.querySelector('#tour');
  let touring = null;
  function stopTour() { touring?.kill(); touring = null; tourBtn.textContent = 'Walk through'; tourBtn.classList.remove('on'); }
  function startTour() {
    flying?.kill(); stopTour();
    pins.forEach((p) => p.btn.classList.remove('on'));
    tourBtn.textContent = 'Stop walk'; tourBtn.classList.add('on');
    const tl = gsap.timeline({ onComplete: () => { touring = null; tourBtn.textContent = 'Walk again'; tourBtn.classList.remove('on'); } });
    nave.TOUR.forEach((s, k) => {
      const d = reduce ? 0 : k === 0 ? 1.6 : 2.8, at = k === 0 ? 0 : '>+1.6';
      tl.add(() => showTerm(s), at)
        .to(camera.position, { x: s.cam[0], y: s.cam[1], z: s.cam[2], duration: d, ease: 'power2.inOut' }, '<')
        .to(controls.target, { x: s.target[0], y: s.target[1], z: s.target[2], duration: d, ease: 'power2.inOut' }, '<');
    });
    touring = tl;
  }
  tourBtn.addEventListener('click', () => (touring ? stopTour() : startTour()));
  controls.addEventListener('start', () => { if (touring) stopTour(); });
  // Open on the first term so the screen is never empty.
  showTerm(nave.HOTSPOTS[0]); node.querySelector('#hint').style.display = '';
  if (document.body.classList.contains('capture')) setTimeout(() => node.isConnected && startTour(), 900);

  let raf;
  const tmp = new THREE.Vector3();
  const loop = () => {
    raf = requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
    const w = host.clientWidth, hh = host.clientHeight;
    for (const p of pins) {
      tmp.copy(p.v).project(camera);
      const dist = camera.position.distanceTo(p.v);
      const on = tmp.z < 1 && Math.abs(tmp.x) < 1.05 && Math.abs(tmp.y) < 1.05 && dist < 90;
      p.btn.classList.toggle('hide', !on);
      if (on) { const half = (p.btn.offsetWidth || 90) / 2 + 8; const x = Math.max(half, Math.min(w - half, (tmp.x * 0.5 + 0.5) * w)); const y = Math.max(w < 600 ? 120 : 96, Math.min(hh - (w < 600 ? 190 : 150), (-tmp.y * 0.5 + 0.5) * hh)); p.btn.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; }
    }
  };
  loop();
  node.dataset.ready = '1';
  teardown = () => { cancelAnimationFrame(raf); removeEventListener('resize', size); flying?.kill(); touring?.kill(); renderer.dispose(); disposeEnv(); group.traverse((o) => { o.geometry?.dispose(); }); };
}

/* ---------------- Router ---------------- */
function go(path) { if (location.hash.slice(1) === path) route(); else location.hash = path; }
async function route() {
  const path = location.hash.slice(1) || '/';
  const m = /^\/b\/([a-z0-9-]+)(?:\/(story|inside))?$/.exec(path);
  if (!m) return home();
  const b = await byId(m[1]);
  if (!b) { return home(); }
  if (m[2] === 'story') return story(b);
  if (m[2] === 'inside' && (b.origin !== 'resolver' || b.gothic)) return inside(b);
  return result(b);
}
document.addEventListener('click', (e) => { const t = e.target.closest('[data-go]'); if (t) go(t.dataset.go); });
addEventListener('hashchange', route);

try {
  const r = await fetch('/data/buildings.json');
  if (!r.ok) throw new Error(r.status);
  DATA = await r.json();
  try { const p = await fetch('/data/presets.json'); if (p.ok) PRESETS = (await p.json()).presets || []; } catch {}
  route();
} catch (e) {
  app.innerHTML = '<section class="screen home"><h1>Couldn’t load the buildings.</h1><p class="sub">Run the data build, then reload.</p></section>';
}
