// Surreal alien desert: an audio-reactive pixel-art background.
// Baked layers (built in resize), back to front: dithered sky and stars, ringed sun,
// companion moon, mesas, an impossible ruined temple, far dunes, a hazy far arch, mid dunes,
// the great rune arch, near dunes and flora.
// Live layers (drawn each frame): breathing dune rims (bass), rune glow (beat), hovering
// fragments, crystals with bass glow and beat ripples, the dark foreground frame, seed pods
// (energy), and windblown sand and glints (treble).

type Audio = { bass: number; treble: number; energy: number; beat: boolean };
interface Surf { c: HTMLCanvasElement; x: CanvasRenderingContext2D; d: ImageData; b: Uint32Array; w: number; h: number }

const HEX = [
  '#0e0716', '#1d0f2b', '#2e1740', '#472056', '#6a2d69', '#9a3d6e', '#c95a68', '#e8845f',
  '#f6b870', '#ffe3a8', '#5b3268', '#7a4070', '#8e4058', '#b85a58', '#d9825c', '#efad6c',
  '#4a2442', '#6e3450', '#94505a', '#b86d62', '#d9966e', '#1a6a78', '#2fc4c0', '#9af5e6',
  '#e03a9c', '#ff8fd6', '#d6c6ea', '#8f7cb4', '#5a4a86', '#7c5c96', '#fff6e0',
];
const RGB = HEX.map((s) => {
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
});
const PAL = RGB.map((c) => pack(c[0], c[1], c[2]));
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const STRATA = [0, 0.12, -0.08, 0.18, -0.14, 0.05];

function pack(r: number, g: number, b: number): number {
  return ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
}
function mixPal(a: number, b: number, f: number): number {
  const A = RGB[a], C = RGB[b];
  return pack(Math.round(A[0] + (C[0] - A[0]) * f), Math.round(A[1] + (C[1] - A[1]) * f), Math.round(A[2] + (C[2] - A[2]) * f));
}
function bay(x: number, y: number): number {
  return (BAYER[((y & 3) << 2) | (x & 3)] + 0.5) / 16;
}
function hash(a: number, b: number, s: number): number {
  let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(s | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x: number, s: number): number {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return hash(i, 17, s) * (1 - u) + hash(i + 1, 17, s) * u;
}
function mulberry(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const cl = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
const c01 = (v: number): number => (v > 0 ? (v < 1 ? v : 1) : 0);

function surf(w: number, h: number): Surf {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d') as CanvasRenderingContext2D;
  const d = x.createImageData(w, h);
  return { c, x, d, b: new Uint32Array(d.data.buffer), w, h };
}
function put(s: Surf, x: number, y: number, col: number): void {
  if (x >= 0 && y >= 0 && x < s.w && y < s.h) s.b[(y | 0) * s.w + (x | 0)] = col;
}

export function createDesertScene() {
  let W = 0, H = 0, time = 0;
  let bg: HTMLCanvasElement | null = null, fg: HTMLCanvasElement | null = null;
  // Smoothed audio state; runeGlow is a decaying beat envelope (only set by real beats).
  let bassS = 0, trebS = 0, enS = 0, runeGlow = 0, lastBeat = false;
  let horizon = 0, sunX = 0, sunY = 0, sunR = 3, ringRx = 6, ringRy = 2, rockL = 0, rockR = 0, uS = 1;
  let ridgeMid = new Int16Array(0), ridgeFg = new Int16Array(0), lift = new Int8Array(0);
  let runeXY = new Int16Array(0), glyphStart = new Uint16Array(1), glyphX = new Int16Array(0), glyphY = new Int16Array(0);
  let glyphN = 0, glyphH = 4;
  const fragC: HTMLCanvasElement[] = [];
  const fragX = new Float32Array(8), fragY = new Float32Array(8), fragPh = new Float32Array(8);
  let fragN = 0;
  const CMAX = 10;
  const crysX = new Int16Array(CMAX), crysY = new Int16Array(CMAX), crysSN = new Uint8Array(CMAX);
  const shardDx = new Int8Array(CMAX * 4), shardH = new Uint8Array(CMAX * 4);
  let crysN = 0, shardW = 1;
  const RMAX = 40, RLIFE = 1.6;
  const ripX = new Float32Array(RMAX), ripY = new Float32Array(RMAX), ripAge = new Float32Array(RMAX), ripOn = new Uint8Array(RMAX);
  let rSpeed = 12;
  let podXY = new Int16Array(0), podN = 0, podS = 1;
  const PMAX = 200;
  const pX = new Float32Array(PMAX), pBase = new Float32Array(PMAX), pS = new Float32Array(PMAX), pPh = new Float32Array(PMAX);
  let pN = 0;
  const MOTES = 10;
  const moteA = new Float32Array(MOTES);

  function build(w: number, h: number): void {
    W = w;
    H = h;
    if (typeof document === 'undefined') return;
    const rnd = mulberry(0x5eedd);
    const tall = w / h < 1.1;
    horizon = Math.max(1, Math.round(h * 0.5));
    const gH = Math.max(1, h - horizon);
    const tU = Math.max(0.6, Math.min(w / 320, h / 76));
    uS = Math.max(1, h / 100);
    const B = surf(w, h), F = surf(w, h);

    // Sky: dithered vertical ramp, a warm radial glow around the sun, faint striations and stars.
    sunR = Math.max(3, Math.round(Math.min(w * 0.05, h * 0.09)));
    sunX = Math.round(w * 0.7);
    sunY = horizon - Math.round(sunR * 1.5);
    ringRx = Math.round(sunR * 2.3);
    ringRy = Math.max(2, Math.round(sunR * 0.5));
    const SKY = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let y = 0; y < h; y++) {
      const t = Math.min(1, y / horizon);
      for (let x = 0; x < w; x++) {
        const dx = (x - sunX) / (w * 0.45), dy = (y - sunY) / Math.max(1, horizon * 0.9);
        const g = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
        let v = t * 0.82 + g * g * 0.5;
        if (t > 0.3 && t < 0.9 && Math.sin(y * 1.1 + vnoise(x * 0.035, 5) * 7) > 0.8) v += 0.07;
        const i = cl(Math.round(v * 7 + bay(x, y) - 0.5), 0, 7);
        put(B, x, y, PAL[SKY[i]]);
        if (i < 3 && hash(x, y, 3) > 0.993) put(B, x, y, PAL[hash(x, y, 4) > 0.6 ? 26 : 29]);
      }
    }
    // Ringed sun: back half of the tilted ring, then the disc, then the front half.
    const ring = (front: boolean) => {
      for (let dy = -ringRy - sunR; dy <= ringRy + sunR; dy++) {
        for (let dx = -ringRx - 1; dx <= ringRx + 1; dx++) {
          const ey = dy - dx * 0.15;
          if (ey >= 0 !== front) continue;
          const e = (dx / ringRx) ** 2 + (ey / ringRy) ** 2;
          if (e < 0.62 || e > 1 || (e > 0.78 && e < 0.84)) continue;
          put(B, sunX + dx, sunY + dy, PAL[front ? (dx > ringRx * 0.3 ? 9 : 8) : 7]);
        }
      }
    };
    ring(false);
    for (let dy = -sunR; dy <= sunR; dy++) {
      for (let dx = -sunR; dx <= sunR; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > sunR + 0.3) continue;
        const v = 1 - d / (sunR + 0.3) + (dx - dy) * 0.03;
        put(B, sunX + dx, sunY + dy, PAL[v + bay(dx + sunX, dy + sunY) * 0.25 > 0.45 ? 9 : v > 0.12 ? 8 : 7]);
      }
    }
    ring(true);
    // Companion moon: a crescent lit from the low sun.
    const mr = Math.max(2, Math.round(sunR * 0.55));
    const mx = Math.round(w * (tall ? 0.24 : 0.13)), my = Math.round(horizon * 0.32);
    for (let dy = -mr; dy <= mr; dy++) {
      for (let dx = -mr; dx <= mr; dx++) {
        if (dx * dx + dy * dy > mr * mr + mr) continue;
        const l = (dx + 0.4 * dy) / mr;
        let c = l > -0.15 ? 26 : l > -0.6 ? 27 : 3;
        if (c === 26 && hash(dx, dy, 8) > 0.82) c = 27;
        put(B, mx + dx, my + dy, PAL[c]);
      }
    }
    // Distant flat-topped mesas on the horizon.
    for (let x = 0; x < w; x++) {
      const m = vnoise(x * 0.022, 51) - 0.52;
      if (m <= 0) continue;
      const mh = Math.round(Math.min(m * 4, 1) * h * 0.07);
      for (let y = horizon - mh; y <= horizon + 2; y++) {
        put(B, x, y, PAL[y === horizon - mh ? 6 : (x + y) & 1 && y > horizon - 2 ? 4 : 5]);
      }
    }
    // Impossible temple: stepped tiers, broken colonnade, detached block, inverted spire.
    const bw = Math.max(10, Math.round(24 * tU));
    const tx = Math.round(w * 0.86) - (bw >> 1);
    let ty = horizon + 1;
    const box = (x0: number, y0: number, ww: number, hh: number, holes: number) => {
      for (let y = y0; y < y0 + hh; y++) {
        for (let x = x0; x < x0 + ww; x++) {
          if (hash(x, y, 11) < holes) continue;
          put(B, x, y, PAL[y === y0 || x >= x0 + ww * 0.65 ? 29 : 28]);
        }
      }
    };
    const th = Math.max(2, Math.round(3 * tU));
    box(tx, ty - th, bw, th, 0.04);
    ty -= th;
    const w2 = Math.round(bw * 0.72), x2 = tx + ((bw - w2) >> 1);
    box(x2, ty - th, w2, th, 0.06);
    ty -= th;
    const ch = Math.max(3, Math.round(5 * tU));
    for (let x = x2 + 1; x < x2 + w2 - 1; x += 2) if (hash(x, 1, 12) > 0.2) box(x, ty - ch + (hash(x, 2, 12) > 0.75 ? 2 : 0), 1, ch, 0);
    box(x2, ty - ch - 1, w2 - 3, 1, 0.1);
    ty -= ch + 1;
    const w3 = Math.round(bw * 0.46), x3 = tx + Math.round(bw * 0.34);
    box(x3, ty - 2 - th, w3, th, 0.05);
    ty -= th + 2;
    const ph = Math.max(3, Math.round(6 * tU)), cT = x3 + (w3 >> 1);
    for (let r = 0; r < ph; r++) {
      const half = Math.round(((r + 1) * w3 * 0.5) / ph);
      box(cT - half, ty - 2 - r, half * 2 + 1, 1, 0.03);
    }
    for (let i = 0; i < ph >> 1; i++) put(B, cT, ty - 2 - ph - i, PAL[29]);

    // Dune layers use sharp-crested ridges; faces toward the sun are lit and ripple lines add texture.
    const makeRidge = (base: number, amp: number, period: number, seed: number): Int16Array<ArrayBuffer> => {
      const r = new Int16Array(w + 2);
      const p1 = hash(seed, 1, 9) * 6.28, p2 = hash(seed, 2, 9) * 6.28;
      for (let x = 0; x < w + 2; x++) {
        const f = x / period;
        const crest = Math.pow(1 - Math.abs(Math.sin(f + p1)), 1.6);
        r[x] = Math.round(base - amp * (crest * 0.7 + Math.sin(f * 2.3 + p2) * 0.2 + vnoise(f * 3, seed) * 0.3));
      }
      return r;
    };
    const fillDune = (r: Int16Array, ramp: number[], rip: boolean, seed: number, dk: number) => {
      for (let x = 0; x < w; x++) {
        const top = r[x], sl = r[x + 1] - r[x > 0 ? x - 1 : 0];
        for (let y = Math.max(0, top); y < h; y++) {
          const d = y - top;
          let v = 0.5 + sl * 0.3 - d * dk + (hash(x, y, seed) - 0.5) * 0.16;
          if (rip && (y + Math.round(Math.sin(x * 0.19 + y * 0.11) * 1.6)) % 4 === 0) v -= 0.28;
          if (d === 0) v += 0.4;
          const q = v * 2 + bay(x, y) - 0.5;
          put(B, x, y, PAL[ramp[q < 0.5 ? 0 : q < 1.5 ? 1 : 2]]);
        }
      }
    };
    const m2Base = Math.round(horizon + gH * 0.62);
    ridgeMid = makeRidge(m2Base, gH * 0.2, Math.max(14, w * 0.11), 25);

    // Eroded arches: hourglass legs, ragged crown, patterned strata, rim light, and carved runes.
    const gpx: number[] = [], glyphs: number[] = [], gstart: number[] = [];
    const gh = h > 150 ? 5 : 4;
    const drawArch = (cx: number, base: number, rx: number, AH: number, s: number, haze: number, runes: boolean) => {
      const ramp = [16, 17, 18, 19, 20].map((i) => (haze > 0 ? mixPal(i, 6, haze) : PAL[i]));
      const bh = Math.max(2, Math.round(AH / 14));
      const inside = (x: number, y: number): boolean => {
        const ny = (base - y) / AH, nx = (x - cx) / rx;
        if (ny < 0) return false;
        const wOut = 1 - 0.1 * ny - 0.14 * Math.sin(Math.min(1, ny / 0.7) * Math.PI) + (vnoise(y * 0.35, s) - 0.5) * 0.2;
        if (Math.abs(nx) > wOut || ny > 1 - 0.22 * nx * nx + (vnoise(x * 0.25, s + 1) - 0.5) * 0.1) return false;
        const hx = nx / 0.55, hy = ny / 0.62;
        return hx * hx + hy * hy > 1 + (vnoise(y * 0.5 + x * 0.1, s + 2) - 0.5) * 0.14;
      };
      for (let y = Math.max(0, base - AH - 2); y <= Math.min(h - 1, base); y++) {
        for (let x = Math.max(0, cx - rx - 2); x <= Math.min(w - 1, cx + rx + 2); x++) {
          if (!inside(x, y)) continue;
          const ny = (base - y) / AH, nx = (x - cx) / rx;
          let v = 0.42 + nx * 0.32;
          if (!inside(x, y - 1)) v += 0.3;
          if (!inside(x + 1, y)) v += 0.18;
          if (!inside(x - 1, y)) v -= 0.18;
          if (y < base && !inside(x, y + 1)) v -= 0.25;
          const sv = base - y + (vnoise(x * 0.07, s + 3) - 0.5) * 5 + nx * 3;
          const band = Math.floor(sv / bh), bm = ((band % 6) + 6) % 6;
          v += STRATA[bm];
          if (bm === 2 && (x + Math.floor(sv)) % 3 === 0) v -= 0.22;
          if (bm === 4 && ((x >> 1) + band) % 2 === 0 && Math.floor(sv) % bh === 0) v += 0.25;
          v += (hash(x, y, s) - 0.5) * 0.18 - (1 - Math.min(1, ny * 4)) * 0.2;
          put(B, x, y, ramp[cl(Math.round(v * 4 + bay(x, y) - 0.5), 0, 4)]);
        }
      }
      if (!runes) return;
      const carve = (gx: number, gy: number) => {
        if (gx < 1 || gx + 4 > w || gy < 1 || gy + gh + 3 >= ridgeMid[gx + 1]) return;
        for (let yy = -1; yy <= gh; yy++) for (let xx = -1; xx <= 3; xx++) if (!inside(gx + xx, gy + yy)) return;
        gstart.push(gpx.length >> 1);
        glyphs.push(gx, gy);
        for (let yy = 0; yy < gh; yy++) {
          for (let xx = 0; xx < 3; xx++) {
            if (rnd() > (xx === 1 ? 0.75 : 0.45)) continue;
            gpx.push(gx + xx, gy + yy);
            put(B, gx + xx, gy + yy, ramp[0]);
          }
        }
      };
      for (const side of [-1, 1]) {
        const lx = cx + side * Math.round(rx * 0.72) - 1;
        for (let yy = base - Math.round(AH * 0.3) - gh; yy > base - AH * 0.6; yy -= gh + 2) carve(lx, yy);
      }
      const sy = base - Math.round(AH * 0.81) - (gh >> 1);
      for (let xx = cx - Math.round(rx * 0.45); xx < cx + rx * 0.45; xx += 5) carve(xx, sy);
    };

    const rFar = makeRidge(horizon + Math.max(2, Math.round(gH * 0.08)), gH * 0.12, Math.max(10, w * 0.06), 21);
    fillDune(rFar, [4, 10, 11], false, 22, 1.4 / gH);
    if (!tall) drawArch(Math.round(w * 0.2), Math.round(horizon + gH * 0.35) + 2, Math.round(Math.min(w * 0.06, h * 0.3)), Math.round(h * 0.36), 31, 0.5, false);
    const r1 = makeRidge(horizon + gH * 0.35, gH * 0.22, Math.max(12, w * 0.09), 23);
    fillDune(r1, [12, 13, 14], true, 24, 1.1 / gH);
    for (let k = 0; k < 10; k++) {
      const x = Math.floor(rnd() * w), y = r1[x] + 2 + Math.floor(rnd() * 3);
      put(B, x, y, PAL[22]);
      put(B, x, y - 1, PAL[23]);
    }
    const acx = Math.round(w * (tall ? 0.3 : 0.45));
    const arx = Math.round(tall ? w * 0.38 : Math.min(w * 0.14, h * 0.58));
    const aH = Math.round(h * (tall ? 0.5 : 0.66));
    drawArch(acx, m2Base + 1, arx, aH, 33, 0, true);
    fillDune(ridgeMid, [13, 14, 15], true, 26, 0.9 / gH);
    runeXY = Int16Array.from(gpx);
    glyphN = gstart.length;
    glyphStart = new Uint16Array(glyphN + 1);
    glyphStart.set(gstart);
    glyphStart[glyphN] = gpx.length >> 1;
    glyphX = new Int16Array(glyphN);
    glyphY = new Int16Array(glyphN);
    for (let g = 0; g < glyphN; g++) {
      glyphX[g] = glyphs[g * 2];
      glyphY[g] = glyphs[g * 2 + 1];
    }
    glyphH = gh;

    // Foreground frame: dark rock outcrops on both edges plus a low dune lip, with warm rim light.
    ridgeFg = makeRidge(h - Math.max(3, Math.round(gH * 0.12)), gH * 0.08, Math.max(16, w * 0.13), 27);
    rockL = Math.round(w * (tall ? 0.24 : 0.13));
    rockR = w - Math.round(w * (tall ? 0.14 : 0.07));
    const rockH = Math.round(gH * (tall ? 0.42 : 0.6));
    const rockTop = (x: number): number => {
      if (x < rockL) return Math.round(rockH * Math.pow(1 - x / rockL, 0.55) * (0.88 + vnoise(x * 0.35, 41) * 0.24));
      if (x >= rockR) return Math.round(rockH * 0.62 * Math.pow(1 - (w - 1 - x) / (w - rockR), 0.5) * (0.85 + vnoise(x * 0.4, 43) * 0.3));
      return 0;
    };
    const fgTop = new Int16Array(w + 2);
    for (let x = 0; x < w + 2; x++) fgTop[x] = ridgeFg[x] - rockTop(Math.min(x, w - 1));
    for (let x = 0; x < w; x++) {
      const fl = ridgeFg[x];
      for (let y = Math.max(0, fgTop[x]); y < h; y++) {
        const d = y - fgTop[x];
        let c = 1;
        if (d === 0) c = y < fl ? 17 : 16;
        else if (y < fl && (x < sunX ? fgTop[x + 1] : fgTop[Math.max(0, x - 1)]) > y) c = 12;
        else if (d < 3 && bay(x, y) > 0.55 + d * 0.15) c = 2;
        else if ((y < fl && (y * 2 + (x >> 2)) % 7 === 0) || hash(x, y, 47) > 0.92) c = 2;
        else if (h - y <= 2 && bay(x, y) > 0.4) c = 0;
        put(F, x, y, PAL[c]);
      }
    }

    // Branching flora: mid-ground plants are baked into bg, foreground silhouettes into fg.
    // Pod positions are collected so the pods can glow live.
    const pods: number[] = [];
    const plant = (S: Surf, x: number, y: number, len: number, depth: number, stem: number) => {
      const grow = (fx: number, fy: number, a: number, L: number, dp: number, curl: number) => {
        for (let i = 0; i < L; i++) {
          fx += Math.cos(a);
          fy += Math.sin(a);
          a += curl;
          put(S, Math.round(fx), Math.round(fy), stem);
          if (dp === depth && L > 3) put(S, Math.round(fx) + 1, Math.round(fy), stem);
        }
        if (dp <= 0) {
          pods.push(Math.round(fx), Math.round(fy));
          return;
        }
        grow(fx, fy, a - 0.45 - rnd() * 0.35, L * 0.68, dp - 1, -curl * 1.3 - 0.02);
        grow(fx, fy, a + 0.35 + rnd() * 0.4, L * 0.62, dp - 1, curl * 1.2 + 0.02);
      };
      grow(x, y, -Math.PI / 2 + (rnd() - 0.5) * 0.3, len, depth, (rnd() - 0.5) * 0.06);
    };
    for (let k = 0; k < (tall ? 2 : 3); k++) {
      const x = Math.round(rockL + 6 + rnd() * Math.max(1, rockR - rockL - 12));
      plant(B, x, ridgeMid[x] + 1, Math.max(3, Math.round(gH * 0.07)), 2, PAL[16]);
    }
    const lx = Math.round(rockL * 0.55);
    plant(F, lx, fgTop[lx] + 1, Math.max(4, Math.round(gH * 0.13)), 3, PAL[1]);
    const fx0 = Math.round(w * (tall ? 0.62 : 0.7));
    plant(F, fx0, fgTop[fx0] + 1, Math.max(3, Math.round(gH * 0.08)), 2, PAL[1]);
    if (!tall) {
      const rx2 = Math.min(w - 2, rockR + 3);
      plant(F, rx2, fgTop[rx2] + 1, Math.max(3, Math.round(gH * 0.1)), 2, PAL[1]);
    }
    podXY = Int16Array.from(pods);
    podN = pods.length >> 1;
    podS = h > 150 ? 2 : 1;

    // Floating stone fragments: a keystone above the arch plus scattered sky shards.
    const makeFrag = (sw: number, sh: number, seed: number): HTMLCanvasElement => {
      const S = surf(sw, sh);
      for (let r = 0; r < sh; r++) {
        const t = r / sh;
        const half = (sw / 2) * (t < 0.25 ? 0.8 + t * 0.8 : Math.pow(1 - (t - 0.25) / 0.75, 0.9)) * (0.85 + vnoise(r * 0.8, seed) * 0.3);
        for (let x = 0; x < sw; x++) {
          const dx = x - sw / 2 + 0.5;
          if (Math.abs(dx) > half) continue;
          const v = 0.45 + (dx / sw) * 0.9 + (r === 0 ? 0.35 : 0) - t * 0.35 + (r % 3 === 1 ? -0.12 : 0) + (hash(x, r, seed) - 0.5) * 0.2;
          put(S, x, r, PAL[16 + cl(Math.round(v * 4 + bay(x, r) - 0.5), 0, 4)]);
        }
      }
      S.x.putImageData(S.d, 0, 0);
      return S.c;
    };
    fragN = 0;
    fragC.length = 0;
    const addFrag = (x: number, y: number, sw: number) => {
      fragC.push(makeFrag(sw, Math.round(sw * 0.9) + 1, 60 + fragN));
      fragX[fragN] = x;
      fragY[fragN] = y;
      fragPh[fragN] = rnd() * 6.28;
      fragN++;
    };
    const archTop = m2Base + 1 - aH;
    const kw = Math.max(4, Math.round(arx * 0.2));
    if (archTop - kw - 3 > 1) addFrag(acx - (kw >> 1) + 2, archTop - kw - 3, kw);
    for (let tries = 0; tries < 60 && fragN < 6; tries++) {
      const sw = Math.round((3 + rnd() * 5) * Math.max(0.8, tU));
      const x = Math.round(rnd() * (w - sw)), y = Math.round(2 + rnd() * Math.max(1, horizon * 0.72 - sw));
      const cxF = x + sw / 2, cyF = y + sw / 2;
      if (Math.abs(cxF - sunX) < ringRx + 5 && Math.abs(cyF - sunY) < sunR + 6) continue;
      if (Math.abs(cxF - mx) < mr + 5 && Math.abs(cyF - my) < mr + 5) continue;
      if (cxF > acx - arx - 3 && cxF < acx + arx + 3 && cyF > archTop - 4) continue;
      if (cxF > tx - 3 && cxF < tx + bw + 3) continue;
      let near = false;
      for (let j = 0; j < fragN; j++) if (Math.abs(fragX[j] - x) < 14 && Math.abs(fragY[j] - y) < 10) near = true;
      if (!near) addFrag(x, y, sw);
    }

    // Crystal clusters rest on the open sand between the mid dunes and the foreground lip.
    crysN = 0;
    shardW = h > 150 ? 2 : 1;
    const want = tall ? 4 : w > 400 ? 8 : 6;
    for (let tries = 0; tries < 80 && crysN < want; tries++) {
      const x = Math.round(rockL + 4 + rnd() * Math.max(1, rockR - rockL - 8));
      const top = ridgeMid[x] + 2, bot = ridgeFg[x] - 3;
      if (bot < top) continue;
      let ok = true;
      for (let j = 0; j < crysN; j++) if (Math.abs(crysX[j] - x) < 12) ok = false;
      if (!ok) continue;
      crysX[crysN] = x;
      crysY[crysN] = Math.round(top + rnd() * (bot - top));
      const n = 2 + Math.floor(rnd() * 3);
      crysSN[crysN] = n;
      for (let k = 0; k < n; k++) {
        shardDx[crysN * 4 + k] = k - (n >> 1);
        shardH[crysN * 4 + k] = Math.max(2, Math.round(uS * (2 + rnd() * 2 + (k === n >> 1 ? 2 : 0))));
      }
      crysN++;
    }
    ripOn.fill(0);
    rSpeed = 8 + h * 0.06;

    // Particle pools: sand drifting over the ground and airborne dust just above the horizon.
    pN = Math.min(PMAX, Math.max(30, Math.round((w * h) / 180)));
    for (let i = 0; i < pN; i++) {
      pX[i] = rnd() * w;
      pBase[i] = rnd() < 0.72 ? horizon + 2 + rnd() * (gH - 3) : horizon - rnd() * gH * 0.3;
      pS[i] = 0.5 + rnd();
      pPh[i] = rnd();
    }
    for (let i = 0; i < MOTES; i++) moteA[i] = (i / MOTES) * 6.2832 + rnd();
    lift = new Int8Array(w);
    B.x.putImageData(B.d, 0, 0);
    F.x.putImageData(F.d, 0, 0);
    bg = B.c;
    fg = F.c;
  }

  function resize(width: number, height: number): void {
    const w = Math.floor(width), h = Math.floor(height);
    if (w >= 8 && h >= 8 && w <= 4096 && h <= 4096) build(w, h);
  }

  function draw(ctx: CanvasRenderingContext2D, width: number, height: number, audio: Audio, dt: number): void {
    const w = Math.floor(width), h = Math.floor(height);
    if (!(w > 0 && h > 0) || w > 4096 || h > 4096) return;
    if (w < 8 || h < 8) {
      ctx.fillStyle = HEX[2];
      ctx.fillRect(0, 0, w, h);
      return;
    }
    if (w !== W || h !== H || !bg) build(w, h);
    if (!bg || !fg) return;
    const step = dt > 0 ? Math.min(dt, 0.1) : 0;
    time += step;

    // Audio smoothing. Beats only come from real input, on the rising edge.
    const k = 1 - Math.exp(-step * 8);
    bassS += (c01(audio ? audio.bass : 0) - bassS) * k;
    trebS += (c01(audio ? audio.treble : 0) - trebS) * k;
    enS += (c01(audio ? audio.energy : 0) - enS) * k;
    const beat = !!(audio && audio.beat);
    if (beat && !lastBeat) {
      runeGlow = 1;
      for (let c = 0; c < crysN; c++) {
        for (let r = 0; r < RMAX; r++) {
          if (ripOn[r]) continue;
          ripOn[r] = 1;
          ripAge[r] = 0;
          ripX[r] = crysX[c];
          ripY[r] = crysY[c] + 1;
          break;
        }
      }
    }
    lastBeat = beat;
    runeGlow *= Math.exp(-step * 2.2);

    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0);

    // Motes orbit the sun ring and are hidden behind the disc.
    ctx.fillStyle = HEX[trebS > 0.5 ? 30 : 9];
    for (let i = 0; i < MOTES; i++) {
      moteA[i] += step * (0.18 + (i % 3) * 0.05);
      const ca = Math.cos(moteA[i]), sa = Math.sin(moteA[i]);
      const dx = ca * ringRx * (0.86 + (i % 3) * 0.06), dy = sa * ringRy + dx * 0.15;
      if (sa < 0 && dx * dx + dy * dy < sunR * sunR) continue;
      ctx.fillRect(Math.round(sunX + dx), Math.round(sunY + dy), 1, 1);
    }

    // Bass breathes the near dune crest upward in a slow travelling swell.
    const amp = Math.max(1.5, h / 50) * bassS;
    if (amp > 0.3) {
      for (let x = 0; x < w; x++) lift[x] = Math.round(amp * (0.6 + 0.4 * Math.sin(x * 0.07 + time * 0.9)));
      ctx.fillStyle = HEX[14];
      for (let x = 0; x < w; x++) if (lift[x] > 0) ctx.fillRect(x, ridgeMid[x] - lift[x], 1, lift[x] + 1);
      ctx.fillStyle = HEX[15];
      for (let x = 0; x < w; x++) if (lift[x] > 0) ctx.fillRect(x, ridgeMid[x] - lift[x], 1, 1);
    }

    // Carved runes: a faint slow pulse, flaring on beats and decaying through teal to dim.
    for (let g = 0; g < glyphN; g++) {
      const lvl = 0.22 + 0.08 * Math.sin(time * 0.6 + g * 0.9) + runeGlow * 0.8 + bassS * 0.12;
      ctx.fillStyle = HEX[lvl < 0.3 ? 21 : lvl < 0.55 ? 22 : lvl < 0.8 ? 23 : 30];
      for (let p = glyphStart[g]; p < glyphStart[g + 1]; p++) ctx.fillRect(runeXY[p * 2], runeXY[p * 2 + 1], 1, 1);
      if (lvl > 0.6) {
        const gx = glyphX[g], gy = glyphY[g];
        ctx.globalAlpha = Math.min(1, (lvl - 0.6) * 2.5);
        ctx.fillStyle = HEX[22];
        for (let xx = -1; xx <= 3; xx += 2) {
          ctx.fillRect(gx + xx, gy - 1, 1, 1);
          ctx.fillRect(gx + xx, gy + glyphH, 1, 1);
        }
        ctx.globalAlpha = 1;
      }
    }

    // Hovering fragments bob slowly, each carrying a small rune light.
    const fl = 0.25 + runeGlow * 0.75;
    const fAmp = Math.max(1, h / 60);
    for (let i = 0; i < fragN; i++) {
      const x = Math.round(fragX[i]), y = Math.round(fragY[i] + Math.sin(time * 0.5 + fragPh[i]) * fAmp);
      ctx.drawImage(fragC[i], x, y);
      ctx.fillStyle = HEX[fl < 0.4 ? 21 : fl < 0.7 ? 22 : 23];
      ctx.fillRect(x + (fragC[i].width >> 1), y + 1, 1, 1);
    }

    // Beat ripples: dotted ellipses expanding from each crystal cluster.
    for (let r = 0; r < RMAX; r++) {
      if (!ripOn[r]) continue;
      ripAge[r] += step;
      const a = ripAge[r];
      if (a > RLIFE) {
        ripOn[r] = 0;
        continue;
      }
      const rx = 1.5 + a * rSpeed, ry = Math.max(1, rx * 0.3), f = a / RLIFE;
      ctx.fillStyle = HEX[f < 0.35 ? 23 : f < 0.7 ? 22 : 21];
      const n = Math.max(12, Math.round(rx * 1.5)) & ~1;
      for (let i = 0; i < n; i += 2) {
        const t = (i / n) * 6.2832 + a * 0.4;
        ctx.fillRect(Math.round(ripX[r] + Math.cos(t) * rx), Math.round(ripY[r] + Math.sin(t) * ry), 1, 1);
      }
    }

    // Crystals: bass swells the halo on the sand and brightens the shards.
    const glow = c01(0.18 + 0.08 * Math.sin(time * 0.7) + bassS * 0.8 + runeGlow * 0.2);
    for (let c = 0; c < crysN; c++) {
      const cx = crysX[c], cy = crysY[c], R = 1 + Math.round(glow * 4 * uS);
      ctx.globalAlpha = glow * 0.6;
      ctx.fillStyle = HEX[22];
      for (let dx = -R; dx <= R; dx += 2) ctx.fillRect(cx + dx, cy + 1, 1, 1);
      for (let dx = 1 - R; dx < R - 1; dx += 2) ctx.fillRect(cx + dx, cy + 2, 1, 1);
      ctx.globalAlpha = 1;
      for (let s = c * 4; s < c * 4 + crysSN[c]; s++) {
        const x = cx + shardDx[s] * shardW, hh = shardH[s], top = cy - hh + 1;
        ctx.fillStyle = HEX[shardDx[s] <= 0 ? 21 : 22];
        ctx.fillRect(x, top, shardW, hh);
        ctx.fillStyle = HEX[glow > 0.75 ? 30 : 23];
        ctx.fillRect(x, top, shardW, Math.max(1, hh >> 2));
        if (glow > 0.3) {
          ctx.globalAlpha = Math.min(1, (glow - 0.3) * 1.2);
          ctx.fillStyle = HEX[23];
          ctx.fillRect(x, top + 1, shardW, hh - 1);
          ctx.globalAlpha = 1;
        }
      }
    }

    ctx.drawImage(fg, 0, 0);

    // The foreground dune lip breathes more gently.
    if (amp > 0.3) {
      const a2 = amp * 0.6;
      for (let x = rockL; x < rockR; x++) lift[x] = Math.round(a2 * (0.6 + 0.4 * Math.sin(x * 0.09 - time * 0.7)));
      ctx.fillStyle = HEX[1];
      for (let x = rockL; x < rockR; x++) if (lift[x] > 0) ctx.fillRect(x, ridgeFg[x] - lift[x], 1, lift[x] + 1);
      ctx.fillStyle = HEX[16];
      for (let x = rockL; x < rockR; x++) if (lift[x] > 0) ctx.fillRect(x, ridgeFg[x] - lift[x], 1, 1);
    }

    // Seed pods: magenta base with a highlight that swells with energy.
    const off = podS >> 1;
    ctx.fillStyle = HEX[24];
    for (let i = 0; i < podN; i++) ctx.fillRect(podXY[i * 2] - off, podXY[i * 2 + 1], podS, podS + 1);
    ctx.fillStyle = HEX[25];
    for (let i = 0; i < podN; i++) {
      const pg = c01(0.3 + 0.15 * Math.sin(time * 1.3 + i) + enS * 0.7);
      const x = podXY[i * 2] - off, y = podXY[i * 2 + 1];
      ctx.globalAlpha = pg;
      ctx.fillRect(x, y, podS, 1);
      if (pg > 0.75) {
        ctx.globalAlpha = (pg - 0.75) * 2;
        ctx.fillRect(x - 1, y, 1, 1);
        ctx.fillRect(x + podS, y, 1, 1);
      }
    }
    ctx.globalAlpha = 1;

    // Windblown sand: energy speeds the wind, and treble reveals more dust and more glints.
    const wind = w * 0.035 * (0.75 + 0.25 * Math.sin(time * 0.23)) * (1 + enS * 1.6);
    const vis = Math.floor(pN * (0.3 + 0.7 * Math.max(trebS, enS * 0.5)));
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = HEX[15];
    for (let i = 0; i < pN; i++) {
      pX[i] += wind * pS[i] * step;
      if (pX[i] > w + 2) pX[i] -= w + 4;
      if (i >= vis) continue;
      const y = Math.round(pBase[i] + Math.sin(time * 1.1 + pPh[i] * 6.28) * 1.5);
      ctx.fillRect(Math.round(pX[i]), y, (i & 3) === 0 ? 2 : 1, 1);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = HEX[30];
    const thr = 0.98 - trebS * 0.25;
    for (let i = 0; i < vis; i++) {
      const b = Math.sin(time * (1.2 + pS[i]) + pPh[i] * 40);
      if (b < thr) continue;
      const x = Math.round(pX[i]), y = Math.round(pBase[i] + Math.sin(time * 1.1 + pPh[i] * 6.28) * 1.5);
      ctx.fillRect(x, y, 1, 1);
      if (b > 0.995 && trebS > 0.35) {
        ctx.fillRect(x - 1, y, 3, 1);
        ctx.fillRect(x, y - 1, 1, 3);
      }
    }
  }

  return { resize, draw };
}
