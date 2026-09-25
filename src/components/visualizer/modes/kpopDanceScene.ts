type AudioIn = { bass: number; treble: number; energy: number; beat: boolean; beatPhase?: number; beatCount?: number };

interface Pose {
  x: number; bob: number; jump: number; lean: number; tilt: number; sway: number; shrug: number;
  la: number; le: number; ra: number; re: number; ll: number; lk: number; rl: number; rk: number; mouth: number;
}
interface Look { hair: string; hairD: string; hairL: string; skin: string; skinS: string; iris: string; irisD: string }

const POSE_KEYS: (keyof Pose)[] = ['x', 'bob', 'jump', 'lean', 'tilt', 'sway', 'shrug', 'la', 'le', 'ra', 're', 'll', 'lk', 'rl', 'rk', 'mouth'];
const OUT = '#140a1e', LASH = '#1a1024', BLUSH = '#ff8fa6';
const GOLD = '#f4c431', GOLD_D = '#c0861a', GOLD_L = '#ffe98a';
const DARK = '#261d38', DARK_L = '#463a62', PINK = '#ff5aae';
const BLUE = '#3b78ff', BLUE_L = '#8db6ff', BLUE_D = '#2a52c4', TOP = '#eef0ff', TOP_S = '#b9bde0';
const PANTS = '#ff9a3c', PANTS_L = '#ffd26a', TEAL = '#34d1c0', SHOE = '#f4f2ff';
const SPARK = ['#fff6b0', '#ff7ad0', '#7ff4ff', '#ffd24a'];
const STICK = ['#ff4fb0', '#a45cff', '#5ff0ff', '#ffd24a'];
const LOOKS: Look[] = [
  { hair: '#ff4fa8', hairD: '#c22a7c', hairL: '#ffa6d8', skin: '#ffd9bf', skinS: '#e8ae8f', iris: '#ff79b6', irisD: '#8a1f57' },
  { hair: '#9446f2', hairD: '#5b22b0', hairL: '#cb9aff', skin: '#ffdcc2', skinS: '#e8b294', iris: '#b17cff', irisD: '#4a1d8f' },
  { hair: '#2c2544', hairD: '#17121f', hairL: '#6d5fae', skin: '#f7cfae', skinS: '#dca382', iris: '#5fc4ff', irisD: '#1d4f8a' },
];
const BANGS = [[5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 4, 5], [4, 5, 5, 4, 4, 3, 3, 4, 4, 5, 5, 4], [4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4]];
const SHX = [4.5, 4.3, 3.9];

function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function c01(v: unknown): number { return typeof v === 'number' && isFinite(v) ? Math.min(1, Math.max(0, v)) : 0; }
function basePose(): Pose {
  return { x: 0, bob: 0, jump: 0, lean: 0, tilt: 0, sway: 0, shrug: 0, la: 0.3, le: 0.2, ra: 0.3, re: 0.2, ll: 0.08, lk: 0.05, rl: 0.08, rk: 0.05, mouth: 0 };
}
function setP(p: Pose, v: Partial<Pose>): Pose { return Object.assign(p, v); }
function mirrorPose(p: Pose): Pose {
  return { ...p, x: -p.x, lean: -p.lean, tilt: -p.tilt, sway: -p.sway, la: p.ra, le: p.re, ra: p.la, re: p.le, ll: p.rl, lk: p.rk, rl: p.ll, rk: p.lk };
}
function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const o = basePose();
  for (const k of POSE_KEYS) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
}
function leadPose(ci: number): Pose {
  const m = setP(basePose(), { ra: 2.95, re: -0.2, la: 0.75, le: -2.0, sway: 1.4, tilt: -0.8, rl: 0.35, rk: 0, ll: 0.05, lk: 0.2, mouth: 1 });
  if (ci === 0) return m;
  if (ci === 2) return setP(mirrorPose(m), { shrug: 0.8 });
  return setP(basePose(), { ra: 2.3, re: 1.0, la: 1.0, le: -0.4, lean: 0.8, tilt: 0.7, ll: 0.35, lk: -0.05, rl: 0.05, mouth: 1 });
}
function heroPose(ci: number): Pose {
  if (ci === 0) return setP(basePose(), { ra: 2.35, re: 0.25, la: 0.75, le: -2.0, ll: 0.35, rl: 0.3, lean: -0.6, tilt: -0.8, sway: -1 });
  if (ci === 1) return setP(basePose(), { ra: 2.95, re: 0.05, la: 1.2, le: 0.6, rl: 0.4, ll: 0.1, lk: 0.3, tilt: 0.6, lean: 0.4, mouth: 1 });
  return setP(basePose(), { la: 2.4, le: 0.5, ra: 1.3, re: -3.1, ll: 0.6, lk: -0.2, rl: 0.2, rk: 0.9, tilt: 0.8, sway: 0.8, mouth: 1 });
}
function keyPose(b: number, ci: number, bp: number): Pose {
  const sec = b >> 3, k = b & 7;
  let p = basePose();
  if (sec === 0) {
    if (k === 7) setP(p, { la: 2.55, ra: 2.55, le: 0.1, re: 0.1, ll: 0.2, rl: 0.2, mouth: 1 });
    else if (k === 3) setP(p, { ra: 1.6, re: 0, la: 0.75, le: -2.0, lean: 0.6, tilt: 0.8, rl: 0.3, mouth: 1 });
    else setP(p, { x: 1.5, lean: 0.8, tilt: 0.6, rl: 0.38, rk: -0.1, ll: 0.05, lk: 0.2, ra: 2.45, re: 0.15, la: 0.7, le: 0.25 });
    if ((k & 1) === 1 && k !== 7) p = mirrorPose(p);
    if (ci === 0) p = mirrorPose(p);
  } else if (sec === 1) {
    if ((k & 1) === 0) setP(p, { la: 0.75, le: -2.0, ra: 0.75, re: -2.0, sway: 1.6, lean: -0.5, tilt: 0.9, shrug: 1, ll: 0.12, rl: 0.12, lk: 0.15, rk: 0.15 });
    else setP(p, { rl: 1.15, rk: -0.25, ll: 0.02, lk: 0.05, ra: 0.55, re: 0.1, la: 2.35, le: 0.3, lean: -0.6, tilt: -0.4, mouth: 1 });
    if (((k >> 1) & 1) === 1) p = mirrorPose(p);
  } else if (sec === 2) {
    const lead = k >> 1;
    if (lead === ci || lead === 3) p = leadPose(ci);
    else {
      const w = Math.sin(bp * Math.PI - ci * 1.1), w2 = Math.sin(bp * Math.PI - ci * 1.1 - 1.3);
      setP(p, { la: 1.3 + 0.45 * w, le: 0.9 * w2, ra: 1.3 - 0.45 * w, re: -0.9 * w2, sway: 0.9 * w, tilt: -0.5 * w, ll: 0.12 + 0.1 * w, rl: 0.12 - 0.1 * w, lk: 0.15, rk: 0.15 });
    }
  } else {
    if (k >= 6) p = heroPose(ci);
    else if ((k & 1) === 0) setP(p, { la: 2.55, ra: 2.55, le: 0.1, re: 0.1, ll: 0.25, rl: 0.25, lk: 0.1, rk: 0.1, mouth: 1 });
    else setP(p, { la: 2.75, ra: 2.75, le: 1.25, re: 1.25, shrug: 1.5, ll: 0.15, rl: 0.15, lk: 0.2, rk: 0.2, mouth: 1 });
  }
  return p;
}
function dancePose(bp: number, ci: number, bass: number, jmax: number): Pose {
  const fb = Math.floor(bp);
  const b = ((fb % 32) + 32) % 32;
  const ph = bp - fb;
  const cur = keyPose(b, ci, bp), prev = keyPose((b + 31) % 32, ci, bp);
  const snap = ci === 0 ? 0.16 : ci === 2 ? 0.22 : 0.26;
  const e = ph < snap ? 1 - Math.pow(1 - ph / snap, 3) : 1;
  const p = lerpPose(prev, cur, e);
  const sec = b >> 3, k = b & 7;
  if (sec === 3 && k < 6 && (k & 1) === 0) {
    const jv = Math.sin(Math.PI * Math.min(1, ph * 1.25));
    p.jump = jv * jmax * (ci === 2 ? 1 : 0.85);
    p.ll += 0.5 * jv; p.lk -= 1.4 * jv; p.rl += 0.5 * jv; p.rk -= 1.4 * jv;
  }
  if (p.jump < 0.3) {
    const c = Math.max(0, Math.cos(ph * Math.PI * 2));
    const dip = c * c * (0.35 + 0.6 * bass) * (ci === 2 ? 1.3 : 1) + bass * 0.15;
    p.ll += dip * 0.3; p.rl += dip * 0.3; p.lk -= dip * 0.6; p.rk -= dip * 0.6; p.bob += dip * 0.4;
  }
  return p;
}
function idlePose(ci: number, t: number, bass: number, energy: number): Pose {
  const p = basePose();
  p.bob = Math.sin(t * 1.7 + ci * 1.3) * 0.35;
  p.tilt = Math.sin(t * 0.8 + ci * 2.1) * 0.35;
  p.sway = Math.sin(t * 0.5 + ci) * 0.5 * (0.3 + energy);
  const lift = energy * 0.9;
  if (ci === 0) setP(p, { la: 0.75, le: -2.0, ra: 0.3 + lift, re: 0.2 + lift * 0.5, rl: 0.25 });
  else if (ci === 1) setP(p, { la: 0.25 + lift * 0.8, ra: 0.25 + lift * 0.8, le: 0.3, re: 0.3 });
  else setP(p, { ra: 0.75, re: -2.0, la: 0.3 + lift, le: 0.2 + lift * 0.5, ll: 0.25 });
  const sq = bass * 0.8;
  p.ll += sq * 0.3; p.rl += sq * 0.3; p.lk -= sq * 0.6; p.rk -= sq * 0.6;
  return p;
}
function fillEll(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number): void {
  for (let dy = -ry; dy <= ry; dy++) {
    const k = dy / (ry + 0.5);
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - k * k)));
    ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
}

export function createKpopDanceScene(): {
  resize(width: number, height: number): void;
  draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioIn, dt: number): void;
} {
  let W = 0, H = 0, s = 1, mini = true, portrait = false;
  let groundY = 0, floorTop = 0, edgeY = 0, trussH = 0, spacing = 1, leftFree = 0, jumpMax = 0;
  let bg: HTMLCanvasElement | null = null;
  let towerX = -1, towerY = 0;
  const lamps: number[] = [], lanterns: number[] = [], sticks: number[] = [], wisps: number[] = [];
  let time = 0, sb = 0, st = 0, se = 0, pulse = 0, sparkAcc = 0;
  let prevBeat = false, fbCount = -1, fbPhase = 0.97, fbInt = 0.5, lastOnset = -99, onsetSeen = false;
  let lastPhase = 0, derivedCount = 0, lastB = -1, activity = 0, physInit = false;
  const fx = makeRng(4242);
  const NP = 72;
  const pX = new Float32Array(NP), pY = new Float32Array(NP), pVX = new Float32Array(NP), pVY = new Float32Array(NP);
  const pL = new Float32Array(NP), pM = new Float32Array(NP), pC = new Uint8Array(NP);
  let pNext = 0;
  const NR = 6;
  const rX = new Float32Array(NR), rY = new Float32Array(NR), rL = new Float32Array(NR);
  let rNext = 0;
  const hands = new Float32Array(12);
  const hOff = new Float32Array(3), hVel = new Float32Array(3), hLift = new Float32Array(3), hLiftV = new Float32Array(3);
  const prevHX = new Float32Array(3), prevJ = new Float32Array(3);

  function spawn(x: number, y: number, vx: number, vy: number, life: number, c: number): void {
    const i = pNext; pNext = (pNext + 1) % NP;
    pX[i] = x; pY[i] = y; pVX[i] = vx; pVY[i] = vy; pL[i] = life; pM[i] = life; pC[i] = c;
  }
  function burst(x: number, y: number, n: number, sp: number): void {
    for (let i = 0; i < n; i++) {
      const a = fx() * Math.PI * 2, v = sp * (0.4 + fx() * 0.8);
      spawn(x, y, Math.cos(a) * v, Math.sin(a) * v - sp * 0.3, 0.4 + fx() * 0.4, Math.floor(fx() * 4));
    }
  }

  function layout(w: number, h: number): void {
    W = w; H = h;
    portrait = h > w * 1.2;
    const footM = Math.max(2, Math.floor(h * 0.06));
    const byH = Math.floor(Math.min(h - footM - 2, h * 0.9) / 34);
    s = Math.max(0, Math.min(byH, Math.floor(w / 88), 8));
    mini = s < 1;
    if (mini) {
      s = 1; groundY = h - 1; floorTop = Math.max(1, Math.floor(h * 0.62)); edgeY = h; trussH = 0;
      spacing = Math.max(1, Math.floor(w / 4)); leftFree = 0; jumpMax = 0;
    } else {
      groundY = portrait ? Math.min(h - footM, Math.floor(h * 0.74)) : h - footM;
      spacing = Math.min(Math.floor(w / 3), 31 * s);
      jumpMax = Math.max(0, Math.min(6, Math.floor((groundY - 33 * s - 1) / s)));
      floorTop = Math.max(2, groundY - Math.max(3, 7 * s));
      edgeY = Math.min(h - 1, groundY + Math.max(1, Math.floor((h - groundY) * 0.45)));
      trussH = h >= 60 ? Math.max(2, Math.min(2 * s, Math.floor(h * 0.04))) : 0;
      leftFree = Math.floor(w / 2 - spacing - 15 * s);
    }
    for (let i = 0; i < 6; i++) { hands[i * 2] = Math.round(w / 2 + ((i >> 1) - 1) * spacing); hands[i * 2 + 1] = Math.round(groundY - 18 * s); }
    physInit = false;
    bake();
  }

  function bake(): void {
    bg = null; lamps.length = 0; lanterns.length = 0; sticks.length = 0; wisps.length = 0; towerX = -1;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'); if (!g) return;
    const r = makeRng(9001);
    const u = Math.max(1, Math.floor(s / 2));
    const F = (x: number, y: number, w: number, h: number, col: string): void => {
      g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
    };
    const disc = (cx: number, cy: number, rr: number, col: string): void => {
      for (let dy = -rr; dy <= rr; dy++) { const hw = Math.floor(Math.sqrt(rr * rr - dy * dy)); F(cx - hw, cy + dy, hw * 2 + 1, 1, col); }
    };
    const hz = Math.max(1, floorTop);
    const sky = ['#0c0922', '#130e31', '#1b1242', '#261650', '#35195c', '#4a2068', '#5d2870'];
    for (let y = 0; y < hz; y++) {
      const t = (y / hz) * (sky.length - 1), i = Math.floor(t), f = t - i;
      F(0, y, W, 1, sky[i]);
      if (f > 0.5 && i + 1 < sky.length) {
        g.fillStyle = sky[i + 1];
        const stp = f > 0.75 ? 2 : 4;
        for (let x = (y % 2) * (stp >> 1); x < W; x += stp) g.fillRect(x, y, 1, 1);
      }
    }
    const ns = Math.min(90, Math.floor((W * hz) / 300));
    for (let i = 0; i < ns; i++) F(Math.floor(r() * W), Math.floor(r() * hz * 0.7), 1, 1, r() < 0.3 ? '#ffe9b0' : '#c9c3ff');
    if (hz > 20 && W > 40) {
      const mr = Math.max(2, Math.floor(hz * 0.07)), mx = Math.floor(W * 0.13) + mr, my = Math.floor(hz * 0.14) + mr;
      disc(mx, my, mr, '#f6e9c8'); disc(mx + Math.ceil(mr * 0.5), my - Math.ceil(mr * 0.3), mr, sky[1]);
    }
    if (W >= 60 && hz > 10) {
      const tx = Math.floor(W * 0.8), th = Math.floor(hz * 0.62), tw = Math.max(1, Math.floor(s * 0.8));
      disc(tx, hz + Math.floor(th * 0.1), Math.floor(th * 0.25), '#1a1238');
      F(tx, hz - th, tw, th, '#2b2152');
      F(tx - 2 * tw, hz - Math.floor(th * 0.72), 5 * tw, Math.max(2, 2 * tw), '#3a2d6a');
      F(tx - tw, hz - Math.floor(th * 0.72), tw, 1, '#ffd76a'); F(tx + 2 * tw, hz - Math.floor(th * 0.72), tw, 1, '#7ff4ff');
      F(tx, hz - th - 3 * tw, 1, 3 * tw, '#3a2d6a');
      towerX = tx; towerY = hz - th - 3 * tw;
    }
    const wc = ['#f7d774', '#6fe3ff', '#ff7ac8'];
    for (let x = 0; x < W;) {
      const bw = (3 + Math.floor(r() * 9)) * u, bh = Math.floor(hz * (0.08 + r() * 0.3));
      F(x, hz - bh, bw, bh, '#1e1644');
      for (let wy = hz - bh + 2; wy < hz - 1; wy += 3 * u) for (let wx = x + 1; wx < x + bw - 1; wx += 2 * u) if (r() < 0.18) F(wx, wy, u, u, wc[Math.floor(r() * 3)]);
      x += bw + (r() < 0.3 ? u : 0);
    }
    const nroof = Math.max(2, Math.floor(W / 60));
    for (let i = 0; i < nroof; i++) {
      const rx = Math.floor(((i + 0.5) / nroof) * W + (r() - 0.5) * 20), rw = (12 + Math.floor(r() * 10)) * u;
      const rh = Math.max(2, Math.floor(rw * 0.28)), wallH = Math.max(2, Math.floor(rw * 0.22)), base = hz - wallH;
      F(rx - rw * 0.4, base, rw * 0.8, wallH, '#140d2c');
      if (wallH > 2) F(rx - u, base + 1, 2 * u, u, '#ffb04a');
      for (let j = 0; j < rh; j++) { const ww = rw * (0.55 + 0.45 * Math.pow(j / Math.max(1, rh - 1), 1.6)); F(rx - ww / 2, base - rh + j, ww, 1, '#110a26'); }
      F(rx - rw * 0.3, base - rh - u, rw * 0.6, u, '#110a26');
      F(rx - rw / 2 - u, base - 2 * u, u, u, '#110a26'); F(rx + rw / 2, base - 2 * u, u, u, '#110a26');
    }
    const ph = Math.max(2, 3 * s);
    for (let y = hz; y < H; y++) F(0, y, W, 1, y < edgeY ? ((y - hz) % ph === 0 ? '#2a1f48' : '#1d1535') : '#0b0819');
    const fd = Math.max(1, edgeY - hz);
    for (let k = -8; k <= 8; k++) {
      const x0 = W / 2 + (k * W) / 18, x1 = W / 2 + (k * W) / 7;
      for (let y = hz; y < edgeY; y++) F(x0 + ((x1 - x0) * (y - hz)) / fd, y, 1, 1, '#271c44');
    }
    for (let i = 0; i < 6; i++) F(r() * W, hz + 1 + r() * fd, 3 + r() * 10 * u, 1, '#3b2c68');
    F(0, hz, W, 1, '#8a2a78');
    if (edgeY < H) F(0, edgeY, W, 1, '#2a8fa6');
    for (let x = 0; x < W; x += 5 * u + 2) { const hr = 2 * u + Math.floor(r() * 2 * u); F(x, H - hr, 3 * u + 1, hr, '#130d26'); }
    if (!mini && leftFree >= 5) {
      const sw = Math.min(leftFree - 1, 9 * s + 2), sh = Math.min(Math.floor(sw * 1.8), groundY - hz + Math.floor(hz * 0.35)), sy = groundY - sh;
      for (const x of [1, W - 1 - sw]) {
        F(x, sy, sw, sh, '#2e2450'); F(x + 1, sy + 1, sw - 2, sh - 2, '#171126');
        const cr = Math.max(1, Math.floor(sw * 0.3));
        for (const fy of [0.3, 0.72]) { const cx = Math.floor(x + sw / 2), cy = Math.floor(sy + sh * fy); disc(cx, cy, cr, '#3a2f5a'); if (cr > 1) disc(cx, cy, cr - 1, '#0b0814'); F(cx, cy, 1, 1, '#6a5c9a'); }
      }
    }
    if (trussH > 0) {
      F(0, 0, W, trussH, '#1b1430');
      for (let x = 0; x < W; x += trussH * 2) { F(x, 0, 1, trussH, '#3a2f5a'); F(x + trussH, Math.floor(trussH / 2), 1, 1, '#3a2f5a'); }
      F(0, trussH - 1, W, 1, '#3a2f5a');
      const nl = W >= 200 ? 5 : 3;
      for (let i = 0; i < nl; i++) { const lx = Math.round((W * (i + 0.5)) / nl); F(lx - 1, trussH, 3, 2, '#5a4d86'); lamps.push(lx); }
    }
    if (!mini) {
      const headTop = groundY - 33 * s - jumpMax * s, ly = trussH + 3 * u;
      if (headTop - (ly + 7 * u) > 2) lanterns.push(Math.round(W / 2 - spacing / 2), ly, Math.round(W / 2 + spacing / 2), ly);
      if (leftFree > 6 * u) lanterns.push(Math.round(leftFree / 2), ly + 2 * u, Math.round(W - leftFree / 2), ly + 2 * u);
      const cz = H - edgeY - 1;
      for (let x = 1 + u; x < W - 1; x += 3 * u + 2) {
        if (cz < 3 && x > leftFree - 1 && x < W - leftFree + 1) continue;
        sticks.push(x, Math.floor(r() * 4), Math.floor(r() * 628), cz >= 3 ? Math.min(cz - 1, 3 * u + Math.floor(r() * 3 * u)) : 4 + Math.floor(r() * 3));
        if (sticks.length >= 240) break;
      }
      for (let i = 0; i < 6; i++) wisps.push(i % 2, 0.5 + r(), r() * 10);
    }
    bg = c;
  }

  function drawChar(ctx: CanvasRenderingContext2D, ci: number, p: Pose, ox: number, oy: number): void {
    const L = LOOKS[ci];
    const X = (v: number): number => ox + Math.round(v * s);
    const Y = (v: number): number => oy + Math.round(v * s);
    const R = (x: number, y: number, w: number, h: number, c: string): void => {
      const x0 = X(x), y0 = Y(y);
      ctx.fillStyle = c; ctx.fillRect(x0, y0, Math.max(1, X(x + w) - x0), Math.max(1, Y(y + h) - y0));
    };
    const RO = (x: number, y: number, w: number, h: number): void => {
      if (s < 2) return;
      const x0 = X(x), y0 = Y(y);
      ctx.fillStyle = OUT; ctx.fillRect(x0 - 1, y0 - 1, Math.max(1, X(x + w) - x0) + 2, Math.max(1, Y(y + h) - y0) + 2);
    };
    const limb = (ax: number, ay: number, ex: number, ey: number, t: number, c: string, hc: string): void => {
      const x0 = X(ax), y0 = Y(ay), x1 = X(ex), y1 = Y(ey);
      const sz = Math.max(1, Math.round(t * s)), hf = sz >> 1, hs = Math.max(1, Math.round(sz / 3));
      const n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0)), stp = Math.max(1, hf);
      for (let pass = s < 2 ? 1 : 0; pass < 3; pass++) {
        ctx.fillStyle = pass === 0 ? OUT : pass === 1 ? c : hc;
        for (let i = 0; ; i += stp) {
          const q = Math.min(i, n);
          const x = x0 + Math.round(((x1 - x0) * q) / n) - hf, y = y0 + Math.round(((y1 - y0) * q) / n) - hf;
          if (pass === 0) ctx.fillRect(x - 1, y - 1, sz + 2, sz + 2);
          else if (pass === 1) ctx.fillRect(x, y, sz, sz);
          else ctx.fillRect(x, y, hs, hs);
          if (q >= n) break;
        }
      }
    };
    const ext = (a: number, k: number): number => 5 * Math.cos(a) + 5 * Math.cos(a + k);
    const hipY = -Math.max(ext(p.ll, p.lk), ext(p.rl, p.rk), 3) - p.jump;
    const hipX = p.sway, tt = hipY - 8 + p.bob, sx = hipX + p.lean, hx = sx + p.tilt, hy = tt - 11, sy = tt + 1 - p.shrug;
    const ho = hOff[ci], hl = hLift[ci];
    // back hair
    if (ci === 0) {
      const len = Math.max(12, Math.round(hipY - hy + 1));
      for (let pass = 0; pass < 2; pass++) for (let r = 0; r < len; r++) {
        const f = r / len, w = 14 - f * 3, x = hx - w / 2 + ho * f * f * 1.8, y = hy + 1 + r - hl * f * 1.5;
        if (pass === 0) { RO(x, y, w, 1); continue; }
        R(x, y, w, 1, L.hairD); R(x + 1, y, w - 2 - (r > len - 3 ? 1 : 0), 1, L.hair);
        if (r % 3 !== 2) R(x + 3 + (r % 2), y, 1, 1, L.hairL);
      }
    } else if (ci === 1) {
      RO(hx - 7, hy + 1, 14, 7); R(hx - 7, hy + 1, 14, 7, L.hairD);
      let lx = hx + 3, ly = hy + 3;
      for (let i = 0; i < 10; i++) {
        const f = i / 9;
        lx = hx + 3 + i * 0.5 + ho * Math.pow(f, 1.3) * 1.6 + Math.sin(time * 2.6 + i * 0.7) * 0.35 * f;
        ly = hy + 3 + i * 2.2 - hl * f * 2;
        RO(lx - 1.5, ly, 3, 2.6); R(lx - 1.5, ly, 3, 2.6, i % 2 ? L.hairD : L.hair); R(lx + (i % 2 ? 0.5 : -1.5), ly, 1, 1, L.hairL);
      }
      R(lx - 1.5, ly + 2.4, 3, 1, GOLD_L); R(lx - 1, ly + 3.4, 2, 2, L.hair); R(lx - 1, ly + 3.4, 1, 1, L.hairL);
    } else { RO(hx - 7, hy + 1, 14, 8); R(hx - 7, hy + 1, 14, 8, L.hairD); }
    // legs
    for (const sg of [-1, 1]) {
      const a = sg < 0 ? p.ll : p.rl, k = sg < 0 ? p.lk : p.rk;
      const jx = hipX + sg * 2, kx = jx + sg * 5 * Math.sin(a), ky = hipY + 5 * Math.cos(a);
      const fX = kx + sg * 5 * Math.sin(a + k), fY = ky + 5 * Math.cos(a + k), toe = fX - 2 + sg * 0.5;
      if (ci === 2) {
        limb(jx, hipY, kx, ky, 4, PANTS, PANTS_L); limb(kx, ky, fX, fY - 1.5, 4, PANTS, PANTS_L);
        R(kx - 0.5, ky - 0.5, 1, 1, TEAL); R(fX - 2, fY - 2.6, 4, 1, TEAL);
        RO(toe, fY - 1.6, 4, 1.6); R(toe, fY - 1.6, 4, 1.6, SHOE); R(toe, fY - 0.6, 4, 0.6, BLUE);
      } else {
        limb(jx, hipY, kx, ky, 3, L.skin, '#fff0e0'); limb(kx, ky + 0.5, fX, fY - 1, 3.2, DARK, DARK_L);
        R(kx - 1.7, ky, 3.4, 1, ci === 0 ? PINK : GOLD);
        RO(toe, fY - 1.6, 4, 1.6); R(toe, fY - 1.6, 4, 1.6, DARK); R(toe, fY - 0.6, 4, 0.6, ci === 0 ? PINK : '#110c1a');
      }
    }
    // torso
    const widths = [8, 8, 7, 7, 6, 6, 7, 8];
    for (let pass = 0; pass < 2; pass++) for (let r = 0; r < 8; r++) {
      const cx = sx + ((hipX - sx) * r) / 7, w = widths[r], x = cx - w / 2, y = tt + r;
      if (pass === 0) { RO(x, y, w, 1); continue; }
      if (ci === 1) {
        if (r <= 4) { R(x, y, w, 1, GOLD); R(x, y, 1, 1, GOLD_D); R(x + w - 1, y, 1, 1, GOLD_D); R(cx - 1.5, y, 3, 1, TOP); R(cx - 2.5, y, 1, 1, GOLD_L); R(cx + 1.5, y, 1, 1, GOLD_L); }
        else if (r === 5) { R(x, y, w, 1, TOP); R(x, y, 1, 1, TOP_S); }
        else { R(x, y, w, 1, DARK); R(x, y, 1, 1, DARK_L); if (r === 6) R(cx - 0.5, y, 1, 1, GOLD); }
      } else if (ci === 0) {
        if (r <= 4) { R(x, y, w, 1, DARK); R(x, y, 1, 1, DARK_L); if (r === 2) R(cx - 1, y, 2, 1, PINK); }
        else if (r === 5) { R(x, y, w, 1, L.skin); R(x, y, 1, 1, L.skinS); }
        else R(x, y, w, 1, GOLD);
      } else {
        if (r <= 1) { R(x, y, w, 1, L.skin); R(cx - 2.5, y, 1, 1, BLUE); R(cx + 1.5, y, 1, 1, BLUE); }
        else if (r <= 4) { R(x, y, w, 1, r === 4 ? BLUE_D : BLUE); R(x, y, 1, 1, BLUE_L); }
        else if (r === 5) { R(x, y, w, 1, L.skin); R(x, y, 1, 1, L.skinS); }
        else R(x, y, w, 1, r === 6 ? TEAL : PANTS);
      }
    }
    if (ci === 1) { RO(hipX - 4, hipY - 0.5, 8, 2); R(hipX - 4, hipY - 0.5, 8, 2, DARK); R(hipX - 0.5, hipY + 0.5, 1, 1, OUT); }
    else if (ci === 2) { R(hipX - 4.5, hipY - 0.5, 9, 2, PANTS); R(hipX - 4.5, hipY - 0.5, 1, 2, PANTS_L); }
    else {
      const so = ho * 0.3;
      for (let pass = 0; pass < 2; pass++) for (let j = 0; j < 5; j++) {
        const w = 8 + j * 1.1, cx = hipX + (so * j) / 4, y = hipY - 1 + j;
        if (pass === 0) { RO(cx - w / 2, y, w, 1); continue; }
        R(cx - w / 2, y, w, 1, j === 4 ? GOLD_D : GOLD);
        for (let q = -w / 2 + 1.5; q < w / 2 - 0.5; q += 2) R(cx + q, y, 1, 1, GOLD_D);
        R(cx - w / 2, y, 1, 1, GOLD_L);
      }
    }
    const arm = (sg: number, a: number, e: number): void => {
      const shx = sx + sg * SHX[ci], ex = shx + sg * 5 * Math.sin(a), ey = sy + 5 * Math.cos(a);
      const qx = ex + sg * 5 * Math.sin(a + e), qy = ey + 5 * Math.cos(a + e);
      if (ci === 1) limb(shx, sy, ex, ey, 2.6, GOLD, GOLD_L); else limb(shx, sy, ex, ey, 2, L.skin, '#fff0e0');
      limb(ex, ey, qx, qy, 2, L.skin, '#fff0e0');
      if (ci === 0) { RO(shx - 1.5, sy - 1, 3, 2.2); R(shx - 1.5, sy - 1, 3, 2.2, DARK); }
      if (ci === 1) R(ex - 1.3, ey - 1, 2.6, 1.5, GOLD_D);
      const bx = ex + (qx - ex) * 0.72, by = ey + (qy - ey) * 0.72;
      if (ci !== 1) R(bx - 1, by - 0.5, 2, 1, ci === 0 ? PINK : BLUE);
      RO(qx - 1, qy - 1, 2, 2); R(qx - 1, qy - 1, 2, 2, L.skin);
      const hi = (ci * 2 + (sg > 0 ? 1 : 0)) * 2;
      hands[hi] = X(qx); hands[hi + 1] = Y(qy);
    };
    if (p.la <= 2) arm(-1, p.la, p.le);
    if (p.ra <= 2) arm(1, p.ra, p.re);
    // head
    R(hx - 1, tt - 1, 2, 1.5, L.skinS);
    RO(hx - 6, hy + 2, 12, 8); RO(hx - 4, hy + 10, 8, 1); RO(hx - 7, hy - 1, 14, 3);
    R(hx - 6, hy + 2, 12, 8, L.skin); R(hx - 4, hy + 10, 8, 1, L.skin);
    R(hx - 6, hy + 8, 1, 2, L.skinS); R(hx + 5, hy + 8, 1, 2, L.skinS); R(hx - 4, hy + 10, 1, 1, L.skinS); R(hx + 3, hy + 10, 1, 1, L.skinS);
    const blink = (time * 0.9 + ci * 0.37) % 4.1 < 0.12;
    for (const ex of [hx - 4, hx + 2]) {
      if (blink) R(ex, hy + 7, 2, 1, LASH);
      else { R(ex, hy + 5, 2, 1, LASH); R(ex, hy + 6, 2, 2, L.iris); R(ex + 1, hy + 7, 1, 1, L.irisD); R(ex, hy + 6, 1, 1, '#ffffff'); }
    }
    if (ci === 0) { R(hx - 5, hy + 5, 1, 1, LASH); R(hx + 4, hy + 5, 1, 1, LASH); }
    R(hx - 5, hy + 8, 2, 1, BLUSH); R(hx + 3, hy + 8, 2, 1, BLUSH);
    if (p.mouth > 0.5) { R(hx - 1, hy + 8, 2, 1, '#c8405e'); R(hx - 1, hy + 9, 2, 1, '#6a1530'); }
    else R(ci === 0 ? hx : hx - 1, hy + 9, 2, 1, '#a8354f');
    R(hx - 5, hy - 1, 10, 1, L.hair); R(hx - 7, hy, 14, 2, L.hair);
    const bang = BANGS[ci];
    for (let k = 0; k < 12; k++) { R(hx - 6 + k, hy, 1, bang[k], L.hair); if (k % 2) R(hx - 6 + k, hy + bang[k] - 1, 1, 1, L.hairD); }
    const lockH = ci === 2 ? 7 : 8;
    R(hx - 7, hy + 1, 1, lockH, L.hair); R(hx + 6, hy + 1, 1, lockH, L.hair);
    R(hx - 4, hy, 3, 1, L.hairL); R(hx + 1, hy, 2, 1, L.hairL); R(hx - 5, hy + 1, 1, 1, L.hairL);
    if (ci === 2) {
      const by = hy - 3 - hl * 0.5;
      for (const bx of [hx - 6.5, hx + 2.5]) { RO(bx, by, 4, 3.2); R(bx, by, 4, 3.2, L.hair); R(bx + 1, by, 1, 1, L.hairL); R(bx, by + 2.6, 4, 0.6, BLUE_L); }
    } else if (ci === 1) R(hx + 4, hy + 2, 1, 1, GOLD);
    else R(hx - 7, hy + 7, 1, 1, GOLD);
    if (p.la > 2) arm(-1, p.la, p.le);
    if (p.ra > 2) arm(1, p.ra, p.re);
  }

  function drawMini(ctx: CanvasRenderingContext2D, beatPos: number): void {
    const m = Math.max(1, Math.floor(H / 10));
    const ph = beatPos - Math.floor(beatPos);
    const cols = [[LOOKS[0].hair, LOOKS[0].skin, DARK, GOLD], [LOOKS[1].hair, LOOKS[1].skin, GOLD, DARK], [LOOKS[2].hair, LOOKS[2].skin, BLUE, PANTS]];
    for (let ci = 0; ci < 3; ci++) {
      const c = cols[ci];
      const up = (activity > 0.5 && ph > 0.2 && ph < 0.6) || sb > 0.6 ? (H >= 6 * m ? m : 0) : 0;
      const x0 = Math.round((W * (ci + 1)) / 4 - 1.5 * m), yb = H - m - up;
      ctx.fillStyle = c[3]; ctx.fillRect(x0, yb, m, m); ctx.fillRect(x0 + 2 * m, yb, m, m);
      ctx.fillStyle = c[2]; ctx.fillRect(x0, yb - m, 3 * m, m);
      ctx.fillStyle = c[0]; ctx.fillRect(x0, yb - 3 * m, 3 * m, 2 * m);
      ctx.fillStyle = c[1]; ctx.fillRect(x0 + m, yb - 2 * m, m, m);
      ctx.fillStyle = c[0];
      if (ci === 0) ctx.fillRect(x0 - m, yb - 2 * m, m, 2 * m);
      else if (ci === 1) ctx.fillRect(x0 + 3 * m, yb - 2 * m, m, 2 * m);
      else { ctx.fillRect(x0, yb - 4 * m, m, m); ctx.fillRect(x0 + 2 * m, yb - 4 * m, m, m); }
    }
    if (pulse > 0.5) { ctx.fillStyle = SPARK[0]; ctx.fillRect(Math.floor(W / 2), 0, 1, 1); }
  }

  function drawBack(ctx: CanvasRenderingContext2D, beatIdx: number, hasClock: boolean): void {
    if (towerX >= 0 && time % 1.6 < 0.8) { ctx.fillStyle = '#ff4a5a'; ctx.fillRect(towerX, towerY, 1, 1); }
    const u = Math.max(1, Math.floor(s / 2));
    ctx.globalAlpha = 0.06 + 0.1 * sb + 0.05 * pulse;
    for (let i = 0; i < lamps.length; i++) {
      const ang = (i % 2 ? 1 : -1) * 0.25 + Math.sin(time * 0.35 + i * 1.7) * 0.2 * (0.5 + se), ta = Math.tan(ang);
      ctx.fillStyle = ['#ff5ab4', '#5ff0ff', '#ffd24a'][i % 3];
      for (let y = trussH + 2; y < floorTop; y += s) {
        const dd = y - trussH, hw = 1 + Math.floor(dd * 0.07);
        ctx.fillRect(Math.round(lamps[i] + dd * ta) - hw, y, hw * 2 + 1, s);
      }
    }
    const acx = Math.round(W / 2), acy = groundY - 2 * s;
    const arx = Math.round(Math.min(W / 2 - 2, spacing * 1.6 + 10 * s)), ary = Math.round(Math.max(4, Math.min(acy - trussH - 2, 44 * s)));
    const n = Math.max(24, Math.min(240, Math.round((arx + ary) * 0.9))), off = Math.floor(time * 8), ps = s >= 3 ? 2 : 1;
    ctx.globalAlpha = Math.min(0.75, 0.16 + 0.3 * sb + 0.25 * pulse);
    for (let i = 0; i <= n; i++) {
      const th = (Math.PI * i) / n;
      if ((i + off) % 6 < 4) { ctx.fillStyle = '#7ff6ff'; ctx.fillRect(Math.round(acx + Math.cos(th) * arx), Math.round(acy - Math.sin(th) * ary), ps, ps); }
      if (i % 10 === 5) { ctx.fillStyle = '#ff7ad8'; ctx.fillRect(Math.round(acx + Math.cos(th) * arx * 0.93), Math.round(acy - Math.sin(th) * ary * 0.93), ps, ps); }
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < lanterns.length; i += 2) {
      const lx = lanterns[i], ly = lanterns[i + 1] + Math.round(Math.sin(time * 1.1 + lx) * 0.8);
      ctx.fillStyle = '#3a2f5a'; ctx.fillRect(lx, trussH, 1, Math.max(1, ly - trussH));
      ctx.globalAlpha = 0.15 + 0.2 * sb; ctx.fillStyle = '#ff8a3c'; ctx.fillRect(lx - 2 * u, ly - u, 5 * u, 6 * u);
      ctx.globalAlpha = 1; ctx.fillStyle = '#d8343c'; ctx.fillRect(lx - u, ly, 3 * u, 4 * u);
      ctx.fillStyle = '#ffcf4a'; ctx.fillRect(lx - u, ly, 3 * u, u); ctx.fillRect(lx - u, ly + 3 * u, 3 * u, u);
      ctx.fillStyle = '#ffe38a'; ctx.fillRect(lx, ly + u, u, 2 * u);
    }
    ctx.globalAlpha = Math.min(1, 0.35 + 0.55 * sb + 0.2 * pulse);
    ctx.fillStyle = '#ff3fa4'; ctx.fillRect(0, floorTop, W, 1);
    if (edgeY < H) { ctx.fillStyle = '#3fe8ff'; ctx.fillRect(0, edgeY, W, 1); }
    ctx.globalAlpha = 1;
    if (edgeY + 1 < H) for (let i = 0, x = 2; x < W; i++, x += 6 * u) {
      const lit = hasClock ? (i + beatIdx) % 3 === 0 : i % 3 === 0 && sb > 0.3;
      ctx.fillStyle = lit ? '#ffe27a' : '#6a5420'; ctx.fillRect(x, edgeY + 1, u, 1);
    }
  }

  function drawFront(ctx: CanvasRenderingContext2D): void {
    const u = Math.max(1, Math.floor(s / 2));
    for (let i = 0; i < sticks.length; i += 4) {
      const x = sticks[i], hgt = sticks[i + 3];
      const sw = Math.round(Math.sin(time * (1.5 + st * 3) + sticks[i + 2] / 100) * (0.6 + st * 1.4));
      const top = H - 1 - hgt - (st > 0.55 && i % 8 === 0 ? 1 : 0) - Math.round(sb * 1.2);
      ctx.fillStyle = '#2c2640'; ctx.fillRect(x, top + 2 * u, u, Math.max(1, H - top - 2 * u));
      ctx.globalAlpha = 0.15 + 0.3 * st; ctx.fillStyle = STICK[sticks[i + 1]]; ctx.fillRect(x + sw - u, top - u, 4 * u, 4 * u);
      ctx.globalAlpha = 0.55 + 0.45 * st; ctx.fillRect(x + sw, top, 2 * u, 2 * u);
      ctx.globalAlpha = 1;
    }
    const zone = Math.max(3, leftFree);
    for (let i = 0; i < wisps.length; i += 3) {
      const side = wisps[i], sp = wisps[i + 1], ph = wisps[i + 2], span = Math.max(4, floorTop);
      const y = Math.round(span - ((time * sp * 8 + ph * span) % span));
      const xo = Math.round(zone * 0.3 + Math.sin(time * 1.3 + ph) * 2);
      const x = side ? W - 1 - xo : xo;
      ctx.globalAlpha = 0.22 + 0.2 * se; ctx.fillStyle = side ? '#c8a8ff' : '#b8fff6';
      ctx.fillRect(x, y, u, u); ctx.fillRect(x + (side ? -u : u), y + u, u, u); ctx.fillRect(x, y + 2 * u, u, 2 * u);
    }
    ctx.globalAlpha = 1;
  }

  return {
    resize(width: number, height: number): void {
      const w = Math.floor(Number(width)), h = Math.floor(Number(height));
      if (!Number.isFinite(w) || !Number.isFinite(h) || !(w >= 1 && h >= 1)) { W = 0; H = 0; bg = null; return; }
      layout(w, h);
    },
    draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioIn, dt: number): void {
      const w = Math.floor(Number(width)), h = Math.floor(Number(height));
      if (!ctx || !Number.isFinite(w) || !Number.isFinite(h) || !(w >= 1 && h >= 1)) return;
      if (w !== W || h !== H || !bg) layout(w, h);
      const d = Math.min(0.05, Math.max(0, typeof dt === 'number' && isFinite(dt) ? dt : 0));
      time += d;
      const au: Partial<AudioIn> = audio || {};
      const k = Math.min(1, d * 10);
      sb += (c01(au.bass) - sb) * k; st += (c01(au.treble) - st) * k; se += (c01(au.energy) - se) * k;
      let hasClock = false, beatPos = 0;
      if (typeof au.beatPhase === 'number' && isFinite(au.beatPhase)) {
        const ph = Math.min(0.9999, Math.max(0, au.beatPhase));
        if (typeof au.beatCount === 'number' && isFinite(au.beatCount)) beatPos = Math.floor(au.beatCount) + ph;
        else { if (ph < lastPhase - 0.5) derivedCount++; beatPos = derivedCount + ph; }
        lastPhase = ph; hasClock = true;
      }
      const onset = !!au.beat && !prevBeat;
      prevBeat = !!au.beat;
      if (onset) {
        if (onsetSeen) { const iv = time - lastOnset; if (iv > 0.2 && iv < 1.5) fbInt = fbInt * 0.6 + iv * 0.4; }
        onsetSeen = true; lastOnset = time; fbCount++; fbPhase = 0; pulse = 1;
      } else fbPhase = Math.min(0.97, fbPhase + d / Math.max(0.2, fbInt));
      if (!hasClock) beatPos = Math.max(0, fbCount) + fbPhase;
      activity += ((hasClock || (onsetSeen && time - lastOnset < 2.6) ? 1 : 0) - activity) * Math.min(1, d * 3);
      pulse = Math.max(0, pulse - d * 3);
      const bIdx = ((Math.floor(beatPos) % 32) + 32) % 32;
      ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
      if (bg) ctx.drawImage(bg, 0, 0); else { ctx.fillStyle = '#130e31'; ctx.fillRect(0, 0, W, H); }
      if (mini) { drawMini(ctx, beatPos); return; }
      drawBack(ctx, bIdx, hasClock);
      const poses: Pose[] = [], oxs: number[] = [], oys: number[] = [];
      const fwd = portrait ? Math.min(2 * s, Math.max(0, edgeY - groundY - 2)) : 0;
      for (let ci = 0; ci < 3; ci++) {
        const idle = idlePose(ci, time, sb, se);
        const p = activity > 0.001 ? lerpPose(idle, dancePose(beatPos, ci, sb, jumpMax), activity) : idle;
        poses.push(p);
        oxs.push(Math.round(W / 2 + (ci - 1) * spacing + p.x * s)); oys.push(groundY + (ci === 1 ? fwd : 0));
        const headU = p.x + p.sway + p.lean + p.tilt;
        if (!physInit) { prevHX[ci] = headU; prevJ[ci] = p.jump; }
        if (d > 0) {
          const v = (headU - prevHX[ci]) / d;
          const tgt = Math.max(-3.5, Math.min(3.5, -v * 0.09)) + Math.sin(time * 1.3 + ci) * 0.3 + (st - 0.2) * 0.2;
          hVel[ci] += ((tgt - hOff[ci]) * 38 - hVel[ci] * 7) * d;
          hOff[ci] = Math.max(-5, Math.min(5, hOff[ci] + hVel[ci] * d));
          const lt = Math.max(-2, Math.min(2, (-(p.jump - prevJ[ci]) / d) * 0.06));
          hLiftV[ci] += ((lt - hLift[ci]) * 40 - hLiftV[ci] * 8) * d;
          hLift[ci] = Math.max(-2.5, Math.min(2.5, hLift[ci] + hLiftV[ci] * d));
        }
        prevHX[ci] = headU; prevJ[ci] = p.jump;
      }
      physInit = true;
      for (let ci = 0; ci < 3; ci++) {
        const p = poses[ci], cx = oxs[ci] + Math.round(p.sway * s);
        ctx.globalAlpha = 0.1 + 0.25 * sb + 0.1 * pulse; ctx.fillStyle = LOOKS[ci].hair;
        fillEll(ctx, cx, oys[ci] + Math.max(1, s), 10 * s, Math.max(1, Math.round(s * 1.5)));
        ctx.globalAlpha = 0.55; ctx.fillStyle = '#07040e';
        fillEll(ctx, cx, oys[ci], Math.max(2, Math.round((7 - Math.min(p.jump, 6) * 0.6) * s)), Math.max(1, Math.round(s * 0.8)));
      }
      if (onset) {
        rX[rNext] = W / 2; rY[rNext] = groundY; rL[rNext] = 0.001; rNext = (rNext + 1) % NR;
        for (let i = 0; i < 6; i++) burst(hands[i * 2], hands[i * 2 + 1], 2, 40 * Math.max(1, s * 0.6));
      }
      if (hasClock && bIdx !== lastB && bIdx === 30) for (let i = 0; i < 3; i++) burst(oxs[i], oys[i] - 30 * s, 5, 50 * Math.max(1, s * 0.6));
      if (hasClock && bIdx !== lastB && bIdx >= 25 && bIdx <= 29 && bIdx % 2 === 1) for (let i = 0; i < 3; i++) burst(oxs[i], oys[i] - 30 * s, 2, 25 * s);
      lastB = hasClock ? bIdx : -1;
      for (let i = 0; i < NR; i++) {
        if (rL[i] <= 0) continue;
        rL[i] += d * 1.4;
        if (rL[i] >= 1) { rL[i] = 0; continue; }
        const rr = rL[i] * spacing * 1.6;
        ctx.globalAlpha = (1 - rL[i]) * 0.7; ctx.fillStyle = i % 2 ? '#ff7ad8' : '#7ff6ff';
        for (let j = 0; j < 48; j++) { const a = (j / 48) * Math.PI * 2; ctx.fillRect(Math.round(rX[i] + Math.cos(a) * rr), Math.round(rY[i] + Math.sin(a) * rr * 0.22), s >= 3 ? 2 : 1, 1); }
      }
      ctx.globalAlpha = 1;
      for (const ci of [0, 2, 1]) drawChar(ctx, ci, poses[ci], oxs[ci], oys[ci]);
      sparkAcc += st * d * 18;
      while (sparkAcc >= 1) {
        sparkAcc -= 1;
        const hi = Math.floor(fx() * 6);
        spawn(hands[hi * 2] + (fx() - 0.5) * 6 * s, hands[hi * 2 + 1] + (fx() - 0.5) * 6 * s, (fx() - 0.5) * 10, -8 - fx() * 12, 0.35 + fx() * 0.3, Math.floor(fx() * 4));
      }
      const ps = Math.max(1, Math.floor(s / 2));
      for (let i = 0; i < NP; i++) {
        if (pL[i] <= 0) continue;
        pL[i] -= d; pVY[i] += 30 * d; pX[i] += pVX[i] * d; pY[i] += pVY[i] * d;
        if (pL[i] <= 0) continue;
        const f = pL[i] / pM[i], x = Math.round(pX[i]), y = Math.round(pY[i]);
        ctx.globalAlpha = Math.min(1, f * 1.5); ctx.fillStyle = SPARK[pC[i]];
        ctx.fillRect(x, y, ps, ps);
        if (s >= 2 && f > 0.5) { ctx.fillRect(x - ps, y, ps * 3, ps); ctx.fillRect(x, y - ps, ps, ps * 3); }
      }
      ctx.globalAlpha = 1;
      drawFront(ctx);
    },
  };
}
