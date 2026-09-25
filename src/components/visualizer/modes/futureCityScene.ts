type RGB = [number, number, number];

const GOLD_M: RGB = [201, 151, 63];
const CYAN_M: RGB = [63, 151, 141];
const SENS_M: RGB = [96, 104, 98];
const HAZE: RGB = [226, 204, 172];
const SHADOW: RGB = [58, 34, 40];
const LIGHT: RGB = [255, 240, 204];
const WALLS: RGB[] = [[214, 168, 112], [198, 134, 70], [180, 98, 62], [208, 150, 100], [228, 200, 156], [156, 92, 58], [192, 116, 94], [222, 182, 126]];
const ACCENTS: RGB[] = [[34, 128, 124], [160, 70, 48], [70, 42, 34], [236, 220, 180], [196, 112, 50], [46, 96, 118]];
const AWN: [RGB, RGB][] = [[[40, 150, 140], [236, 222, 190]], [[180, 80, 50], [240, 214, 160]], [[214, 160, 60], [90, 50, 36]]];
const DOMES: RGB[] = [[196, 110, 56], [228, 206, 166], [58, 140, 128], [176, 92, 60]];
const LEAF_D: RGB = [30, 84, 54];
const LEAF_M: RGB = [52, 128, 66];
const LEAF_L: RGB = [122, 184, 78];
const DOOR: RGB = [58, 34, 30];
const GLASS: RGB = [40, 96, 104];
const WARM: RGB = [255, 200, 104];
const COPPER: RGB = [192, 106, 52];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const STOPS: [number, RGB][] = [[0, [78, 160, 160]], [0.28, [134, 206, 186]], [0.52, [200, 228, 192]], [0.72, [248, 218, 172]], [0.88, [252, 190, 134]], [1, [255, 206, 124]]];
const PED_COLS = ['rgb(40,150,140)', 'rgb(214,90,60)', 'rgb(236,190,80)', 'rgb(120,60,120)', 'rgb(236,226,200)'];

function clamp(v: number, lo: number, hi: number): number { return v < lo ? lo : v > hi ? hi : v; }
function mix(a: RGB, b: RGB, t: number): RGB {
  const k = clamp(t, 0, 1);
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
}
function css(c: RGB): string { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
function mkRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let r = s;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hash2(x: number, y: number): number { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); }
function mkCanvas(w: number, h: number): HTMLCanvasElement { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function px(g: CanvasRenderingContext2D, c: string, x: number, y: number, w: number, h: number): void {
  const wi = Math.round(w), hi = Math.round(h);
  if (wi <= 0 || hi <= 0) return;
  g.fillStyle = c;
  g.fillRect(Math.round(x), Math.round(y), wi, hi);
}
function blob(g: CanvasRenderingContext2D, c: string, cx: number, cy: number, r: number): void {
  const ri = Math.ceil(r);
  for (let yy = -ri; yy <= ri; yy++) {
    const q = r * r - yy * yy;
    if (q < 0) continue;
    const hw = Math.sqrt(q);
    const xl = Math.round(cx - hw), xr = Math.max(xl + 1, Math.round(cx + hw));
    px(g, c, xl, Math.round(cy + yy), xr - xl, 1);
  }
}
function skyAt(v: number): RGB {
  const t = clamp(v, 0, 1);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i], b = STOPS[i + 1];
    if (t <= b[0]) return mix(a[1], b[1], (t - a[0]) / Math.max(1e-6, b[0] - a[0]));
  }
  return STOPS[STOPS.length - 1][1];
}

export function createFutureCityScene() {
  let W = 0, H = 0;
  let back: HTMLCanvasElement | null = null;
  let mid: HTMLCanvasElement | null = null;
  let top: HTMLCanvasElement | null = null;
  let rand: () => number = mkRng(1);
  const frng = mkRng(0xc17a);
  let horizon = 1, canalTop = 1, canalH = 1, promTop = 1, promH = 1, sp = 3, hUnit = 3, nRows = 1;
  let trackRow = 0, trackY = 0, trackOn = false, trainLen = 6, valleyAmp = 0;
  let rowY: number[] = [], rowF: number[] = [];
  let sX: number[] = [], sY: number[] = [], sW: number[] = [], sC: number[] = [], sL: number[] = [], sP: number[] = [], sD: number[] = [];
  let nX: number[] = [], nY: number[] = [], nL: number[] = [], nP: number[] = [];
  let gardens: number[] = [], glints: number[] = [], palms: number[] = [], peds: number[] = [], birds: number[] = [];
  let wfX = -1, wfY0 = 0, wfY1 = 0;
  let t = 0, trainX = 0, boatX = 0, waveT = 9, beatCool = 0, sb = 0, st = 0, se = 0, ambient = 0;
  const MOTES = 48;
  const mX: number[] = [], mY: number[] = [], mVX: number[] = [], mVY: number[] = [], mLife: number[] = [], mMax: number[] = [], mC: number[] = [];
  for (let i = 0; i < MOTES; i++) { mX.push(0); mY.push(0); mVX.push(0); mVY.push(0); mLife.push(0); mMax.push(1); mC.push(0); }
  const SENS = css(SENS_M), GOLDM = css(GOLD_M), CYANM = css(CYAN_M);

  const baseAt = (j: number, x: number): number => {
    const q = W > 1 ? Math.pow((x - W / 2) / (W / 2), 2) : 0;
    return rowY[j] - Math.round(valleyAmp * rowF[j] * q);
  };

  function building(g: CanvasRenderingContext2D, x0: number, bot: number, w: number, h: number, f: number): void {
    const hk = f * 0.55;
    const hz = (c: RGB): string => css(mix(c, HAZE, hk));
    const base = WALLS[(rand() * WALLS.length) | 0];
    const tp = bot - h;
    const wall = hz(base), lit = hz(mix(base, LIGHT, 0.32)), shd = hz(mix(base, SHADOW, 0.3)), dk = hz(mix(base, SHADOW, 0.5));
    const leafD = hz(LEAF_D), leafM = hz(LEAF_M), leafL = hz(LEAF_L);
    const warmC = css(mix(WARM, HAZE, hk * 0.5));
    const sw = w >= 9 ? 2 : 1;
    const roof = (rand() * 6) | 0;
    const near = f < 0.55;
    const cx0 = x0 + w / 2;
    px(g, wall, x0, tp, w, h);
    px(g, lit, x0, tp, 1, h);
    px(g, shd, x0 + w - sw, tp, sw, h);
    px(g, dk, x0, bot - 1, w, 1);
    if (w >= 6 && h >= 8 && rand() < 0.3) {
      const wood = hz([96, 60, 38]);
      for (let ty = tp + 3; ty < bot - 2; ty += 3) {
        px(g, wood, x0 - 1, ty, 1, 1);
        for (let tx = x0 + 2 + (ty % 2); tx < x0 + w - sw; tx += 3) px(g, shd, tx, ty, 1, 1);
      }
    }
    px(g, lit, x0, tp, w - sw, 1);
    let by = tp + 1, bh = 0;
    if (h >= 5 && w >= 4) {
      bh = h >= 9 ? 2 : 1;
      by = tp + 1 + (h >= 12 && rand() < 0.4 ? 1 : 0);
      const acc = ACCENTS[(rand() * ACCENTS.length) | 0];
      const ca = hz(acc), cb = hz(mix(base, acc, 0.3));
      const kind = (rand() * 4) | 0;
      px(g, cb, x0 + 1, by, w - 1 - sw, bh);
      for (let i = 1; i < w - sw; i++) for (let r = 0; r < bh; r++) {
        const m = i % 4;
        const on = kind === 0 ? (r === 0 ? m === 1 : m !== 3) : kind === 1 ? (r === 0 ? i % 2 === 0 : bh > 1) : kind === 2 ? (i + r) % 2 === 0 : (r === 0 ? i % 3 === 0 : i % 3 !== 0);
        if (on) px(g, ca, x0 + i, by + r, 1, 1);
      }
      if (f < 0.85 && w >= 5 && rand() < 0.7) px(g, GOLDM, x0 + 1, by + bh, w - 1 - sw, 1);
    }
    let dx = -99, dw = 0, dh = 0;
    const workshop = roof === 4 && w >= 7;
    if (h >= 5) {
      dw = workshop ? Math.max(2, Math.round(w * 0.45)) : w >= 8 ? 2 : 1;
      dh = Math.min(h - bh - 3, workshop ? Math.max(2, Math.round(h * 0.4)) : w >= 8 ? 3 + (h >= 15 ? 1 : 0) : 2);
      if (dh >= 1) {
        dx = x0 + 1 + ((rand() * Math.max(1, w - dw - sw - 1)) | 0);
        const dtop = bot - 1 - dh;
        px(g, dk, dx - 1, dtop - 1, dw + 2, dh + 1);
        px(g, hz(DOOR), dx, dtop, dw, dh);
        if (workshop) px(g, warmC, dx + 1, bot - 2, Math.max(1, dw - 2), 1);
        else if (rand() < 0.35) px(g, warmC, dx, dtop + 1, 1, Math.max(1, dh - 1));
        if (dw >= 2 && !workshop && rand() < 0.5) { px(g, wall, dx - 1, dtop - 1, 1, 1); px(g, wall, dx + dw, dtop - 1, 1, 1); }
        if ((workshop || (w >= 6 && rand() < 0.55)) && dtop >= tp + 3) {
          const ac = AWN[(rand() * AWN.length) | 0];
          const c1 = hz(ac[0]), c2 = hz(ac[1]);
          const ax0 = Math.max(x0, dx - 2), ax1 = Math.min(x0 + w, dx + dw + 2);
          for (let ax = ax0; ax < ax1; ax++) px(g, (ax & 1) ? c1 : c2, ax, dtop - 2, 1, 1);
        }
      } else dh = 0;
    }
    const glassC = hz(mix(GLASS, [150, 214, 200], 0.15)), shutC = hz([36, 128, 122]);
    const fh = h >= 14 ? 4 : 3, step = w >= 10 ? 3 : 2, tall = fh >= 4 && near;
    const wx0 = x0 + (w >= 6 ? 2 : 1), wx1 = x0 + w - sw - (w >= 6 ? 2 : 1);
    for (let wy = by + bh + 1 + (bh > 0 ? 1 : 0); wy + (tall ? 2 : 1) <= bot - 2; wy += fh) {
      for (let wx = wx0; wx <= wx1; wx += step) {
        if (wx >= dx - 1 && wx <= dx + dw && wy + (tall ? 2 : 1) >= bot - 4 - dh) continue;
        const r = rand();
        px(g, r < 0.3 ? warmC : glassC, wx, wy, 1, tall ? 2 : 1);
        if (tall) {
          if (rand() < 0.5) px(g, lit, wx, wy + 2, 1, 1);
          if (r > 0.85 && wx + 1 <= wx1) px(g, shutC, wx + 1, wy, 1, 2);
        }
      }
    }
    if (w >= 7 && h >= 10 && rand() < 0.5) {
      const yb = Math.min(bot - 4, by + bh + 1 + fh + (tall ? 2 : 1));
      const left = rand() < 0.5, bw = Math.min(5, w - 2);
      const bx = left ? x0 - 1 : x0 + w - bw + 1;
      px(g, hz(COPPER), bx, yb, bw, 1);
      const rl = hz(mix(COPPER, LIGHT, 0.3));
      for (let i = 0; i < bw; i += 2) px(g, rl, bx + i, yb - 1, 1, 1);
      px(g, leafM, bx + (left ? 1 : bw - 2), yb + 1, 1, 1 + ((rand() * 2) | 0));
      if (f < 0.85) px(g, GOLDM, bx + (left ? bw - 1 : 0), yb - 1, 1, 1);
    }
    if (w >= 6 && h >= 7 && rand() < 0.3) {
      const n = Math.min(h - 4, w - 3, 6), sx = x0 + w - sw - 1;
      for (let k = 0; k < n; k++) { px(g, lit, sx - k, bot - 2 - k, 1, 1); px(g, dk, sx - k, bot - 1 - k, 1, 1); }
    }
    if (rand() < 0.35) {
      const vx = x0 + 1 + ((rand() * Math.max(1, w - 2)) | 0), vl = 1 + ((rand() * Math.max(1, h * 0.45)) | 0);
      px(g, leafD, vx, tp, 1, vl); px(g, leafL, vx, tp + vl - 1, 1, 1);
    }
    if ((roof === 0 || roof === 2) && w >= 8 && rand() < 0.3) {
      const wx = x0 + w - 3;
      px(g, wall, wx, tp - 4, 2, 4); px(g, lit, wx, tp - 4, 2, 1); px(g, dk, wx, tp - 3, 1, 1);
    }
    if (roof === 0) {
      for (let i = 1; i < w - 1; i++) {
        px(g, leafD, x0 + i, tp - 1, 1, 1);
        const r = rand();
        if (r < 0.5) px(g, r < 0.2 ? leafL : leafM, x0 + i, tp - 2, 1, 1);
        if (r < 0.08 && near) px(g, hz([240, 120, 90]), x0 + i, tp - 3, 1, 1);
      }
      px(g, lit, x0, tp - 2, 1, 2); px(g, shd, x0 + w - 1, tp - 2, 1, 2);
      if (w >= 5 && f < 0.85 && rand() < 0.6) px(g, CYANM, x0 + 1, tp, w - 2, 1);
      if (rand() < 0.55) { px(g, dk, x0 + w - 2, tp - 4, 1, 2); px(g, SENS, x0 + w - 2, tp - 5, 1, 1); }
      gardens.push(cx0, tp - 2);
    } else if (roof === 1) {
      const dc = DOMES[(rand() * DOMES.length) | 0];
      const c = hz(dc), cl = hz(mix(dc, LIGHT, 0.35)), cs = hz(mix(dc, SHADOW, 0.3));
      const dwid = Math.max(3, w - 2 - (w >= 10 ? 2 : 0)), rr = dwid / 2, dh2 = Math.max(1, Math.round(rr * 0.9));
      for (let yy = 0; yy < dh2; yy++) {
        const u = (yy + 0.5) / dh2, hw = Math.max(0.5, rr * Math.sqrt(1 - u * u));
        const xl = Math.round(cx0 - hw), xr = Math.max(xl + 1, Math.round(cx0 + hw));
        px(g, c, xl, tp - 1 - yy, xr - xl, 1);
        px(g, cl, xl, tp - 1 - yy, Math.max(1, Math.round((xr - xl) / 3)), 1);
        if (xr - xl >= 3) px(g, cs, xr - 1, tp - 1 - yy, 1, 1);
      }
      if (dwid >= 4 && f < 0.85) px(g, CYANM, Math.round(cx0 - rr) + 1, tp - 1, dwid - 2, 1);
      px(g, hz([236, 190, 96]), Math.floor(cx0), tp - 1 - dh2, 1, 1);
      px(g, SENS, Math.floor(cx0), tp - 2 - dh2, 1, 1);
    } else if (roof === 2) {
      const th = Math.max(1, Math.round(h * 0.18)), nt = w >= 8 ? 2 : 1;
      let tw = w, ty = tp;
      for (let k = 0; k < nt; k++) {
        tw -= w >= 10 ? 4 : 2;
        if (tw < 2) break;
        const tx = x0 + ((w - tw) >> 1);
        ty -= th;
        px(g, wall, tx, ty, tw, th); px(g, lit, tx, ty, 1, th); px(g, lit, tx, ty, tw, 1); px(g, shd, tx + tw - 1, ty, 1, th);
        px(g, leafM, tx - 1, ty + th - 1, 1, 1);
        if (rand() < 0.5) px(g, leafL, tx + tw, ty + th - 1, 1, 1);
      }
      px(g, SENS, Math.floor(cx0), ty - 1, 1, 1);
    } else if (roof === 3) {
      const t1 = hz([206, 168, 96]), t2 = hz([168, 126, 70]), ts = hz([130, 92, 56]);
      const ch = Math.max(2, Math.round(w * 0.5));
      for (let yy = 0; yy < ch; yy++) {
        const hw = (w / 2 + 1) * (1 - yy / ch);
        const xl = Math.round(cx0 - hw), xr = Math.max(xl + 1, Math.round(cx0 + hw));
        px(g, yy % 2 ? t1 : t2, xl, tp - 1 - yy, xr - xl, 1);
        if (xr - xl >= 3) px(g, ts, xr - 1, tp - 1 - yy, 1, 1);
      }
      px(g, dk, Math.floor(cx0), tp - 1 - ch, 1, 2);
      px(g, SENS, Math.floor(cx0), tp - 2 - ch, 1, 1);
    } else if (roof === 4) {
      const pc = hz([34, 56, 86]), ph = hz([92, 170, 196]);
      for (let sx = x0 + 1; sx + 1 < x0 + w; sx += 3) {
        px(g, pc, sx, tp - 1, Math.min(3, x0 + w - sx), 1);
        px(g, pc, sx + 1, tp - 2, Math.min(2, x0 + w - sx - 1), 1);
        px(g, rand() < 0.5 ? SENS : ph, sx + 2, tp - 3, 1, 1);
      }
    } else {
      const vh = Math.max(1, Math.round(w * 0.25));
      for (let yy = 0; yy < vh; yy++) {
        const u = (yy + 0.5) / vh, hw = (w / 2) * Math.sqrt(Math.max(0, 1 - u * u));
        const xl = Math.round(cx0 - hw), xr = Math.max(xl + 1, Math.round(cx0 + hw));
        px(g, yy === vh - 1 ? leafL : leafM, xl, tp - 1 - yy, xr - xl, 1);
        if (rand() < 0.4) px(g, hz([250, 206, 90]), xl + ((rand() * (xr - xl)) | 0), tp - 1 - yy, 1, 1);
      }
      gardens.push(cx0, tp - 1 - vh);
    }
  }

  function trees(g: CanvasRenderingContext2D, x0: number, bot: number, w: number, h: number, f: number): void {
    const hk = f * 0.55;
    const d = css(mix(LEAF_D, HAZE, hk)), m = css(mix(LEAF_M, HAZE, hk)), l = css(mix(LEAF_L, HAZE, hk)), tr = css(mix([92, 62, 44], HAZE, hk));
    const n = 1 + ((w / 4) | 0);
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i + 0.5) * w / n + (rand() - 0.5);
      if (h >= 6 && rand() < 0.3) {
        const r = Math.max(1, w * 0.3);
        px(g, tr, Math.round(cx), bot - h + r, 1, h - r);
        blob(g, d, cx, bot - h + r, r); blob(g, m, cx - r * 0.3, bot - h + r * 0.7, r * 0.6);
        px(g, l, Math.round(cx - r * 0.5), Math.round(bot - h + r * 0.3), 1, 1);
      } else {
        const r = Math.max(1, Math.min(h * 0.5, w * 0.45) * (0.7 + rand() * 0.4));
        const cy = bot - r - rand() * Math.max(0, h - 2 * r);
        blob(g, d, cx, cy, r); blob(g, m, cx - r * 0.3, cy - r * 0.3, r * 0.65);
        px(g, l, Math.round(cx - r * 0.5), Math.round(cy - r * 0.6), 1, 1);
        if (cy + r < bot) px(g, tr, Math.round(cx), cy + r, 1, bot - cy - r);
      }
    }
  }

  function plot(g: CanvasRenderingContext2D, x0: number, bot: number, w: number, f: number): void {
    const hz = (c: RGB): string => css(mix(c, HAZE, f * 0.55));
    const crop = [hz(LEAF_L), hz([236, 190, 80]), hz(LEAF_M)];
    px(g, hz([120, 80, 50]), x0, bot - 1, w, 1);
    for (let i = 0; i < w; i += 2) px(g, crop[((i / 2) | 0) % 3], x0 + i, bot - 2, 1, 1);
    const cop = hz(COPPER);
    px(g, cop, x0, bot - 4, 1, 3); px(g, cop, x0 + w - 1, bot - 4, 1, 3);
    px(g, hz([34, 56, 86]), x0, bot - 5, w, 1);
    px(g, SENS, x0 + (w >> 1), bot - 6, 1, 1);
    gardens.push(x0 + w / 2, bot - 3);
  }

  function paintRow(g: CanvasRenderingContext2D, j: number): void {
    const f = rowF[j], s = 1 - 0.5 * f, hk = f * 0.55;
    const hz = (c: RGB): string => css(mix(c, HAZE, hk));
    const earth: RGB = [158, 102, 62];
    const cE = hz(earth), cEd = hz(mix(earth, SHADOW, 0.3)), cG = hz(LEAF_M), cGl = hz(LEAF_L), cGd = hz(LEAF_D);
    const stL = hz([228, 196, 150]), stD = hz([150, 110, 80]);
    const bases: number[] = [];
    for (let x = 0; x < W; x++) {
      const b = baseAt(j, x);
      bases.push(b);
      px(g, cE, x, b, 1, H - b);
      px(g, cG, x, b, 1, 1);
      px(g, cEd, x, b + 1, 1, 1);
      px(g, cEd, x, b + 4, 1, 1);
      const m = x % 6;
      if (m === 0) px(g, cEd, x, b + 2, 1, 2); else if (m === 3) px(g, cEd, x, b + 5, 1, 2);
    }
    const nextBase = (x: number): number => (j < nRows - 1 ? baseAt(j + 1, x) : H);
    for (let k = 0; k < W / 10; k++) {
      const x = (rand() * W) | 0, len = 1 + ((rand() * 3) | 0);
      px(g, cG, x, bases[x] + 1, 1, len); px(g, cGl, x, bases[x] + len, 1, 1);
    }
    if (f < 0.8) for (let k = 0; k < Math.round(W / 40); k++) {
      const xs = (rand() * (W - 6)) | 0, w = 3 + ((rand() * 4) | 0);
      if (xs >= 0 && xs + w - 1 < W && bases[xs] === bases[xs + w - 1]) px(g, CYANM, xs, bases[xs] + 2, w, 1);
    }
    for (let k = 0; k < Math.max(1, Math.round(W / (sp * 7))); k++) {
      const x = (rand() * (W - 2)) | 0, bt = Math.min(H, nextBase(x));
      for (let yy = bases[Math.max(0, x)] + 1; yy < bt; yy++) px(g, yy % 2 ? stL : stD, x, yy, 2, 1);
    }
    for (let x = (rand() * 4) | 0; x < W; x += 2 + ((rand() * 6) | 0)) { px(g, cGd, x, bases[x] - 1, 2, 1); if (rand() < 0.5) px(g, cG, x, bases[x] - 2, 1, 1); }
    const bmax = (x0: number, w: number): number => {
      let m = -1e9;
      for (let x = Math.max(0, x0); x < Math.min(W, x0 + w); x++) m = Math.max(m, bases[x]);
      return m < -1e8 ? baseAt(j, clamp(x0, 0, W - 1)) : m;
    };
    let x = -((rand() * 3) | 0), guard = 0;
    while (x < W && guard++ < 500) {
      const r = rand();
      if (r < 0.12 + f * 0.1) {
        const w = Math.max(2, Math.round(sp * s * (0.5 + rand() * 0.7)));
        trees(g, x, bmax(x, w), w, Math.max(2, Math.round(hUnit * s * (0.8 + rand() * 0.9))), f);
        x += Math.max(1, w - 1);
      } else if (r < 0.2 + f * 0.1 && f < 0.7 && sp >= 6) {
        const w = Math.max(4, Math.round(sp * s * 0.8));
        plot(g, x, bmax(x, w), w, f);
        x += w + 1;
      } else {
        const w = Math.max(3, Math.round(sp * s * (0.65 + rand() * 0.85)));
        let h = Math.max(3, Math.round(hUnit * s * (1 + rand() * 1.1)));
        if (rand() < 0.1) h = Math.round(h * 1.4);
        building(g, x, bmax(x, w), w, h, f);
        x += w + (rand() < 0.55 ? 0 : 1);
      }
    }
  }

  function paintTrack(g: CanvasRenderingContext2D): void {
    const deck = css([232, 222, 196]), under = css([150, 120, 100]), pier = css([196, 170, 138]), pierS = css([140, 112, 92]);
    px(g, deck, 0, trackY, W, 1); px(g, under, 0, trackY + 1, W, 1);
    for (let x = 1; x < W; x += 3) px(g, CYANM, x, trackY + 1, 1, 1);
    const ps = Math.max(8, Math.round(sp * 2.6));
    for (let x = ps >> 1; x < W; x += ps) {
      const b = baseAt(trackRow, x);
      if (b <= trackY + 2) continue;
      px(g, pier, x - 1, trackY + 2, 3, 1);
      px(g, pier, x, trackY + 2, 1, b - trackY - 2);
      if (sp >= 7) px(g, pierS, x + 1, trackY + 3, 1, b - trackY - 3);
    }
    if (W >= 40 && trackY >= 9) {
      const sx = Math.round(W * (0.5 + rand() * 0.15)), sw = Math.max(6, Math.round(sp * 1.6));
      const cop = css(COPPER), copL = css(mix(COPPER, LIGHT, 0.35));
      px(g, cop, sx, trackY - 5, sw, 1); px(g, copL, sx + 1, trackY - 6, sw - 2, 1);
      px(g, css(LEAF_M), sx + 2, trackY - 7, sw - 4, 1);
      px(g, GOLDM, sx + 1, trackY - 4, sw - 2, 1);
      px(g, cop, sx, trackY - 4, 1, 4); px(g, cop, sx + sw - 1, trackY - 4, 1, 4);
      px(g, SENS, sx + (sw >> 1), trackY - 8, 1, 1);
    }
  }

  function paintLand(g: CanvasRenderingContext2D, a: number): void {
    const hzn = horizon, unit = Math.max(8, H * 0.6);
    const ph: number[] = [];
    for (let i = 0; i < 9; i++) ph.push(rand() * 6.283);
    const ridge = (x: number, o: number, sc: number): number => {
      const u = x / (unit * sc);
      return clamp(0.5 + 0.28 * Math.sin(u * 0.9 + ph[o]) + 0.14 * Math.sin(u * 2.3 + ph[o + 1]) + 0.08 * Math.sin(u * 5.1 + ph[o + 2]), 0, 1);
    };
    const yF = (x: number): number => Math.round(hzn - hzn * (0.2 + 0.42 * ridge(x, 0, 1.4)));
    const yM = (x: number): number => Math.round(hzn - hzn * (0.08 + 0.28 * ridge(x, 3, 0.8)));
    const yJ = (x: number): number => Math.round(hzn + Math.min(3, sp * 0.3) - hzn * 0.12 * ridge(x, 6, 0.3) - Math.abs(Math.sin(x * 0.7 + ph[8])) * Math.min(3, sp * 0.25));
    const far = css([178, 198, 184]), farL = css([218, 222, 198]), farD = css([156, 182, 174]);
    for (let x = 0; x < W; x++) {
      const y = yF(x);
      px(g, far, x, y, 1, hzn + 2 - y);
      px(g, yF(x + 1) < yF(x - 1) ? farL : farD, x, y, 1, 2);
    }
    const mb = css([112, 160, 138]), ml = css([164, 198, 158]), md = css([88, 138, 120]), mt = css([134, 180, 146]);
    for (let x = 0; x < W; x++) {
      const y = yM(x);
      px(g, mb, x, y, 1, hzn + sp - y);
      if (yM(x + 1) < yM(x - 1)) px(g, ml, x, y, 1, 2); else px(g, md, x, y + 1, 1, 1);
      for (let yy = y + 2; yy < hzn + 2; yy++) {
        const hv = hash2(x, yy);
        if (hv < 0.1) px(g, md, x, yy, 1, 1); else if ((yy - y) % 3 === 0 && hv < 0.5) px(g, mt, x, yy, 1, 1);
      }
    }
    const wx = Math.round(W * (0.45 + rand() * 0.3));
    if (W >= 30 && hzn >= 14) {
      const y0 = yM(wx) + 2, y1 = yJ(wx);
      if (y1 - y0 >= 3) {
        px(g, css([214, 238, 226]), wx, y0, 1, y1 - y0);
        px(g, css([176, 222, 206]), wx + 1, y0 + 1, 1, y1 - y0 - 1);
        px(g, css([236, 248, 238]), wx - 1, y1 - 1, 3, 1);
        wfX = wx; wfY0 = y0; wfY1 = y1;
      }
    }
    const nT = W < 24 ? 0 : a > 1.6 ? 3 : 2;
    const spots = nT === 3 ? [0.14, 0.6, 0.84] : [0.24, 0.76];
    const tB = css([184, 124, 84]), tL = css([232, 184, 126]), tS = css([126, 84, 68]), tG = css([238, 196, 104]), tLeaf = css([70, 140, 80]);
    for (let i = 0; i < nT; i++) {
      const cx = Math.round(W * spots[i] + (rand() - 0.5) * W * 0.06);
      const tt0 = clamp(Math.round(hzn * (0.08 + rand() * 0.14 + (i === 1 ? 0 : 0.1))), 4, Math.max(4, hzn - 4));
      const tb = hzn + 3, len = tb - tt0;
      if (len < 5) continue;
      const bw = Math.max(2, Math.round(sp * (0.32 + rand() * 0.14))), lean = (rand() - 0.5) * bw;
      for (let y = tt0; y <= tb; y++) {
        const u = (y - tt0) / len;
        const node = Math.abs(u - 0.32) * len < 1 || Math.abs(u - 0.6) * len < 1;
        const hw = bw * 0.5 * (0.2 + 0.8 * Math.pow(u, 0.8)) + (node ? 1 : 0);
        const xc = cx + lean * Math.sin(u * Math.PI);
        const xl = Math.round(xc - hw), xr = Math.max(xl + 1, Math.round(xc + hw));
        px(g, node ? tG : tB, xl, y, xr - xl, 1);
        if (!node) {
          px(g, tL, xl, y, 1, 1);
          if (xr - xl >= 3) { px(g, tS, xr - 1, y, 1, 1); if (y % 3 !== 0) px(g, CYANM, Math.round(xc), y, 1, 1); }
        } else { px(g, tLeaf, xl - 1, y, 1, 1); px(g, tLeaf, xr, y + 1, 1, 1); }
      }
      px(g, tL, cx, tt0 - 3, 1, 3);
      px(g, SENS, cx, tt0 - 4, 1, 1);
    }
    const jb = css([54, 116, 76]), jd = css([34, 88, 58]), jl = css([96, 158, 86]);
    for (let x = 0; x < W; x++) {
      const y = yJ(x);
      px(g, jb, x, y, 1, H - y);
      if (hash2(x, 3) < 0.6) px(g, jl, x, y, 1, 1);
      for (let yy = y + 1; yy < Math.min(H, y + sp * 2); yy++) {
        const hv = hash2(x, yy);
        if (hv < 0.18) px(g, jd, x, yy, 1, 1); else if (hv > 0.93) px(g, jl, x, yy, 1, 1);
      }
    }
  }

  function paintSky(g: CanvasRenderingContext2D, a: number): void {
    const img = g.createImageData(W, H);
    const d = img.data;
    for (let y = 0; y < H; y++) {
      const c = skyAt(y / Math.max(1, horizon));
      for (let x = 0; x < W; x++) {
        const th = (BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.47) * 9;
        const i = (y * W + x) * 4;
        d[i] = clamp(Math.round((c[0] + th) / 9) * 9, 0, 255);
        d[i + 1] = clamp(Math.round((c[1] + th) / 9) * 9, 0, 255);
        d[i + 2] = clamp(Math.round((c[2] + th) / 9) * 9, 0, 255);
        d[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const sx = Math.round(W * (a > 1.2 ? 0.24 : 0.3)), sy = Math.round(horizon * 0.52), r = Math.max(1, Math.round(horizon * 0.11));
    const halo = css([255, 228, 172]);
    for (let yy = -r - 2; yy <= r + 2; yy++) for (let xx = -r - 2; xx <= r + 2; xx++) {
      if (((xx + yy) & 1) === 0 && xx * xx + yy * yy <= (r + 2) * (r + 2)) px(g, halo, sx + xx, sy + yy, 1, 1);
    }
    blob(g, css([255, 244, 208]), sx, sy, r);
    const hi = css([255, 238, 214]), lo = css([246, 196, 168]);
    const nc = 2 + ((W / 90) | 0);
    for (let i = 0; i < nc; i++) {
      const cy = Math.round(horizon * (0.1 + rand() * 0.35)), len = Math.round(W * (0.05 + rand() * 0.1)) + 4, cx = Math.round(rand() * W) - 4;
      px(g, lo, cx, cy, len, 1); px(g, hi, cx + 2, cy + 1, len - 3, 1);
      if (rand() < 0.6) px(g, hi, cx + len - 2, cy - 1, Math.max(2, len >> 2), 1);
    }
  }

  function paintWater(g: CanvasRenderingContext2D): void {
    const tmp = mkCanvas(W, H);
    const tc = tmp.getContext('2d');
    if (tc && back && mid) { tc.drawImage(back, 0, 0); tc.drawImage(mid, 0, 0); }
    const tq: RGB = [26, 158, 156];
    const cols: RGB[] = [];
    for (let y = canalTop + 1; y < promTop; y++) {
      const r = y - canalTop, f = r / Math.max(1, canalH);
      const c = mix(skyAt(Math.max(0, 1 - f * 0.9)), tq, 0.4 + 0.3 * f);
      cols.push(c);
      px(g, css(c), 0, y, W, 1);
      const sy = canalTop - r;
      if (tc && sy >= 0) { g.globalAlpha = 0.28; g.drawImage(tmp, 0, sy, W, 1, 0, y, W, 1); g.globalAlpha = 1; }
    }
    if (cols.length > 0) {
      px(g, css(mix(cols[0], [10, 60, 70], 0.35)), 0, canalTop + 1, W, 1);
      const nr = Math.min(220, Math.round(W * canalH / 16));
      for (let i = 0; i < nr; i++) {
        const k = (rand() * cols.length) | 0, x = (rand() * W) | 0, len = 2 + ((rand() * 5) | 0);
        px(g, css(rand() < 0.5 ? mix(cols[k], [236, 252, 236], 0.35) : mix(cols[k], [10, 70, 80], 0.3)), x, canalTop + 1 + k, len, 1);
      }
      const ng = clamp(Math.round(W * canalH / 30), 0, 70);
      for (let i = 0; i < ng; i++) glints.push(rand() * W, canalTop + 2 + ((rand() * Math.max(1, cols.length - 1)) | 0), rand() * 6.283);
    }
    px(g, css([222, 190, 140]), 0, canalTop, W, 1);
    const qj = css([168, 128, 90]);
    for (let x = 2; x < W; x += 5) px(g, qj, x, canalTop, 1, 1);
  }

  function paintPromenade(g: CanvasRenderingContext2D): void {
    const stone: RGB = [214, 178, 128];
    px(g, css(stone), 0, promTop, W, promH);
    px(g, css([240, 216, 172]), 0, promTop, W, 1);
    const sd = css(mix(stone, SHADOW, 0.2));
    if (promH >= 3) {
      const my = promTop + 1 + ((promH - 1) >> 1);
      px(g, sd, 0, my, W, 1);
      for (let x = 0; x < W; x += 3) px(g, sd, x + ((x / 3) & 1 ? 1 : 0), x % 2 ? my - 1 : my + 1, 1, 1);
      for (let x = 2; x < W; x += 9) px(g, GOLDM, x, H - 1 - (promH >= 5 ? 1 : 0), 4, 1);
    }
    const step = Math.max(10, Math.round(sp * 2.2)), lh = Math.max(2, Math.round(sp * 0.35));
    const pole = css([120, 74, 48]), plan = css(COPPER), lm = css(LEAF_M), ll = css(LEAF_L), fl = css([240, 110, 80]);
    for (let x = (rand() * step) | 0; x < W; x += step + ((rand() * 4) | 0)) {
      if (rand() < 0.5) {
        px(g, pole, x, promTop - lh, 1, lh); px(g, pole, x, promTop - lh - 1, 2, 1);
        px(g, GOLDM, x + 1, promTop - lh, 1, 1);
      } else {
        px(g, plan, x - 1, promTop - 1, 3, 1); px(g, lm, x - 1, promTop - 2, 3, 1);
        px(g, ll, x, promTop - 3, 1, 1); if (rand() < 0.5) px(g, fl, x + 1, promTop - 3, 1, 1);
      }
    }
  }

  function scan(cv: HTMLCanvasElement, layer: number): void {
    const g = cv.getContext('2d');
    if (!g) return;
    const d = g.getImageData(0, 0, W, H).data;
    const span = Math.max(1, canalTop - horizon);
    for (let y = 0; y < H; y++) {
      let run = 0, rc = -1;
      for (let x = 0; x <= W; x++) {
        let c = -1;
        if (x < W) {
          const i = (y * W + x) * 4;
          if (d[i + 3] === 255) {
            const r = d[i], gg = d[i + 1], b = d[i + 2];
            if (r === 201 && gg === 151 && b === 63) c = 0;
            else if (r === 63 && gg === 151 && b === 141) c = 1;
            else if (r === 96 && gg === 104 && b === 98 && nX.length < 400) { nX.push(x); nY.push(y); nL.push(layer); nP.push(hash2(x, y)); }
          }
        }
        if (c !== rc) {
          if (rc >= 0 && sX.length < 1400) {
            sX.push(run); sY.push(y); sW.push(x - run); sC.push(rc); sL.push(layer);
            sP.push(hash2(run, y) * 6.283); sD.push(clamp(0.45 + 0.55 * (y - horizon) / span, 0.35, 1));
          }
          run = x; rc = c;
        }
      }
    }
  }

  function resize(width: number, height: number): void {
    W = Math.max(1, Math.floor(width) || 1);
    H = Math.max(1, Math.floor(height) || 1);
    rand = mkRng((Math.imul(W, 73856093) ^ Math.imul(H, 19349663) ^ 0x2f6b1d) >>> 0);
    sX = []; sY = []; sW = []; sC = []; sL = []; sP = []; sD = [];
    nX = []; nY = []; nL = []; nP = [];
    gardens = []; glints = []; palms = []; peds = []; birds = []; wfX = -1;
    back = mkCanvas(W, H); mid = mkCanvas(W, H); top = mkCanvas(W, H);
    const bg = back.getContext('2d'), mg = mid.getContext('2d'), tg = top.getContext('2d');
    if (!bg || !mg || !tg) { back = null; return; }
    bg.imageSmoothingEnabled = false; mg.imageSmoothingEnabled = false; tg.imageSmoothingEnabled = false;
    const a = W / H;
    promH = Math.max(1, Math.round(H * 0.05));
    canalH = Math.max(1, Math.round(H * (a < 0.9 ? 0.075 : 0.08)));
    promTop = H - promH;
    canalTop = Math.max(1, promTop - canalH - 1);
    horizon = clamp(Math.round(H * (a > 3 ? 0.36 : a < 0.9 ? 0.29 : 0.33)), 1, Math.max(1, canalTop - 1));
    sp = clamp(Math.round(Math.min(H * 0.12, W * 0.11)), 3, 15);
    const region = Math.max(1, canalTop - horizon);
    nRows = clamp(Math.floor(region / sp), 1, 9);
    hUnit = region / nRows;
    valleyAmp = hUnit * 1.1;
    rowY = []; rowF = [];
    for (let j = 0; j < nRows; j++) { rowY.push(horizon + Math.round(region * (j + 1) / nRows)); rowF.push(nRows > 1 ? 1 - j / (nRows - 1) : 0); }
    trackRow = nRows >= 3 ? Math.floor((nRows - 1) * 0.4) : 0;
    trackOn = H >= 24 && W >= 24;
    trackY = clamp(rowY[trackRow] - Math.round(hUnit * 1.25), 2, Math.max(2, H - 4));
    trainLen = clamp(Math.round(W * 0.07), 4, 22);
    paintSky(bg, a);
    paintLand(bg, a);
    for (let j = 0; j <= trackRow; j++) paintRow(bg, j);
    if (trackOn) paintTrack(bg);
    for (let j = trackRow + 1; j < nRows; j++) paintRow(mg, j);
    paintWater(mg);
    paintPromenade(tg);
    scan(back, 0); scan(mid, 1); scan(top, 2);
    if (H >= 40) {
      const np = Math.max(2, Math.round(W / 110));
      for (let i = 0; i < np; i++) {
        const x = i === 0 ? Math.round(W * 0.04) : i === 1 ? Math.round(W * 0.95) : Math.round(W * (0.2 + rand() * 0.6));
        palms.push(x, H - 1, Math.round(hUnit * (1.1 + rand() * 0.5)), rand() * 6.283);
      }
    }
    if (promH >= 3) for (let i = 0; i < clamp(Math.round(W / 45), 1, 10); i++) peds.push(rand() * W, (rand() < 0.5 ? -1 : 1) * (1.5 + rand() * 2.5), (rand() * PED_COLS.length) | 0);
    if (horizon >= 14) for (let i = 0; i < 3; i++) birds.push(horizon * (0.12 + rand() * 0.3), 3 + rand() * 4, rand() * 6.283, rand() * W);
  }

  function spawn(n: number, burst: boolean): void {
    const gc = gardens.length >> 1;
    if (gc === 0) return;
    for (let k = 0; k < n; k++) {
      let i = -1;
      for (let q = 0; q < MOTES; q++) if (mLife[q] <= 0) { i = q; break; }
      if (i < 0) return;
      const gi = ((frng() * gc) | 0) * 2;
      mX[i] = gardens[gi] + (frng() - 0.5) * 3; mY[i] = gardens[gi + 1];
      mVX[i] = (frng() - 0.5) * (burst ? 10 : 3); mVY[i] = -(burst ? 6 + frng() * 10 : 2 + frng() * 3);
      mMax[i] = mLife[i] = burst ? 0.8 + frng() * 0.8 : 1.5 + frng() * 2; mC[i] = frng() < 0.6 ? 0 : 1;
    }
  }

  function fx(ctx: CanvasRenderingContext2D, layer: number): void {
    const waveU = waveT * (W + H * 0.7 + 40) - 20, waveW = 5 + W * 0.035;
    let last = -1;
    for (let i = 0; i < sX.length; i++) {
      if (sL[i] !== layer) continue;
      const u = sX[i] + sW[i] * 0.5 + (H - sY[i]) * 0.7;
      const wave = waveT < 1.2 ? Math.max(0, 1 - Math.abs(u - waveU) / waveW) : 0;
      const idle = 0.5 + 0.5 * Math.sin(t * 1.3 + sP[i]);
      const a = (0.08 + 0.1 * idle + sb * 0.5 * (0.7 + 0.3 * idle) + wave * 0.9) * sD[i];
      if (a < 0.04) continue;
      if (last !== sC[i]) { ctx.fillStyle = sC[i] === 0 ? 'rgb(255,214,110)' : 'rgb(128,250,228)'; last = sC[i]; }
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillRect(sX[i], sY[i], sW[i], 1);
      if (wave > 0.5) { ctx.fillStyle = 'rgb(255,250,220)'; last = -1; ctx.globalAlpha = (wave - 0.5) * 1.2 * sD[i]; ctx.fillRect(sX[i], sY[i], sW[i], 1); }
    }
    for (let i = 0; i < nX.length; i++) {
      if (nL[i] !== layer) continue;
      const p = nP[i], tw = 0.5 + 0.5 * Math.sin(t * (1.7 + p * 3.3) + p * 50);
      const a = Math.pow(tw, 8) * 0.45 + st * 1.4 * tw * tw * (p > 0.3 ? 1 : 0.6);
      if (a < 0.06) continue;
      ctx.fillStyle = p < 0.45 ? 'rgb(150,255,236)' : p < 0.8 ? 'rgb(255,255,240)' : 'rgb(255,220,120)';
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillRect(nX[i], nY[i], 1, 1);
      if (a > 0.9) { ctx.globalAlpha = 0.35; ctx.fillRect(nX[i] - 1, nY[i], 3, 1); ctx.fillRect(nX[i], nY[i] - 1, 1, 3); }
    }
    ctx.globalAlpha = 1;
  }

  function drawPalm(ctx: CanvasRenderingContext2D, x: number, base: number, h: number, ph: number): void {
    const sway = Math.sin(t * 0.8 + ph) * (0.5 + se * 1.6) + Math.sin(t * 2.3 + ph * 2) * 0.2 * (1 + se);
    const lean = x < W / 2 ? 2 : -2;
    let tx = x, ty = base - h;
    for (let k = 0; k < h; k++) {
      const u = k / h, xx = x + Math.round(u * u * (lean + sway * 0.6));
      ctx.fillStyle = k % 2 ? 'rgb(110,76,50)' : 'rgb(132,94,60)';
      ctx.fillRect(xx, base - k, h > 16 && k < 3 ? 2 : 1, 1);
      tx = xx; ty = base - k;
    }
    const L = Math.max(3, Math.round(h * 0.35));
    const dirs = [-1, -0.2, 1, -0.2, -1, 0.45, 1, 0.45, -0.4, -0.9, 0.5, -0.8];
    for (let f = 0; f < 6; f++) {
      const dx = dirs[f * 2], dy = dirs[f * 2 + 1];
      for (let s = 1; s <= L; s++) {
        ctx.fillStyle = s > L * 0.6 ? 'rgb(98,170,76)' : 'rgb(28,96,58)';
        ctx.fillRect(tx + Math.round(dx * s + sway * s / L), ty + Math.round(dy * s + s * s / L * 0.7), 1, 1);
      }
    }
    ctx.fillStyle = 'rgb(200,150,70)';
    ctx.fillRect(tx, ty + 1, 1, 1);
  }

  function draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: { bass: number; treble: number; energy: number; beat: boolean; beatPhase?: number; beatCount?: number }, dt: number): void {
    const w = Math.max(1, Math.floor(width) || 1), h = Math.max(1, Math.floor(height) || 1);
    if (w !== W || h !== H || !back) resize(w, h);
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.imageSmoothingEnabled = false;
    if (!back || !mid || !top) { ctx.fillStyle = 'rgb(232,200,154)'; ctx.fillRect(0, 0, W, H); ctx.restore(); return; }
    const d = Math.min(0.05, Math.max(0, Number.isFinite(dt) ? dt : 0));
    t += d;
    const n01 = (v: number): number => (Number.isFinite(v) ? clamp(v, 0, 1) : 0);
    sb += (n01(audio.bass) - sb) * Math.min(1, d * 10);
    st += (n01(audio.treble) - st) * Math.min(1, d * 14);
    se += (n01(audio.energy) - se) * Math.min(1, d * 4);
    beatCool -= d;
    if (audio.beat && beatCool <= 0) { waveT = 0; beatCool = 0.15; spawn(10, true); }
    if (waveT < 9) waveT += d / 1.1;
    ambient += d * (0.8 + se * 2);
    while (ambient >= 1) { ambient -= 1; spawn(1, false); }

    ctx.drawImage(back, 0, 0);
    fx(ctx, 0);
    if (wfX >= 0) {
      const len = wfY1 - wfY0;
      ctx.fillStyle = 'rgb(246,255,250)';
      for (let k = 0; k < 3; k++) { ctx.globalAlpha = 0.8; ctx.fillRect(wfX, wfY0 + Math.floor((t * 10 + k * len / 3) % len), 1, 1); }
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = 'rgb(74,70,72)';
    for (let i = 0; i < birds.length; i += 4) {
      const span = W + 20, bx = Math.floor(((birds[i + 3] + t * birds[i + 1]) % span + span) % span) - 10;
      const by = Math.round(birds[i] + Math.sin(t * 0.7 + birds[i + 2]) * 2);
      const up = Math.floor(t * 5 + birds[i + 2]) % 2 === 0;
      ctx.fillRect(bx, by, 1, 1);
      ctx.fillRect(bx - 1, by - (up ? 1 : 0), 1, 1); ctx.fillRect(bx + 1, by - (up ? 1 : 0), 1, 1);
    }
    if (trackOn) {
      trainX += d * W * (0.03 + 0.08 * se);
      const span = W + trainLen * 2 + 10;
      const x0 = Math.floor(((trainX % span) + span) % span) - trainLen - 5, y = trackY - 2;
      const car = trainLen >= 12 ? 5 : trainLen;
      for (let cx = x0; cx < x0 + trainLen; cx += car + 1) {
        const cw = Math.min(car, x0 + trainLen - cx);
        ctx.fillStyle = 'rgb(236,226,200)'; ctx.fillRect(cx, y - 1, cw, 3);
        ctx.fillStyle = 'rgb(196,120,62)'; ctx.fillRect(cx + 1, y - 1, Math.max(1, cw - 2), 1);
        ctx.fillStyle = 'rgb(40,120,130)'; ctx.fillRect(cx, y, cw, 1);
        ctx.fillStyle = 'rgb(255,220,130)';
        for (let k = cx + 1; k < cx + cw - 1; k += 2) ctx.fillRect(k, y, 1, 1);
      }
      ctx.fillStyle = 'rgb(240,190,80)'; ctx.fillRect(x0 + trainLen - 1, y, 1, 2);
      ctx.globalAlpha = 0.5 + 0.3 * se; ctx.fillStyle = 'rgb(255,244,200)'; ctx.fillRect(x0 + trainLen, y + 1, 2, 1); ctx.globalAlpha = 1;
    }
    ctx.drawImage(mid, 0, 0);
    fx(ctx, 1);
    const gs = 2 + se * 10;
    for (let i = 0; i < glints.length; i += 3) {
      const ph = glints[i + 2];
      const b = 0.5 + 0.5 * Math.sin(t * (1.2 + ph * 0.3) + ph * 9) + se * 0.35;
      if (b < 0.78) continue;
      const gx = Math.floor(((glints[i] + t * gs * (ph > 3.14 ? 1 : -1)) % W + W) % W);
      ctx.globalAlpha = Math.min(1, (b - 0.78) * 4);
      ctx.fillStyle = ph > 4 ? 'rgb(190,255,240)' : 'rgb(255,244,208)';
      ctx.fillRect(gx, glints[i + 1], b > 0.98 ? 3 : 2, 1);
    }
    ctx.globalAlpha = 1;
    if (canalH >= 4 && W >= 30) {
      boatX += d * (2 + se * 4);
      const span = W + 20, bx = Math.floor(boatX % span) - 10, by = canalTop + 1 + Math.floor(canalH * 0.45);
      ctx.fillStyle = 'rgb(96,56,36)'; ctx.fillRect(bx, by, 6, 1);
      ctx.fillStyle = 'rgb(64,36,28)'; ctx.fillRect(bx + 1, by + 1, 4, 1);
      ctx.fillStyle = 'rgb(220,200,160)'; ctx.fillRect(bx + 1, by - 3, 1, 3);
      ctx.fillStyle = 'rgb(70,40,30)'; ctx.fillRect(bx + 3, by - 2, 1, 1);
      ctx.fillStyle = 'rgb(40,150,140)'; ctx.fillRect(bx + 3, by - 1, 1, 1);
      ctx.globalAlpha = 0.7 + 0.3 * sb; ctx.fillStyle = 'rgb(255,214,110)'; ctx.fillRect(bx + 5, by - 1, 1, 1);
      ctx.globalAlpha = 0.35; ctx.fillRect(bx + 5, by + 2, 1, 1);
      ctx.fillStyle = 'rgb(220,250,236)'; ctx.globalAlpha = 0.5; ctx.fillRect(bx - 2, by + 1, 2, 1);
      ctx.globalAlpha = 1;
    }
    ctx.drawImage(top, 0, 0);
    fx(ctx, 2);
    for (let i = 0; i < palms.length; i += 4) drawPalm(ctx, palms[i], palms[i + 1], palms[i + 2], palms[i + 3]);
    for (let i = 0; i < peds.length; i += 3) {
      const x = Math.floor(((peds[i] + t * peds[i + 1]) % W + W) % W), fy = H - 2;
      const step = Math.floor(t * 4 + i) % 2;
      ctx.fillStyle = 'rgb(70,40,30)'; ctx.fillRect(x, fy - 2, 1, 1); ctx.fillRect(x + (step ? 1 : -1) * (peds[i + 1] > 0 ? 0 : 0), fy, 1, 1);
      ctx.fillStyle = PED_COLS[peds[i + 2]]; ctx.fillRect(x, fy - 1, 1, 1);
      if (step) { ctx.fillStyle = 'rgb(70,40,30)'; ctx.fillRect(x + (peds[i + 1] > 0 ? 1 : -1), fy, 1, 1); }
    }
    for (let i = 0; i < MOTES; i++) {
      if (mLife[i] <= 0) continue;
      mLife[i] -= d;
      mX[i] += mVX[i] * d + Math.sin(t * 2 + i) * d * 1.5;
      mY[i] += mVY[i] * d;
      mVY[i] *= 1 - d * 0.6;
      if (mLife[i] <= 0) continue;
      ctx.globalAlpha = clamp(mLife[i] / mMax[i], 0, 1);
      ctx.fillStyle = mC[i] === 0 ? 'rgb(255,226,130)' : 'rgb(170,255,220)';
      ctx.fillRect(Math.round(mX[i]), Math.round(mY[i]), 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  return { resize, draw };
}