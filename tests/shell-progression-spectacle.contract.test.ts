// Spec sources:
// openspec/changes/build-supernova-snake-wave-1/specs/game-shell-and-onboarding/spec.md
// openspec/changes/build-supernova-snake-wave-1/specs/run-progression-and-challenges/spec.md
// openspec/changes/build-supernova-snake-wave-1/specs/spectacle-and-accessibility-layer/spec.md

import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDailyRun,
  buildSeededRun,
  evaluateRunRewards,
} from "../src/supernova-snake/contracts/progression.ts";
import {
  buildTutorialBeatPlan,
  getHudModel,
  getShellFlow,
  mapInputPrompt,
} from "../src/supernova-snake/contracts/shell.ts";
import {
  applyAccessibilityPreset,
  createSpectacleState,
  selectFrameEffects,
} from "../src/supernova-snake/contracts/spectacle.ts";
import { createRunFixture } from "./helpers/supernova-snake-fixtures.ts";

test("shell flow preserves one-more-run cadence and exposes retry quickly", () => {
  const flow = getShellFlow({
    activeScreen: "results",
    lastSeed: "nova-alpha-001",
  });

  assert.equal(flow.primaryAction.id, "retry-last-run");
  assert.equal(flow.primaryAction.seed, "nova-alpha-001");
  assert.equal(flow.confirmationsToPlay <= 2, true);
});

test("input prompts follow the active device and HUD prioritizes lethal warnings", () => {
  const run = createRunFixture();
  const prompt = mapInputPrompt({ device: "controller", action: "turn-left" });
  const hud = getHudModel(run, {
    imminentWarnings: ["hazard-armed"],
    decorativeEffects: ["score-bloom"],
  });

  assert.equal(prompt.device, "controller");
  assert.equal(hud.priorityWarnings[0], "hazard-armed");
});

test("tutorial beats introduce movement and mutation use through staged play", () => {
  const beats = buildTutorialBeatPlan({
    firstRun: true,
    requiredTopics: ["movement", "food", "hazards", "mutations"],
  });

  assert.equal(beats.some((beat) => beat.topic === "mutations"), true);
  assert.equal(beats.every((beat) => beat.mode === "in-play"), true);
});

test("seeded progression produces replayable daily runs and breadth-first rewards", () => {
  const seededA = buildSeededRun({ seed: "daily-2026-03-05" });
  const seededB = buildDailyRun({ date: "2026-03-05" });
  const rewards = evaluateRunRewards(createRunFixture(), {
    finalScore: 4200,
    styleGrade: "A",
  });

  assert.deepEqual(seededA, seededB);
  assert.equal(rewards.unlockType, "breadth");
  assert.equal(
    ["biome", "mutation", "challenge", "cosmetic"].includes(
      rewards.unlockCategory,
    ),
    true,
  );
});

test("spectacle presets reduce effect intensity without touching simulation difficulty", () => {
  const run = createRunFixture();
  const spectacle = createSpectacleState(run, {
    comboThresholdCrossed: true,
    imminentWarning: "hazard-armed",
  });
  const reduced = applyAccessibilityPreset(spectacle, {
    preset: "reduced-sensory",
  });
  const frame = selectFrameEffects(reduced, { performanceBudget: "low" });

  assert.equal(
    reduced.settings.flashIntensity < spectacle.settings.flashIntensity,
    true,
  );
  assert.equal(
    reduced.settings.screenShake < spectacle.settings.screenShake,
    true,
  );
  assert.equal(reduced.simulationDifficulty, spectacle.simulationDifficulty);
  assert.equal(frame.decorativeEffectsReduced, true);
});
