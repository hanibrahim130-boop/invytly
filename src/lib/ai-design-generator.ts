import type { DesignStyle } from "@/lib/mock-data";

export interface GeneratedPalette {
  accent: string;
  tint: string;
  ink: string;
}

export interface GeneratedOrnament {
  svgPaths: string;
  viewBox: string;
  seed: number;
}

export interface AIGenerationResult {
  palette: GeneratedPalette;
  ornament: GeneratedOrnament;
  layoutVariant: number;
  seed: number;
}

// ─── Seeded PRNG ──────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(...parts: (string | number)[]): number {
  const str = parts.join("|");
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

// ─── Color Palette Generation ─────────────────────────────────

const STYLE_PALETTES: Record<DesignStyle, GeneratedPalette[]> = {
  floral: [
    { accent: "#9f3f49", tint: "#f8efe9", ink: "#2a1f1d" },
    { accent: "#b15d74", tint: "#f7ecf0", ink: "#3a2129" },
    { accent: "#c97f5e", tint: "#f9efe8", ink: "#3a2418" },
    { accent: "#a06b8e", tint: "#f4edf2", ink: "#2c1f30" },
    { accent: "#b8792c", tint: "#f7efe2", ink: "#3a2c14" },
  ],
  modern: [
    { accent: "#1a1714", tint: "#f1eee9", ink: "#1a1714" },
    { accent: "#244f82", tint: "#eef3f8", ink: "#11233a" },
    { accent: "#287fa3", tint: "#edf7fb", ink: "#0f3140" },
    { accent: "#323232", tint: "#eeeeec", ink: "#1a1a1a" },
    { accent: "#3a3b45", tint: "#ececee", ink: "#1f2027" },
  ],
  glam: [
    { accent: "#b15d74", tint: "#f7ecf0", ink: "#3a2129" },
    { accent: "#b8792c", tint: "#f7efe2", ink: "#3a2c14" },
    { accent: "#7b3f8c", tint: "#f3edf6", ink: "#2c1933" },
    { accent: "#b85f27", tint: "#fbefe4", ink: "#3a2410" },
    { accent: "#9d2f2f", tint: "#f7ece9", ink: "#341212" },
  ],
  classic: [
    { accent: "#8a8073", tint: "#f5f1ea", ink: "#332f29" },
    { accent: "#6d4f7e", tint: "#efeaf2", ink: "#241c2b" },
    { accent: "#54774a", tint: "#eff3e8", ink: "#22311c" },
    { accent: "#4f8d8a", tint: "#edf7f5", ink: "#1c3534" },
    { accent: "#7b8f4b", tint: "#f2f5e9", ink: "#2f371c" },
  ],
  minimal: [
    { accent: "#323232", tint: "#eeeeec", ink: "#1a1a1a" },
    { accent: "#1a1714", tint: "#f1eee9", ink: "#1a1714" },
    { accent: "#4f8d8a", tint: "#edf7f5", ink: "#1c3534" },
    { accent: "#244f82", tint: "#eef3f8", ink: "#11233a" },
    { accent: "#8a8073", tint: "#f5f1ea", ink: "#332f29" },
  ],
};

function pickPalette(style: DesignStyle, rng: () => number): GeneratedPalette {
  const palettes = STYLE_PALETTES[style] ?? STYLE_PALETTES.minimal;
  return palettes[Math.floor(rng() * palettes.length)];
}

// ─── SVG Ornament Generation ──────────────────────────────────

function generateFloralOrnament(rng: () => number): string {
  const petals = 5 + Math.floor(rng() * 4); // 5-8 petals
  const ry = 14 + rng() * 8; // 14-22
  const rx = 5 + rng() * 3; // 5-8
  const innerR = 3 + rng() * 3; // 3-6
  const hasLeaves = rng() > 0.4;
  const leafAngle = 30 + rng() * 30;

  let svg = "";
  for (let i = 0; i < petals; i++) {
    const angle = (i * 360) / petals;
    svg += `<ellipse cx="50" cy="${50 - ry}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(${angle.toFixed(1)} 50 50)"/>`;
  }
  svg += `<circle cx="50" cy="50" r="${innerR.toFixed(1)}" fill="currentColor" stroke="none"/>`;
  if (hasLeaves) {
    svg += `<path d="M${50 - rx - 2} 50 Q${30} ${50 - leafAngle} ${20} 50 Q${30} ${50 + leafAngle} ${50 - rx - 2} 50" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>`;
    svg += `<path d="M${50 + rx + 2} 50 Q${70} ${50 - leafAngle} ${80} 50 Q${70} ${50 + leafAngle} ${50 + rx + 2} 50" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>`;
  }
  return svg;
}

function generateModernOrnament(rng: () => number): string {
  const bars = 3 + Math.floor(rng() * 2); // 3-4 bars
  const gap = 18;
  const startX = 50 - ((bars - 1) * gap) / 2;
  let svg = "";
  for (let i = 0; i < bars; i++) {
    const x = startX + i * gap;
    const h = 30 + rng() * 30;
    const y = 50 - h / 2;
    const w = 10 + rng() * 4;
    svg += `<rect x="${(x - w / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
  }
  // accent line
  if (rng() > 0.3) {
    svg += `<line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" stroke-width="0.8" opacity="0.3"/>`;
  }
  return svg;
}

function generateGlamOrnament(rng: () => number): string {
  const rings = 2 + Math.floor(rng() * 2); // 2-3 rings
  const startR = 10 + rng() * 5;
  const step = 8 + rng() * 4;
  let svg = "";
  for (let i = 0; i < rings; i++) {
    const r = startR + i * step;
    const sw = i === 0 ? 1.4 : 1 - i * 0.2;
    svg += `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="${sw.toFixed(1)}"/>`;
  }
  // sparkle dots
  const dots = 4 + Math.floor(rng() * 4);
  for (let i = 0; i < dots; i++) {
    const angle = (i * 360) / dots + rng() * 20;
    const rad = (angle * Math.PI) / 180;
    const dist = startR + rings * step + 6;
    const x = 50 + Math.cos(rad) * dist;
    const y = 50 + Math.sin(rad) * dist;
    svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="currentColor" stroke="none"/>`;
  }
  // center diamond
  svg += `<rect x="47" y="47" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.2" transform="rotate(45 50 50)"/>`;
  return svg;
}

function generateClassicOrnament(rng: () => number): string {
  const hasDiamond = rng() > 0.3;
  const hasDots = rng() > 0.4;
  const lineLen = 20 + rng() * 10;
  let svg = "";
  // left line
  svg += `<line x1="${(50 - lineLen - 6).toFixed(1)}" y1="50" x2="${(50 - 6).toFixed(1)}" y2="50" stroke="currentColor" stroke-width="1.4"/>`;
  // right line
  svg += `<line x1="${(50 + 6).toFixed(1)}" y1="50" x2="${(50 + lineLen + 6).toFixed(1)}" y2="50" stroke="currentColor" stroke-width="1.4"/>`;
  // center ornament
  if (hasDiamond) {
    svg += `<rect x="44" y="44" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(45 50 50)"/>`;
    svg += `<rect x="47" y="47" width="6" height="6" fill="currentColor" stroke="none" transform="rotate(45 50 50)"/>`;
  } else {
    svg += `<circle cx="50" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
    svg += `<circle cx="50" cy="50" r="2" fill="currentColor" stroke="none"/>`;
  }
  if (hasDots) {
    svg += `<circle cx="${(50 - lineLen - 10).toFixed(1)}" cy="50" r="1.6" fill="currentColor" stroke="none"/>`;
    svg += `<circle cx="${(50 + lineLen + 10).toFixed(1)}" cy="50" r="1.6" fill="currentColor" stroke="none"/>`;
  }
  return svg;
}

function generateMinimalOrnament(rng: () => number): string {
  const variant = Math.floor(rng() * 3);
  if (variant === 0) {
    // single line + dot
    const len = 30 + rng() * 20;
    return `<line x1="${(50 - len / 2).toFixed(1)}" y1="50" x2="${(50 + len / 2).toFixed(1)}" y2="50" stroke="currentColor" stroke-width="1.4"/><circle cx="50" cy="50" r="${(2.5 + rng() * 2).toFixed(1)}" fill="currentColor" stroke="none"/>`;
  }
  if (variant === 1) {
    // two thin lines
    const gap = 4 + rng() * 4;
    const len = 35 + rng() * 15;
    return `<line x1="${(50 - len / 2).toFixed(1)}" y1="${(50 - gap).toFixed(1)}" x2="${(50 + len / 2).toFixed(1)}" y2="${(50 - gap).toFixed(1)}" stroke="currentColor" stroke-width="1"/><line x1="${(50 - len / 2).toFixed(1)}" y1="${(50 + gap).toFixed(1)}" x2="${(50 + len / 2).toFixed(1)}" y2="${(50 + gap).toFixed(1)}" stroke="currentColor" stroke-width="1"/>`;
  }
  // single circle outline
  const r = 8 + rng() * 6;
  return `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
}

function generateOrnament(style: DesignStyle, rng: () => number): string {
  switch (style) {
    case "floral": return generateFloralOrnament(rng);
    case "modern": return generateModernOrnament(rng);
    case "glam": return generateGlamOrnament(rng);
    case "classic": return generateClassicOrnament(rng);
    default: return generateMinimalOrnament(rng);
  }
}

// ─── Public API ───────────────────────────────────────────────

export function generateDesign(
  style: DesignStyle,
  orderId: string,
  regenerationCount: number
): AIGenerationResult {
  const seed = hashSeed(orderId, regenerationCount);
  const rng = mulberry32(seed);
  const palette = pickPalette(style, rng);
  const ornamentSvg = generateOrnament(style, rng);
  const layoutVariant = Math.floor(rng() * 3);

  return {
    palette,
    ornament: {
      svgPaths: ornamentSvg,
      viewBox: "0 0 100 100",
      seed,
    },
    layoutVariant,
    seed,
  };
}
