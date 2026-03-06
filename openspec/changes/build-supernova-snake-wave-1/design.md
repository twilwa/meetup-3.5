## Context

`Supernova Snake` is a new game, so the design problem is less about
retro-fitting an existing system and more about avoiding a pile of disconnected
"cool ideas." The proposal defines a browser-first, single-player wave 1 with
local persistence, no live backend, and a deliberately maximal presentation.
The design therefore needs to keep two truths in tension:

1. The game must still read like snake in under ten seconds.
2. The game must feel unlike every safe nostalgia remake by the end of the
   first run.

The primary stakeholders are gameplay engineering, content design, audio or VFX
workstreams, and whoever owns early playtest evaluation. The biggest constraint
is parallelism: wave 1 needs contracts stable enough that multiple workstreams
can move at once without waiting on a monolithic prototype.

## Goals / Non-Goals

**Goals:**

- Preserve the essential snake loop of routing, growth, self-management, and
  rapid failure or retry.
- Support a wild presentation through deterministic gameplay contracts instead
  of one-off scripted sequences.
- Make content data-driven so arenas, hazards, food, mutations, and challenges
  can expand in parallel.
- Expose a stable gameplay event model that feeds UI, audio, VFX, scoring, and
  progression without tight coupling.
- Ship a replayable wave 1 with multiple biomes, challenge seeds, and a clear
  vertical slice for playtesting.

**Non-Goals:**

- Synchronous multiplayer, co-op, or PvP.
- Backend services, online accounts, cloud saves, or live leaderboards.
- Full procedural generation with unconstrained fairness risk.
- Campaign storytelling, boss fights, or user-generated content in wave 1.

## Decisions

### Decision: Use deterministic cell simulation with stylized presentation

The game simulation SHALL remain cell- or node-based with fixed-timestep
updates, legal turn buffering, deterministic hazard resolution, and seeded spawn
logic. Rendering MAY distort this into a living cosmic lattice with curved
trails, shader warps, camera motion, and reactive overlays, but presentation
MUST not change the simulation outcome.

This choice keeps the game readable, testable, and portable while still letting
the audiovisual layer go hard.

Alternatives considered:

- Freeform physics snake: rejected because collision fairness, input precision,
  and content balancing become much harder.
- Pure retro grid presentation: rejected because it does not deliver the desired
  "off the wall" identity.

### Decision: Build around a semantic gameplay event bus

Core simulation SHALL emit semantic events such as `food_collected`,
`combo_extended`, `mutation_started`, `near_miss`, `hazard_armed`,
`hazard_triggered`, `run_failed`, and `challenge_completed`. Spectacle,
progression, UI, and analytics or playtest logging SHALL consume these events
instead of reading simulation internals directly.

This is the main parallelization seam for wave 1. Audio, VFX, HUD, and run
results can all move as long as the event contract stays stable.

Alternatives considered:

- Direct subsystem callbacks: rejected because they tangle gameplay and
  feedback.
- Full ECS rewrite before design lock: rejected because architecture novelty is
  not the product goal.

### Decision: Keep content curated but data-driven

Biomes, hazards, foods, mutations, challenge cards, and spawn tables SHALL live
in declarative content definitions with validated fields for behavior,
telegraphing, audiovisual hooks, and fairness constraints. Wave 1 content MUST
be curated rather than infinitely procedural.

This supports a content pipeline that can move independently while protecting
readability and test coverage.

Alternatives considered:

- Hard-code all content in gameplay logic: rejected because it blocks parallel
  iteration and balancing.
- Fully procedural arenas and mutators: rejected because fairness failures would
  dominate early playtests.

### Decision: Treat music and spectacle as reactive systems, not decoration

Wave 1 SHALL define event-driven music states, combo intensity layers, near-miss
stingers, and mutation-specific VFX hooks. Spectacle SHALL amplify meaningful
play states, not fire randomly. Every high-intensity effect MUST have a reduced
or disabled accessibility mode.

This choice preserves the "cosmic concert" fantasy without sacrificing
readability or accessibility.

Alternatives considered:

- Static soundtrack with generic juice pass: rejected because it underserves the
  concept.
- Unbounded full-screen FX everywhere: rejected because it compromises clarity
  and performance.

### Decision: Scope replayability around local runs and seeded challenges

Wave 1 SHALL rely on local unlocks, challenge cards, and deterministic daily or
seeded runs derived without backend dependencies. The design SHALL treat async
competition as a future extension, not a launch requirement.

This keeps the initial product self-contained and removes service risk from the
critical path.

Alternatives considered:

- Live leaderboards and accounts in wave 1: rejected because they add
  infrastructure without improving core feel.
- No progression at all: rejected because the concept needs reasons to chase
  repeated runs beyond raw score.

### Decision: Define a vertical slice before content explosion

Wave 1 SHALL target a first playable slice with one fully realized biome, at
least one challenge path, a stable HUD and fail-state loop, three mutation
powers, and the full event-driven spectacle chain. Additional content MAY expand
after the slice proves readable and fun.

This keeps the team from distributing effort across too many half-finished
systems.

Alternatives considered:

- Build all biomes equally from the start: rejected because it spreads design
  attention too thin.
- Ship a minimal prototype with no presentation contract: rejected because the
  spec is specifically about a maximal-feel wave 1.

## Risks / Trade-offs

- [Too much chaos obscures core play] -> Enforce telegraphs, effect priority,
  and reduced sensory presets from the start.
- [Event taxonomy grows unstable as features expand] -> Lock a small set of
  canonical gameplay events before downstream implementation starts.
- [Mutation and hazard combinations create unfair deaths] -> Use curated
  compatibility tables and playtest fairness checks for every biome package.
- [Browser performance collapses under heavy FX] -> Separate simulation from
  render cadence and define graceful degradation rules for heavy effects.
- [Meta-progression dilutes the arcade identity] -> Keep unlocks breadth-focused
  rather than raw power-focused.

## Migration plan

This is a greenfield change, so "migration" means rollout order rather than
production data movement.

1. Lock the deterministic core simulation contract and gameplay event schema.
2. Define content schemas for food, hazards, mutations, biomes, and challenges.
3. Implement one vertical-slice biome with full audiovisual and HUD feedback.
4. Add progression, seeded challenges, and additional curated content packages.
5. Run structured playtests and tune readability, fairness, and pacing.

If wave 1 proves too noisy or unstable, rollback is feature rollback rather than
system rollback: disable unstable mutator packages, reduce concurrent spectacle
layers, and fall back to the stable vertical slice.

## Open questions

- Which browser game stack should own the implementation: a canvas-first custom
  renderer, Phaser, Pixi, or another engine with strong deterministic control?
- Should daily seeded runs expose shareable seed codes in wave 1, or remain a
  local-only ritual until async leaderboards exist?
- How strict should rhythm timing be for `Beat Boost` so it adds mastery without
  becoming mandatory for basic survival?
- What is the default accessibility preset on first launch: standard spectacle
  or reduced sensory mode with an opt-in ramp to full intensity?
