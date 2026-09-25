type AudioFrame = { bass: number; treble: number; energy: number; beat: boolean; beatPhase?: number; beatCount?: number };
type Ctx = CanvasRenderingContext2D;
type Surf = { c: HTMLCanvasElement; g: Ctx };
type Rnd = () => number;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bay = (x: number, y: number): number => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
function pick<T>(r: Rnd, a: readonly T[]): T { return a[Math.floor(r() * a.length) % a.length]; }
function rng(seed: number): Rnd {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
function mk(w: number, h: number): Surf {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w); c.height = Math.max(1, h);
  const g = c.getContext('2d') as Ctx;
  g.imageSmoothingEnabled = false;
  return { c, g };
}

const SKY = ['#0a0718', '#100b24', '#171031', '#20143c', '#2b1946', '#382050', '#472858', '#56305e'];
const WATER = ['#171f3a', '#111a33', '#0d142a', '#0a0f21'];
const BRICK: readonly (readonly [string, string, string])[] = [
  ['#43232f', '#381c28', '#5a3038'], ['#4c2a2c', '#3e2024', '#66383a'], ['#362331', '#2c1a28', '#4a3242'],
  ['#3e2c3c', '#322232', '#543c50'], ['#2f2a3a', '#26202f', '#433c52'], ['#522f2a', '#432420', '#6a4034']];
const WARM = ['#ffb45a', '#ff9d4e', '#ffcf7a', '#ff8563', '#ffe0a0', '#f07a52'];
const GLASS = ['#ffd08a', '#ffc070', '#86dccb', '#ffb3cf', '#ffe4ac'];
const TV = ['#5a86d0', '#86b4f0', '#3e5ea8', '#a8d0ff'];
const CARC = ['#2c2438', '#1f2c3a', '#3a2632', '#2a2f2a', '#40343a'];
const DK = '#1b1321';

export function createParallaxCityScene(): {
  resize(width: number, height: number): void;
  draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioFrame, dt: number): void;
} {
  let W = 0, H = 0, SW = 132, gy = 1, wt = 1, trackY = 2, railTop = 1, moonR = 2, moonCy = 1, carLen = 12, carH = 3;
  let sky = mk(1, 1), moon = mk(1, 1), l1 = mk(1, 1), l2 = mk(1, 1), l3 = mk(1, 1), glow = mk(1, 1);
  let refl = mk(1, 1), track = mk(1, 1), road = mk(1, 1), fore = mk(1, 1);
  const lampX = new Int16Array(48), lampY = new Int16Array(48); let lampN = 0;
  const tvX = new Int16Array(24), tvY = new Int16Array(24); let tvN = 0;
  const RMAX = 360, rx = new Float32Array(RMAX), ry = new Float32Array(RMAX), rv = new Float32Array(RMAX), rl = new Float32Array(RMAX);
  const rz = new Uint8Array(RMAX); let rN = 0;
  const PM = 32, px = new Float32Array(PM), py = new Float32Array(PM), pa = new Float32Array(PM), pm = new Float32Array(PM);
  const GM = 24, gxA = new Float32Array(GM), gyA = new Float32Array(GM), glA = new Float32Array(GM);
  const WM = 4, wx = new Float32Array(WM), wl = new Float32Array(WM);
  const CM = 6, cx = new Float32Array(CM), cv = new Float32Array(CM), cl = new Uint8Array(CM), cc = new Uint8Array(CM);
  let pNext = 0, gNext = 0, gAcc = 0, pAcc = 0;
  let camX = 0, moonDrift = 0, time = 0, bassE = 0, trebE = 0, enE = 0, beatE = 0, prevBeat = false, trX = 0, trWait = 0;
  let pr: Rnd = rng(1);

  const R = (g: Ctx, x: number, y: number, w: number, h: number, col: string): void => {
    if (w <= 0 || h <= 0) return;
    const xi = ((Math.floor(x) % SW) + SW) % SW, yi = Math.floor(y), wi = Math.ceil(w), hi = Math.ceil(h);
    if (col === '') { g.clearRect(xi, yi, wi, hi); if (xi + wi > SW) g.clearRect(xi - SW, yi, wi, hi); return; }
    g.fillStyle = col; g.fillRect(xi, yi, wi, hi);
    if (xi + wi > SW) g.fillRect(xi - SW, yi, wi, hi);
  };
  const blit = (ctx: Ctx, src: HTMLCanvasElement, off: number, x0: number, x1: number, sy: number, h: number, dy: number): void => {
    if (h <= 0) return;
    let x = Math.max(0, x0 | 0); const e = Math.min(W, x1 | 0);
    while (x < e) {
      const s = (((off + x) % SW) + SW) % SW, w = Math.min(e - x, SW - s);
      ctx.drawImage(src, s, sy, w, h, x, dy, w, h);
      x += w;
    }
  };
  const bands = (g: Ctx, y0: number, y1: number, cols: readonly string[]): void => {
    const n = y1 - y0;
    for (let y = y0; y < y1; y++) {
      const t = ((y - y0) / Math.max(1, n - 1)) * (cols.length - 1), a = Math.min(cols.length - 1, Math.floor(t)), f = t - a;
      g.fillStyle = cols[a]; g.fillRect(0, y, W, 1);
      if (f > 0.05 && a + 1 < cols.length) { g.fillStyle = cols[a + 1]; for (let x = 0; x < W; x++) if (bay(x, y) < f) g.fillRect(x, y, 1, 1); }
    }
  };
  const mist = (g: Ctx, y0: number, y1: number, col: string, dens: number): void => {
    g.fillStyle = col;
    for (let y = Math.max(0, y0); y < y1; y++) {
      const d = ((y - y0) / Math.max(1, y1 - y0)) * dens;
      for (let x = 0; x < SW; x++) if (bay(x, y) < d) g.fillRect(x, y, 1, 1);
    }
  };
  const skyline = (g: Ctx, r: Rnd, h0: number, h1: number, w0: number, w1: number, body: string, lit: string, side: string, wins: readonly string[], winP: number, gapP: number): void => {
    let x = 0;
    while (x < SW) {
      const w = w0 + Math.floor(r() * (w1 - w0 + 1)), h = Math.max(2, Math.round(H * (h0 + r() * (h1 - h0))));
      const top = gy - h, m = x + (w >> 1), k = Math.floor(r() * 6);
      R(g, x, top, w, h, body);
      if (k === 0) { const s = 2 + Math.floor(r() * (2 + H * 0.07)); R(g, m, top - s, 1, s, body); R(g, m - 1, top - 2, 3, 2, body); }
      else if (k === 1 && w > 7) { R(g, x + 1, top - 2, w - 2, 2, body); R(g, x + 3, top - 4, w - 6, 2, body); }
      else if (k === 2) { const rr = Math.max(1, (w >> 1) - 2); for (let i = 0; i < rr; i++) { const hw = Math.round(Math.sqrt(rr * rr - i * i)); R(g, m - hw, top - 1 - i, hw * 2 + 1, 1, body); } }
      else if (k === 3) for (let i = 0; i < w >> 1; i++) R(g, x + i, top - 1 - i, w - 2 * i, 1, body);
      else if (k === 4) { R(g, x + 1, top - 3, 2, 3, body); R(g, x + w - 3, top - 2, 2, 2, body); }
      const sd = Math.max(1, w >> 2);
      R(g, x + w - sd, top, sd, h, side); R(g, x, top, 1, h, lit);
      for (let y = top + 2; y < gy - 2; y += 3) for (let xx = x + 2; xx < x + w - sd - 1; xx += 2) if (r() < winP) R(g, xx, y, 1, 1, pick(r, wins));
      x += r() < gapP ? w + 2 + Math.floor(r() * 8) : w - Math.floor(r() * 3);
    }
  };

  const buildMid = (r: Rnd): void => {
    const g = l3.g, gg = glow.g, shopH = Math.max(3, Math.round(H * 0.075));
    const glyph = (gx: number, gyy: number, base: string, hot: string): void => {
      const bits = Math.floor(r() * 512) | 16 | (r() < 0.5 ? 1 : 256);
      for (let b = 0; b < 9; b++) if ((bits >> b) & 1) { R(g, gx + (b % 3), gyy + Math.floor(b / 3), 1, 1, base); R(gg, gx + (b % 3), gyy + Math.floor(b / 3), 1, 1, hot); }
    };
    tvN = 0;
    let x = 0;
    while (x < SW) {
      const w = 14 + Math.floor(r() * 26), h = Math.max(shopH + 4, Math.round(H * (0.16 + r() * 0.22))), top = gy - h;
      const [body, mortar, hi] = pick(r, BRICK);
      if (r() < 0.45) {
        const bw = Math.max(4, Math.floor(w * (0.35 + r() * 0.4))), bh = h + 3 + Math.floor(r() * H * 0.14), bx = x + Math.floor(r() * (w - bw));
        R(gg, bx, gy - bh, bw, bh, ''); R(g, bx, gy - bh, bw, bh, '#24192c'); R(g, bx, gy - bh, 1, bh, '#33263e'); R(g, bx - 1, gy - bh, bw + 2, 1, '#33263e');
        for (let yy = gy - bh + 2; yy < top - 1; yy += 3) for (let xx = bx + 2; xx < bx + bw - 1; xx += 3) if (r() < 0.3) R(g, xx, yy, 1, 1, r() < 0.5 ? '#a8683e' : '#5e4460');
      }
      R(gg, x, top, w, h, ''); R(g, x, top, w, h, body);
      for (let yy = top + 2; yy < gy - shopH; yy++) {
        const m = (yy - top) % 3;
        if (m === 0) R(g, x, yy, w, 1, mortar);
        else if (m === 1) for (let jx = x + (((yy - top) / 3) & 1) * 2; jx < x + w; jx += 4) R(g, jx, yy, 1, 1, mortar);
      }
      for (let i = (w * h) >> 5; i > 0; i--) R(g, x + Math.floor(r() * w), top + Math.floor(r() * h), 1, 1, r() < 0.5 ? hi : DK);
      R(g, x, top, 1, h, hi); R(g, x + w - 1, top, 1, h, DK);
      const fh = 4 + Math.floor(r() * 2), ww = r() < 0.35 ? 3 : 2, wh = fh - 2, sp = ww + 2 + Math.floor(r() * 2);
      const cols = Math.max(1, Math.floor((w - 4 + sp - ww) / sp)), x0 = x + Math.floor((w - (cols * sp - (sp - ww))) / 2);
      const litP = 0.2 + r() * 0.5, sill = r() < 0.5, fe = w > 16 && r() < 0.45 ? (r() < 0.5 ? 0 : cols - 1) : -1;
      let flip = 0;
      for (let fy = top + 3; fy + wh + 1 < gy - shopH - 1; fy += fh) {
        for (let c = 0; c < cols; c++) {
          const wxp = x0 + c * sp;
          if (r() < litP) {
            R(g, wxp, fy, ww, wh, pick(r, WARM));
            if (r() < 0.35) R(g, wxp + Math.floor(r() * ww), fy + wh - 1, 1, 1, '#7a3e2c');
            R(gg, wxp, fy, ww, wh, '#fff1cc'); R(gg, wxp, fy + wh, ww, 1, '#8a5234');
          } else {
            R(g, wxp, fy, ww, wh, '#15101d'); R(g, wxp, fy, ww, 1, '#261c30');
            if (r() < 0.55) R(gg, wxp, fy, ww, wh, r() < 0.5 ? '#f09a58' : '#e0784e');
            else if (tvN < tvX.length && r() < 0.25) { tvX[tvN] = ((wxp % SW) + SW) % SW; tvY[tvN] = fy; tvN++; }
          }
          if (sill) R(g, wxp, fy + wh, ww, 1, hi);
        }
        if (fe >= 0) {
          const fx = x0 + fe * sp - 1, fw = ww + 3, fc = '#110c16';
          R(g, fx, fy + wh + 1, fw, 1, fc); R(g, fx, fy + wh, 1, 1, fc); R(g, fx + fw - 1, fy + wh, 1, 1, fc);
          for (let i = 1; i < fh; i++) { const o = Math.floor((i * (fw - 1)) / fh); R(g, flip ? fx + fw - 1 - o : fx + o, fy + wh + 1 + i, 1, 1, fc); }
          flip ^= 1;
        }
      }
      const rc = '#1c1422';
      if (r() < 0.5) { for (let i = 0; i < w; i += 3) R(g, x + i, top - 1, 2, 1, body); } else R(g, x - 1, top, w + 2, 1, hi);
      if (w >= 13 && r() < 0.55) {
        const tw = 4 + Math.floor(r() * 3), th = 3 + Math.floor(r() * 3), tx = x + 2 + Math.floor(r() * (w - tw - 3)), ty = top - 2 - th;
        R(g, tx, top - 2, 1, 2, rc); R(g, tx + tw - 1, top - 2, 1, 2, rc); R(g, tx, top - 2, tw, 1, rc);
        R(g, tx, ty, tw, th, '#2c1e2a'); for (let i = 1; i < tw; i += 2) R(g, tx + i, ty, 1, th, '#35242f');
        R(g, tx, ty + 1, tw, 1, rc); R(g, tx + 1, ty - 1, tw - 2, 1, rc); R(g, tx + (tw >> 1), ty - 2, 1, 1, rc);
      }
      if (r() < 0.5) {
        const ax = x + 1 + Math.floor(r() * (w - 2)), ah = 3 + Math.floor(r() * (2 + H * 0.1));
        R(g, ax, top - ah, 1, ah, rc); R(g, ax - 1, top - ah + 1, 3, 1, rc); if (ah > 5) R(g, ax - 2, top - ah + 3, 5, 1, rc);
        R(g, ax, top - ah, 1, 1, '#a03a3a'); R(gg, ax, top - ah, 1, 1, '#ff5a5a');
      }
      if (r() < 0.4) { const bx = x + w - 7 + Math.floor(r() * 3); R(g, bx, top - 3, 4, 3, rc); R(g, bx + 1, top - 2, 1, 2, '#4a3040'); }
      if (r() < 0.35) { R(g, x + 2, top - 3, 2, 3, rc); R(g, x + 3, top - 4, 1, 1, rc); }
      const sy = gy - shopH, dw = 2 + (shopH > 6 ? 1 : 0), gx0 = x + 2, gw = w - 5 - dw, gh = shopH - 3;
      R(g, x, sy, w, shopH, '#1a111c');
      R(g, gx0, sy + 2, gw, gh, pick(r, GLASS)); R(gg, gx0, sy + 2, gw, gh, '#fff6e2');
      if (gh > 2) { R(g, gx0, sy + 1 + gh, gw, 1, '#6a4038'); for (let i = 0; i < gw; i += 2) if (r() < 0.5) R(g, gx0 + i, sy + gh, 1, 1, pick(r, ['#c85a4a', '#5a8a7a', '#e0a060'])); }
      for (let i = 4 + Math.floor(r() * 2); i < gw; i += 5) R(g, gx0 + i, sy + 2, 1, gh, '#2a1c28');
      R(g, x + w - 2 - dw, sy + 2, dw, shopH - 2, '#0c0810'); R(g, x + w - 2 - dw, sy + 1, dw, 1, '#ffd08a');
      if (shopH >= 4 && r() < 0.6) {
        const [a, b] = r() < 0.7 ? ['#8c2d52', '#d8c6ae'] : ['#2b6a6c', '#cfd8c6'];
        for (let i = 0; i < w - 2; i++) { const c = (i >> 1) & 1 ? a : b; R(g, x + 1 + i, sy, 1, 1, c); if ((i & 1) === 0) R(g, x + 1 + i, sy + 1, 1, 1, c); }
      }
      if (r() < 0.72) {
        const n = 1 + Math.floor(r() * Math.min(3, Math.max(1, (w - 6) / 4))), sw = n * 4 + 1, sx = x + 2 + Math.floor(r() * Math.max(1, w - sw - 3)), syy = sy - 6;
        const teal = r() < 0.2, base = teal ? '#2f8f8a' : '#b8387c', hot = teal ? '#a8fff0' : '#ff86c8';
        R(g, sx, syy, sw, 5, '#12080f'); R(gg, sx - 1, syy - 1, sw + 2, 7, teal ? '#1c4a4c' : '#5a1a44'); R(gg, sx, syy, sw, 5, '#12080f');
        for (let k = 0; k < n; k++) glyph(sx + 1 + k * 4, syy + 1, base, hot);
      }
      if (h > shopH + 18 && r() < 0.35) {
        const n = 2 + Math.floor(r() * 2), bx = x + w - 3, bh = n * 4 + 1, by = sy - 3 - bh;
        R(g, bx, by, 5, bh, '#12080f'); R(gg, bx - 1, by - 1, 7, bh + 2, '#5a1a44'); R(gg, bx, by, 5, bh, '#12080f'); R(g, bx + 1, by + bh, 1, 3, DK);
        for (let k = 0; k < n; k++) glyph(bx + 1, by + 1 + k * 4, '#b8387c', '#ff86c8');
      }
      const gap = r() < 0.22 ? 2 + Math.floor(r() * 4) : 0;
      if (gap) { R(g, x + w, sy - 3, gap, shopH + 3, '#130d19'); R(g, x + w, gy - 1, gap, 1, '#241a2c'); }
      x += w + gap;
    }
  };

  const resetDrop = (i: number, any: boolean): void => {
    const z = rz[i];
    rx[i] = pr() * (W + 8); ry[i] = any ? pr() * H : -pr() * H * 0.3 - 4;
    rv[i] = (z === 0 ? 1 : z === 1 ? 1.5 : 2.3) * Math.max(40, H) * (0.85 + pr() * 0.3);
    rl[i] = z === 2 ? wt + pr() * (H - wt) : z === 1 ? gy + pr() * (wt - gy + 1) : gy * (0.5 + pr() * 0.5);
  };
  const ripple = (x: number, y: number, m: number): void => { const i = pNext; pNext = (pNext + 1) % PM; px[i] = x; py[i] = y; pa[i] = 0; pm[i] = m; };

  const resize = (width: number, height: number): void => {
    W = Math.max(1, Math.floor(width) || 1); H = Math.max(1, Math.floor(height) || 1);
    SW = Math.ceil(Math.max(128, W * 1.5) / 12) * 12;
    gy = clamp(Math.round(H * (H > W ? 0.7 : 0.66)), 1, H);
    wt = Math.min(H, gy + Math.max(2, Math.round(H * 0.08)));
    const rh = wt - gy;
    sky = mk(W, H); bands(sky.g, 0, gy, SKY); bands(sky.g, wt, H, WATER);
    const rs = rng(4242);
    for (let i = Math.floor((W * gy) / 260); i > 0; i--) { sky.g.fillStyle = rs() < 0.3 ? '#c8b8e0' : '#6e5e92'; sky.g.fillRect(Math.floor(rs() * W), Math.floor(rs() * gy * 0.55), 1, 1); }
    for (let i = Math.floor((W * (H - wt)) / 40); i > 0; i--) { sky.g.fillStyle = '#1c2a48'; sky.g.fillRect(Math.floor(rs() * W), wt + Math.floor(rs() * (H - wt)), 2 + Math.floor(rs() * 4), 1); }
    moonR = clamp(Math.round(Math.min(W, H) * 0.15), 2, 24); moonCy = Math.max(moonR + 1, Math.round(gy - H * 0.5));
    const c = moonR + 4, D = c * 2 + 1; moon = mk(D, D); const mg = moon.g;
    for (let y = -c; y <= c; y++) for (let x = -c; x <= c; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d > moonR + 0.5 && d < moonR + 4.2 && ((x + y) & 1) === 0 && (d < moonR + 2.2 || ((x & 1) === 0 && (y & 1) === 0))) { mg.fillStyle = d < moonR + 2.2 ? '#6a4a7c' : '#4e3566'; mg.fillRect(x + c, y + c, 1, 1); }
    }
    for (let y = -moonR; y <= moonR; y++) {
      const hw = Math.round(Math.sqrt(moonR * moonR - y * y)), sh = Math.max(1, Math.round(hw * 0.35));
      mg.fillStyle = '#f1e2c4'; mg.fillRect(c - hw, c + y, hw * 2 + 1, 1);
      mg.fillStyle = '#d9c4a6'; mg.fillRect(c + hw - sh + 1, c + y, sh, 1);
    }
    const mr = rng(91);
    for (let i = 3 + (moonR >> 2); i > 0; i--) {
      const a = mr() * 6.283, dd = mr() * moonR * 0.55, cr = 1 + Math.floor((mr() * moonR) / 7);
      const qx = Math.round(c + Math.cos(a) * dd), qy = Math.round(c + Math.sin(a) * dd);
      mg.fillStyle = '#d0ba9c'; mg.fillRect(qx - cr + 1, qy - cr + 1, cr * 2 - 1 || 1, cr * 2 - 1 || 1);
      mg.fillStyle = '#faf0da'; mg.fillRect(qx - cr + 1, qy + cr, Math.max(1, cr * 2 - 1), 1);
    }
    l1 = mk(SW, gy); const r1 = rng(1101);
    for (let i = Math.ceil(SW / 40); i > 0; i--) {
      const cw = 16 + Math.floor(r1() * 50), cy = Math.floor(r1() * gy * 0.45), cx0 = Math.floor(r1() * SW);
      for (let j = 0; j < 3; j++) for (let k = j * 2 + (j & 1); k < cw - j * 3; k += 2) R(l1.g, cx0 + k, cy + j, 1, 1, j === 1 ? '#2f2050' : '#281a44');
    }
    skyline(l1.g, r1, 0.14, 0.4, 6, 20, '#34264f', '#46385f', '#2d2146', ['#6a4e7e', '#8a6478'], 0.08, 0.04);
    mist(l1.g, gy - Math.round(H * 0.14), gy, '#4a3a6c', 0.75);
    l2 = mk(SW, gy);
    skyline(l2.g, rng(2202), 0.12, 0.36, 8, 22, '#231a38', '#2f4058', '#1b1430', ['#c08048', '#6e5890', '#d8964e'], 0.12, 0.35);
    mist(l2.g, gy - Math.round(H * 0.1), gy, '#3a2e5c', 0.5);
    l3 = mk(SW, gy); glow = mk(SW, gy); buildMid(rng(3303));
    refl = mk(SW, gy); const rg2 = refl.g;
    rg2.drawImage(l3.c, 0, 0); rg2.globalAlpha = 0.5; rg2.drawImage(glow.c, 0, 0); rg2.globalAlpha = 1;
    rg2.globalCompositeOperation = 'source-atop'; rg2.fillStyle = 'rgba(10,20,44,0.5)'; rg2.fillRect(0, 0, SW, gy); rg2.globalCompositeOperation = 'source-over';
    const r4 = rng(4404); trackY = clamp(Math.round(gy - H * 0.21), 2, Math.max(2, gy - 3));
    track = mk(SW, gy); const tg = track.g, bh = Math.max(2, Math.round(H * 0.03)), th = bh + 2, ty2 = trackY + bh;
    R(tg, 0, trackY - 1, SW, 1, '#433b58'); for (let x = 0; x < SW; x += 4) R(tg, x, trackY - 1, 1, 1, '#5a5070');
    R(tg, 0, trackY, SW, bh, '#1c1727'); R(tg, 0, trackY, SW, 1, '#2d2640'); tg.fillStyle = '#211b30';
    for (let y = 0; y < th; y++) for (let x = 0; x < SW; x++) if ((x + y) % 6 === 0 || (x - y + 6000) % 6 === 0) tg.fillRect(x, ty2 + y, 1, 1);
    R(tg, 0, ty2 + th, SW, 1, '#1c1727');
    for (let p = 6 + Math.floor(r4() * 12); p < SW - 16; p += 34 + Math.floor(r4() * 30)) {
      const ph = gy - ty2 - th - 1;
      R(tg, p, ty2 + th + 1, 3, ph, '#16121e'); R(tg, p, ty2 + th + 1, 1, ph, '#2a2440'); R(tg, p - 1, ty2 + th + 1, 5, 1, '#16121e');
      if (r4() < 0.4) R(tg, p + 1, ty2 + th + 3, 1, 1, '#d04646');
    }
    carLen = Math.max(12, Math.round(H * 0.28)); carH = clamp(Math.round(H * 0.065), 3, 12);
    const r5 = rng(5505); road = mk(SW, Math.max(1, rh)); const og = road.g;
    R(og, 0, 0, SW, rh, '#16121e'); R(og, 0, 0, SW, 1, '#2c2436'); if (rh > 2) R(og, 0, 1, SW, 1, '#1d1826');
    if (rh >= 5) for (let x = 0; x < SW; x += 12) R(og, x, rh >> 1, 5, 1, '#383142');
    for (let i = (SW * rh) >> 3; i > 0 && rh > 1; i--) R(og, Math.floor(r5() * SW), 1 + Math.floor(r5() * (rh - 1)), 1 + Math.floor(r5() * 3), 1, r5() < 0.5 ? '#221d2e' : '#2a2438');
    fore = mk(SW, H); const fg = fore.g, FC = '#0a0810';
    const railH = Math.max(2, Math.round(rh * 0.45)); railTop = Math.max(0, wt - railH);
    R(fg, 0, wt - 1, SW, 1, '#0d0a14'); R(fg, 0, railTop, SW, 1, '#231e2e'); if (railH > 3) R(fg, 0, railTop + (railH >> 1), SW, 1, '#15111d');
    for (let x = 0; x < SW; x += 6) { R(fg, x, railTop, 1, railH, FC); if (r5() < 0.5) R(fg, x + 2, railTop, 1, 1, '#4a4258'); }
    lampN = 0; const poles: number[] = [];
    const pTop = Math.max(1, wt - Math.max(4, Math.round(H * 0.56))), lh = Math.max(3, Math.round(H * 0.27));
    for (let p = 4 + Math.floor(r5() * 10); p < SW - 10; p += 22 + Math.floor(r5() * 22)) {
      if (r5() < 0.32) {
        R(fg, p, pTop, 2, wt - pTop, FC); R(fg, p - 3, pTop + 2, 8, 1, FC); R(fg, p - 2, pTop + 5, 6, 1, FC);
        R(fg, p - 3, pTop + 1, 1, 1, '#3a3446'); R(fg, p + 4, pTop + 1, 1, 1, '#3a3446'); R(fg, p + 2, pTop + 8, 2, 3, '#120e18');
        poles.push(p);
      } else {
        const top = Math.max(1, wt - lh), hx = p + 3;
        R(fg, p, top, 1, wt - top, FC); R(fg, p - 1, wt - 3, 3, 2, FC); R(fg, p, top, 4, 1, FC); R(fg, hx - 1, top + 1, 3, 1, FC);
        for (let dy = -3; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const q = dx * dx + dy * dy; if (((dx + dy) & 1) === 0 && q <= 12 && q > 2) R(fg, hx + dx, top + 2 + dy, 1, 1, '#3e2c34'); }
        R(fg, hx - 1, top + 2, 3, 1, '#ffe0a0');
        for (let i = -5; i <= 5; i += 2) { R(fg, hx + i, wt - 2, 1, 1, '#3c2c2a'); if (Math.abs(i) < 4) R(fg, hx + i + 1, wt - 3, 1, 1, '#33262a'); }
        if (lampN < lampX.length) { lampX[lampN] = ((hx % SW) + SW) % SW; lampY[lampN] = top + 2; lampN++; }
      }
    }
    for (let i = 0; i < poles.length; i++) {
      const a = poles[i], b = i + 1 < poles.length ? poles[i + 1] : poles[0] + SW, sag = 2 + (b - a) * 0.07;
      for (let x = a; x <= b; x++) { const t = (x - a) / Math.max(1, b - a), d = Math.round(sag * 4 * t * (1 - t)); R(fg, x - 3, pTop + 1 + d, 1, 1, '#07060b'); R(fg, x + 4, pTop + 2 + d, 1, 1, '#07060b'); }
    }
    pr = rng(0xc17e5 ^ (W * 7919) ^ (H * 104729));
    rN = Math.min(RMAX, Math.max(6, Math.floor((W * H) / 80)));
    for (let i = 0; i < rN; i++) { const q = pr(); rz[i] = q < 0.45 ? 0 : q < 0.8 ? 1 : 2; resetDrop(i, true); }
    for (let i = 0; i < PM; i++) pm[i] = 0;
    for (let i = 0; i < GM; i++) glA[i] = 0;
    for (let i = 0; i < WM; i++) wl[i] = 0;
    for (let i = 0; i < CM; i++) { cl[i] = i & 1; cx[i] = pr() * W; cv[i] = 14 + pr() * 22; cc[i] = Math.floor(pr() * CARC.length); }
    trX = W * 0.35; trWait = 0; camX = 0; moonDrift = 0;
  };

  const draw = (ctx: Ctx, width: number, height: number, audio: AudioFrame, dtIn: number): void => {
    const cw = Math.max(1, Math.floor(width) || 1), ch = Math.max(1, Math.floor(height) || 1);
    if (cw !== W || ch !== H) resize(cw, ch);
    const dt = clamp(Number.isFinite(dtIn) ? dtIn : 0, 0, 0.05), k = Math.min(1, dt * 6);
    time += dt;
    bassE += (clamp(audio.bass || 0, 0, 1) - bassE) * k; trebE += (clamp(audio.treble || 0, 0, 1) - trebE) * k;
    enE += (clamp(audio.energy || 0, 0, 1) - enE) * Math.min(1, dt * 1.5);
    beatE *= Math.exp(-dt * 2.6);
    if (audio.beat && !prevBeat) {
      beatE = 1; let s = 0;
      for (let i = 1; i < WM; i++) if (wl[i] < wl[s]) s = i;
      wx[s] = -W * 0.15; wl[s] = 1;
      if (H > wt) for (let i = 0; i < 4; i++) ripple(pr() * W, wt + 1 + pr() * (H - wt - 1), 4 + pr() * 4);
    }
    prevBeat = audio.beat;
    const camSpeed = 11 + enE * 12;
    camX = (camX + camSpeed * dt) % (SW * 100);
    moonDrift = (moonDrift + camSpeed * dt * 0.02) % (W + moon.c.width);
    const o1 = Math.floor(camX * 0.06) % SW, o2 = Math.floor(camX * 0.16) % SW, o3 = Math.floor(camX * 0.36) % SW;
    const o4 = Math.floor(camX * 0.6) % SW, o5 = Math.floor(camX) % SW;
    ctx.save();
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sky.c, 0, 0);
    const D = moon.c.width, span = W + D, mpos = ((((W * 0.72 + D / 2 - moonDrift) % span) + span) % span) - D;
    const mx = Math.floor(mpos), mcx = mx + (D >> 1);
    ctx.drawImage(moon.c, mx, moonCy - (D >> 1));
    ctx.fillStyle = '#6a5a88';
    for (let y = wt + 1; y < H; y += 2) {
      const hw = Math.round((1 + moonR * 0.5) * (0.3 + 0.35 * (Math.sin(y * 3.1 + time * 2) + 1))), wob = Math.round(Math.sin(y * 0.9 + time * 3) * (0.5 + bassE));
      ctx.fillRect(mcx - hw + wob, y, hw * 2, 1);
    }
    blit(ctx, l1.c, o1, 0, W, 0, gy, 0); blit(ctx, l2.c, o2, 0, W, 0, gy, 0); blit(ctx, l3.c, o3, 0, W, 0, gy, 0);
    const amb = Math.min(1, Math.round((0.12 + bassE * 0.4 + beatE * 0.18) * 8) / 8);
    if (amb > 0) { ctx.globalAlpha = amb; blit(ctx, glow.c, o3, 0, W, 0, gy, 0); }
    const hw = W * 0.1 + 6;
    for (let i = 0; i < WM; i++) {
      if (wl[i] <= 0) continue;
      wx[i] += (W * 0.7 + 30) * dt; wl[i] -= dt * 0.55;
      if (wx[i] - hw > W) { wl[i] = 0; continue; }
      const a = Math.round(Math.max(0, wl[i]) * 8) / 8;
      if (a <= 0) continue;
      ctx.globalAlpha = a * 0.55; blit(ctx, glow.c, o3, wx[i] - hw, wx[i] + hw, 0, gy, 0);
      ctx.globalAlpha = a * 0.9; blit(ctx, glow.c, o3, wx[i] - hw * 0.4, wx[i] + hw * 0.4, 0, gy, 0);
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < tvN; i++) {
      if ((i * 5 + Math.floor(time * 0.15 + i * 0.37)) % 3 === 0) continue;
      let sx = tvX[i] - o3; if (sx < 0) sx += SW;
      if (sx >= W) continue;
      ctx.fillStyle = TV[Math.floor(time * (5 + (i % 3)) + i * 1.7) % 4]; ctx.fillRect(sx, tvY[i], 2, 2);
    }
    blit(ctx, track.c, o4, 0, W, 0, gy, 0);
    const trainLen = 4 * (carLen + 1);
    if (trWait > 0) trWait -= dt;
    else {
      trX -= (46 + camSpeed * 0.6) * dt;
      if (trX < -trainLen - 8) { trWait = 3 + pr() * 8; trX = W + 6; }
      const ty = trackY - 1 - carH, acc = Math.max(beatE, bassE * 0.7), nx = Math.round(trX) - 1;
      for (let c = 0; c < 4; c++) {
        const x0 = Math.round(trX) + c * (carLen + 1);
        if (x0 > W || x0 + carLen < 0) continue;
        ctx.fillStyle = '#272d40'; ctx.fillRect(x0, ty, carLen, carH);
        ctx.fillStyle = '#3c4560'; ctx.fillRect(x0, ty, carLen, 1);
        ctx.fillStyle = '#12151f'; ctx.fillRect(x0, ty + carH - 1, carLen, 1);
        ctx.fillStyle = acc > 0.3 ? '#ff6ab4' : '#6e2a55'; ctx.fillRect(x0, ty + carH - 2, carLen, 1);
        ctx.fillStyle = acc > 0.45 ? '#fff4dc' : '#ffd79c';
        for (let x = x0 + 2; x < x0 + carLen - 2; x += 3) if ((x - x0) % 12 !== 8) ctx.fillRect(x, ty + 1, 2, Math.max(1, carH - 3));
        if (c === 1) {
          const pxm = x0 + (carLen >> 1); ctx.fillStyle = '#15121c'; ctx.fillRect(pxm, ty - 1, 1, 1); ctx.fillRect(pxm - 1, ty - 2, 3, 1);
          if (trebE > 0.4 && pr() < trebE * 0.35) { ctx.fillStyle = '#bff4ff'; ctx.fillRect(pxm + Math.floor(pr() * 3) - 1, ty - 3, 1, 1); }
        }
      }
      ctx.fillStyle = '#272d40'; ctx.fillRect(nx, ty + 1, 1, carH - 1);
      ctx.fillStyle = '#fff6d8'; ctx.fillRect(nx, ty + Math.max(1, carH - 3), 1, 1);
      ctx.fillStyle = '#7a6a4c'; for (let i = 2; i < 6 + acc * 10; i += 2) ctx.fillRect(nx - i, trackY - 1, 1, 1);
    }
    if (wt > gy) blit(ctx, road.c, o5, 0, W, 0, wt - gy, gy);
    const laneA = gy + 1, laneB = Math.max(gy + 1, wt - 4);
    for (let i = 0; i < CM; i++) {
      const dir = cl[i] ? 1 : -1;
      cx[i] += (dir * cv[i] - camSpeed * 0.95) * dt;
      if (cx[i] < -16 || cx[i] > W + 16) { const left = cx[i] < 0; cv[i] = 14 + pr() * 22; cx[i] = left ? W + 8 + pr() * 30 : -8 - pr() * 30; }
      const x = Math.round(cx[i]), y = cl[i] ? laneB : laneA;
      if (x > W + 2 || x < -10) continue;
      ctx.fillStyle = CARC[cc[i]]; ctx.fillRect(x, y, 8, 2); ctx.fillRect(x + 2, y - 1, 4, 1);
      ctx.fillStyle = '#5a6a80'; ctx.fillRect(x + (dir > 0 ? 4 : 2), y - 1, 2, 1);
      const fx = dir > 0 ? x + 8 : x - 1, bx = dir > 0 ? x - 1 : x + 8;
      ctx.fillStyle = beatE > 0.5 ? '#fffbe6' : '#ffe6b0'; ctx.fillRect(fx, y, 1, 1);
      ctx.fillStyle = '#ff3a4e'; ctx.fillRect(bx, y, 1, 1);
      ctx.fillStyle = '#4a1822'; ctx.fillRect(bx, y + 2, 1, 1);
      ctx.fillStyle = '#6a5a42'; const L = 4 + Math.round(beatE * 6); for (let j = 2; j <= L; j += 2) ctx.fillRect(fx + dir * j, y + 1, 1, 1);
    }
    const amp = 0.5 + bassE * 1.6 + beatE * 1.4;
    for (let y = wt; y < H; y++) {
      const d = y - wt, sy = gy - 1 - Math.floor(d * 1.35);
      if (sy < 0) break;
      if (Math.sin(d * 1.9 - time * 2.2) > 0.82) continue;
      const sh = Math.round(Math.sin(d * 0.6 + time * 3.1) * amp + Math.sin(d * 1.7 - time * 1.9) * 0.6);
      blit(ctx, refl.c, o3 + sh + SW, 0, W, sy, 1, y);
    }
    for (let i = 0; i < lampN; i++) {
      let sx = lampX[i] - o5; if (sx < 0) sx += SW; if (sx > SW - 3) sx -= SW;
      if (sx < -3 || sx > W + 2) continue;
      if (bassE > 0.45 || beatE > 0.6) { ctx.fillStyle = '#fff4d0'; ctx.fillRect(sx - 1, lampY[i], 3, 1); }
      for (let y = wt + 1; y < H; y += 2) {
        if ((y + Math.floor(time * 8) + i * 3) % 7 === 0) continue;
        const f = (y - wt) / Math.max(1, H - wt), wob = Math.round(Math.sin(y * 0.8 + time * 5 + i) * (0.4 + bassE * 1.2));
        ctx.fillStyle = f < 0.4 ? '#d8a060' : '#7a5238'; ctx.fillRect(sx + wob - (f < 0.25 ? 1 : 0), y, f < 0.25 ? 2 : 1, 1);
      }
    }
    pAcc += dt * bassE * 6;
    while (pAcc >= 1) { pAcc -= 1; if (H > wt) ripple(pr() * W, wt + 1 + pr() * (H - wt - 1), 2 + pr() * 3); }
    for (let i = 0; i < PM; i++) {
      if (pm[i] <= 0) continue;
      pa[i] += dt; px[i] -= camSpeed * 0.9 * dt;
      const r = Math.floor(pa[i] * 7); if (r > pm[i]) { pm[i] = 0; continue; }
      const x = Math.round(px[i]), y = Math.round(py[i]);
      ctx.fillStyle = r < pm[i] * 0.5 ? '#7d9cc4' : '#40587e';
      ctx.fillRect(x - r, y, 1, 1); ctx.fillRect(x + r, y, 1, 1);
      if (r >= 2) { ctx.fillRect(x - (r >> 1), y - 1, r, 1); ctx.fillStyle = '#2a3a58'; ctx.fillRect(x - (r >> 1), y + 1, r, 1); }
    }
    blit(ctx, fore.c, o5, 0, W, 0, H, 0);
    gAcc += dt * trebE * 70;
    while (gAcc >= 1) {
      gAcc -= 1; const i = gNext; gNext = (gNext + 1) % GM;
      gxA[i] = pr() * W; gyA[i] = H > wt && pr() < 0.6 ? wt + pr() * (H - wt) : railTop; glA[i] = 0.25;
    }
    for (let i = 0; i < GM; i++) {
      if (glA[i] <= 0) continue;
      glA[i] -= dt; const x = Math.round(gxA[i]), y = Math.round(gyA[i]);
      if (glA[i] > 0.12) { ctx.fillStyle = '#9ab8d8'; ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); ctx.fillStyle = '#eef8ff'; ctx.fillRect(x, y, 1, 1); }
      else { ctx.fillStyle = '#9ab8d8'; ctx.fillRect(x, y, 1, 1); }
    }
    const act = Math.floor(rN * (0.35 + 0.65 * trebE));
    for (let i = 0; i < rN; i++) {
      const z = rz[i];
      ry[i] += rv[i] * dt; rx[i] -= (rv[i] * 0.18 + camSpeed * (0.2 + z * 0.3)) * dt;
      if (rx[i] < -4) rx[i] += W + 8;
      if (ry[i] > rl[i]) { if (z === 2 && rl[i] >= wt && i < act && pr() < 0.35) ripple(rx[i], rl[i], 2 + (pr() < trebE ? 1 : 0)); resetDrop(i, false); }
    }
    for (let z = 0; z < 3; z++) {
      ctx.fillStyle = z === 0 ? '#34375e' : z === 1 ? '#56668e' : trebE > 0.5 ? '#cfe2f5' : '#8ea4c4';
      const len = (z === 0 ? 2 : z === 1 ? 3 : 5) + (H > 150 ? 1 : 0), half = len >> 1;
      for (let i = 0; i < act; i++) {
        if (rz[i] !== z) continue;
        const x = Math.floor(rx[i]), y = Math.floor(ry[i]);
        ctx.fillRect(x, y - half, 1, len - half); ctx.fillRect(x + 1, y - len, 1, half);
      }
    }
    ctx.restore();
  };

  return { resize, draw };
}
