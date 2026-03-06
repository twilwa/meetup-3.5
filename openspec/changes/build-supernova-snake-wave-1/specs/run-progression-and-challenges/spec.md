## ADDED Requirements

### Requirement: Runs award layered results, not just raw score

Every run SHALL award a final result package that includes raw score, style
grade, combo achievement, biome completion context, and progression gain. The
result package MUST reinforce both mastery and replayability.

#### Scenario: Stylish play earns different rewards than safe survival

- **WHEN** two runs end with similar survival length but different combo or
  style performance
- **THEN** the results package SHALL distinguish those runs
- **THEN** stylish play SHALL earn meaningful recognition in grade or
  progression output

### Requirement: Challenge cards define optional run tension

The game SHALL support optional challenge cards or run modifiers that introduce
clear constraints or bonus goals before a run begins. Challenge effects MUST be
readable before the player commits.

#### Scenario: Player reviews challenge before starting

- **WHEN** a run offers a challenge card
- **THEN** the challenge SHALL describe its modifier and reward before start
- **THEN** the player SHALL be able to accept the challenge or choose a standard
  run if allowed by the current mode

### Requirement: Daily and seeded runs work without backend services

Wave 1 SHALL generate deterministic seeded runs locally, including a daily run
derived from a published date rule or local challenge schedule. A player MUST be
able to replay a known seed without online dependencies.

#### Scenario: Daily run reproduces the same setup

- **WHEN** two runs are started with the same daily or shared seed
- **THEN** they SHALL use the same deterministic content setup and spawn logic
- **THEN** the game SHALL identify that seed in the run results

### Requirement: Unlocks expand variety instead of creating hard power gaps

Wave 1 progression SHALL unlock breadth such as new biome packages, mutation
options, challenge cards, or cosmetic presentation variants. Progression MUST
not create such large stat advantages that early runs become obsolete.

#### Scenario: Unlock grants new option rather than mandatory upgrade

- **WHEN** a player earns a new progression unlock
- **THEN** the unlock SHALL expose a new mode, modifier, mutation, or cosmetic
  option
- **THEN** a skilled player on a fresh profile SHALL still be able to complete a
  credible score-chasing run
