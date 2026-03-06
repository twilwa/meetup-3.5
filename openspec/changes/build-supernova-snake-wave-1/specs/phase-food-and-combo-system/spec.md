## ADDED Requirements

### Requirement: Food families telegraph value and risk

Wave 1 SHALL ship multiple food families with distinct visual language,
collection value, and gameplay consequences. Players MUST be able to identify
whether a pickup is basic, combo-extending, mutation-charging, or
arena-reactive before committing to the route.

#### Scenario: Player reads a special pickup before collection

- **WHEN** a mutation-charging or arena-reactive pickup spawns
- **THEN** it SHALL use distinct visuals and timing cues from basic score food
- **THEN** the player SHALL be able to infer that it carries higher risk or
  special value

### Requirement: Combo chains reward tempo and route commitment

The game SHALL track a combo window that increases scoring and style when the
player chains eligible pickups, near-misses, or route commitments without
stalling. Missing the combo window MUST collapse the multiplier cleanly.

#### Scenario: Combo extends through aggressive play

- **WHEN** a player collects eligible pickups in sequence before the combo
  window expires
- **THEN** the combo counter SHALL increase
- **THEN** the score and style reward for later pickups in that chain SHALL
  increase

### Requirement: Reactive pickups can trigger local chain events

Wave 1 SHALL include at least one special pickup family that triggers a local
arena event such as a score bloom, gravity pulse, prism gate, or hazard bloom.
These events MUST be telegraphed and tied to the pickup source.

#### Scenario: Arena-reactive pickup changes nearby state

- **WHEN** the player collects an arena-reactive pickup
- **THEN** the game SHALL trigger a local event around the collection site
- **THEN** the event SHALL create either a scoring opportunity, a routing risk,
  or both

### Requirement: Spawn logic preserves fairness under pressure

Food spawn logic SHALL produce routing choices without placing required pickups
inside unavoidable lethal states. Spawn selection MUST respect occupied cells,
armed hazards, and the current arena mutation package.

#### Scenario: Spawn director avoids impossible placement

- **WHEN** the game selects a new pickup spawn while hazards and body segments
  occupy large portions of the arena
- **THEN** the pickup SHALL not appear in a cell that is already guaranteed
  lethal on the next resolution step
- **THEN** the spawn system SHALL preserve at least one plausible route to the
  pickup
