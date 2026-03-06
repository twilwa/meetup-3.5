## 1. Foundations and contracts

- [ ] 1.1 Implement the deterministic run state machine, fixed-timestep simulation, and canonical gameplay event schema
- [ ] 1.2 Define validated content manifests for foods, hazards, mutations, biomes, and challenge cards
- [ ] 1.3 Establish seeded run generation, run-result payloads, and replayable seed identity rules

## 2. Core gameplay systems

- [ ] 2.1 Build movement, collision resolution, scoring skeleton, and fail-state handling for the arcade run loop
- [ ] 2.2 Implement food families, combo windows, local chain reactions, and fair spawn direction
- [ ] 2.3 Implement mutation powers, activation triggers, lifetime warnings, and deterministic priority rules
- [ ] 2.4 Implement biome packages, telegraphed hazards, trail-collapse rules, and escalation events

## 3. Parallel experience streams

- [ ] 3.1 Build the shell flow, device-aware controls, HUD, and staged onboarding sequence
- [ ] 3.2 Build reactive audio, VFX, and visual-priority rules on top of the gameplay event bus
- [ ] 3.3 Add reduced-sensory presets and graceful performance degradation that preserve simulation integrity
- [ ] 3.4 Build layered results, challenge cards, seeded daily runs, and breadth-first unlocks

## 4. Vertical slice and validation

- [ ] 4.1 Assemble one fully playable biome with at least one challenge path and three mutation powers
- [ ] 4.2 Expand curated wave 1 content to the remaining planned biome and challenge packages
- [ ] 4.3 Run structured playtests for fairness, readability, performance, and replayability, then tune the slice
