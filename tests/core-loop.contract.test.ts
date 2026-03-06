// Spec source:
// openspec/changes/build-supernova-snake-wave-1/specs/arcade-run-loop/spec.md

import test from "node:test";
import assert from "node:assert/strict";

import {
  advanceTick,
  buildRunResults,
  createRunState,
  queueTurn,
  resolveCollision,
} from "../src/supernova-snake/contracts/core-loop.ts";
import { createRunFixture } from "./helpers/supernova-snake-fixtures.ts";

test("core loop remains deterministic for the same seed and input history", () => {
  const seed = "nova-alpha-001";
  const inputs = [
    { tick: 42, direction: "left" as const },
    { tick: 43, direction: "up" as const },
  ];

  const runA = createRunState({ seed });
  const runB = createRunState({ seed });

  for (const input of inputs) {
    queueTurn(runA, input);
    queueTurn(runB, input);
    advanceTick(runA);
    advanceTick(runB);
  }

  assert.deepEqual(runA, runB);
});

test("core loop rejects an invalid reversal into the first occupied body segment", () => {
  const run = createRunFixture();
  const originalHeading = run.heading;

  const nextRun = queueTurn(run, { tick: 42, direction: "down" });

  assert.equal(nextRun.heading, originalHeading);
});

test("collision resolution consumes a valid phase exception before failing the run", () => {
  const run = createRunFixture();
  const outcome = resolveCollision(run, {
    cell: "5,5",
    collisionType: "hazard",
  });

  assert.equal(outcome.failed, false);
  assert.equal(outcome.consumedException, true);
  assert.equal(outcome.remainingPhaseExceptions, 0);
});

test("run results expose score, style, combo, biome, challenge, and seed context", () => {
  const run = createRunFixture();
  const results = buildRunResults(run, { reason: "collision" });

  assert.deepEqual(results, {
    seed: "nova-alpha-001",
    finalScore: 4200,
    styleGrade: "A",
    dominantComboChain: {
      count: 3,
      multiplier: 4,
    },
    biomeId: "nebula-drift",
    challengeId: "tight-orbit",
    reason: "collision",
  });
});
