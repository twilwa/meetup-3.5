export type PickupKind = "star" | "prism" | "phase";

export interface BiomeTheme {
  id: string;
  name: string;
  rule: string;
  accent: string;
  accentSoft: string;
  backgroundA: string;
  backgroundB: string;
}

export const BIOME_THEMES: readonly BiomeTheme[] = [
  {
    id: "nebula-drift",
    name: "Nebula Drift",
    rule: "Hazards drift toward your last lane",
    accent: "#61f4ff",
    accentSoft: "rgba(97, 244, 255, 0.28)",
    backgroundA: "#07111f",
    backgroundB: "#12315f",
  },
  {
    id: "mirror-lattice",
    name: "Mirror Lattice",
    rule: "Reactive pickups fork danger into symmetric cells",
    accent: "#ff8ad8",
    accentSoft: "rgba(255, 138, 216, 0.28)",
    backgroundA: "#150820",
    backgroundB: "#4a1f5d",
  },
  {
    id: "solar-rail",
    name: "Solar Rail",
    rule: "Combo heat ramps speed and brightens the whole lane",
    accent: "#ffd166",
    accentSoft: "rgba(255, 209, 102, 0.28)",
    backgroundA: "#1b1003",
    backgroundB: "#6b3b05",
  },
] as const;

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pickBiomeTheme(seed: string): BiomeTheme {
  return BIOME_THEMES[hashSeed(seed) % BIOME_THEMES.length] ?? BIOME_THEMES[0]!;
}

export function pickPickupKind(seed: string, tick: number, score: number): PickupKind {
  const pressure = tick + Math.floor(score / 100);
  if (pressure >= 18) {
    return "phase";
  }
  if (pressure >= 8) {
    return "prism";
  }
  return "star";
}

export function nextTickInterval(comboMultiplier: number, mutationActive: boolean): number {
  const comboPressure = Math.max(0, comboMultiplier - 1) * 8;
  const mutationBoost = mutationActive ? 12 : 0;
  return Math.max(72, 146 - comboPressure - mutationBoost);
}
