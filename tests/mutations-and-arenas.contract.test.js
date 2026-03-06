// Spec sources:
// openspec/changes/build-supernova-snake-wave-1/specs/mutation-powers/spec.md
// openspec/changes/build-supernova-snake-wave-1/specs/living-arenas-and-hazards/spec.md

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  earnMutationCharge,
  activateMutation,
  tickMutationTimers,
  resolveMutationPriority,
} = require("../src/supernova-snake/contracts/mutations");
const {
  selectBiome,
  armHazard,
  recordTrailStep,
  advanceArena,
} = require("../src/supernova-snake/contracts/arenas");
const {
  createContentManifestFixture,
  createRunFixture,
} = require("./helpers/supernova-snake-fixtures");

test("mutation charges unlock through explicit published triggers", () => {
  const run = createRunFixture();
  const charge = earnMutationCharge(run, {
    source: "combo-threshold",
    threshold: 4,
  });

  assert.deepEqual(charge, {
    id: "phase-shift",
    source: "combo-threshold",
    readable: true,
  });
});

test("active mutations warn before expiry and end deterministically", () => {
  const run = createRunFixture();
  const activeRun = activateMutation(run, {
    id: "phase-shift",
    durationTicks: 1,
  });
  const nextRun = tickMutationTimers(activeRun);

  assert.equal(nextRun.warnings.includes("phase-shift-expiring"), true);
  assert.equal(nextRun.activeMutations.some((mutation) => mutation.id === "phase-shift"), false);
});

test("mutation priority resolves one collision outcome deterministically", () => {
  const outcome = resolveMutationPriority([
    { id: "phase-shift", priority: 100, effect: "ignore-hazard-once" },
    { id: "score-frenzy", priority: 50, effect: "bonus-score" },
  ]);

  assert.deepEqual(outcome, {
    priorityOrder: ["phase-shift", "score-frenzy"],
    winningEffect: "ignore-hazard-once",
  });
});

test("biome selection advertises its dominant traversal rule", () => {
  const manifest = createContentManifestFixture();
  const biome = selectBiome(manifest, { biomeId: "mirror-lattice" });

  assert.deepEqual(biome, {
    id: "mirror-lattice",
    dominantRule: "reflection",
  });
});

test("hazards telegraph before becoming lethal and trail steps mutate the arena", () => {
  const run = createRunFixture();
  const telegraphed = armHazard(run, {
    id: "hazard-2",
    cell: "7,7",
    telegraphTicks: 2,
  });
  const trailed = recordTrailStep(telegraphed, { cell: "4,2" });
  const advanced = advanceArena(trailed, { tick: run.tick + 1 });

  assert.equal(advanced.arena.hazards.some((hazard) => hazard.cell === "7,7" && hazard.state === "telegraph"), true);
  assert.equal(advanced.arena.trailCells.includes("4,2"), true);
});
