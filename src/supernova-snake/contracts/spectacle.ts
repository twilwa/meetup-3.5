// ABOUTME: Spectacle and accessibility layer for visual effects and performance tuning
// ABOUTME: Manages flash intensity, screen shake, and decorative effect reduction

import type {
  AccessibilityPresetInput,
  FrameEffects,
  FrameEffectsInput,
  RunState,
  SpectacleInput,
  SpectacleState,
} from "./types.ts";

export const createSpectacleState = (
  run: RunState,
  input: SpectacleInput,
): SpectacleState => {
  return {
    settings: {
      flashIntensity: 1,
      screenShake: 1,
    },
    simulationDifficulty: "normal",
  };
};

export const applyAccessibilityPreset = (
  spectacle: SpectacleState,
  input: AccessibilityPresetInput,
): SpectacleState => {
  if (input.preset === "reduced-sensory") {
    return {
      settings: {
        flashIntensity: spectacle.settings.flashIntensity * 0.5,
        screenShake: spectacle.settings.screenShake * 0.5,
      },
      simulationDifficulty: spectacle.simulationDifficulty,
    };
  }

  return spectacle;
};

export const selectFrameEffects = (
  spectacle: SpectacleState,
  input: FrameEffectsInput,
): FrameEffects => {
  return {
    decorativeEffectsReduced: input.performanceBudget === "low",
  };
};
