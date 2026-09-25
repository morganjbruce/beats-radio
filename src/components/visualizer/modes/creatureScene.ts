type AudioIn = { bass: number; treble: number; energy: number; beat: boolean; beatPhase?: number; beatCount?: number };

function clampI(v: number, a: number, b: number): number { return v < a ? a : v > b ? b : v; }
function c01(v: unknown): number { const n = typeof v === 'number' && isFinite(v) ? v : 0; return n < 0 ? 0 : n > 1 ? 1 : n; }
function dim(v: unknown): number { const n = Math.floor(Number(v)); return n > 0 && isFinite(n) ? Math.min(n, 4096) : 0; }

const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const INK = '#140c1c';
const PALS: string[][] = [
  ['#0e2a26', '#1f7a5c', '#3cc07c', '#8ef0a8', '#eafff0'],
  ['#161a2a', '#4a5878', '#8c9cba', '#c8d4ea', '#ffffff'],
  ['#3a2418', '#b8987a', '#ecd6b0', '#fff4dc', '#ffffff'],
  ['#2a1008', '#a8441c', '#ea7a2e', '#ffb262', '#fff0d0'],
  ['#1c0c2c', '#5c2c8c', '#9c4ccc', '#ca8cf2', '#f6e2ff'],
  ['#0c1a34', '#2a50a2', '#4a8ce2', '#8cc6ff', '#eaf6ff'],
  ['#2c1c34', '#b4a0c8', '#eee6f4', '#ffffff', '#ffffff'],
];
const CAP = ['#3a0c14', '#9a1c2c', '#e03a3e', '#ff7c6a', '#ffd2c2'];
const LIMB = ['#1f7a5c', '#4a5878', '#b8987a', '#5a2a14', '#5c2c8c', '#2a50a2', '#b4a0c8'];
const HAND = ['#8ef0a8', '#c8d4ea', '#fff4dc', '#fff0d0', '#ca8cf2', '#8cc6ff', '#ffffff'];
const FOOT = ['#1f7a5c', '#2a2e44', '#7a5a3a', '#3a1a0c', '#3a1a5c', '#1a3070', '#ff9ab8'];
const LEG = [2, 3, 3, 3, 3, 2, 3];
const SW = [5, 4, 3, 3, 5, 4, 3];
const HEADH = [12, 20, 15, 17, 16, 13, 22];
const ORDER5 = [0, 1, 3, 4, 6];
const SPARK = ['#fff27a', '#ffffff', '#ff9ad0', '#7af0ff', '#ffb347', '#9aff7a', '#a89868'];
const ZERO: AudioIn = { bass: 0, treble: 0, energy: 0, beat: false };

export function createCreatureScene(): {
  resize(width: number, height: number): void;
  draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioIn, dt: number): void;
} {
  let W = 0, H = 0, dirty = true, mini = false;
  let n = 1, S = 1, gy = 0, sf = 0, slot = 1;
  const roster = new Int8Array(7), dx = new Int16Array(7);
  let bgCanvas: HTMLCanvasElement | null = null, bg: HTMLCanvasElement | null = null, bgImg: ImageData | null = null;
  const starX = new Int16Array(24), starY = new Int16Array(24);
  let starN = 0;
  let time = 0, bassS = 0, trebS = 0, enS = 0, accent = 0, prevBeat = false, confAcc = 0;
  let fbCount = 0, fbLast = -100, fbInt = 0.5, fbHave = false, lastB = -1;
  let con = false, cb = 0, cp = 0, camp = 0;
  let by = 0, sq = 0, lean = 0, mouth = 0, look = 0;
  let hlx = 0, hly = 0, hrx = 0, hry = 0, flx = 0, fly = 0, frx = 0, fry = 0;
  const PN = 96;
  const pX = new Float32Array(PN), pY = new Float32Array(PN), pVX = new Float32Array(PN), pVY = new Float32Array(PN);
  const pL = new Float32Array(PN), pM = new Float32Array(PN), pT = new Uint8Array(PN), pC = new Uint8Array(PN);
  let pNext = 0, rs = 0x2f6b9e31;
  let C: CanvasRenderingContext2D | null = null;
  let OX = 0, OY = 0;

  function rnd(): number { rs ^= rs << 13; rs ^= rs >>> 17; rs ^= rs << 5; return (rs >>> 0) / 4294967296; }
  function spawn(x: number, y: number, vx: number, vy: number, life: number, t: number, col: number): void {
    const k = pNext; pNext = (pNext + 1) % PN;
    pX[k] = x; pY[k] = y; pVX[k] = vx; pVY[k] = vy; pL[k] = life; pM[k] = life; pT[k] = t; pC[k] = col;
  }
  function F(x: number, y: number, w: number, h: number, col: string): void { const c = C!; c.fillStyle = col; c.fillRect(x, y, w, h); }
  function R(x: number, y: number, w: number, h: number, col: string): void { if (w > 0 && h > 0) F(OX + x * S, OY + y * S, w * S, h * S, col); }
  function line(x0: number, y0: number, x1: number, y1: number, col: string): void {
    const c = C!; c.fillStyle = col;
    const ax = Math.abs(x1 - x0), ay = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = ax + ay;
    for (let g = 0; g < 64; g++) {
      c.fillRect(OX + x0 * S, OY + y0 * S, S, S);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= ay) { e += ay; x0 += sx; }
      if (e2 <= ax) { e += ax; y0 += sy; }
    }
  }
  function limb(x0: number, y0: number, x1: number, y1: number, side: number, len: number, col: string, bendY: number): void {
    const bend = Math.round(Math.max(0, len - Math.hypot(x1 - x0, y1 - y0)) * 0.6);
    const ex = Math.round((x0 + x1) / 2) + side * bend, ey = Math.round((y0 + y1) / 2 + bend * bendY);
    line(x0, y0, ex, ey, col); line(ex, ey, x1, y1, col);
  }
  function hwOf(r: number, w: number, h: number, flat: number): number {
    let yy = ((r + 0.5) / h) * 2 - 1;
    if (yy > 0) yy *= 1 - flat;
    return Math.max(1, Math.round((w / 2) * Math.sqrt(Math.max(0, 1 - yy * yy))));
  }
  function blob(cx: number, bottom: number, w: number, h: number, pal: string[], flat: number): void {
    const top = bottom - h;
    for (let r = 0; r < h; r++) { const hw = hwOf(r, w, h, flat); R(cx - hw - 1, top + r, hw * 2 + 2, 1, pal[0]); }
    const h0 = hwOf(0, w, h, flat), hl = hwOf(h - 1, w, h, flat);
    R(cx - h0, top - 1, h0 * 2, 1, pal[0]); R(cx - hl, bottom, hl * 2, 1, pal[0]);
    for (let r = 0; r < h; r++) {
      const hw = hwOf(r, w, h, flat), y = top + r, lo = r >= h * 0.72;
      R(cx - hw, y, hw * 2, 1, lo ? pal[1] : pal[2]);
      if (!lo) {
        R(cx + hw - 1, y, 1, 1, pal[1]);
        if (r > 0 && r < h * 0.45) R(cx - hw + 1, y, Math.max(1, hw >> 1), 1, pal[3]);
      } else if (((r + hw) & 1) === 0) R(cx - hw + 1, y, 1, 1, pal[2]);
    }
    R(cx - h0 + 1, top + 1, 1, 1, pal[4]);
  }
  function box(x: number, y: number, w: number, h: number, pal: string[]): void {
    R(x - 1, y - 1, w + 2, h + 2, pal[0]); R(x, y, w, h, pal[2]); R(x, y, w, 1, pal[3]);
    R(x, y + h - 1, w, 1, pal[1]); R(x + w - 1, y, 1, h, pal[1]); R(x, y, 1, 1, pal[4]);
  }
  function eye(x: number, y: number, bl: boolean): void {
    if (bl) { R(x, y + 1, 2, 1, INK); return; }
    R(x, y, 2, 2, '#ffffff'); R(x + (look > 0 ? 1 : 0), y, 1, 2, INK);
  }
  function mouthAt(x: number, y: number): void {
    if (mouth) { R(x - 1, y, 2, 2, '#5a1022'); R(x - 1, y + 1, 2, 1, '#ff6a8a'); }
    else { R(x - 1, y + 1, 2, 1, INK); R(x - 2, y, 1, 1, INK); R(x + 1, y, 1, 1, INK); }
  }
  function ear(x: number, base: number, len: number, tilt: number, pal: string[]): void {
    const low = len - 2;
    R(x - 1, base - low - 1, 4, low + 1, pal[0]); R(x - 1 + tilt, base - len - 1, 4, 3, pal[0]);
    R(x, base - low, 2, low, pal[2]); R(x + tilt, base - len, 2, 2, pal[2]);
    R(x + 1, base - low + 1, 1, Math.max(1, low - 1), '#ff9ab8');
  }

  function layout(w: number, h: number): void {
    W = w; H = h; mini = h < 24 || w < 40;
    if (mini) n = clampI(Math.floor(w / 3), 1, 7);
    else n = w >= 112 ? 7 : w >= 80 ? 5 : clampI(Math.floor(w / 16), 1, 5);
    for (let i = 0; i < n; i++) roster[i] = n >= 6 ? i : ORDER5[i];
    gy = h > w ? Math.floor(h * 0.68) : h - Math.max(2, Math.floor(h * 0.16));
    slot = w / n;
    S = Math.max(1, Math.min(Math.floor(slot / 16), Math.floor(gy / 30)));
    sf = Math.min(h - 1, gy + Math.max(1, Math.floor((h - gy) * 0.5)));
    for (let i = 0; i < n; i++) dx[i] = Math.floor(slot * (i + 0.5));
    dirty = true;
  }

  function bake(ctx: CanvasRenderingContext2D): void {
    const w = W, h = H;
    let img: ImageData;
    try { img = ctx.createImageData(w, h); } catch { bg = null; bgImg = null; return; }
    const d = img.data;
    let seed = (w * 7919 + h * 104729 + 0x5eed) >>> 0;
    const rr = (): number => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const put = (x: number, y: number, c: number): void => { if (x < 0 || y < 0 || x >= w || y >= h) return; const o = (y * w + x) << 2; d[o] = (c >> 16) & 255; d[o + 1] = (c >> 8) & 255; d[o + 2] = c & 255; d[o + 3] = 255; };
    const th = (x: number, y: number): number => (BAY[((y & 3) << 2) | (x & 3)] + 0.5) / 16;
    const LEAF = [0x07121a, 0x0d2230, 0x153242, 0x21485a];
    const disc = (cx: number, cy: number, r: number): void => {
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        if (x * x + y * y > r * r + r) continue;
        const v = (x + y) / (r * 1.6) + (th(cx + x, cy + y) - 0.5) * 0.35;
        let k = v < -0.4 ? 3 : v < 0 ? 2 : v < 0.45 ? 1 : 0;
        if (rr() < 0.07 && k > 0) k--;
        put(cx + x, cy + y, LEAF[k]);
      }
    };
    const SK = [0x0a0b22, 0x10133a, 0x181b4a, 0x241f5a, 0x342868, 0x46306e];
    for (let y = 0; y < h; y++) {
      const f = Math.min(1, y / Math.max(1, gy)) * (SK.length - 1), i0 = Math.min(SK.length - 1, Math.floor(f)), i1 = Math.min(SK.length - 1, i0 + 1);
      for (let x = 0; x < w; x++) put(x, y, f - i0 > th(x, y) ? SK[i1] : SK[i0]);
    }
    const ns = Math.floor((w * gy) / 140);
    for (let s = 0; s < ns; s++) put(Math.floor(rr() * w), Math.floor(rr() * gy * 0.8), rr() < 0.2 ? 0xdfe4ff : 0x6a70b0);
    const mr = Math.max(1, Math.floor(Math.min(w, gy) * 0.08)), mx = Math.floor(w * (h > w ? 0.68 : 0.8)), my = mr + 2 + Math.floor(gy * (h > w ? 0.2 : 0.08));
    for (let y = -mr - 3; y <= mr + 3; y++) for (let x = -mr - 3; x <= mr + 3; x++) {
      const q = x * x + y * y;
      if (q <= mr * mr) { const v = (x + y) / (mr * 2) + (th(mx + x, my + y) - 0.5) * 0.4; put(mx + x, my + y, v > 0.3 ? 0xc4b890 : v > -0.2 ? 0xefe6c2 : 0xfff8e0); }
      else if (q <= (mr + 2) * (mr + 2) && ((x + y) & 1) === 0) put(mx + x, my + y, 0x3a3a7a);
    }
    if (mr >= 4) for (let k = 0; k < 3; k++) put(mx + Math.floor((rr() - 0.3) * mr), my + Math.floor((rr() - 0.3) * mr), 0xd2c6a0);
    starN = 0;
    for (let s = 0; s < 60 && starN < 24; s++) {
      const x = Math.floor(w * (0.12 + rr() * 0.76)), y = Math.floor(gy * (0.12 + rr() * 0.35));
      if ((x - mx) * (x - mx) + (y - my) * (y - my) < (mr + 4) * (mr + 4)) continue;
      starX[starN] = x; starY[starN] = y; starN++;
    }
    const a1 = rr() * 6, a2 = rr() * 6;
    for (let x = 0; x < w; x++) {
      const hh = Math.floor(gy * 0.6 + Math.sin(x * 0.045 + a1) * gy * 0.08 + Math.sin(x * 0.12 + a2) * gy * 0.04);
      for (let y = Math.max(0, hh); y < gy; y++) put(x, y, y === hh ? 0x3a3672 : rr() < 0.06 ? 0x2a2660 : 0x201c4a);
      const h2 = Math.floor(gy * 0.8 + Math.sin(x * 0.07 + a2) * gy * 0.05 + Math.sin(x * 0.21 + a1) * gy * 0.025);
      for (let y = Math.max(0, h2); y < gy; y++) put(x, y, y === h2 ? 0x2c4a5a : th(x, y) < 0.5 ? 0x162438 : 0x1a2a3c);
    }
    if (w >= 40 && gy >= 16) {
      const R0 = Math.max(3, Math.floor(Math.min(w * 0.08, gy * 0.22)));
      for (let sd = 0; sd < 2; sd++) {
        const tx = sd ? w - 1 - Math.floor(R0 * 0.6) : Math.floor(R0 * 0.6), tw = Math.max(2, R0 >> 1);
        for (let y = Math.floor(gy * 0.3); y < gy; y++) for (let x = 0; x < tw; x++) put(tx - (tw >> 1) + x, y, x === 0 ? 0x0c0808 : rr() < 0.15 ? 0x2a1c16 : 0x1c1210);
        for (let k = 0; k < 5; k++) disc(tx + Math.round((rr() - 0.5) * R0 * 1.4), Math.floor(gy * (0.1 + 0.13 * k)), Math.round(R0 * (0.8 + rr() * 0.5)));
      }
      if (h > w) {
        for (let x = 0; x < w + R0; x += Math.max(2, R0)) disc(x, Math.floor(rr() * R0 * 0.6), Math.round(R0 * (0.7 + rr() * 0.5)));
        for (let x = 2; x < w; x += 3 + Math.floor(rr() * 5)) {
          const len = Math.floor(R0 + rr() * R0 * 1.5);
          for (let y = 0; y < len; y++) put(x, y, (y & 3) === 1 ? 0x21485a : 0x0d2230);
        }
      }
    }
    const GR = [0x14281e, 0x1e3a28, 0x2a4c30, 0x3a6034], WARM = [0x5a5a2c, 0x7a6a34, 0x9a7e3c];
    const pw = Math.max(4, slot * 0.42), ph = Math.max(2, (sf - gy) * 1.3);
    for (let y = gy; y < h; y++) for (let x = 0; x < w; x++) {
      let c: number;
      const t0 = th(x, y);
      if (y < sf) {
        const f = ((y - gy + 1) / Math.max(1, sf - gy)) * 2, i0 = Math.floor(f);
        c = GR[Math.min(3, f - i0 > t0 ? i0 + 1 : i0)];
        let best = 9;
        for (let k = 0; k < n; k++) { const ex = (x - dx[k]) / pw, ey = (sf - y) / ph, q = ex * ex + ey * ey; if (q < best) best = q; }
        if (best < 1) { const v = 1 - best, j = (t0 - 0.5) * 0.3; c = v > 0.55 + j ? WARM[2] : v > 0.25 + j ? WARM[1] : v > t0 * 0.25 ? WARM[0] : c; }
        const r = rr(); if (r < 0.06) c = 0x10201a; else if (r < 0.1) c = 0x4a7040;
      } else if (y === sf) c = x % 7 === 0 ? 0x3a2012 : 0x8a5a32;
      else {
        const yy = y - sf;
        c = yy % 3 === 0 ? 0x24140c : (x + Math.floor(yy / 3) * 5) % 13 === 0 ? 0x24140c : rr() < 0.12 ? 0x5a3822 : 0x482c1a;
        if (t0 < (yy / Math.max(1, h - sf)) * 0.5) c = 0x301a10;
      }
      put(x, y, c);
    }
    for (let x = 0; x < w; x++) {
      if (rr() < 0.5) put(x, gy, 0x3e6a3c);
      if (rr() < 0.4) { put(x, gy - 1, 0x24422e); if (rr() < 0.3) put(x, gy - 2, 0x2e5236); }
    }
    if (h - sf >= 3) {
      const FL = [0xff9ab8, 0xffe070, 0x9ad0ff, 0xffffff];
      for (let k = 0, cnt = Math.floor(w / 5); k < cnt; k++) {
        const x = Math.floor(rr() * w), hh = 1 + Math.floor(rr() * Math.max(1, (h - sf) * 0.45));
        for (let j = 0; j < hh; j++) put(x, h - 1 - j, 0x24502a);
        put(x, h - 1 - hh, FL[k & 3]);
        if (rr() < 0.5) put(x + 1, h - 1, 0x2e6a34);
      }
    }
    bgImg = img; bg = null;
    if (typeof document !== 'undefined') {
      try {
        if (!bgCanvas) bgCanvas = document.createElement('canvas');
        bgCanvas.width = w; bgCanvas.height = h;
        const g = bgCanvas.getContext('2d');
        if (g) { g.putImageData(img, 0, 0); bg = bgCanvas; }
      } catch { bg = null; }
    }
  }

  function computePose(i: number, sw: number): void {
    by = 0; sq = 0; lean = 0; mouth = 0; look = 0;
    hlx = -(sw + 1); hly = 3; hrx = sw + 1; hry = 3; flx = -2; fly = 0; frx = 2; fry = 0;
    if (!con) {
      const br = Math.sin(time * 1.6 + i * 1.3);
      sq = br > 0.8 && enS < 0.05 ? 1 : 0;
      hly = hry = 3 - (br > 0.2 ? 1 : 0);
      const up = Math.round(trebS * 8);
      if (up > 0) { hly = 3 - up; hry = 3 - Math.round(trebS * 8 * (i & 1 ? 0.6 : 1)); hlx -= Math.round(trebS * 2); hrx += Math.round(trebS * 2); }
      by = -Math.round(bassS * 3.5);
      if (bassS > 0.45) sq = -1;
      lean = Math.round(enS * 1.6 * Math.sin(time * 2.2 + i * 0.7));
      mouth = enS > 0.3 ? 1 : 0; look = lean;
    } else {
      const b = cb, p = cp, amp = camp, k = b & 3, jc = Math.sin(Math.PI * p), hit = Math.max(0, 1 - p * 4);
      const base = jc * (0.8 + bassS * 2.2) * amp;
      switch ((b >> 2) & 7) {
        case 0: {
          const sd = b & 1 ? 1 : -1, lift = -Math.round(2 * jc * amp), arm = -2 - Math.round(3 * jc);
          by = -Math.round(base);
          if (sd < 0) { fly = lift; hly = arm; } else { fry = lift; hry = arm; }
          lean = sd * Math.round(jc); sq = hit > 0.5 ? 1 : jc > 0.85 ? -1 : 0; mouth = jc > 0.7 ? 1 : 0; look = sd; break;
        }
        case 1: {
          by = -Math.round(base * 0.6);
          if (p < 0.3) { const y = k & 1 ? -6 : -2; hlx = 0; hrx = 0; hly = y; hry = y; mouth = 1; }
          else { hlx = -(sw + 3); hrx = sw + 3; hly = hry = -1 - Math.round(2 * jc); }
          flx = -2 - (k & 1); frx = 2 + (k & 1); sq = hit > 0.6 ? 1 : 0; look = k & 2 ? 1 : -1; break;
        }
        case 2: {
          const w1 = Math.sin(Math.PI * (k + p) - i * 0.9), w2 = Math.sin(Math.PI * (k + p) - i * 0.9 - 0.8);
          hlx = -(sw + 2); hrx = sw + 2; hly = -1 - Math.round(4 * w1); hry = -1 - Math.round(4 * w2);
          lean = Math.round(w1 * 1.4); by = -Math.round(Math.max(0, w1) * 2 * amp + bassS); mouth = w1 > 0.5 ? 1 : 0; look = lean; break;
        }
        case 3: {
          const sd = (b + i) & 1 ? 1 : -1, kk = -Math.round(4 * jc * amp), kx = 2 + Math.round(3 * jc);
          if (sd < 0) { flx = -kx; fly = kk; hrx = sw + 2; hry = -5; hlx = -sw; hly = 1; }
          else { frx = kx; fry = kk; hlx = -(sw + 2); hly = -5; hrx = sw; hry = 1; }
          by = -Math.round(jc * 0.8 + bassS); lean = -sd * Math.round(jc); mouth = jc > 0.5 ? 1 : 0; look = sd; break;
        }
        case 4: {
          by = -Math.round(jc * (3 + bassS * 3) * amp); fly = fry = -Math.round(jc * 2); flx = -3; frx = 3;
          hlx = -(sw + 3); hrx = sw + 3; hly = hry = -2 - Math.round(4 * jc);
          sq = hit > 0.4 ? 2 : jc > 0.5 ? -1 : 0; mouth = jc > 0.4 ? 1 : 0; break;
        }
        case 5: {
          const sv = Math.cos(Math.PI * (b + p));
          lean = Math.round(sv * 2); hlx = -sw + lean * 2; hrx = sw + lean * 2; hly = hry = -6 + Math.round(Math.abs(sv) * 2);
          flx = -2 + Math.round(sv); frx = 2 + Math.round(sv); by = -Math.round(base * 0.5); look = lean; mouth = Math.abs(sv) < 0.4 ? 1 : 0; break;
        }
        case 6: {
          let dd = (k + p) / 4 - (i + 0.5) / n; dd -= Math.round(dd);
          const hop = Math.max(0, 1 - Math.abs(dd) * n * 1.2), r = Math.round(hop * 9), ax = Math.round(hop * 2);
          by = -Math.round(hop * 4 * amp + jc * bassS); hly = 3 - r; hry = 3 - r; hlx = -(sw + 1 + ax); hrx = sw + 1 + ax;
          fly = fry = -Math.round(hop * 2); sq = hop > 0.6 ? -1 : hop > 0.05 && hop < 0.3 ? 1 : 0; mouth = hop > 0.4 ? 1 : 0; look = dd > 0 ? 1 : -1; break;
        }
        default: {
          if (k < 2) {
            const q = (p * 2) % 1;
            by = -Math.round(Math.sin(Math.PI * q) * (1 + bassS) * amp);
            if (q < 0.3) { hlx = 0; hrx = 0; hly = hry = -5; mouth = 1; } else { hlx = -(sw + 2); hrx = sw + 2; hly = hry = -2; }
            look = p < 0.5 ? -1 : 1;
          } else if (k === 2) {
            const sp = Math.round(3 * jc);
            by = -Math.round(jc * (5 + bassS * 2) * amp); hlx = -(sw + 1 + sp); hrx = sw + 1 + sp; hly = hry = 3 - Math.round(9 * jc);
            flx = -2 - Math.round(2 * jc); frx = 2 + Math.round(2 * jc); fly = fry = -Math.round(jc); sq = hit > 0.4 ? 2 : jc > 0.5 ? -1 : 0; mouth = 1;
          } else {
            hlx = -(sw + 3); hrx = sw + 3; hly = hry = -6 + Math.round(jc); flx = -4; frx = 4; sq = hit > 0.3 ? 1 : 0; mouth = 1; by = -Math.round(bassS * jc * 2);
          }
        }
      }
    }
    if (accent > 0.05) { sq += Math.round(accent * 1.5); const u = Math.round(accent * 3); hly -= u; hry -= u; if (accent > 0.5) mouth = 1; }
    sq = clampI(sq, -2, 2); by = clampI(by, -9, 0); lean = clampI(lean, -2, 2); look = clampI(look, -1, 1);
    hly = clampI(hly, -8, 4); hry = clampI(hry, -8, 4); flx = clampI(flx, -5, -1); frx = clampI(frx, 1, 5); fly = clampI(fly, -4, 0); fry = clampI(fry, -4, 0);
  }

  function drawDancer(i: number, sp: number, cx: number): void {
    OX = cx; OY = gy;
    const pal = PALS[sp], air = Math.max(0, -by), shw = Math.max(2, 5 - (air >> 1));
    R(-shw, 0, shw * 2, 1, '#10180f'); R(-shw + 1, 1, shw * 2 - 2, 1, '#1c2616');
    const leg = LEG[sp], hipY = by - leg, bx = Math.round(lean / 2), hx = lean, K = sq;
    const bl = (time * 0.45 + i * 0.37) % 3.3 < 0.09 && accent < 0.2;
    const lf = by + fly - 1, rf = by + fry - 1;
    limb(bx - 2, hipY, flx, lf, -1, leg + 1, LIMB[sp], -0.2);
    limb(bx + 1, hipY, frx, rf, 1, leg + 1, LIMB[sp], -0.2);
    R(flx - 2, lf, 3, 1, FOOT[sp]); R(frx, rf, 3, 1, FOOT[sp]);
    let shY = hipY - 3, shX = SW[sp];
    const flick = ((time * 8 + i) | 0) % 3 === 0;
    switch (sp) {
      case 0: {
        const w = 10 + K, h = 8 - K, bot = hipY + 1, top = bot - h, bs = time * (1.5 + trebS * 9);
        blob(bx, bot, w, h, pal, 0.75);
        for (let j = 0; j < 2; j++) R(bx - 2 + j * 3, bot - 2 - Math.floor((bs + j * 1.7) % Math.max(1, h - 4)), 1, 1, pal[3]);
        eye(hx - 3, top + 2, bl); eye(hx + 1, top + 2, bl); mouthAt(hx, top + 4);
        shY = top + 4; break;
      }
      case 1: {
        const tw = 8 + K, th = 5 - K, tl = bx - (tw >> 1), ty = hipY - th + 1, hy = ty - 9;
        box(tl, ty, tw, th, pal);
        R(tl + 2, ty + 2, 1, 1, trebS > 0.3 && ((time * 9) | 0) % 2 === 0 ? '#ff5a7a' : '#8a2a44');
        R(tl + 4, ty + 2, 2, 1, accent > 0.2 ? '#fff27a' : '#4ad07a');
        R(hx - 1, ty - 2, 2, 1, pal[1]);
        box(hx - 4, hy, 8, 6, pal); R(hx - 3, hy + 1, 6, 4, '#0c2434');
        R(hx - 6, hy + 2, 1, 2, pal[2]); R(hx + 5, hy + 2, 1, 2, pal[2]);
        const ec = accent > 0.3 ? '#fff27a' : '#6ef2ff';
        if (bl) { R(hx - 2, hy + 3, 2, 1, ec); R(hx + 1, hy + 3, 2, 1, ec); }
        else { R(hx - 2 + (look > 0 ? 1 : 0), hy + 2, 1, 2, ec); R(hx + 1 + (look > 0 ? 1 : 0), hy + 2, 1, 2, ec); }
        R(hx - 1, hy + 4, 2, 1, mouth ? '#ff7ab0' : '#2a6a7a');
        R(hx, hy - 3, 1, 2, pal[0]);
        R(hx, hy - 4, 1, 1, trebS > 0.25 && ((time * 12) | 0) % 2 === 0 ? '#ffffff' : accent > 0.2 ? '#fff27a' : '#ff4a6a');
        shY = ty + 1; shX = tw >> 1; break;
      }
      case 2: {
        const w = 6 + K, h = 7 - K, bot = hipY + 1, top = bot - h, ct = top - 4;
        blob(bx, bot, w, h, pal, 0.3);
        eye(hx - 3, top + 2, bl); eye(hx + 1, top + 2, bl); mouthAt(hx, top + 4);
        blob(hx, top + 1, 12 + K, 5, CAP, 0.9);
        R(hx - 4, ct + 1, 2, 1, '#fff4ea'); R(hx + 1, ct, 2, 2, '#fff4ea'); R(hx - 2, ct + 3, 1, 1, '#fff4ea');
        R(hx + 4, ct + 2, 1, 1, trebS > 0.4 && flick ? '#fff27a' : '#fff4ea');
        shY = top + 4; shX = 3; break;
      }
      case 3: {
        const tsw = clampI(-lean + (con ? Math.round(Math.sin(cp * 6.283)) : 0), -1, 1), tx = bx + 2, t2 = tx + 1 + tsw;
        R(tx - 1, hipY - 3, 4, 4, pal[0]); R(t2 - 1, hipY - 7, 4, 5, pal[0]);
        R(tx, hipY - 2, 2, 2, pal[2]); R(t2, hipY - 4, 2, 2, pal[2]); R(t2, hipY - 6, 2, 2, pal[4]);
        const w = 7 + K, h = 6 - K, bot = hipY + 1, top = bot - h, ht = top - 5, et = trebS > 0.4 && flick ? -1 : 0;
        blob(bx, bot, w, h, pal, 0.5); R(bx - 1, top + 2, 2, Math.max(1, h - 3), pal[4]);
        blob(hx, top + 1, 8, 6, pal, 0.3);
        R(hx - 4 + et, ht - 3, 1, 1, pal[0]); R(hx - 4, ht - 2, 2, 1, pal[1]); R(hx - 4, ht - 1, 3, 1, pal[2]); R(hx - 3, ht - 1, 1, 1, '#ff9ab8');
        R(hx + 3, ht - 3, 1, 1, pal[0]); R(hx + 2, ht - 2, 2, 1, pal[1]); R(hx + 1, ht - 1, 3, 1, pal[2]); R(hx + 2, ht - 1, 1, 1, '#ff9ab8');
        R(hx - 2, ht + 4, 4, 2, pal[4]); R(hx - 1, ht + 4, 2, 1, INK);
        eye(hx - 3, ht + 2, bl); eye(hx + 1, ht + 2, bl);
        if (mouth) R(hx - 1, ht + 5, 2, 1, '#8a1a2a');
        shY = top + 1; shX = 3; break;
      }
      case 4: {
        const w = 10 + K, h = 11 - K, bot = hipY + 1, top = bot - h, ex = hx - 2, ey = top + 2, tw = trebS > 0.3 && ((time * 10) | 0) % 2 === 0 ? 1 : 0;
        blob(bx, bot, w, h, pal, 0.4);
        R(hx - 1, top - 2, 1, 2, pal[1]); R(hx + tw, top - 3, 1, 3, pal[3]); R(hx + 1, top - 2, 1, 1, pal[1]);
        R(ex - 1, ey, 6, 4, pal[0]); R(ex, ey - 1, 4, 6, pal[0]);
        if (bl) { R(ex, ey, 4, 4, pal[2]); R(ex, ey + 2, 4, 1, pal[0]); }
        else { R(ex, ey, 4, 4, '#ffffff'); R(ex + 1 + look, ey + 1, 2, 2, '#3aa0ff'); R(ex + 2 + look, ey + 2, 1, 1, INK); R(ex + 1 + look, ey + 1, 1, 1, '#ffffff'); }
        R(hx - 2, ey + 5, 4, mouth ? 2 : 1, '#2a0a1a'); R(hx - 2, ey + 5, 1, 1, '#ffffff'); R(hx + 1, ey + 5, 1, 1, '#ffffff');
        shY = top + 6; shX = 5; break;
      }
      case 5: {
        const w = 9 + K, h = 8 - K, bot = hipY + 1, top = bot - h, hc = trebS > 0.4 && flick ? '#fff27a' : '#9a7a4a';
        blob(bx, bot, w, h, pal, 0.6);
        R(hx - 4, top - 1, 2, 1, '#f0e0b0'); R(hx - 5, top - 2, 2, 1, '#f0e0b0'); R(hx - 5, top - 3, 1, 1, hc);
        R(hx + 2, top - 1, 2, 1, '#f0e0b0'); R(hx + 3, top - 2, 2, 1, '#f0e0b0'); R(hx + 4, top - 3, 1, 1, hc);
        eye(hx - 3, top + 2, bl); eye(hx + 1, top + 2, bl);
        if (!bl) { R(hx - 3, top + 1, 1, 1, pal[0]); R(hx + 2, top + 1, 1, 1, pal[0]); }
        R(hx - 4, top + 4, 1, 1, pal[1]); R(hx + 3, top + 4, 1, 1, pal[1]);
        R(hx - 2, top + 5, 4, mouth ? 2 : 1, '#2a0a1a');
        const fy = mouth ? top + 5 : top + 6;
        R(hx - 2, fy, 1, 1, '#ffffff'); R(hx + 1, fy, 1, 1, '#ffffff');
        shY = top + 4; shX = 4; break;
      }
      default: {
        R(bx + 3, hipY - 3, 3, 3, pal[0]); R(bx + 3, hipY - 2, 2, 2, '#ffffff');
        const w = 7 + K, h = 6 - K, bot = hipY + 1, top = bot - h, ht = top - 5;
        blob(bx, bot, w, h, pal, 0.4);
        const eh = clampI(6 - (air >> 1), 3, 6), tw = (trebS > 0.5 && flick ? 1 : 0) + (air > 2 ? 1 : 0);
        ear(hx - 3, ht, eh, clampI(-tw - (lean < 0 ? 1 : 0), -1, 1), pal);
        ear(hx + 1, ht, eh, clampI(tw + (lean > 0 ? 1 : 0), -1, 1), pal);
        blob(hx, top + 1, 8, 6, pal, 0.2);
        eye(hx - 3, ht + 2, bl); eye(hx + 1, ht + 2, bl);
        R(hx - 1, ht + 4, 2, 1, '#ff7a9a'); R(hx - 4, ht + 4, 1, 1, '#ffb0c8'); R(hx + 3, ht + 4, 1, 1, '#ffb0c8');
        if (mouth) R(hx - 1, ht + 5, 2, 1, '#8a1a3a');
        shY = top + 1; shX = 3;
      }
    }
    const lim = 7 - Math.abs(bx), lhx = bx + clampI(hlx, -lim, lim), rhx = bx + clampI(hrx, -lim, lim);
    const lhy = shY + hly, rhy = shY + hry;
    limb(bx - shX, shY, lhx, lhy, -1, 6, LIMB[sp], 0.5); limb(bx + shX - 1, shY, rhx, rhy, 1, 6, LIMB[sp], 0.5);
    R(lhx - 1, lhy, 2, 2, HAND[sp]); R(rhx, rhy, 2, 2, HAND[sp]);
  }

  function resize(width: number, height: number): void {
    const w = dim(width), h = dim(height);
    if (w > 0 && h > 0 && (w !== W || h !== H)) layout(w, h);
  }

  function draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioIn, dt: number): void {
    const w = dim(width), h = dim(height);
    if (!ctx || !(w > 0 && h > 0)) return;
    if (w !== W || h !== H) layout(w, h);
    C = ctx;
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingEnabled = false;
    if (dirty) { bake(ctx); dirty = false; }
    let d = Number(dt); if (!(d > 0)) d = 0; if (d > 0.05) d = 0.05;
    time += d;
    const A = audio || ZERO, k = Math.min(1, d * 12);
    bassS += (c01(A.bass) - bassS) * k; trebS += (c01(A.treble) - trebS) * k; enS += (c01(A.energy) - enS) * k;
    const lvl = Math.max(bassS, trebS, enS), beat = !!A.beat, edge = beat && !prevBeat;
    prevBeat = beat;
    if (edge) {
      accent = 1;
      if (fbHave) { const iv = time - fbLast; if (iv > 0.2 && iv < 2) fbInt = fbInt * 0.5 + iv * 0.5; }
      fbHave = true; fbLast = time; fbCount++;
    }
    accent = Math.max(0, accent - d * 3.5);
    con = false; cb = 0; cp = 0; camp = 0;
    const ph = A.beatPhase, bc = A.beatCount;
    if (typeof ph === 'number' && isFinite(ph)) {
      con = true; cp = Math.min(0.999, Math.max(0, ph));
      cb = typeof bc === 'number' && isFinite(bc) ? Math.floor(bc) : fbCount; camp = 0.65 + 0.35 * lvl;
    } else if (fbHave && time - fbLast < fbInt * 2.2) {
      con = true; cb = fbCount; cp = Math.min(0.999, (time - fbLast) / fbInt); camp = 0.55 + 0.45 * lvl;
    }
    cb = ((cb % 32) + 32) % 32;
    if (bg) ctx.drawImage(bg, 0, 0);
    else if (bgImg) ctx.putImageData(bgImg, 0, 0);
    else F(0, 0, w, h, '#0b0d24');
    for (let s = 0; s < starN; s++) {
      const tw = Math.sin(time * (1.3 + (s % 5) * 0.4) + s * 2.1) + trebS * 1.2;
      if (tw > 0.6) F(starX[s], starY[s], 1, 1, tw > 1.3 ? '#ffffff' : '#c8d0ff');
    }
    if (mini) {
      for (let i = 0; i < n; i++) {
        const sp = roster[i], x = Math.floor((w * (i + 0.5)) / n);
        const up = clampI((con ? (Math.sin(Math.PI * cp) > 0.5 ? 1 : 0) : bassS > 0.35 ? 1 : 0) + (accent > 0.5 ? 1 : 0), 0, 2);
        const y = Math.max(0, gy - 2 - up);
        F(x, y, 1, 2, PALS[sp][2]); F(x, y, 1, 1, sp === 2 ? CAP[2] : PALS[sp][3]);
      }
      return;
    }
    if (con && cb !== lastB) {
      lastB = cb;
      if (bassS > 0.15 || ((cb >> 2) & 7) === 4) for (let i = 0; i < n; i++) {
        spawn(dx[i] - 3 * S, gy - 1, -8 * S, -4 * S, 0.4, 2, 6); spawn(dx[i] + 3 * S, gy - 1, 8 * S, -4 * S, 0.4, 2, 6);
      }
    }
    if (edge) for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) {
      spawn(dx[i] + (rnd() - 0.5) * 10 * S, gy - HEADH[roster[i]] * S - rnd() * 4 * S, (rnd() - 0.5) * 20 * S, -(10 + rnd() * 20) * S, 0.5 + rnd() * 0.4, 0, Math.floor(rnd() * 6));
    }
    confAcc += trebS * trebS * d * 30;
    for (let g = 0; g < 4 && confAcc >= 1; g++) { confAcc -= 1; spawn(rnd() * w, -2, (rnd() - 0.5) * 6 * S, (4 + rnd() * 6) * S, 5, 1, Math.floor(rnd() * 6)); }
    if (confAcc > 4) confAcc = 0;
    for (let q = 0; q < PN; q++) {
      if (pL[q] <= 0) continue;
      pL[q] -= d;
      if (pT[q] === 1) pX[q] += Math.sin(time * 3 + q) * d * 4 * S;
      else if (pT[q] === 2) pVY[q] += 20 * S * d;
      pX[q] += pVX[q] * d; pY[q] += pVY[q] * d;
      if (pY[q] > h || pX[q] < -4 || pX[q] > w + 4) pL[q] = 0;
    }
    for (let i = 0; i < n; i++) { const sp = roster[i]; computePose(i, SW[sp]); drawDancer(i, sp, dx[i]); }
    const lz = Math.max(1, (S + 1) >> 1), glow = Math.min(1, 0.25 + enS * 0.6 + accent * 0.6 + bassS * 0.2);
    const bulb = glow > 0.8 ? '#fff4c0' : glow > 0.5 ? '#ffd27a' : '#e8963a';
    for (let i = 0; i < n; i++) {
      const x0 = dx[i] - Math.floor((3 * lz) / 2);
      F(x0, sf - lz, 3 * lz, 2 * lz, '#1a100a'); F(x0 + lz, sf - lz, lz, lz, bulb);
      if (glow > 0.45) F(x0 + lz, sf - 2 * lz, lz, lz, '#b8762a');
      if (glow > 0.75) { F(x0, sf - 2 * lz, lz, lz, '#6a4020'); F(x0 + 2 * lz, sf - 2 * lz, lz, lz, '#6a4020'); }
    }
    const z = Math.max(1, S >> 1);
    for (let q = 0; q < PN; q++) {
      if (pL[q] <= 0) continue;
      const x = Math.round(pX[q]), y = Math.round(pY[q]), col = SPARK[pC[q]];
      if (pT[q] === 0 && pL[q] > pM[q] * 0.5) { F(x - z, y, z * 3, z, col); F(x, y - z, z, z * 3, col); }
      else if (pT[q] === 1) F(x, y, z, z + (q & 1 ? z : 0), col);
      else F(x, y, z, z, col);
    }
  }

  return { resize, draw };
}
