## ADDED Requirements

### Requirement: Audio reacts to the player's performance state

The soundtrack and key sound effects SHALL react to run intensity, combo state,
near-misses, mutation activation, and run failure. Audio changes MUST reinforce
the current gameplay state instead of masking it.

#### Scenario: Combo intensity changes music layer

- **WHEN** the player crosses a documented combo threshold
- **THEN** the audio system SHALL transition to a higher-intensity layer or cue
- **THEN** the transition SHALL correspond to the same gameplay event every time

### Requirement: Visual feedback preserves gameplay hierarchy

Visual effects SHALL support a strict priority stack in which hazards, legal
routes, active mutation states, and collision threats remain more readable than
decorative flourishes. Full-screen effects MUST degrade or suppress themselves
when they would obscure survival-critical information.

#### Scenario: Decorative effect yields to danger cue

- **WHEN** a decorative full-screen effect coincides with an imminent lethal
  warning
- **THEN** the lethal warning SHALL remain readable above the decorative layer
- **THEN** the decorative effect SHALL reduce intensity or timing if needed

### Requirement: Spectacle includes sensory safety controls

The game SHALL offer reduced sensory presets and granular controls for screen
shake, flash intensity, chromatic distortion, rapid color cycling, and reactive
audio intensity. These settings MUST apply without changing simulation
difficulty.

#### Scenario: Reduced sensory preset keeps gameplay intact

- **WHEN** the player enables a reduced sensory preset
- **THEN** the game SHALL lower or disable the documented spectacle effects
- **THEN** collision timing, scoring rules, and input windows SHALL remain
  unchanged

### Requirement: The presentation degrades gracefully under load

Wave 1 SHALL define a performance strategy that preserves simulation integrity
and input responsiveness when the device cannot sustain peak spectacle. The game
MUST prefer lowering decorative load over slowing core simulation.

#### Scenario: Heavy scene reduces decorative overhead first

- **WHEN** the game detects a sustained performance drop during a high-intensity
  scene
- **THEN** it SHALL reduce decorative effect load before compromising
  simulation timing
- **THEN** the player's run outcome SHALL remain governed by the same simulation
  rules
