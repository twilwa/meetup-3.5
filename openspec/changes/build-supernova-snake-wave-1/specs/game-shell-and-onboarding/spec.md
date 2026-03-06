## ADDED Requirements

### Requirement: The shell supports fast arcade flow

The game shell SHALL provide direct paths to start a run, retry the last run,
review recent results, and adjust settings without burying the player in deep
menus. Failure and pause states MUST preserve the "one more run" cadence.

#### Scenario: Player restarts from the shell after a run

- **WHEN** a player finishes a run and returns to the shell
- **THEN** the shell SHALL surface a prominent option to start again quickly
- **THEN** the player SHALL not need to navigate through unrelated menu layers

### Requirement: Input supports keyboard and controller play

Wave 1 SHALL support keyboard and controller input with remappable directional
controls and essential actions. Input prompts MUST reflect the active device.

#### Scenario: Active device changes prompt language

- **WHEN** the player switches from keyboard input to controller input
- **THEN** the UI SHALL update prompts to match the active device
- **THEN** the core run loop SHALL remain fully playable without hidden
  keyboard-only actions

### Requirement: HUD communicates critical state without clutter

The HUD SHALL expose the current score, combo timer or multiplier, active
mutation state, challenge state, and imminent hazard warnings. Non-critical
information MUST yield to survival-critical information during high-pressure
moments.

#### Scenario: Survival-critical warning overrides decorative state

- **WHEN** a lethal hazard warning and a non-critical flourish would compete for
  attention
- **THEN** the HUD SHALL prioritize the lethal warning
- **THEN** the player SHALL still be able to read the critical state at a glance

### Requirement: Onboarding teaches through staged play

The first-run onboarding flow SHALL teach movement, food collection, hazard
telegraphs, and at least one mutation interaction through short staged prompts
or scripted beats during active play. The tutorial MUST be skippable after the
first encounter.

#### Scenario: First run introduces a mutation safely

- **WHEN** a new player reaches the first mutation tutorial beat
- **THEN** the game SHALL explain the trigger and effect in the context of play
- **THEN** the player SHALL be able to practice that interaction before the game
  returns to normal pressure
