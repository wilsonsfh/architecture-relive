// Simplified procedural Gothic nave. NOT a scan and NOT any real building's interior.
// Pure geometry: importable in the browser (import map) and in Node tests.
import * as THREE from 'three';

export const DIM = {
  halfSpan: 5,        // nave half-width (pier centre to centre line)
  bay: 6,             // bay length
  bays: 6,
  arcadeTop: 14,      // top of arcade level
  triforiumTop: 18,
  spring: 24,         // vault springing height
};
const { halfSpan: A, bay: B, bays: N, spring: SP } = DIM;
export const bayCentre = (i) => -B / 2 - B * i;           // z of bay i centre
const K = (A * Math.sqrt(3)) / ((B / 2) * Math.sqrt(3));  // scale so groin apex meets ridge

// Equilateral pointed arch profile: height at offset x for half-span a.
export const pointed = (x, a) => Math.sqrt(Math.max(0, 4 * a * a - (Math.abs(x) + a) ** 2));

function pointedPath(path, cx, base, a, steps = 16) {
  path.moveTo(cx - a, base);
  for (let i = 0; i <= steps; i++) {
    const x = -a + (2 * a * i) / steps;
    path.lineTo(cx + x, base + pointed(x, a));
  }
  path.lineTo(cx + a, base);
  path.lineTo(cx - a, base);
  return path;
}

export const GLASS = [0x9b2d30, 0x2f5fa3, 0xc98f2b, 0x3d6b52, 0x7a3b86];

export function buildNave() {
  const group = new THREE.Group();
  group.name = 'nave';
  const stone = new THREE.MeshStandardMaterial({ color: 0xd9ceb6, roughness: 0.95, side: THREE.DoubleSide });
  const stoneDark = new THREE.MeshStandardMaterial({ color: 0xb9ab8f, roughness: 0.95, side: THREE.DoubleSide });
  const ribMat = new THREE.MeshStandardMaterial({ color: 0xf0e8d6, roughness: 0.8 });
  const features = {};
  const tag = (key, obj) => { (features[key] ||= []).push(obj); obj.userData.feature = key; group.add(obj); return obj; };

  // floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(2 * A + 8, N * B + 4), new THREE.MeshStandardMaterial({ color: 0x8e8268, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -N * B / 2);
  tag('nave', floor);

  const wallPanel = (zc, side, y0, y1, holes) => {
    const s = new THREE.Shape();
    s.moveTo(-B / 2, y0); s.lineTo(B / 2, y0); s.lineTo(B / 2, y1); s.lineTo(-B / 2, y1); s.lineTo(-B / 2, y0);
    holes.forEach((h) => s.holes.push(h));
    const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    const m = new THREE.Mesh(g, stone);
    m.position.set(side * A - 0.5, 0, zc);
    return m;
  };
  const glassFor = (zc, side, base, a, color) => {
    const sh = pointedPath(new THREE.Path(), 0, base, a);
    const g = new THREE.ShapeGeometry(new THREE.Shape(sh.getPoints()));
    g.rotateY(side > 0 ? -Math.PI / 2 : Math.PI / 2);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.position.set(side * A, 0, zc);
    return m;
  };

  for (let i = 0; i < N; i++) {
    const zc = bayCentre(i);
    for (const side of [-1, 1]) {
      // arcade: wall with a pointed opening onto the aisle
      const arch = pointedPath(new THREE.Path(), 0, 0, B / 2 - 0.5);
      tag('pointed-arch', wallPanel(zc, side, 0, DIM.arcadeTop, [arch]));
      // triforium: three small pointed openings in a band
      const tri = [-1.7, 0, 1.7].map((dx) => pointedPath(new THREE.Path(), dx, DIM.arcadeTop + 0.6, 0.65));
      tag('triforium', wallPanel(zc, side, DIM.arcadeTop, DIM.triforiumTop, tri));
      // clerestory: tall pointed window filled with coloured glass
      const win = pointedPath(new THREE.Path(), 0, DIM.triforiumTop + 1, 2.4);
      const cl = wallPanel(zc, side, DIM.triforiumTop, SP, [win]);
      tag('clerestory', cl);
      tag('clerestory', glassFor(zc, side, DIM.triforiumTop + 1, 2.4, GLASS[(i + (side > 0 ? 2 : 0)) % GLASS.length]));
    }

    // rib vault: webbing + transverse ribs + diagonal ribs + boss
    const zA = zc + B / 2, zB = zc - B / 2;
    const seg = 14, verts = [], idx = [];
    for (let a = 0; a <= seg; a++) for (let b = 0; b <= seg; b++) {
      const x = -A + (2 * A * a) / seg, z = zA - (B * b) / seg;
      verts.push(x, SP + Math.min(pointed(x, A), K * pointed(z - zc, B / 2)), z);
    }
    for (let a = 0; a < seg; a++) for (let b = 0; b < seg; b++) {
      const p = a * (seg + 1) + b;
      idx.push(p, p + 1, p + seg + 1, p + 1, p + seg + 2, p + seg + 1);
    }
    const vg = new THREE.BufferGeometry();
    vg.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    vg.setIndex(idx); vg.computeVertexNormals();
    tag('rib-vault', new THREE.Mesh(vg, stoneDark));

    const rib = (pts) => tag('rib-vault', new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.16, 6), ribMat));
    for (const z of [zA, zB]) {
      rib(Array.from({ length: 21 }, (_, k) => { const x = -A + (2 * A * k) / 20; return new THREE.Vector3(x, SP + pointed(x, A), z); }));
    }
    for (const dir of [1, -1]) {
      rib(Array.from({ length: 25 }, (_, k) => {
        const t = k / 24, x = -A + 2 * A * t, z = dir > 0 ? zA - B * t : zB + B * t;
        return new THREE.Vector3(x, SP + Math.min(pointed(x, A), K * pointed(z - zc, B / 2)) + 0.02, z);
      }));
    }
    const boss = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), new THREE.MeshStandardMaterial({ color: 0xc98f2b, roughness: 0.5, metalness: 0.2 }));
    boss.position.set(0, SP + pointed(0, A), zc);
    tag('rib-vault', boss);
  }

  // piers (one row of bays + 1) with a slim shaft carried up to the vault springing
  for (let i = 0; i <= N; i++) {
    const z = -B * i;
    for (const side of [-1, 1]) {
      const pier = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, DIM.arcadeTop, 14), stone);
      pier.position.set(side * A, DIM.arcadeTop / 2, z);
      tag('pointed-arch', pier);
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, SP - DIM.arcadeTop, 8), stone);
      shaft.position.set(side * (A - 0.75), (SP + DIM.arcadeTop) / 2, z);
      tag('nave', shaft);
    }
  }

  // flying buttresses (exterior cutaway): outer pier + arched strut to the clerestory wall
  for (let i = 0; i < N; i++) {
    const zc = bayCentre(i);
    for (const side of [-1, 1]) {
      const px = side * (A + 8);
      const pier = new THREE.Mesh(new THREE.BoxGeometry(1.6, 21, 1.6), stoneDark);
      pier.position.set(px, 10.5, zc);
      tag('flying-buttress', pier);
      const pinnacle = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3, 4), stoneDark);
      pinnacle.position.set(px, 22.5, zc); pinnacle.rotation.y = Math.PI / 4;
      tag('flying-buttress', pinnacle);
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(px - side * 0.8, 19.5, zc), new THREE.Vector3(side * (A + 3.2), 25.5, zc), new THREE.Vector3(side * A, 21.5, zc));
      tag('flying-buttress', new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.55, 8), stone));
      // outer aisle wall panel so the exterior reads as a building
      const aisle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 10, B - 1.6), stoneDark);
      aisle.position.set(side * (A + 8), 5, zc);
      group.add(aisle);
    }
  }

  // end wall with a rose window (west end, far from the viewer)
  const endZ = -N * B;
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(2 * A, SP + 9), stone);
  endWall.position.set(0, (SP + 9) / 2, endZ - 0.05);
  group.add(endWall);
  const rose = new THREE.Group();
  const petals = 12;
  for (let p = 0; p < petals; p++) {
    const seg = new THREE.Mesh(new THREE.CircleGeometry(3.4, 8, (p / petals) * Math.PI * 2, (Math.PI * 2) / petals - 0.06),
      new THREE.MeshBasicMaterial({ color: GLASS[p % GLASS.length], side: THREE.DoubleSide }));
    rose.add(seg);
  }
  const hub = new THREE.Mesh(new THREE.CircleGeometry(0.7, 20), new THREE.MeshBasicMaterial({ color: 0xf0e8d6 }));
  rose.add(hub);
  rose.position.set(0, 20, endZ + 0.05);
  tag('rose-window', rose);

  return { group, features };
}

// Camera framings for each clickable feature. pos = pin anchor in the model.
export const HOTSPOTS = [
  { key: 'nave', pin: [0, 1.2, -13], cam: [0, 3.4, 5], target: [0, 15, -26] },
  { key: 'pointed-arch', pin: [-A, 11.5, bayCentre(1)], cam: [1.5, 7, -2.5], target: [-A, 9.5, bayCentre(1)] },
  { key: 'triforium', pin: [A, 16, bayCentre(2)], cam: [-1.5, 13, -8.5], target: [A, 16, bayCentre(2)] },
  { key: 'clerestory', pin: [-A, 21.5, bayCentre(2)], cam: [2.5, 15, -9], target: [-A, 21, bayCentre(2)] },
  { key: 'rib-vault', pin: [0, SP + 8.2, bayCentre(3)], cam: [0, 12, -12], target: [0, SP + 7, bayCentre(3)] },
  { key: 'rose-window', pin: [0, 20, -N * B + 0.4], cam: [0, 9, -18], target: [0, 20, -N * B] },
  { key: 'flying-buttress', pin: [A + 3, 24, bayCentre(3)], cam: [A + 26, 20, bayCentre(3) + 12], target: [A + 2, 19, bayCentre(3)] },
];
export const START_VIEW = { cam: [0, 3.4, 5], target: [0, 15, -26] };
// Guided walk-through: doorway -> nave -> arcade -> look up into the vault -> clerestory -> rose window -> outside.
export const TOUR = [
  { key: 'nave', cam: [0, 3.4, 5], target: [0, 12, -30] },
  { key: 'pointed-arch', cam: [1.2, 3.8, -7], target: [-A, 8, bayCentre(2)] },
  { key: 'triforium', cam: [-1, 7, -13], target: [A, 16, bayCentre(2) - 2] },
  { key: 'rib-vault', cam: [0, 5, -17], target: [0, SP + 7, bayCentre(3) - 1.5] },
  { key: 'clerestory', cam: [1.5, 9, -24], target: [-A, 21, bayCentre(4)] },
  { key: 'rose-window', cam: [0, 6, -26], target: [0, 20, -N * B] },
  { key: 'flying-buttress', cam: [A + 26, 20, bayCentre(3) + 12], target: [A + 2, 19, bayCentre(3)] },
];
