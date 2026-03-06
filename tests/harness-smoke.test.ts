import test from "node:test";
import assert from "node:assert/strict";

import * as coreLoop from "../src/supernova-snake/contracts/core-loop.ts";
import * as content from "../src/supernova-snake/contracts/content.ts";
import * as mutations from "../src/supernova-snake/contracts/mutations.ts";
import * as arenas from "../src/supernova-snake/contracts/arenas.ts";
import * as shell from "../src/supernova-snake/contracts/shell.ts";
import * as progression from "../src/supernova-snake/contracts/progression.ts";
import * as spectacle from "../src/supernova-snake/contracts/spectacle.ts";
import {
  createContentManifestFixture,
  createRunFixture,
} from "./helpers/supernova-snake-fixtures.ts";

test("contract harness exposes the planned Supernova Snake seams", () => {
  assert.equal(typeof coreLoop.createRunState, "function");
  assert.equal(typeof coreLoop.advanceTick, "function");
  assert.equal(typeof content.validateContentManifest, "function");
  assert.equal(typeof mutations.activateMutation, "function");
  assert.equal(typeof arenas.advanceArena, "function");
  assert.equal(typeof shell.getHudModel, "function");
  assert.equal(typeof progression.buildDailyRun, "function");
  assert.equal(typeof spectacle.selectFrameEffects, "function");
});

test("contract fixtures cover the core wave 1 state surface", () => {
  const run = createRunFixture();
  const manifest = createContentManifestFixture();

  assert.equal(run.seed, "nova-alpha-001");
  assert.equal(run.arena.biomeId, "nebula-drift");
  assert.ok(Array.isArray(run.activeMutations));
  assert.ok(Array.isArray(manifest.foods));
  assert.ok(Array.isArray(manifest.biomes));
});
