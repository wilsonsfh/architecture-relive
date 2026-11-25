// Procedural surroundings + stone textures for the simplified nave. No image assets.
// Everything here is illustrative atmosphere, not a model of any real site.
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h); return c;
}
// Ashlar: staggered limestone blocks with mortar lines and grain. Returns [colour, bump] canvases.
function ashlar(base = [217, 206, 182]) {
  const W = 512, H = 512, rows = 8, bh = H / rows;
  const col = canvas(W, H, (g) => {
    g.fillStyle = `rgb(${base})`; g.fillRect(0, 0, W, H);
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * 64; let x = -off;
      while (x < W) {
        const bw = 96 + Math.floor(rnd() * 64), t = (rnd() - 0.5) * 22;
        g.fillStyle = `rgb(${base.map((v) => Math.round(v + t)).join(',')})`;
        g.fillRect(x + 2, r * bh + 2, bw - 4, bh - 4); x += bw;
      }
    }
    for (let i = 0; i < 9000; i++) { // grain
      const v = rnd() < 0.5 ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${0.03 + rnd() * 0.05})`;
      g.fillRect(rnd() * W, rnd() * H, 1 + rnd() * 2, 1 + rnd() * 2);
    }
  });
  const bump = canvas(W, H, (g) => {
    g.fillStyle = '#bbb'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#333'; g.lineWidth = 4;
    for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(0, r * bh); g.lineTo(W, r * bh); g.stroke(); }
    seed = 7; // same stagger as colour map
    for (let r = 0; r < rows; r++) {
      const off = (r % 2) * 64; let x = -off;
      while (x < W) { const bw = 96 + Math.floor(rnd() * 64); rnd(); g.beginPath(); g.moveTo(x, r * bh); g.lineTo(x, (r + 1) * bh); g.stroke(); x += bw; }
    }
    for (let i = 0; i < 6000; i++) { const v = 150 + rnd() * 90; g.fillStyle = `rgba(${v},${v},${v},.5)`; g.fillRect(rnd() * W, rnd() * H, 2, 2); }
  });
  return [col, bump];
}
function flagstones() {
  const W = 512;
  return canvas(W, W, (g) => {
    const n = 4, s = W / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const t = ((x + y) % 2 ? 128 : 150) + (rnd() - 0.5) * 18;
      g.fillStyle = `rgb(${t + 8},${t},${t - 18})`; g.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
    }
    for (let i = 0; i < 7000; i++) { g.fillStyle = `rgba(0,0,0,${rnd() * 0.08})`; g.fillRect(rnd() * W, rnd() * W, 2, 2); }
  });
}

export function dress(THREE, scene, group, renderer) {
  seed = 7;
  const tex = (c, rx, ry, srgb = true) => {
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  const [sc, sb] = ashlar(); const [dc, db] = ashlar([185, 171, 143]);
  // ExtrudeGeometry/ShapeGeometry UVs are in world units (metres): one tile per 4 m.
  const stoneMap = tex(sc, 0.25, 0.25), stoneBump = tex(sb, 0.25, 0.25, false);
  const darkMap = tex(dc, 0.25, 0.25), darkBump = tex(db, 0.25, 0.25, false);
  const floorMap = tex(flagstones(), 6, 18);
  const seen = new Set();
  group.traverse((o) => {
    const m = o.material; if (!o.isMesh || !m || !m.isMeshStandardMaterial || seen.has(m)) return;
    seen.add(m);
    const hex = m.color.getHex();
    if (hex === 0xd9ceb6) { m.map = stoneMap; m.bumpMap = stoneBump; m.bumpScale = 1.2; m.color.set(0xffffff); }
    else if (hex === 0xb9ab8f) { m.map = darkMap; m.bumpMap = darkBump; m.bumpScale = 1.2; m.color.set(0xffffff); }
    else if (hex === 0x8e8268) { m.map = floorMap; m.color.set(0xe8dcc4); m.roughness = 0.7; }
    m.needsUpdate = true;
  });

  // Sky dome: vertical gradient, warm horizon to soft blue zenith.
  const sky = new THREE.Mesh(new THREE.SphereGeometry(380, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x8fb2cf) }, mid: { value: new THREE.Color(0xe9dcc2) }, bottom: { value: new THREE.Color(0xc9b48e) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; varying vec3 vP; void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.6)) : mix(mid, bottom, pow(-h, 0.4)); gl_FragColor = vec4(c, 1.0); }',
  }));
  scene.add(sky);
  scene.background = null;
  scene.fog = new THREE.Fog(0xe2d3b6, 90, 330);

  // Ground: a town square (paving) fading into fields.
  const ground = new THREE.Mesh(new THREE.CircleGeometry(360, 48), new THREE.MeshStandardMaterial({ color: 0x9aa078, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, -0.05, -18); scene.add(ground);
  const square = new THREE.Mesh(new THREE.PlaneGeometry(70, 90), new THREE.MeshStandardMaterial({ map: tex(flagstones(), 10, 14), color: 0xd8ccb2, roughness: 0.9 }));
  square.rotation.x = -Math.PI / 2; square.position.set(0, -0.02, -18); scene.add(square);

  // Distant town: simple gabled houses and round trees, deterministic placement.
  const house = new THREE.MeshStandardMaterial({ color: 0xd6c3a0, roughness: 1 });
  const roof = new THREE.MeshStandardMaterial({ color: 0x8a4a35, roughness: 1 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x5f7651, roughness: 1 });
  const town = new THREE.Group();
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2, r = 55 + rnd() * 90;
    const x = Math.cos(a) * r, z = -18 + Math.sin(a) * r;
    if (Math.abs(x) < 30 && z > -70 && z < 30) continue; // keep the cathedral square clear
    if (rnd() < 0.62) {
      const w = 6 + rnd() * 6, h = 5 + rnd() * 7, d = 6 + rnd() * 5;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), house); b.position.set(x, h / 2, z); b.rotation.y = a;
      const rf = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.75, h * 0.6, 4), roof); rf.position.set(x, h + h * 0.3, z); rf.rotation.y = a + Math.PI / 4;
      town.add(b, rf);
    } else {
      const t = new THREE.Mesh(new THREE.SphereGeometry(3 + rnd() * 2.5, 10, 8), leaf); t.position.set(x, 4, z); t.scale.y = 1.2;
      town.add(t);
    }
  }
  scene.add(town);
  return () => { [stoneMap, stoneBump, darkMap, darkBump, floorMap].forEach((t) => t.dispose()); };
}
