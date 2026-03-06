const test = require("node:test");
const assert = require("node:assert/strict");

const coreLoop = require("../src/supernova-snake/contracts/core-loop");
const content = require("../src/supernova-snake/contracts/content");
const mutations = require("../src/supernova-snake/contracts/mutations");
const arenas = require("../src/supernova-snake/contracts/arenas");
const shell = require("../src/supernova-snake/contracts/shell");
const progression = require("../src/supernova-snake/contracts/progression");
const spectacle = require("../src/supernova-snake/contracts/spectacle");
const {
  createRunFixture,
  createContentManifestFixture,
} = require("./helpers/supernova-snake-fixtures");

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
