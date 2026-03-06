import test from "node:test";
import assert from "node:assert/strict";

import {
  nextTickInterval,
  pickBiomeTheme,
  pickPickupKind,
} from "../src/supernova-snake/browser/game-model.ts";

test("browser arcade slice derives a deterministic biome from the seed", () => {
  const first = pickBiomeTheme("nova-alpha-001");
  const second = pickBiomeTheme("nova-alpha-001");

  assert.deepEqual(first, second);
  assert.equal(typeof first.rule, "string");
});

test("browser arcade slice escalates pickup identity across a run deterministically", () => {
  assert.equal(pickPickupKind("nova-alpha-001", 0, 0), "star");
  assert.equal(pickPickupKind("nova-alpha-001", 7, 300), "prism");
  assert.equal(pickPickupKind("nova-alpha-001", 11, 700), "phase");
});

test("browser arcade slice speeds up under combo pressure and mutation heat", () => {
  const baseline = nextTickInterval(1, false);
  const hot = nextTickInterval(5, true);

  assert.equal(hot < baseline, true);
  assert.equal(hot >= 72, true);
});
