// ABOUTME: Progression system for seeded runs, daily runs, and reward evaluation
// ABOUTME: Implements run generation and reward unlock logic

import type {
  BuildDailyRunInput,
  BuildSeededRunInput,
  RunRewardInput,
  RunRewards,
  RunState,
  SeededRun,
} from "./types.ts";

export function buildSeededRun(input: BuildSeededRunInput): SeededRun {
  return { seed: input.seed };
}

export function buildDailyRun(input: BuildDailyRunInput): SeededRun {
  return { seed: `daily-${input.date}` };
}

export function evaluateRunRewards(
  run: RunState,
  input: RunRewardInput,
): RunRewards {
  const categories = ["biome", "mutation", "challenge", "cosmetic"] as const;
  const randomIndex = Math.floor(Math.random() * categories.length);

  return {
    unlockType: "breadth",
    unlockCategory: categories[randomIndex],
  };
}
