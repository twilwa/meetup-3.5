## Why

Classic snake is one of the cleanest game loops ever made, but most versions
stop at nostalgia, polish, or joke variants. Wave 1 exists to turn snake into
an ecstatic arcade spectacle: a browser-first game with enough systemic chaos,
style, and replayability to feel like its own genre mutation rather than a
reskin.

## What Changes

- Create a new game concept, `Supernova Snake`, centered on high-speed runs
  through unstable cosmic arenas instead of a static grid box.
- Define a core arcade run loop with crisp movement, readable danger, instant
  retries, and score-chasing hooks that preserve snake's clarity.
- Introduce food archetypes, combo chains, and mutation powers so feeding
  decisions become strategic rather than purely accumulative.
- Add living arenas with biome rules, hazards, and short-form run events that
  force route adaptation during play.
- Define wave 1 progression around local unlocks, seeded runs, and challenge
  goals instead of live-service systems or backend dependencies.
- Specify a spectacle layer for audio, camera, VFX, and accessibility guardrails
  so the game can be maximal without becoming unreadable or exhausting.

## Capabilities

### New Capabilities

- `arcade-run-loop`: Core single-player run structure, movement rules, collision
  outcomes, scoring, retry flow, and run-end states.
- `phase-food-and-combo-system`: Food families, combo windows, chain scoring,
  and risk-reward feeding rules that shape player routing.
- `mutation-powers`: Temporary snake state changes unlocked by play, including
  trigger rules, duration, and trade-offs.
- `living-arenas-and-hazards`: Arena biomes, environmental hazards, and dynamic
  run events that alter traversal conditions.
- `run-progression-and-challenges`: Local meta-progression, seeded or daily run
  structures, and challenge objectives that drive replayability.
- `game-shell-and-onboarding`: Menus, HUD, controls, tutorial beats, and
  fail-state flows that make the game learnable and replayable.
- `spectacle-and-accessibility-layer`: Visual, audio, UI readability, and
  sensory safety behaviors that support a maximal presentation.

### Modified Capabilities

- None.

## Impact

- Establishes the product definition for a new game rather than changing an
  existing capability.
- Affects future client architecture, rendering, input, simulation, content
  authoring, persistence, test strategy, and balancing work.
- Assumes a browser-first implementation with local persistence in wave 1 so
  the initial spec can parallelize cleanly without backend or live-ops
  dependencies.
