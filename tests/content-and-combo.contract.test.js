// Spec sources:
// openspec/changes/build-supernova-snake-wave-1/specs/phase-food-and-combo-system/spec.md
// openspec/changes/build-supernova-snake-wave-1/specs/run-progression-and-challenges/spec.md

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateContentManifest,
  spawnPickup,
  extendComboChain,
  triggerReactivePickup,
} = require("../src/supernova-snake/contracts/content");
const {
  createContentManifestFixture,
  createRunFixture,
} = require("./helpers/supernova-snake-fixtures");

test("content manifest validates the core wave 1 food, hazard, biome, and challenge schema", () => {
  const manifest = createContentManifestFixture();
  const validation = validateContentManifest(manifest);

  assert.deepEqual(validation, {
    ok: true,
    errors: [],
  });
});

test("pickup spawns avoid occupied cells and guaranteed lethal cells", () => {
  const run = createRunFixture();
  const manifest = createContentManifestFixture();

  const pickup = spawnPickup(run, manifest, { family: "basic" });

  assert.equal(run.arena.occupiedCells.includes(pickup.cell), false);
  assert.equal(run.arena.lethalCells.includes(pickup.cell), false);
});

test("combo extension increases chain value without losing the prior window", () => {
  const run = createRunFixture();
  const nextCombo = extendComboChain(run.combo, {
    tick: 42,
    pickupFamily: "reactive",
    eventType: "pickup",
  });

  assert.equal(nextCombo.count, 4);
  assert.equal(nextCombo.multiplier > run.combo.multiplier, true);
  assert.equal(nextCombo.expiresAtTick > run.combo.expiresAtTick, true);
});

test("reactive pickups create a local arena opportunity or routing risk", () => {
  const run = createRunFixture();
  const event = triggerReactivePickup(run, {
    pickupId: "prism-burst",
    cell: "4,2",
  });

  assert.deepEqual(event, {
    sourcePickupId: "prism-burst",
    originCell: "4,2",
    outcome: "score-bloom",
    createsOpportunity: true,
  });
});
