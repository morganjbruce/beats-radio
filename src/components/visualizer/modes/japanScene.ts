type AudioFrame = { bass: number; treble: number; energy: number; beat: boolean; beatPhase?: number; beatCount?: number };
type Lantern = { wx: number; wy: number; ww: number; wh: number; base: number; gr: number };

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const dith = (x: number, y: number): number => (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16;
const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
const unit = (v: unknown): number => { const n = Number(v); return Number.isFinite(n) ? clamp(n, 0, 1) : 0; };
const dim = (v: unknown): number => { const n = Math.floor(Number(v)); return Number.isFinite(n) && n > 0 ? Math.min(n, 4096) : 0; };
const css = (hex: number): string => '#' + (hex & 0xffffff).toString(16).padStart(6, '0');

function mixH(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const r = Math.round(ar + (((b >> 16) & 255) - ar) * t);
  const g = Math.round(ag + (((b >> 8) & 255) - ag) * t);
  const bl = Math.round(ab + ((b & 255) - ab) * t);
  return (r << 16) | (g << 8) | bl;
}

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toCanvas(buf: Int32Array, w: number, h: number): HTMLCanvasElement | null {
  try {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    if (!g) return null;
    const img = g.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < buf.length; i++) {
      const v = buf[i];
      if (v < 0) continue;
      const o = i * 4;
      d[o] = (v >> 16) & 255; d[o + 1] = (v >> 8) & 255; d[o + 2] = v & 255; d[o + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  } catch {
    return null;
  }
}

const SKY = [0x1a1737, 0x232150, 0x2f2d67, 0x413c80, 0x5a5098, 0x7b68aa, 0xa183b6, 0xbf98bb];
const WAT = [0x6a5d98, 0x4f4a84, 0x3a3c6c, 0x2a2f56, 0x1c2242];
const BL = [0x6e3f68, 0xa8628e, 0xd68cae, 0xefb6cb, 0xfde0ea];
const LAMP: string[] = [];
for (let i = 0; i < 8; i++) LAMP.push(css(mixH(0x5a3018, 0xffe8a8, i / 7)));
const FR_A = css(BL[2]), FR_B = css(BL[3]);

export function createJapanScene() {
  let W = 0, H = 0, hz = 1, RW = 1, built = false;
  let back: HTMLCanvasElement | null = null, refl: HTMLCanvasElement | null = null, front: HTMLCanvasElement | null = null;
  let lanterns: Lantern[] = [];
  let lampBr = new Float32Array(0);
  let frX = new Int16Array(0), frY = new Int16Array(0), frT = new Float32Array(0), frSplit = 0;
  let glX = new Int16Array(0), glY = new Int16Array(0), glP = new Float32Array(0);
  let wgX = new Int16Array(0), wgY = new Int16Array(0), wgL = new Int8Array(0), wgP = new Float32Array(0);
  let clX = new Float32Array(0), clY = new Float32Array(0), crS = 2;
  let rcX = new Float32Array(0), rcY = new Float32Array(0);
  let pCap = 12, pScale = 1, ripSpeed = 8;
  const CAP = 80;
  const pX = new Float32Array(CAP), pY = new Float32Array(CAP), pVX = new Float32Array(CAP), pVY = new Float32Array(CAP);
  const pLY = new Float32Array(CAP), pLife = new Float32Array(CAP), pPh = new Float32Array(CAP);
  const pOn = new Uint8Array(CAP), pLand = new Uint8Array(CAP);
  const RIP = 6;
  const rX = new Float32Array(RIP), rY = new Float32Array(RIP), rA = new Float32Array(RIP), rS = new Float32Array(RIP);
  const rOn = new Uint8Array(RIP);
  const rr = rng(0x9e3779b9);
  let time = 0, bassS = 0, trebS = 0, pulse = 0, prevBeat = false, spawnAcc = 0, ripIdx = 0;

  function build(w: number, h: number): void {
    W = w; H = h; built = true;
    const R = rng(0x51a7e);
    const tbl = new Float32Array(256);
    for (let i = 0; i < 256; i++) tbl[i] = R();
    const n1 = (x: number): number => {
      const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f), a = tbl[i & 255];
      return a + (tbl[(i + 1) & 255] - a) * u;
    };
    const h2 = (x: number, y: number): number => {
      let v = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) ^ 0x2f6d;
      v = Math.imul(v ^ (v >>> 13), 1274126177);
      return ((v ^ (v >>> 16)) >>> 0) / 4294967296;
    };
    const portrait = W / H < 1.25;
    hz = Math.max(1, Math.min(H - 1, Math.round(H * (portrait ? 0.5 : 0.55))));
    const WHr = Math.max(0, H - hz), WH = Math.max(1, WHr);
    RW = W + 4;
    const bk = new Int32Array(W * H), fr = new Int32Array(W * H).fill(-1), rf = new Int32Array(RW * WH);
    const u = Math.min(W, H * 1.6);
    const tx = Math.round(W * (portrait ? 0.6 : 0.57));
    const tb = Math.min(H - 1, Math.round(hz + WHr * (portrait ? 0.3 : 0.34)));
    const th = Math.max(4, Math.round(Math.min(H * 0.4, W * 0.42, tb * 0.9)));

    for (let y = 0; y < hz; y++) {
      const ty = y / Math.max(1, hz - 1);
      for (let x = 0; x < W; x++) {
        let c = SKY[clamp(Math.floor(ty * (SKY.length - 1) + dith(x, y)), 0, SKY.length - 1)];
        const cv = n1(x * 0.018 + y * 2.3 + 11) * n1(y * 0.4 + 3);
        if (ty > 0.3 && cv > 0.38 && (cv - 0.38) * 5 > dith(x + 1, y)) c = mixH(c, 0xcfa6c8, 0.25);
        if (ty < 0.6 && h2(x, y) > 0.993) c = h2(y, x) > 0.5 ? 0xe6e0fa : 0x9a93cc;
        bk[y * W + x] = c;
      }
    }
    const mr = Math.max(1, Math.round(Math.min(W, H) * (portrait ? 0.07 : 0.085)));
    const mx = Math.round(W * (portrait ? 0.78 : 0.8)), my = Math.max(mr + 1, Math.round(hz * 0.3));
    for (let y = Math.max(0, my - mr * 3); y < Math.min(hz, my + mr * 3); y++) {
      for (let x = Math.max(0, mx - mr * 3); x < Math.min(W, mx + mr * 3); x++) {
        const d = Math.hypot(x - mx, y - my), i = y * W + x;
        if (d <= mr + 0.35) {
          let c = 0xf3ead8;
          if (h2(x + 3, y * 7) > 0.78 && d < mr - 0.5) c = 0xdccfbf;
          if (x - mx + y - my < -mr * 0.55) c = mixH(c, 0xb9aecb, 0.5);
          bk[i] = c;
        } else if (d < mr * 2.8 && dith(x, y) < (1 - (d - mr) / (mr * 1.8)) * 0.55) bk[i] = mixH(bk[i], 0xb49cc8, 0.3);
      }
    }
    const fx = Math.round(W * (portrait ? 0.42 : 0.44));
    const fh = Math.max(2, Math.round(Math.min(hz * 0.88, W * (portrait ? 0.49 : 0.285))));
    const fw = Math.max(3, Math.round(Math.min(fh * 2.5, W * (portrait ? 0.86 : 0.6))));
    const peak = hz - fh;
    for (let x = Math.max(0, fx - fw); x < Math.min(W, fx + fw); x++) {
      const tt = Math.abs(x - fx) / fw;
      const prof = tt < 0.07 ? (tt < 0.035 ? 0.98 : 1) : Math.pow((1 - tt) / 0.93, 1.55);
      const top = Math.round(hz - fh * prof + (tt > 0.07 ? (n1(x * 0.4) - 0.5) * 1.3 : 0));
      const sl = 0.26 + 0.12 * n1(x * 0.33 + 7) + 0.3 * Math.max(0, n1(x * 0.8 + 51) - 0.55) + (h2(x, 0) > 0.75 ? 0.06 : 0);
      for (let y = Math.max(0, top); y < hz; y++) {
        const d = (y - peak) / fh;
        const lit = x - fx > (n1(y * 0.6 + 90) - 0.5) * 2.5;
        let c: number;
        if (d < sl) {
          c = lit ? (dith(x, y) < 0.75 ? 0xece7f5 : 0xd0c9e6) : (dith(x, y) < 0.5 ? 0xa39cce : 0x8781ba);
          if (d > sl - 0.04) c = lit ? 0xb6aed8 : 0x7b76ad;
        } else c = lit ? (h2(x, y >> 1) > 0.8 ? 0x42427a : 0x4d4c86) : (h2(x, y >> 1) > 0.75 ? 0x2c2c56 : 0x363564);
        if (dith(x + 2, y) < clamp((d - 0.45) / 0.55, 0, 1) * 0.8) c = mixH(c, 0x6a5c9c, 0.5);
        bk[y * W + x] = c;
      }
    }
    const RC = [[0x5a5692, 0x4c4a84], [0x404a7c, 0x333d6c], [0x283a56, 0x1f2f48]];
    const RA = [0.2, 0.14, 0.08], RB = [0.06, 0.03, 0];
    for (let i = 0; i < 3; i++) {
      const rv = (x: number): number => n1(x * (0.012 + i * 0.01) + i * 37) * 0.7 + n1(x * 0.06 + i * 13) * 0.3;
      for (let x = 0; x < W; x++) {
        const v = rv(x);
        let top = Math.round(hz - hz * (RB[i] + RA[i] * v) - 1);
        if (i > 0 && h2(x, 9 + i) > 0.7) top -= 1 + (h2(x, 4) > 0.6 ? 1 : 0);
        const lit = rv(x + 1) < v;
        for (let y = Math.max(0, top); y < hz; y++) {
          let c = RC[i][lit ? 0 : 1];
          if (h2(x * 3 + i, y) > 0.86) c = mixH(c, 0, 0.18);
          if (i < 2 && dith(x, y) < ((y - top) / (hz - top + 1)) * 0.5) c = mixH(c, 0x6a5c9c, 0.35);
          bk[y * W + x] = c;
        }
      }
    }
    for (let x = 0; x < W; x++) {
      bk[(hz - 1) * W + x] = 0x1c2640;
      if (hz >= 3 && h2(x, 77) > 0.972 && Math.abs(x - tx) > 3) bk[(hz - 2) * W + x] = 0xf2b765;
    }
    const waterAt = (x: number, y: number): number => {
      const tw = (y - hz) / Math.max(1, WHr - 1);
      return WAT[clamp(Math.floor(tw * (WAT.length - 1) + dith(x, y)), 0, WAT.length - 1)];
    };
    for (let y = hz; y < H; y++) for (let x = 0; x < W; x++) bk[y * W + x] = waterAt(x, y);
    for (let ry = 0; ry < WHr; ry++) {
      const y = hz + ry, tw = ry / Math.max(1, WHr - 1), sy = hz - 1 - ry;
      for (let xx = 0; xx < RW; xx++) {
        const x = clamp(xx - 2, 0, W - 1);
        let c = mixH(sy >= 0 ? bk[sy * W + x] : SKY[0], waterAt(x, y), 0.3 + 0.4 * tw);
        c = mixH(c, 0x0c0f24, 0.12 + 0.25 * tw);
        const s = n1(xx * 0.07 + ry * 17.3 + 5);
        if (s > 0.74) c = mixH(c, 0xb2a4dc, 0.22); else if (s < 0.18) c = mixH(c, 0x10132a, 0.3);
        rf[ry * RW + xx] = c;
      }
    }

    const put = (x: number, y: number, c: number, base = -1): void => {
      if (x < 0 || x >= W) return;
      if (y >= 0 && y < H) fr[y * W + x] = c;
      if (base > 0 && y < base) {
        const ry = 2 * base - 1 - y - hz;
        if (ry >= 0 && ry < WHr) { const i = ry * RW + x + 2; rf[i] = mixH(mixH(c, rf[i], 0.35), 0x0c0f24, 0.35); }
      }
    };

    // Torii
    const tw = Math.round(th * 1.05), pw = Math.max(1, Math.round(th * 0.075)), top = tb - th, kh = Math.max(2, Math.round(th * 0.1));
    const pl = Math.round(tx - tw * 0.3) - (pw >> 1), prx = Math.round(tx + tw * 0.3) - (pw >> 1);
    for (const p0 of [pl, prx]) {
      for (let y = top + kh; y < tb; y++) for (let i = 0; i < pw; i++) {
        let c = pw > 1 && i === 0 ? 0x8a2a2c : pw > 1 && i === pw - 1 ? 0xe06848 : 0xc2402e;
        if (y >= tb - Math.max(1, Math.round(th * 0.07))) c = 0x241a26;
        else if (h2(p0 + i, y) > 0.9) c = mixH(c, 0x241a26, 0.3);
        put(p0 + i, y, c, tb);
      }
      for (let i = -1; i <= pw; i++) put(p0 + i, tb, 0x8f84c0);
    }
    const ny = top + kh + Math.max(1, Math.round(th * 0.2)), nh = Math.max(1, Math.round(th * 0.06)), nov = Math.max(1, Math.round(th * 0.07));
    for (let x = pl - nov; x < prx + pw + nov; x++) for (let r = 0; r < nh; r++) put(x, ny + r, r === nh - 1 && nh > 1 ? 0x8a2a2c : 0xc84430, tb);
    for (let y = top + kh; y < ny; y++) for (let i = -pw; i <= pw; i++) {
      const edge = Math.abs(i) === pw || y === top + kh || y === ny - 1;
      if (th >= 16) put(tx + i, y, edge ? 0xc89a4a : 0x241a26, tb);
      else if (Math.abs(i) < Math.max(1, pw - 1)) put(tx + i, y, 0xb23a2c, tb);
    }
    const half = tw / 2 + Math.max(1, Math.round(th * 0.1));
    for (let x = Math.floor(tx - half); x <= Math.ceil(tx + half); x++) {
      const d = Math.abs(x - tx) / half;
      if (d > 1) continue;
      const lift = Math.round(Math.pow(d, 3) * th * 0.1), rows = d > 0.96 ? Math.max(1, kh - 1) : kh, blk = Math.max(1, Math.round(kh * 0.45));
      for (let r = 0; r < rows; r++) put(x, top - lift + r, r === 0 ? 0x3a2c38 : r < blk ? 0x1e1620 : r === kh - 1 ? 0x9a302c : 0xcc4632, tb);
    }

    // Stone lanterns
    lanterns = [];
    const lh = Math.max(5, Math.round(th * 0.5));
    const lantern = (cx: number, base: number): void => {
      const lw = Math.max(3, Math.round(lh * 0.42)) | 1;
      let y = base;
      const sec = (sw: number, sh: number): void => {
        const x0 = cx - (sw >> 1);
        for (let r = 0; r < sh; r++) {
          y--;
          for (let i = 0; i < sw; i++) {
            let c = i === 0 ? 0x33344a : i === sw - 1 ? 0x77788f : r === sh - 1 ? 0x6c6d86 : 0x53546c;
            const n = h2(x0 + i, y);
            if (n > 0.86) c = n > 0.95 ? 0x45604f : 0x40415a;
            put(x0 + i, y, c, base);
          }
        }
      };
      sec(lw, Math.max(1, Math.round(lh * 0.12)));
      sec(Math.max(1, Math.round(lw * 0.4)) | 1, Math.max(1, Math.round(lh * 0.22)));
      sec(Math.max(3, lw - 1) | 1, Math.max(1, Math.round(lh * 0.08)));
      const bw = Math.max(3, Math.round(lw * 0.75)) | 1, bh = Math.max(3, Math.round(lh * 0.22));
      sec(bw, bh);
      const ww = Math.max(1, bw - 2), wh = Math.max(1, bh - 2), wx = cx - (ww >> 1), wy = y + 1;
      for (let j = 0; j < wh; j++) for (let i = 0; i < ww; i++) put(wx + i, wy + j, 0x4a2a18, base);
      lanterns.push({ wx, wy, ww, wh, base, gr: Math.max(2, Math.round(lh * 0.45)) });
      const rh = Math.max(2, Math.round(lh * 0.16)), rhalf = (lw + 2) >> 1;
      for (let r = 0; r < rh; r++) {
        y--;
        const hw = Math.max(0, rhalf - Math.round((r * rhalf) / rh));
        for (let i = -hw; i <= hw; i++) put(cx + i, y, r === 0 ? 0x24243a : i > hw * 0.3 ? 0x6e6e8a : i < -hw * 0.3 ? 0x2c2c42 : 0x4a4a64, base);
        if (r === 0) { put(cx - hw - 1, y - 1, 0x4a4a64, base); put(cx + hw + 1, y - 1, 0x6e6e8a, base); }
      }
      y--; put(cx - 1, y, 0x3a3a52, base); put(cx, y, 0x4a4a64, base); put(cx + 1, y, 0x6e6e8a, base);
      y--; put(cx, y, 0x77788f, base);
    };
    const l1x = Math.round(W * (portrait ? 0.28 : 0.24)), l1b = Math.min(H - 1, Math.round(hz + WHr * (portrait ? 0.5 : 0.55)));
    const l2x = Math.round(W * (portrait ? 0.86 : 0.68)), l2b = Math.min(H - 1, Math.round(hz + WHr * (portrait ? 0.6 : 0.7)));
    lantern(l1x, l1b); lantern(l2x, l2b);
    lampBr = new Float32Array(lanterns.length);

    const rock = (cx: number, cy: number, rw: number, rh: number): void => {
      rw = Math.max(2, rw); rh = Math.max(1, rh);
      for (let y = Math.round(cy - rh); y <= cy + rh; y++) for (let x = Math.round(cx - rw); x <= cx + rw; x++) {
        const dx = (x - cx) / rw, dy = (y - cy) / rh;
        if (dx * dx + dy * dy + (h2(x, y) - 0.5) * 0.25 + (n1(x * 0.3 + y) - 0.5) * 0.3 >= 1) continue;
        const l = dx * 0.6 - dy * 0.8 + (h2(x + 1, y) - 0.5) * 0.4;
        put(x, y, dy < -0.5 && h2(x, y + 5) > 0.5 ? 0x3f5c55 : l > 0.45 ? 0x60607c : l > -0.1 ? 0x40405a : 0x28283c);
      }
    };
    // Bridge
    const bx0 = Math.round(W * (portrait ? 0.5 : 0.72)), bx1 = W + Math.round(W * (portrait ? 0.25 : 0.1));
    const byb = H - Math.max(1, Math.round(H * 0.05)), bah = Math.max(2, Math.round(H * (portrait ? 0.09 : 0.15)));
    const bdt = Math.max(2, Math.round(H * 0.035)), brh = Math.max(2, Math.round(H * (portrait ? 0.05 : 0.08)));
    const bps = Math.max(3, Math.round(Math.min(W, H * 3) * 0.035));
    const deckY = (x: number): number => Math.round(byb - bah * Math.sin(Math.PI * clamp((x - bx0) / (bx1 - bx0), 0, 1)));
    rock(bx0 - u * 0.02, H, u * 0.05, u * 0.028);
    for (let x = bx0 + bps; x < W; x += bps * 2) {
      for (let y = deckY(x) + bdt; y < H; y++) for (let i = 0; i < Math.max(1, bdt >> 1); i++) put(x + i, y, i === 0 ? 0x2a1e28 : 0x3d2c34);
    }
    for (let x = bx0; x < Math.min(W, bx1); x++) {
      const yc = deckY(x), yt = yc - brh;
      for (let y = yc + bdt; y < Math.min(H, yc + bdt + 2); y++) put(x, y, 0x161a30);
      for (let r = 0; r < bdt; r++) {
        const y = yc + r;
        put(x, y, r === 0 ? ((x - bx0) % 3 === 0 ? 0x4e3428 : h2(x, 3) > 0.7 ? 0x9a7454 : 0x7a5a44) : r === bdt - 1 ? 0x7a2426 : h2(x, y) > 0.85 ? 0xa0362c : 0xbf4630);
      }
      put(x, yt, 0xd9573c);
      if (brh > 3) put(x, yt + 1, 0x9a3028);
      put(x, yc - (brh >> 1), 0x8e2c28);
      if ((x - bx0) % bps === 0) for (let y = yt; y < yc; y++) { put(x, y, 0xc84a32); if (bps > 4) put(x + 1, y, 0x8e2c28); }
    }
    const gy = deckY(bx0) - brh;
    for (let i = -1; i <= 1; i++) { put(bx0 + i, gy - 1, i > 0 ? 0xc2aa60 : 0x8a7a48); put(bx0 + i, gy - 2, i > 0 ? 0xb09a54 : 0x76683e); }
    put(bx0, gy - 3, 0xd8c070);

    const reeds = (x0: number, x1: number, n: number): void => {
      for (let k = 0; k < n; k++) {
        const bx = Math.round(x0 + R() * (x1 - x0)), hr = Math.max(2, Math.round(H * (0.07 + R() * 0.13))), lean = (R() - 0.3) * hr * 0.5, cat = R() < 0.3;
        for (let j = 0; j < hr; j++) {
          const f = j / hr, x = bx + Math.round(lean * f * f), y = H - 1 - j;
          put(x, y, cat && f > 0.68 && f < 0.86 ? 0x7a5a3e : f > 0.85 ? 0x6a9a7c : f > 0.45 ? 0x2f5650 : 0x1d3336);
        }
      }
    };
    rock(W * 0.1, H, u * 0.07, u * 0.035);
    reeds(W * 0.02, W * (portrait ? 0.3 : 0.2), Math.max(3, Math.round(W * 0.05)));
    reeds(W * (portrait ? 0.36 : 0.62), W * (portrait ? 0.48 : 0.72), Math.max(2, Math.round(W * 0.03)));
    rock(W * 0.04, H + 1, u * 0.06, u * 0.04);

    // Cherry tree
    const discs: number[] = [], tips: number[] = [], sx = portrait ? 1 : 1.45;
    const grow = (x: number, y: number, ang: number, len: number, thk: number, depth: number): void => {
      const steps = Math.max(1, Math.round(len));
      for (let i = 0; i < steps; i++) {
        ang += (R() - 0.5) * 0.22;
        x += Math.cos(ang) * sx; y += Math.sin(ang);
        discs.push(x, y, Math.max(0.5, thk * (1 - (0.3 * i) / steps) * 0.5));
        if (depth <= 2 && i === steps >> 1 && R() < 0.5) tips.push(x, y);
      }
      if (depth <= 0 || len < 2) { tips.push(x, y); return; }
      const sp = portrait ? 0.45 : 0.6;
      grow(x, y, ang - sp - R() * 0.3, len * (0.62 + R() * 0.18), thk * 0.62, depth - 1);
      grow(x, y, ang + sp * 0.8 + R() * 0.3, len * (0.6 + R() * 0.18), thk * 0.62, depth - 1);
      if (depth >= 2 && R() < 0.35) grow(x, y, ang + (R() - 0.5) * 0.3, len * 0.55, thk * 0.55, depth - 2);
    };
    grow(Math.round(W * 0.05), H + 1, portrait ? -1.38 : -1.32, H * (portrait ? 0.34 : 0.4), Math.max(2, Math.min(H * 0.6, W * 0.3) * 0.1), 4);
    // Pull the canopy leftward toward the trunk base to reveal Fuji; heights are untouched so the crown stays tall, not squat.
    const tAx = Math.round(W * 0.05), tSq = portrait ? 0.86 : 0.78;
    for (let i = 0; i < discs.length; i += 3) discs[i] = tAx + (discs[i] - tAx) * tSq;
    for (let i = 0; i < tips.length; i += 2) tips[i] = tAx + (tips[i] - tAx) * tSq;
    const cr = Math.max(2, Math.round(Math.min(H * 0.6, W * 0.3) * 0.105));
    crS = cr;
    const mark = new Uint8Array(W * H);
    const fa: number[] = [], fb: number[] = [], gl: number[] = [];
    const cluster = (cx: number, cy: number, backLayer: boolean): void => {
      const n = 3 + Math.floor(R() * 3), bx: number[] = [], by: number[] = [], br: number[] = [];
      for (let b = 0; b < n; b++) { bx.push(cx + (R() - 0.5) * cr * 1.4); by.push(cy + (R() - 0.5) * cr * 0.9); br.push(cr * (0.55 + R() * 0.45)); }
      const e = Math.ceil(cr * 1.9);
      for (let y = Math.round(cy - e); y <= cy + e; y++) for (let x = Math.round(cx - e); x <= cx + e; x++) {
        if (x < 0 || x >= W || y < 0 || y >= H) continue;
        let best = 9;
        for (let b = 0; b < n; b++) best = Math.min(best, Math.hypot(x - bx[b], y - by[b]) / br[b]);
        best += (h2(x, y) - 0.5) * 0.3;
        if (best < 1) {
          if (h2(x + 7, y) > 0.94) continue;
          const sh = (x - cx - (y - cy)) / (cr * 2.4) + 0.5 - best * 0.25 + (h2(x, y + 3) - 0.5) * 0.35;
          const k = clamp(Math.floor(sh * 4 + dith(x, y) + 0.3) - (backLayer ? 1 : 0), 0, 4);
          put(x, y, BL[k]); mark[y * W + x] = 1;
          if (k >= 3 && h2(x + 1, y + 9) > 0.82 && gl.length < 600) gl.push(x, y);
        } else if (!backLayer && best < 1.3 && fa.length + fb.length < 3600) {
          (h2(x, y + 11) > 0.55 ? fb : fa).push(x, y, (best - 1) / 0.3 * 0.7 + h2(x + 5, y) * 0.3);
        }
      }
    };
    const nT = tips.length >> 1, backFlag = new Uint8Array(nT);
    for (let i = 0; i < nT; i++) backFlag[i] = R() < 0.4 ? 1 : 0;
    for (let i = 0; i < nT; i++) if (backFlag[i]) cluster(tips[i * 2], tips[i * 2 + 1], true);
    for (let i = 0; i < discs.length; i += 3) {
      const cx = discs[i], cy = discs[i + 1], r = discs[i + 2], e = Math.ceil(r);
      for (let y = Math.round(cy - e); y <= cy + e; y++) for (let x = Math.round(cx - e); x <= cx + e; x++) {
        const dx = x - cx, dy = y - cy;
        if (dx * dx + dy * dy > r * r + 0.25) continue;
        put(x, y, h2(x, y * 3) > 0.88 ? 0x3d2a38 : dx > r * 0.35 ? 0x4f3444 : dx < -r * 0.3 ? 0x1a111a : 0x2e1f2c);
      }
    }
    for (let i = 0; i < nT; i++) if (!backFlag[i]) cluster(tips[i * 2], tips[i * 2 + 1], false);
    clX = new Float32Array(nT); clY = new Float32Array(nT);
    for (let i = 0; i < nT; i++) { clX[i] = tips[i * 2]; clY[i] = tips[i * 2 + 1]; }
    const fx2: number[] = [], fy2: number[] = [], ft2: number[] = [];
    const takeFringe = (arr: number[]): void => {
      for (let i = 0; i < arr.length; i += 3) {
        const k = arr[i + 1] * W + arr[i];
        if (mark[k]) continue;
        mark[k] = 1; fx2.push(arr[i]); fy2.push(arr[i + 1]); ft2.push(arr[i + 2]);
      }
    };
    takeFringe(fa); frSplit = fx2.length; takeFringe(fb);
    frX = Int16Array.from(fx2); frY = Int16Array.from(fy2); frT = Float32Array.from(ft2);
    glX = new Int16Array(gl.length >> 1); glY = new Int16Array(gl.length >> 1); glP = new Float32Array(gl.length >> 1);
    for (let i = 0; i < glX.length; i++) { glX[i] = gl[i * 2]; glY[i] = gl[i * 2 + 1]; glP[i] = R(); }

    const nG = WHr > 0 ? Math.max(4, Math.round((W * WHr) / 70)) : 0;
    wgX = new Int16Array(nG); wgY = new Int16Array(nG); wgL = new Int8Array(nG); wgP = new Float32Array(nG);
    for (let k = 0; k < nG; k++) {
      const ry = Math.floor(Math.pow(R(), 1.3) * WHr);
      wgX[k] = clamp(R() < 0.5 ? Math.round(mx + (R() - 0.5) * (mr * 3 + ry * 0.8)) : Math.floor(R() * W), 0, W - 1);
      wgY[k] = hz + ry; wgL[k] = 1 + Math.floor(R() * 3); wgP[k] = R() * 6.283;
    }
    rcX = Float32Array.from([pl + pw / 2, prx + pw / 2, l1x, l2x, W * 0.45]);
    rcY = Float32Array.from([tb, tb, l1b, l2b, hz + WHr * 0.45]);
    pCap = Math.min(CAP, Math.max(12, Math.round((W * H) / 300)));
    pScale = Math.max(0.5, H / 100);
    ripSpeed = Math.max(5, W * 0.03);
    pOn.fill(0); rOn.fill(0);
    back = toCanvas(bk, W, H); refl = toCanvas(rf, RW, WH); front = toCanvas(fr, W, H);
  }

  function spawn(n: number): void {
    const nc = clX.length;
    if (!nc) return;
    for (let i = 0; i < pCap && n > 0; i++) {
      if (pOn[i]) continue;
      const c = Math.floor(rr() * nc);
      pX[i] = clX[c] + (rr() - 0.5) * crS * 2; pY[i] = clY[c] + (rr() - 0.5) * crS;
      pVX[i] = (5 + rr() * 10) * pScale; pVY[i] = (4 + rr() * 7) * pScale; pPh[i] = rr() * 6.283;
      pLY[i] = Math.max(hz + 1 + rr() * Math.max(1, H - hz - 1), pY[i] + 2);
      pLand[i] = 0; pLife[i] = 0; pOn[i] = 1; n--;
    }
  }

  function onBeat(energy: number): void {
    pulse = 1;
    spawn(Math.round(4 + energy * 8 + bassS * 3));
    for (let i = 0; i < RIP; i++) {
      if (rOn[i]) continue;
      const k = ripIdx++ % (rcX.length + 1);
      if (k < rcX.length) { rX[i] = rcX[k]; rY[i] = rcY[k]; }
      else { rX[i] = W * (0.3 + rr() * 0.4); rY[i] = hz + (H - hz) * (0.2 + rr() * 0.6); }
      rA[i] = 0; rS[i] = 0.5 + 0.5 * energy; rOn[i] = 1;
      break;
    }
  }

  function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    const n = Math.max(8, Math.round(r * 3));
    for (let j = 0; j < n; j++) {
      const a = (j / n) * 6.283, py = Math.round(y + Math.sin(a) * r * 0.32);
      if (py >= hz && py < H) ctx.fillRect(Math.round(x + Math.cos(a) * r), py, 1, 1);
    }
  }

  return {
    resize(width: number, height: number): void {
      const w = dim(width), h = dim(height);
      if (w && h && (w !== W || h !== H || !built)) build(w, h);
    },
    draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: AudioFrame, dt: number): void {
      const w = dim(width), h = dim(height);
      if (!w || !h || !ctx) return;
      if (w !== W || h !== H || !built) build(w, h);
      const d = Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0;
      const bass = unit(audio?.bass), treble = unit(audio?.treble), energy = unit(audio?.energy);
      time += d;
      bassS += (bass - bassS) * Math.min(1, d * 6);
      trebS += (treble - trebS) * Math.min(1, d * 8);
      pulse = Math.max(0, pulse - d * 1.8);
      const beat = !!(audio && audio.beat);
      if (beat && !prevBeat) onBeat(energy);
      prevBeat = beat;

      spawnAcc += d * (0.5 + bassS * 0.8);
      while (spawnAcc >= 1) { spawnAcc -= 1; spawn(1); }
      for (let i = 0; i < pCap; i++) {
        if (!pOn[i]) continue;
        if (!pLand[i]) {
          pX[i] += (pVX[i] + Math.sin(time * 1.7 + pPh[i]) * 5) * d;
          pY[i] += (pVY[i] + Math.sin(time * 2.3 + pPh[i]) * 2) * d;
          if (pY[i] >= pLY[i]) { pLand[i] = 1; pY[i] = pLY[i]; pLife[i] = 3 + (pPh[i] % 1) * 3; }
        } else { pX[i] += pVX[i] * 0.12 * d; pLife[i] -= d; }
        if (pX[i] > W + 2 || pY[i] > H + 1 || (pLand[i] && pLife[i] <= 0)) pOn[i] = 0;
      }
      for (let i = 0; i < RIP; i++) if (rOn[i] && (rA[i] += d) > 2.4) rOn[i] = 0;

      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      if (!back || !refl || !front) {
        ctx.fillStyle = '#2f2d67'; ctx.fillRect(0, 0, W, hz);
        ctx.fillStyle = '#2a2f56'; ctx.fillRect(0, hz, W, H - hz);
        return;
      }
      ctx.drawImage(back, 0, 0);
      const WHr = H - hz;
      for (let ry = 0; ry < WHr; ry++) {
        const f = ry / Math.max(1, WHr), amp = 0.3 + f * 1.6 + bassS * 0.5 * f;
        const dx = clamp(Math.round(Math.sin(ry * 0.83 + time * 1.5) * amp + Math.sin(ry * 0.31 - time * 0.8) * amp * 0.5), -2, 2);
        ctx.drawImage(refl, 0, ry, RW, 1, dx - 2, hz + ry, RW, 1);
      }
      if (bassS > 0.02 && WHr > 0) { ctx.globalAlpha = bassS * 0.07; ctx.fillStyle = '#9b8ad0'; ctx.fillRect(0, hz, W, WHr); }
      ctx.fillStyle = '#e4dcff';
      const thr = 0.94 - trebS * 0.35;
      for (let k = 0; k < wgX.length; k++) {
        const s = Math.sin(time * (1.1 + (k % 5) * 0.23) + wgP[k]);
        if (s <= thr) continue;
        ctx.globalAlpha = Math.min(1, (s - thr) * 8) * 0.8;
        ctx.fillRect(wgX[k], wgY[k], wgL[k], 1);
      }
      ctx.fillStyle = '#cbbff0';
      for (let i = 0; i < RIP; i++) {
        if (!rOn[i]) continue;
        const life = rA[i] / 2.4, r = 1 + rA[i] * ripSpeed;
        ctx.globalAlpha = (1 - life) * (1 - life) * 0.7 * rS[i];
        ring(ctx, rX[i], rY[i], r);
        if (r > 3) ring(ctx, rX[i], rY[i], r * 0.6);
      }
      for (let i = 0; i < lanterns.length; i++) {
        const L = lanterns[i], fl = 0.86 + 0.08 * Math.sin(time * 2.7 + i * 1.9) + 0.06 * Math.sin(time * 6.1 + i);
        const br = clamp((0.5 + bassS * 0.4 + pulse * 0.15) * fl, 0, 1);
        lampBr[i] = br;
        const yA = 2 * L.base - 1 - (L.wy + L.wh - 1), len = L.wh * 4;
        ctx.globalAlpha = 0.25 + br * 0.35;
        ctx.fillStyle = LAMP[Math.round(br * 7)];
        for (let k = 0; k < len; k++) {
          const y = yA + k;
          if (y >= H) break;
          if (y < hz || (k > L.wh && (k + Math.floor(time * 4)) % 3 === 2)) continue;
          const wd = Math.max(1, L.ww - (k >> 2));
          ctx.fillRect(L.wx + Math.round(Math.sin(y * 0.9 + time * 1.5) * (0.5 + k * 0.15)) + ((L.ww - wd) >> 1), y, wd, 1);
        }
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(front, 0, 0);
      for (let i = 0; i < lanterns.length; i++) {
        const L = lanterns[i], lv = Math.round(lampBr[i] * 7);
        ctx.globalAlpha = 1;
        ctx.fillStyle = LAMP[lv]; ctx.fillRect(L.wx, L.wy, L.ww, L.wh);
        ctx.fillStyle = LAMP[Math.min(7, lv + 2)]; ctx.fillRect(L.wx + ((L.ww - 1) >> 1), L.wy + (L.wh >> 1), 1, L.wh - (L.wh >> 1));
        ctx.globalAlpha = 0.08 + lampBr[i] * 0.18;
        ctx.fillStyle = '#ffb35c';
        const cx = L.wx + (L.ww >> 1), cy = L.wy + (L.wh >> 1);
        for (let y = cy - L.gr; y <= cy + L.gr; y++) for (let x = cx - L.gr; x <= cx + L.gr; x++) {
          if (((x + y) & 1) !== 0 || (x - cx) * (x - cx) + (y - cy) * (y - cy) > L.gr * L.gr) continue;
          if (x >= L.wx && x < L.wx + L.ww && y >= L.wy && y < L.wy + L.wh) continue;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
      const lvl = bassS * 1.15 + 0.04 * (1 + Math.sin(time * 0.6));
      ctx.fillStyle = FR_A;
      for (let k = 0; k < frSplit; k++) if (frT[k] < lvl) ctx.fillRect(frX[k], frY[k], 1, 1);
      ctx.fillStyle = FR_B;
      for (let k = frSplit; k < frX.length; k++) if (frT[k] < lvl) ctx.fillRect(frX[k], frY[k], 1, 1);
      ctx.fillStyle = '#fff4f8';
      const gs = 0.13 + trebS * 0.6, gw = 0.03 + trebS * 0.2;
      for (let k = 0; k < glX.length; k++) if ((glP[k] + time * gs) % 1 < gw) ctx.fillRect(glX[k], glY[k], 1, 1);
      for (let i = 0; i < pCap; i++) {
        if (!pOn[i]) continue;
        ctx.globalAlpha = pLand[i] ? Math.min(1, pLife[i]) * 0.75 : 1;
        ctx.fillStyle = i & 1 ? '#f7cadb' : '#e59ab9';
        ctx.fillRect(Math.round(pX[i]), Math.round(pY[i]), pLand[i] || (time * 3 + i) % 2 < 1 ? 2 : 1, 1);
      }
      ctx.globalAlpha = 1;
    },
  };
}
