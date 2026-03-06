## ADDED Requirements

### Requirement: Wave 1 ships multiple biome rule packages

Wave 1 SHALL include multiple curated biome packages, each with a dominant
movement or routing identity such as drift, pull, reflection, or collapse. A
biome package MUST change play meaningfully without requiring a different core
control scheme.

#### Scenario: Run starts with a biome identity

- **WHEN** a player starts a new run
- **THEN** the selected biome SHALL advertise its dominant traversal rule
- **THEN** that rule SHALL materially affect routing during the run

### Requirement: Hazards telegraph before they become lethal

Dynamic hazards SHALL provide a readable warning phase before entering a lethal
state unless a challenge explicitly documents instant resolution. Warning
feedback MUST be strong enough to support fair avoidance under normal play.

#### Scenario: Armed hazard becomes lethal after telegraph

- **WHEN** a hazard is scheduled to activate in the player's arena
- **THEN** the game SHALL present a non-lethal warning state before activation
- **THEN** entering the hazard during the warning state SHALL not count as the
  post-telegraph lethal outcome

### Requirement: Snake movement can mutate the arena state

The arena SHALL react to player movement through at least one trail-driven rule,
such as charged tiles that later collapse into hazards or bonus lanes. The
player's own pathing MUST therefore reshape future route options.

#### Scenario: Charged trail decays into a new condition

- **WHEN** the snake traverses a tile that supports trail charging
- **THEN** that tile SHALL enter a visible intermediate state
- **THEN** the tile SHALL later resolve into its documented hazard or bonus
  state unless another rule changes it first

### Requirement: Runs escalate through short-form arena events

The game SHALL trigger short-form arena events as score, time, or combo
thresholds rise. Events MUST intensify pacing or force rerouting without
invalidating the player's ability to recover through skillful play.

#### Scenario: Mid-run event changes arena pressure

- **WHEN** a run crosses an escalation threshold
- **THEN** the game SHALL activate a documented arena event
- **THEN** the event SHALL increase pressure without making failure unavoidable
