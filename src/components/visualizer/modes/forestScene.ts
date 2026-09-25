type Rng = () => number;
type Pt = (x: number, y: number, c: string, w?: number, h?: number) => void;
interface Layer { c: HTMLCanvasElement; g: CanvasRenderingContext2D }
interface Sprite { img: HTMLCanvasElement; x: number; y: number; ph: number; amp: number }
interface Fern { x: number; y: number; px: Int16Array; h: number; ph: number; front: boolean }
interface Shaft { o: number; w: number; sl: number; ph: number }
interface AudioIn { bass: number; treble: number; energy: number; beat: boolean }

const FAR_LEAF = ['#3f7466', '#4f8670', '#64987a', '#80ae86'];
const MID_LEAF = ['#12392f', '#1c5236', '#2a6c38', '#3f8a3c', '#65ad48', '#a5d466'];
const FORE_LEAF = ['#041815', '#092822', '#0f3a2b', '#18522f', '#276a33', '#478c3e'];
const MID_BARK = ['#1b2e2a', '#2c423a', '#46604e', '#6d8a64', '#2f5a2c', '#4f8a36'];
const FORE_BARK = ['#0a1614', '#15251f', '#26392e', '#3f5a40', '#1d4424', '#3a7a2e'];
const SKY = ['#4f8c80', '#6aa28a', '#8bb995', '#b1cf9d', '#d6dea4', '#efe6ac', '#fbefbc'];
const GROUND = ['#5a9660', '#4a8753', '#3b7747', '#2f683c', '#255a34', '#1c4b2d', '#153e27'];
const LIT = ['#7fb652', '#99c85a', '#b9dc6c'];
const WATER = ['#155e61', '#1f8384', '#2ea8a2', '#5ccbbd', '#a4e6d2'];
const FERN_PAL = [['#174a2c', '#2e7a3a', '#78c052'], ['#07221b', '#123e28', '#2a6630']];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function mulberry32(a: number): Rng {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(x: number, y: number): number { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
function h1(n: number): number { const v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); }
function bay(x: number, y: number): number { return (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16; }
function clamp01(v: unknown): number { return typeof v === 'number' && v > 0 ? (v < 1 ? v : 1) : 0; }

function layer(w: number, h: number): Layer {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w); c.height = Math.max(1, h);
  const g = c.getContext('2d') as CanvasRenderingContext2D;
  g.imageSmoothingEnabled = false;
  return { c, g };
}
function painter(g: CanvasRenderingContext2D): Pt {
  let last = '';
  return (x, y, c, w = 1, h = 1) => {
    if (c !== last) { g.fillStyle = c; last = c; }
    g.fillRect(Math.floor(x), Math.floor(y), w, h);
  };
}

function makeCluster(rng: Rng, r: number, pal: string[], lightR: boolean): HTMLCanvasElement {
  const R = Math.max(2, Math.round(r)), S2 = R * 2 + 4, L = layer(S2, S2), pt = painter(L.g), c = S2 / 2;
  const puffs: number[] = [c, c, R * 0.6];
  const n = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < n; i++) {
    const a = rng() * 6.283, d = rng() * R * 0.5;
    puffs.push(c + Math.cos(a) * d * 1.1, c + Math.sin(a) * d * 0.8, R * (0.32 + rng() * 0.28));
  }
  const seed = rng() * 100, ls = lightR ? 1 : -1;
  for (let y = 0; y < S2; y++) for (let x = 0; x < S2; x++) {
    let best = 9, nx = 0, ny = 0;
    for (let i = 0; i < puffs.length; i += 3) {
      const dx = (x + 0.5 - puffs[i]) / puffs[i + 2], dy = (y + 0.5 - puffs[i + 1]) / puffs[i + 2], d = dx * dx + dy * dy;
      if (d < best) { best = d; nx = dx; ny = dy; }
    }
    const clump = hash(Math.floor(x / 2) + seed, Math.floor(y / 2));
    const e = best + (hash(x + seed, y) - 0.5) * 0.55 + (clump - 0.5) * 0.35;
    if (e > 1) continue;
    let l = -ny * 0.55 + nx * ls * 0.45 + (0.5 - y / S2) * 0.6 + (hash(Math.floor(x / 2) + seed * 3, Math.floor(y / 2)) - 0.5) * 0.5;
    if (e > 0.8 && l < 0.2) l -= 0.3;
    pt(x, y, pal[Math.max(0, Math.min(pal.length - 1, Math.floor(((l + 0.9) / 1.8) * pal.length)))]);
  }
  return L.c;
}

function makeFern(rng: Rng, hgt: number, lightR: boolean): Int16Array {
  const out: number[] = [], fr = 3 + Math.floor(rng() * 3);
  for (let f = 0; f < fr; f++) {
    const lean = (f / (fr - 1) - 0.5) * 2.2 + (rng() - 0.5) * 0.4, hf = Math.max(3, Math.round(hgt * (0.6 + rng() * 0.4)));
    for (let i = 0; i < hf; i++) {
      const fi = i / hf, sx = Math.round(lean * fi * fi * hf * 0.6), sy = -i + Math.round(Math.abs(lean) * fi * fi * hf * 0.3);
      out.push(sx, sy, 0);
      if (i >= 2 && i % 2 === 0) {
        const len = Math.max(1, Math.round((1 - fi) * hf * 0.3 * Math.min(1, fi * 5)));
        for (let s = -1; s <= 1; s += 2) for (let j = 1; j <= len; j++) out.push(sx + s * j, sy - (j > len * 0.6 ? 1 : 0), (s > 0) === lightR ? 2 : 1);
      }
    }
  }
  return Int16Array.from(out);
}

function gnOff(y: number, seed: number, gn: number): number {
  return gn * (Math.sin(y * 0.045 + seed) + Math.sin(y * 0.13 + seed * 2) * 0.35);
}

function trunk(pt: Pt, cx: number, yTop: number, yBase: number, wTop: number, wBot: number, pal: string[], gn: number, seed: number, lightR: boolean, moss: number): number {
  for (let y = yTop; y <= yBase; y++) {
    const f = (y - yTop) / Math.max(1, yBase - yTop);
    const wd = Math.max(1, Math.round(wTop + (wBot - wTop) * f * f * f + (f > 0.88 ? ((f - 0.88) / 0.12) * wBot * 0.5 : 0)));
    const xl = Math.round(cx + gnOff(y, seed, gn) - wd / 2);
    for (let i = 0; i < wd; i++) {
      const rel = wd > 1 ? i / (wd - 1) : 0.5, lr = lightR ? rel : 1 - rel;
      let c = lr > 0.75 ? pal[2] : lr < 0.3 ? pal[0] : pal[1];
      if (lr > 0.9 && wd > 3) c = pal[3];
      if (hash(i * 3.7 + seed, Math.floor((y + i * 2) / 5)) > 0.8 || (hash(i + seed, 1) > 0.75 && hash(i, Math.floor(y / 7)) > 0.3)) c = lr > 0.75 ? pal[1] : pal[0];
      if (moss > 0 && lr < 0.55 && hash(Math.floor(i / 2) + seed, Math.floor(y / 3)) < moss * (0.15 + f * 0.6)) c = hash(i, y) > 0.5 ? pal[5] : pal[4];
      pt(xl + i, y, c);
    }
  }
  return cx + gnOff(yBase, seed, gn);
}

function roots(pt: Pt, cx: number, by: number, wb: number, n: number, pal: string[], rng: Rng, spread: number): void {
  for (let k = 0; k < n; k++) {
    const dir = k % 2 ? 1 : -1, len = Math.round(wb * (0.5 + rng() * 0.8) * spread);
    const th0 = Math.max(1, Math.round(wb * (0.22 + rng() * 0.12))), sx = cx + dir * wb * (0.2 + rng() * 0.2);
    for (let s = 0; s <= len; s++) {
      const f = s / Math.max(1, len), x = Math.round(sx + dir * s);
      const top = Math.round(by - th0 * 1.6 * Math.pow(1 - f, 1.4) - (1 - f) * 0.5), bot = by + Math.round(f * 1.5);
      for (let y = top; y <= bot; y++) pt(x, y, y === top ? (hash(x, k) > 0.55 ? pal[5] : pal[2]) : y === bot ? pal[0] : pal[1]);
    }
  }
}

function mush(pt: Pt, x: number, y: number, k: number): void {
  x = Math.round(x); y = Math.round(y);
  const sw = k > 1 ? 2 : 1, sh = k + 1, cw = 1 + 2 * k, cy = y - sh, cxm = x + (sw - 1) / 2;
  pt(x, cy, '#e9dcc0', sw, sh + 1);
  if (sw > 1) pt(x, cy, '#b0a080', 1, sh + 1);
  for (let r = 0; r <= k; r++) {
    const wr = Math.max(1, r <= 1 ? cw : cw - 2 * (r - 1)), xl = Math.round(cxm - (wr - 1) / 2);
    pt(xl, cy - r, r === 0 ? '#8e1a20' : r === k ? '#e9553f' : '#d2302e', wr, 1);
    if (r === 1 && k >= 2) { pt(xl + 1, cy - r, '#fff2dc'); pt(xl + wr - 2, cy - r - 1, '#fff2dc'); }
  }
  if (k === 1) pt(Math.round(cxm), cy - 1, '#ffe8d0');
}

export function createForestScene() {
  let W = 0, H = 0, S = 1, hz = 0, vx = 0, sunX = 0, sunY = 0, clearY = 0, reqW = -1, reqH = -1;
  let bg: Layer | null = null, ground: Layer | null = null, fore: Layer | null = null;
  let farC: Sprite[] = [], midC: Sprite[] = [], foreC: Sprite[] = [], ferns: Fern[] = [], shafts: Shaft[] = [];
  let scx = new Float32Array(0), shw = new Float32Array(0), dew = new Int16Array(0);
  let t = 0, dtc = 0, bassE = 0, trebE = 0, enE = 0, beatE = 0, kick = 0, prevBass = 0, prevBeat = false, beatCd = 0, moteAcc = 0;
  const rr = mulberry32(90210);
  const ripples = Array.from({ length: 10 }, () => ({ on: false, x: 0, y: 0, r: 0, life: 0, sp: 0 }));
  const flies = Array.from({ length: 80 }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, ph: 0 }));
  const motes = Array.from({ length: 120 }, () => ({ on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, kind: 0, ph: 0 }));

  function resize(w: number, h: number): void {
    reqW = w; reqH = h;
    W = Math.max(24, Math.floor(w)); H = Math.max(24, Math.floor(h));
    S = Math.min(W, H) / 100;
    const portrait = H > W * 1.05;
    hz = Math.round(H * (portrait ? 0.52 : 0.44));
    vx = Math.round(W * 0.54); sunX = Math.round(W * (portrait ? 0.62 : 0.66)); sunY = Math.round(hz * 0.22);
    clearY = Math.round(hz + (H - hz) * 0.3);
    const rng = mulberry32(0x51f7 + W * 7919 + H * 104729), gH = H - 1 - hz;

    scx = new Float32Array(H); shw = new Float32Array(H);
    const sph = rng() * 6.28, bx = W * (0.4 + rng() * 0.12);
    for (let y = hz; y < H; y++) {
      const p = (y - hz) / gH;
      scx[y] = vx + (bx - vx) * p + Math.sin(p * 6.5 + sph) * W * 0.11 * p;
      shw[y] = 0.5 + Math.pow(p, 1.5) * W * (portrait ? 0.2 : 0.11);
    }

    // Background: sky, sun, haze silhouettes, distant slender trees
    bg = layer(W, H);
    let pt = painter(bg.g);
    for (let y = 0; y <= hz + 3; y++) for (let x = 0; x < W; x++) {
      const dx = (x - sunX) / (W * 0.45), dy = (y - sunY) / (hz * 0.9), glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
      const v = Math.min(SKY.length - 1.001, (y / hz) * 3.2 + glow * 3.6), i = Math.floor(v);
      pt(x, y, SKY[v - i > bay(x, y) ? i + 1 : i]);
    }
    const sr = Math.max(2, Math.round(3.5 * S));
    for (let ring = sr + 2; ring >= sr; ring -= 2) for (let dy = -ring; dy <= ring; dy++) {
      const hw = Math.round(Math.sqrt(ring * ring - dy * dy));
      pt(sunX - hw, sunY + dy, ring > sr ? '#fff4c4' : '#fffde8', hw * 2 + 1, 1);
    }
    const haze: [string, number, number][] = [['#a3c69b', 22, 0.035], ['#86b28d', 14, 0.06], ['#6b9e84', 8, 0.1]];
    haze.forEach(([col, hh, fq], k) => {
      const a = rng() * 9, b = rng() * 9;
      for (let x = 0; x < W; x++) {
        const spike = hash(Math.floor(x / 2), k * 9) > 0.65 ? hash(Math.floor(x / 2), k) * 3 : 0;
        const top = Math.round(hz - S * (hh * 0.6 + Math.sin(x * fq + a) * hh * 0.25 + Math.sin(x * fq * 2.7 + b) * hh * 0.15 + spike));
        pt(x, top, col, 1, hz + 3 - top);
      }
    });
    farC = [];
    const farN = Math.round(W / 6) + 6;
    for (let i = 0; i < farN; i++) {
      const x = Math.round(rng() * W), base = hz + 1 + Math.round(rng() * 2), top = Math.round(hz * (0.08 + rng() * 0.4)), tw = S > 1.6 && rng() < 0.5 ? 2 : 1;
      pt(x, top, '#4f7f6e', tw, base - top);
      for (let y = top; y < base; y += 2) if (hash(x, y) > 0.4) pt(x + (sunX > x ? tw - 1 : 0), y, '#7ea890');
      const nc = 2 + Math.floor(rng() * 2);
      for (let k = 0; k < nc; k++) {
        const r = (2 + rng() * 3.5) * S, img = makeCluster(rng, r, FAR_LEAF, x < sunX);
        const cy = top + k * r * 1.1 + rng() * r, cx = x + (rng() - 0.5) * r * 1.4;
        farC.push({ img, x: Math.round(cx - img.width / 2), y: Math.round(cy - img.height / 2), ph: rng() * 6.28, amp: 0.6 * S });
      }
    }

    // Ground: terrain, lit clearing, grass, stream, mid trunks, mushrooms
    ground = layer(W, H);
    pt = painter(ground.g);
    for (let y = hz + 1; y < H; y++) {
      const p = (y - hz) / gH;
      for (let x = 0; x < W; x++) {
        const v = p * (GROUND.length - 1) + bay(x, y) - 0.5 + (hash(Math.floor(x / 3), Math.floor(y / 2)) - 0.5) * 0.6;
        let col = GROUND[Math.max(0, Math.min(GROUND.length - 1, Math.floor(v)))];
        const ex = (x - vx) / (W * 0.26), ey = (y - clearY) / ((H - hz) * 0.3), d = ex * ex + ey * ey;
        if (d < 1) { const lv = (1 - d) * 2.6 + bay(x, y) - 0.5 + (hash(x >> 1, y) - 0.5) * 0.4; if (lv > 0) col = LIT[Math.min(2, Math.floor(lv))]; }
        pt(x, y, col);
      }
    }
    const tufts = Math.floor((W * (H - hz)) / 25);
    for (let i = 0; i < tufts; i++) {
      const x = Math.floor(rng() * W), y = hz + 2 + Math.floor(rng() * (gH - 1)), p = (y - hz) / gH;
      const len = 1 + Math.round(rng() * 2 * (0.5 + p * 1.5) * S), ex = (x - vx) / (W * 0.26), ey = (y - clearY) / ((H - hz) * 0.3);
      pt(x, y - len, rng() < 0.5 ? '#173f25' : ex * ex + ey * ey < 0.8 ? '#c4e27a' : '#6fae4c', 1, len);
    }
    for (let y = hz + 1; y < H; y++) {
      const c = scx[y], hw = shw[y], p = (y - hz) / gH;
      pt(Math.round(c - hw - 1 - p * 2), y, '#16372a', Math.round(2 * hw + 2 + p * 4), 1);
      if (hw < 1) { pt(Math.round(c), y, '#8fdcc8'); continue; }
      for (let x = Math.ceil(c - hw); x <= Math.floor(c + hw); x++) {
        const rel = Math.abs(x - c) / hw;
        const v = (1 - rel) * 2.2 + (1 - p) * 1.5 + bay(x, y) - 0.5 + (hash(x >> 1, y) - 0.5) * 0.4;
        pt(x, y, rel > 0.88 ? '#124f52' : WATER[Math.max(0, Math.min(4, Math.floor(v)))]);
      }
    }
    for (let i = 0; i < 10; i++) {
      const y = Math.round(hz + gH * (0.25 + rng() * 0.75)), p = (y - hz) / gH, s = rng() < 0.5 ? -1 : 1;
      const x = Math.round(scx[y] + s * shw[y]), rw = Math.max(2, Math.round((1 + p * 4) * S)), rh = Math.max(1, Math.round(rw * 0.5));
      pt(x - rw, y - rh, '#4d6358', rw * 2, rh + 1); pt(x - rw + 1, y - rh, '#7d9587', rw, 1);
      if (rng() < 0.6) pt(x - rw, y - rh, '#4f8a36', Math.max(1, rw - 1), 1);
    }
    const mids: number[][] = [];
    const midN = Math.max(4, Math.round(W / 32) + 2);
    for (let i = 0; i < midN; i++) {
      let x = rng() * W;
      const by = Math.round(hz + 2 + rng() * (H - hz) * 0.4);
      if (Math.abs(x - vx) < W * 0.1) x += (x < vx ? -1 : 1) * W * 0.12;
      const sd = x - scx[by], gap = shw[by] + 6 * S;
      if (Math.abs(sd) < gap) x = scx[by] + (sd < 0 ? -1 : 1) * (gap + rng() * 8 * S);
      mids.push([x, by]);
    }
    mids.sort((a, b) => a[1] - b[1]);
    midC = [];
    for (const [x, by] of mids) {
      const p = (by - hz) / gH, tw = Math.max(2, Math.round((2.5 + p * 7 + rng() * 2) * S)), seed = rng() * 50, lightR = x < sunX;
      const bcx = trunk(pt, x, -2, by, tw * 0.8, tw * 1.3, MID_BARK, 2 * S, seed, lightR, 0.5);
      roots(pt, bcx, by, tw * 1.3, 2 + Math.floor(rng() * 3), MID_BARK, rng, 0.7);
      const nc = 3 + Math.floor(rng() * 3);
      for (let k = 0; k < nc; k++) {
        const r = (5 + rng() * 5) * S * (0.85 + p * 0.5), cy = rng() * hz * 0.75 - r * 0.3, side = (rng() - 0.5) * 2, cx = x + side * r * 1.3;
        if (Math.abs(side) > 0.4) {
          const y0 = cy + r * 0.8, tx = x + gnOff(y0, seed, 2 * S), steps = Math.ceil(Math.abs(cx - tx) + r * 0.8), th = tw > 4 ? 2 : 1;
          for (let s = 0; s <= steps; s++) pt(Math.round(tx + ((cx - tx) * s) / steps), Math.round(y0 - (r * 0.8 * s) / steps), MID_BARK[1], th, th);
        }
        const img = makeCluster(rng, r, MID_LEAF, lightR);
        midC.push({ img, x: Math.round(cx - img.width / 2), y: Math.round(cy - img.height / 2), ph: rng() * 6.28, amp: (1 + p) * S });
      }
      if (rng() < 0.7) mush(pt, bcx + (rng() - 0.5) * tw * 3, by + 1, p > 0.25 && S > 1.2 ? 2 : 1);
    }
    for (let i = 0; i < 7; i++) {
      const y = Math.round(hz + gH * (0.2 + rng() * 0.7)), p = (y - hz) / gH;
      mush(pt, scx[y] + (rng() < 0.5 ? -1 : 1) * (shw[y] + (2 + rng() * 5) * S), y, p > 0.5 && S > 1.2 ? 2 : 1);
    }

    // Foreground: gnarled framing trunks, limbs, mossy mounds, canopy edge
    fore = layer(W, H);
    pt = painter(fore.g);
    foreC = [];
    const fw = Math.max(6, Math.round(Math.min(W * 0.1, 13 * S)));
    for (const side of [-1, 1]) {
      const x = side < 0 ? W * 0.07 : W * 0.93, seed = rng() * 50, lightR = side < 0;
      const bcx = trunk(pt, x, -2, H - 3, fw, fw * 1.5, FORE_BARK, 3.5 * S, seed, lightR, 0.8);
      const mr = fw * 3, mh = fw * 0.7;
      for (let dx = -mr; dx <= mr; dx++) {
        const top = Math.round(H - 2 - Math.sqrt(1 - (dx / mr) ** 2) * mh), xx = Math.round(bcx + dx);
        pt(xx, top + 1, '#0c2a22', 1, H - top);
        pt(xx, top, hash(xx, 3) > 0.5 ? '#1f4d2e' : '#2d6634');
        if (hash(xx, 7) > 0.6) pt(xx, top - 1 - Math.floor(hash(xx, 8) * 3 * S), '#123a26', 1, 2);
      }
      roots(pt, bcx, H - 2 - Math.round(mh * 0.6), fw * 1.5, 4 + Math.floor(rng() * 2), FORE_BARK, rng, 1.2);
      const y0 = Math.round(H * 0.16), tx = x + gnOff(y0, seed, 3.5 * S), ex = tx - side * W * 0.22, ey = y0 - H * 0.1;
      const mx = tx - side * W * 0.1, my = y0 + H * 0.03, len = Math.ceil(Math.abs(ex - tx) * 1.6);
      for (let s = 0; s <= len; s++) {
        const f = s / len, a = (1 - f) * (1 - f), b = 2 * f * (1 - f), c = f * f;
        const px = Math.round(a * tx + b * mx + c * ex), py = a * y0 + b * my + c * ey, th = Math.round(fw * 0.45 * (1 - f) + 1.5), top = Math.round(py - th / 2);
        for (let d = 0; d < th; d++) pt(px, top + d, d === 0 ? (hash(px, 2) > 0.55 ? FORE_BARK[5] : FORE_BARK[3]) : d < th * 0.4 ? FORE_BARK[2] : d > th - 2 ? FORE_BARK[0] : FORE_BARK[1]);
      }
      const addFore = (cx: number, cy: number, r: number) => {
        const img = makeCluster(rng, r, FORE_LEAF, lightR);
        foreC.push({ img, x: Math.round(cx - img.width / 2), y: Math.round(cy - img.height / 2), ph: rng() * 6.28, amp: 2 * S });
      };
      for (let k = 0; k < 3; k++) addFore(ex + (rng() - 0.5) * 12 * S - side * k * 4 * S, ey + (rng() - 0.5) * 8 * S, (6 + rng() * 5) * S);
      for (let k = 0; k < 3; k++) addFore(x + (rng() - 0.5) * fw * 3, rng() * H * 0.12, (7 + rng() * 6) * S);
      for (let k = 0; k < 3; k++) mush(pt, bcx + side * -1 * (fw * (1 + rng() * 1.6)), H - 2 - Math.round(mh * (0.3 + rng() * 0.3)), S > 1.4 ? 3 : 2);
    }
    for (let cx = -4 * S; cx < W + 4 * S; cx += (8 + rng() * 8) * S) {
      const mid = cx > W * 0.34 && cx < W * 0.74;
      if (mid && rng() < 0.7) continue;
      const r = (6 + rng() * 6) * S * (mid ? 0.7 : 1), img = makeCluster(rng, r, FORE_LEAF, cx < sunX);
      foreC.push({ img, x: Math.round(cx - img.width / 2), y: Math.round(-r * 0.4 + rng() * r * 0.6 - img.height / 2), ph: rng() * 6.28, amp: 2 * S });
    }

    ferns = [];
    const fN = Math.round(W / 10) + 6;
    for (let i = 0; i < fN; i++) {
      const y = Math.round(hz + gH * (0.2 + rng() * 0.8)), p = (y - hz) / gH;
      const x = rng() < 0.75 ? scx[y] + (rng() < 0.5 ? -1 : 1) * (shw[y] + (1 + rng() * 4) * S) : rng() * W;
      const hg = Math.max(3, Math.round((3 + p * 13) * S * (0.7 + rng() * 0.6)));
      ferns.push({ x: Math.round(x), y, px: makeFern(rng, hg, x < sunX), h: hg, ph: rng() * 6.28, front: false });
    }
    for (let k = 0; k < 4; k++) {
      const x = k < 2 ? W * 0.07 + fw * (3.2 + rng() * 2) : W * 0.93 - fw * (3.2 + rng() * 2), hg = Math.round((12 + rng() * 8) * S);
      ferns.push({ x: Math.round(x), y: H, px: makeFern(rng, hg, x < sunX), h: hg, ph: rng() * 6.28, front: true });
    }
    ferns.sort((a, b) => a.y - b.y);
    shafts = [];
    for (let i = 0; i < 5; i++) shafts.push({ o: (i - 2) * W * 0.06 + (rng() - 0.5) * W * 0.04, w: (2 + rng() * 5) * S, sl: (vx - sunX) / (clearY - sunY) + (rng() - 0.5) * 0.35, ph: rng() * 6.28 });
    dew = new Int16Array(100);
    for (let i = 0; i < 100; i += 2) {
      dew[i] = Math.round(vx + (rng() - 0.5) * W * 0.5);
      dew[i + 1] = Math.round(Math.min(H - 1, Math.max(hz + 2, clearY + (rng() - 0.5) * gH * 0.6)));
    }
    for (const r of ripples) r.on = false;
    for (const f of flies) f.on = false;
    for (const m of motes) m.on = false;
  }

  function spawnFly(i: number, x: number, y: number, burst: boolean): void {
    const f = flies[i];
    f.on = true; f.x = x; f.y = y; f.ph = rr() * 6.28;
    if (burst) {
      const a = rr() * 6.28, s = (12 + rr() * 30) * S;
      f.vx = Math.cos(a) * s; f.vy = Math.sin(a) * s - 8 * S; f.life = f.max = 1.5 + rr() * 2.5;
    } else { f.vx = 0; f.vy = 0; f.life = f.max = 3 + rr() * 5; }
  }

  function onBeat(): void {
    beatE = 1; beatCd = 0.12;
    let ox = vx, oy = clearY;
    const nR = enE > 0.55 ? 2 : 1;
    for (let n = 0; n < nR; n++) for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (r.on) continue;
      const p = 0.3 + rr() * 0.65, y = Math.round(hz + p * (H - 1 - hz));
      r.on = true; r.x = scx[y] + (rr() - 0.5) * shw[y]; r.y = y; r.r = 0.5; r.life = 1; r.sp = (5 + p * 16) * S;
      ox = r.x; oy = y - 2 * S;
      break;
    }
    let burst = 8 + Math.round(enE * 12);
    for (let i = 0; i < flies.length && burst > 0; i++) if (!flies[i].on) { spawnFly(i, ox, oy, true); burst--; }
  }

  function sway(ph: number, amp: number): number {
    return Math.round((Math.sin(t * 0.7 + ph) * 0.65 + Math.sin(t * 1.63 + ph * 1.9) * 0.35) * amp * (0.8 + enE * 0.5) +
      (bassE * 0.7 + kick * 1.3) * Math.sin(t * 3.1 + ph) * amp * 1.4);
  }
  function drawSprites(ctx: CanvasRenderingContext2D, arr: Sprite[]): void {
    for (let i = 0; i < arr.length; i++) {
      const s = arr[i];
      ctx.drawImage(s.img, s.x + sway(s.ph, s.amp), s.y + Math.round(kick * s.amp * 0.6 * Math.sin(s.ph * 3)));
    }
  }
  function disc(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number): void {
    const R = Math.max(1, Math.round(ry));
    for (let dy = -R; dy <= R; dy++) {
      const hw = Math.round(rx * Math.sqrt(1 - (dy / R) * (dy / R)));
      ctx.fillRect(Math.round(cx) - hw, Math.round(cy) + dy, hw * 2 + 1, 1);
    }
  }
  function drawFerns(ctx: CanvasRenderingContext2D, front: boolean): void {
    const pal = FERN_PAL[front ? 1 : 0];
    for (let i = 0; i < ferns.length; i++) {
      const f = ferns[i];
      if (f.front !== front) continue;
      const sw = ((Math.sin(t * 1.1 + f.ph) * 0.8 + Math.sin(t * 2.3 + f.ph * 2) * 0.3) * (0.8 + enE) + (bassE * 0.8 + kick * 1.5) * Math.sin(t * 3.5 + f.ph) * 1.5) * S * 1.5;
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = pal[c];
        const px = f.px;
        for (let j = 0; j < px.length; j += 3) if (px[j + 2] === c) ctx.fillRect(f.x + px[j] + Math.round((sw * -px[j + 1]) / f.h), f.y + px[j + 1], 1, 1);
      }
    }
  }

  function update(): void {
    const dt = dtc;
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (!r.on) continue;
      r.r += r.sp * dt; r.life -= dt * 0.9;
      if (r.life <= 0) r.on = false;
    }
    let active = 0;
    for (let i = 0; i < flies.length; i++) {
      const f = flies[i];
      if (!f.on) continue;
      active++;
      const damp = Math.exp(-dt * 2);
      f.vx *= damp; f.vy *= damp;
      f.x += (f.vx + Math.sin(t * 0.8 + f.ph) * 4 * S) * dt;
      f.y += (f.vy + Math.cos(t * 0.67 + f.ph * 1.3) * 3 * S) * dt;
      f.life -= dt;
      if (f.life <= 0 || f.x < -4 || f.x > W + 4 || f.y < -4 || f.y > H + 4) f.on = false;
    }
    if (active < 14 + Math.round(enE * 16)) for (let i = 0; i < flies.length; i++) if (!flies[i].on) { spawnFly(i, rr() * W, hz - 6 * S + rr() * (H - hz) * 0.9, false); break; }
    moteAcc += dt * (2.5 + trebE * 55 + beatE * 10);
    const wx = (3 + Math.sin(t * 0.23) * 2.5 + bassE * 9) * S;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      if (!m.on) {
        if (moteAcc < 1) continue;
        moteAcc -= 1;
        m.on = true; m.kind = rr() < 0.35 ? 1 : 0; m.x = rr() * W - wx; m.y = rr() * hz * 1.1; m.ph = rr() * 6.28;
        m.vx = (rr() - 0.5) * 4 * S; m.vy = (m.kind ? 3 + rr() * 4 : (rr() - 0.4) * 2) * S; m.life = m.max = 4 + rr() * 4;
        continue;
      }
      const jit = 1 + trebE * 3;
      m.x += (wx * (m.kind ? 1 : 0.6) + m.vx + Math.sin(t * 1.7 + m.ph) * 2 * S * jit) * dt;
      m.y += (m.vy + Math.sin(t * 2 + m.ph) * S * (2 + trebE * 6)) * dt;
      m.life -= dt;
      if (m.life <= 0 || m.x > W + 3 || m.y > H + 3 || m.y < -3) m.on = false;
    }
    if (moteAcc > 3) moteAcc = 3;
  }

  function draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioIn, dt: number): void {
    if (!bg || !ground || !fore || width !== reqW || height !== reqH) resize(width, height);
    if (!bg || !ground || !fore) return;
    dtc = dt > 0 ? Math.min(dt, 0.05) : 0;
    t += dtc;
    const ab = clamp01(audio?.bass), at = clamp01(audio?.treble), ae = clamp01(audio?.energy);
    const k = (r: number) => 1 - Math.exp(-r * dtc);
    bassE += (ab - bassE) * k(ab > bassE ? 14 : 2.5);
    trebE += (at - trebE) * k(at > trebE ? 18 : 3);
    enE += (ae - enE) * k(ae > enE ? 6 : 1.5);
    const rise = ab - prevBass;
    prevBass = ab;
    kick = Math.max(kick * Math.exp(-dtc * 5), rise > 0.06 ? Math.min(1, kick + rise * 2.5) : 0);
    beatE *= Math.exp(-dtc * 4);
    beatCd -= dtc;
    const beat = !!audio?.beat;
    if (beat && !prevBeat && beatCd <= 0) onBeat();
    prevBeat = beat;
    update();

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(bg.c, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#ffe9a0';
    const sr = 4 * S + bassE * 5 * S + beatE * 2 * S;
    ctx.globalAlpha = 0.1 + bassE * 0.25; disc(ctx, sunX, sunY, sr + 3 * S, sr + 3 * S);
    ctx.globalAlpha = 0.12 + bassE * 0.3; disc(ctx, sunX, sunY, sr, sr);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    drawSprites(ctx, farC);
    ctx.drawImage(ground.c, 0, 0);

    ctx.fillStyle = '#c8fff0';
    for (let y = hz + 1; y < H; y++) {
      const p = (y - hz) / (H - hz), hw = shw[y];
      if (hw < 1.5) continue;
      const key = Math.floor((y - t * (4 + p * 10) * S) / (1 + p * 2)), r = h1(key * 1.7 + 3.1);
      if (r < 0.6 - trebE * 0.25) continue;
      const len = 1 + Math.floor(h1(key + 9.2) * (1 + p * 3 * S));
      const x = Math.round(Math.max(scx[y] - hw, Math.min(scx[y] + hw - len, scx[y] + (h1(key * 3.3) - 0.5) * 1.6 * hw)));
      ctx.globalAlpha = Math.min(1, 0.2 + (r - 0.4) * 0.8 + trebE * 0.4 + beatE * 0.2);
      ctx.fillRect(x, y, len, 1);
    }
    ctx.fillStyle = '#e6fff8';
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];
      if (!r.on) continue;
      ctx.globalAlpha = Math.min(1, r.life * 0.9);
      for (let ring = 0; ring < 2; ring++) {
        const rx = r.r * (ring ? 0.6 : 1), ry = Math.max(1, rx * 0.35), steps = Math.max(10, Math.round(rx * 3));
        for (let s = 0; s < steps; s++) {
          const a = (s / steps) * 6.2832, px = Math.round(r.x + Math.cos(a) * rx), py = Math.round(r.y + Math.sin(a) * ry);
          if (py > hz && py < H && Math.abs(px - scx[py]) < shw[py]) ctx.fillRect(px, py, 1, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
    drawSprites(ctx, midC);

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#ffcf66';
    const cg = 0.05 + bassE * 0.1 + beatE * 0.08;
    ctx.globalAlpha = cg; disc(ctx, vx, clearY, W * 0.2, (H - hz) * 0.18);
    ctx.globalAlpha = cg * 0.8; disc(ctx, vx, clearY, W * 0.11, (H - hz) * 0.1);
    ctx.fillStyle = '#ffd978';
    const yEnd = Math.min(H - 1, Math.round(clearY + (H - clearY) * 0.5));
    for (let i = 0; i < shafts.length; i++) {
      const sh = shafts[i], I = 0.05 + 0.035 * Math.sin(t * 0.35 + sh.ph) + bassE * 0.13 + kick * 0.1 + beatE * 0.04;
      for (let y = sunY; y <= yEnd; y++) {
        const f = (y - sunY) / (yEnd - sunY), a = Math.floor(I * 4 * f * (1 - f) * 20) / 20;
        if (a <= 0) continue;
        ctx.globalAlpha = a;
        const wd = Math.max(1, Math.round(sh.w * (0.4 + f * 1.4)));
        ctx.fillRect(Math.round(sunX + sh.sl * (y - sunY) + sh.o * f + Math.sin(t * 0.3 + sh.ph) * 2 * S * f), y, wd, 1);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    drawFerns(ctx, false);
    ctx.drawImage(fore.c, 0, 0);
    drawFerns(ctx, true);
    drawSprites(ctx, foreC);

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#fffbe6';
    for (let i = 0; i < dew.length; i += 2) {
      const tw = h1(i * 7.1 + Math.floor(t * 3 + i * 0.37));
      if (tw < 0.88 - trebE * 0.3) continue;
      ctx.globalAlpha = Math.min(1, 0.3 + trebE * 0.7);
      ctx.fillRect(dew[i], dew[i + 1], 1, 1);
      if (trebE > 0.5) { ctx.globalAlpha *= 0.4; ctx.fillRect(dew[i] - 1, dew[i + 1], 3, 1); ctx.fillRect(dew[i], dew[i + 1] - 1, 1, 3); }
    }
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      if (!m.on) continue;
      const fade = Math.min(1, (m.max - m.life) * 2, m.life);
      if (m.kind) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = fade;
        ctx.fillStyle = (i & 1) ? '#8cc84a' : '#d9a441';
        const flip = Math.sin(t * 6 + m.ph) > 0;
        ctx.fillRect(Math.round(m.x), Math.round(m.y), flip ? 2 : 1, flip ? 1 : 2);
      } else {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = fade * (0.35 + trebE * 0.65);
        ctx.fillStyle = '#fff1a8';
        ctx.fillRect(Math.round(m.x), Math.round(m.y), 1, 1);
      }
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < flies.length; i++) {
      const f = flies[i];
      if (!f.on) continue;
      const glow = 0.5 + 0.5 * Math.sin(t * 3 + f.ph * 5), fade = Math.min(1, (f.max - f.life) * 2, f.life * 1.5);
      const a = fade * (0.35 + 0.65 * glow) * (1 + beatE * 0.5), x = Math.round(f.x), y = Math.round(f.y);
      if (a < 0.08) continue;
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = '#ffcf5a';
      ctx.fillRect(x, y, 1, 1);
      if (a > 0.6) {
        ctx.globalAlpha = Math.min(1, a * 0.45);
        ctx.fillStyle = '#e08a2a';
        ctx.fillRect(x - 1, y, 1, 1); ctx.fillRect(x + 1, y, 1, 1); ctx.fillRect(x, y - 1, 1, 1); ctx.fillRect(x, y + 1, 1, 1);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  return { resize, draw };
}