## ADDED Requirements

### Requirement: Players can enter or retry a run with minimal friction

The game SHALL let players enter active play from the title screen, pause
screen, or results screen in no more than two input confirmations. A failed run
MUST offer an immediate retry using the same seed and an option to return to the
game shell.

#### Scenario: Immediate retry after failure

- **WHEN** a run ends in failure
- **THEN** the results screen SHALL present a retry action for the same seed
- **THEN** selecting retry SHALL return the player to active play without
  routing through unrelated menus

### Requirement: Core movement is deterministic and readable

The simulation SHALL advance on a fixed timestep with deterministic movement,
legal turn buffering, and explicit prevention of invalid reversal into the first
occupied body segment. Presentation effects MUST NOT change simulation results.

#### Scenario: Buffered turn resolves on the next legal tick

- **WHEN** a player inputs a valid turn before the snake reaches the next cell
- **THEN** the simulation SHALL apply that turn on the earliest legal tick
- **THEN** all clients and replays using the same seed and inputs SHALL resolve
  the same movement outcome

### Requirement: Collisions resolve consistently by hazard state

The game SHALL evaluate collisions against walls, hazards, self-contact, active
mutation rules, and temporary immunity states in a consistent order. A collision
MUST only cause failure after any active exception or phase rule is resolved.

#### Scenario: Phase effect prevents one otherwise lethal contact

- **WHEN** the snake enters a lethal tile while a mutation grants a valid phase
  exception
- **THEN** the game SHALL consume the exception instead of ending the run
- **THEN** the next lethal contact without a valid exception SHALL fail the run

### Requirement: Run results summarize performance and seed context

Every completed run SHALL produce a results summary containing the final score,
style grade, dominant combo chain, active biome, active challenge card, and
seed identity. The results summary MUST support replay-oriented decisions.

#### Scenario: Results screen exposes run context

- **WHEN** a run reaches a failure or completion state
- **THEN** the results screen SHALL display the run's score breakdown and seed
- **THEN** the player SHALL be able to retry the same seed or start a new run
