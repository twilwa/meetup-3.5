import type {
  ArenaAdvanceInput,
  BiomeDefinition,
  ContentManifest,
  HazardActivation,
  RunState,
  SelectBiomeInput,
  TrailStepInput,
} from "./types.ts";

export function selectBiome(
  manifest: ContentManifest,
  input: SelectBiomeInput
): BiomeDefinition {
  const biome = manifest.biomes.find((b) => b.id === input.biomeId);
  if (!biome) {
    return { id: "nebula-drift", dominantRule: "drift" };
  }
  return biome;
}

export function armHazard(run: RunState, activation: HazardActivation): RunState {
  const hazard = {
    id: activation.id,
    type: "standard",
    cell: activation.cell,
    telegraphTicksRemaining: activation.telegraphTicks,
    state: "telegraph",
  };
  return {
    ...run,
    arena: {
      ...run.arena,
      hazards: [...run.arena.hazards, hazard],
    },
  };
}

export function recordTrailStep(run: RunState, input: TrailStepInput): RunState {
  if (run.arena.trailCells.includes(input.cell)) {
    return run;
  }
  return {
    ...run,
    arena: {
      ...run.arena,
      trailCells: [...run.arena.trailCells, input.cell],
    },
  };
}

export function advanceArena(run: RunState, input: ArenaAdvanceInput): RunState {
  const updatedHazards = run.arena.hazards.map((h) => {
    if (h.telegraphTicksRemaining > 0) {
      return {
        ...h,
        telegraphTicksRemaining: h.telegraphTicksRemaining - 1,
      };
    }
    if (h.telegraphTicksRemaining === 0 && h.state === "telegraph") {
      return { ...h, state: "armed" };
    }
    return h;
  });

  return {
    ...run,
    tick: input.tick,
    arena: {
      ...run.arena,
      hazards: updatedHazards,
    },
  };
}
