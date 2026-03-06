## ADDED Requirements

### Requirement: Mutations are earned through readable triggers

Mutation powers SHALL be triggered by explicit performance conditions, pickup
states, or challenge effects rather than opaque hidden randomness. The player
MUST understand why a mutation became available.

#### Scenario: Combo unlocks a mutation charge

- **WHEN** a player satisfies a mutation's published trigger, such as a combo
  threshold or pickup chain
- **THEN** the game SHALL grant the corresponding mutation charge or activation
  state
- **THEN** the UI and audiovisual layer SHALL reveal why it was earned

### Requirement: Wave 1 ships multiple mutations with clear trade-offs

Wave 1 SHALL include at least three distinct mutation powers that change
traversal or survival rules. Each mutation MUST provide a visible upside and a
balancing trade-off such as instability, cooldown, risk exposure, or reduced
score gain while active.

#### Scenario: Mutation changes route options while adding cost

- **WHEN** a player activates a mutation power
- **THEN** the mutation SHALL create a new movement or survival option
- **THEN** the mutation SHALL also apply a clearly communicated cost or limit

### Requirement: Mutation lifetime is explicit and time-bounded

Every temporary mutation SHALL expose a clear start state, active state, and end
state. The player MUST receive warning feedback before a mutation expires if its
expiration could materially change survival.

#### Scenario: Expiring mutation warns the player

- **WHEN** a temporary mutation is approaching its final valid interval
- **THEN** the game SHALL emit warning feedback before expiration
- **THEN** the mutation SHALL end on a deterministic rule rather than silently
  disappearing

### Requirement: Conflicting mutation rules resolve deterministically

If multiple mutation powers could affect the same movement or collision outcome,
the game SHALL define a deterministic resolution order or explicit exclusivity.
The same input and seed MUST always produce the same mutation outcome.

#### Scenario: Two active mutation rules affect one collision

- **WHEN** a movement step is affected by more than one active mutation rule
- **THEN** the game SHALL apply the documented priority or exclusivity rule
- **THEN** replaying the same sequence SHALL yield the same result
