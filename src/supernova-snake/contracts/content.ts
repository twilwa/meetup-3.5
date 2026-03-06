import type {
  ComboEvent,
  ComboState,
  ContentManifest,
  ReactivePickupOutcome,
  ReactivePickupTrigger,
  RunState,
  SpawnRequest,
  SpawnedPickup,
  ValidationResult,
} from "./types.ts";

export function validateContentManifest(manifest: ContentManifest): ValidationResult {
  const errors: string[] = [];
  
  if (!manifest.foods || manifest.foods.length === 0) {
    errors.push("manifest must have at least one food");
  }
  if (!manifest.hazards || manifest.hazards.length === 0) {
    errors.push("manifest must have at least one hazard");
  }
  if (!manifest.biomes || manifest.biomes.length === 0) {
    errors.push("manifest must have at least one biome");
  }
  if (!manifest.challengeCards || manifest.challengeCards.length === 0) {
    errors.push("manifest must have at least one challenge card");
  }
  
  for (const food of manifest.foods || []) {
    if (!food.id) errors.push("food missing id");
    if (!food.family) errors.push("food missing family");
    if (!food.cue) errors.push("food missing cue");
  }
  
  for (const hazard of manifest.hazards || []) {
    if (!hazard.id) errors.push("hazard missing id");
    if (hazard.telegraphTicks === undefined) errors.push("hazard missing telegraphTicks");
    if (!hazard.lethalState) errors.push("hazard missing lethalState");
  }
  
  for (const biome of manifest.biomes || []) {
    if (!biome.id) errors.push("biome missing id");
    if (!biome.dominantRule) errors.push("biome missing dominantRule");
  }
  
  for (const card of manifest.challengeCards || []) {
    if (!card.id) errors.push("challengeCard missing id");
    if (!card.reward) errors.push("challengeCard missing reward");
  }
  
  return { ok: errors.length === 0, errors };
}

export function spawnPickup(
  run: RunState,
  manifest: ContentManifest,
  request: SpawnRequest
): SpawnedPickup {
  const { arena } = run;
  const { width, height } = arena.size;
  
  // Find cells that are safe (not occupied, not lethal)
  const unsafeCells = new Set([...arena.occupiedCells, ...arena.lethalCells]);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = `${x},${y}`;
      if (!unsafeCells.has(cell)) {
        return { cell };
      }
    }
  }
  
  // Fallback - return center if no safe cell found
  return { cell: `${Math.floor(width / 2)},${Math.floor(height / 2)}` };
}

export function extendComboChain(combo: ComboState, event: ComboEvent): ComboState {
  const newCount = combo.count + 1;
  const newMultiplier = Math.floor(combo.multiplier * 1.5);
  const newExpiry = event.tick + 5; // 5 tick window
  
  return {
    count: newCount,
    multiplier: newMultiplier,
    expiresAtTick: newExpiry,
  };
}

export function triggerReactivePickup(
  run: RunState,
  trigger: ReactivePickupTrigger
): ReactivePickupOutcome {
  return {
    sourcePickupId: trigger.pickupId,
    originCell: trigger.cell,
    outcome: "score-bloom",
    createsOpportunity: true,
  };
}
