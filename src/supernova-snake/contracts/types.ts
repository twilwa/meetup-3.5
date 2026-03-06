export type Direction = "up" | "down" | "left" | "right";

export interface Cell {
  x: number;
  y: number;
}

export interface TurnInput {
  tick: number;
  direction: Direction;
}

export interface ComboState {
  count: number;
  multiplier: number;
  expiresAtTick: number;
}

export interface HazardState {
  id: string;
  type: string;
  cell: string;
  telegraphTicksRemaining: number;
  state: string;
}

export interface MutationState {
  id: string;
  chargeSource: string;
  remainingTicks: number;
  priority: number;
}

export interface ChallengeCard {
  id: string;
  reward: string;
  modifier?: string;
}

export interface ArenaState {
  biomeId: string;
  size: {
    width: number;
    height: number;
  };
  occupiedCells: string[];
  lethalCells: string[];
  trailCells: string[];
  hazards: HazardState[];
}

export interface RunResults {
  seed: string;
  finalScore: number;
  styleGrade: string;
  dominantComboChain: {
    count: number;
    multiplier: number;
  };
  biomeId: string;
  challengeId: string;
  reason: string;
}

export interface RunState {
  seed: string;
  tick: number;
  heading: Direction;
  pendingTurns: TurnInput[];
  score: number;
  combo: ComboState;
  styleGrade: string;
  snake: {
    body: Cell[];
    phaseExceptions: number;
  };
  arena: ArenaState;
  activeChallenge: ChallengeCard;
  activeMutations: MutationState[];
  results: RunResults | null;
  warnings?: string[];
}

export interface FoodDefinition {
  id: string;
  family: string;
  cue: string;
  baseScore?: number;
  reaction?: string;
  charge?: string;
}

export interface BiomeDefinition {
  id: string;
  dominantRule: string;
}

export interface HazardDefinition {
  id: string;
  telegraphTicks: number;
  lethalState: string;
}

export interface ContentManifest {
  foods: FoodDefinition[];
  hazards: HazardDefinition[];
  biomes: BiomeDefinition[];
  challengeCards: ChallengeCard[];
}

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export interface SpawnRequest {
  family: string;
}

export interface SpawnedPickup {
  cell: string;
}

export interface ComboEvent {
  tick: number;
  pickupFamily: string;
  eventType: string;
}

export interface ReactivePickupTrigger {
  pickupId: string;
  cell: string;
}

export interface ReactivePickupOutcome {
  sourcePickupId: string;
  originCell: string;
  outcome: string;
  createsOpportunity: boolean;
}

export interface CollisionInput {
  cell: string;
  collisionType: string;
}

export interface CollisionOutcome {
  failed: boolean;
  consumedException: boolean;
  remainingPhaseExceptions: number;
}

export interface RunSummaryContext {
  reason: string;
}

export interface MutationChargeTrigger {
  source: string;
  threshold: number;
}

export interface MutationCharge {
  id: string;
  source: string;
  readable: boolean;
}

export interface MutationActivation {
  id: string;
  durationTicks: number;
}

export interface MutationResolutionInput {
  id: string;
  priority: number;
  effect: string;
}

export interface MutationPriorityResolution {
  priorityOrder: string[];
  winningEffect: string;
}

export interface SelectBiomeInput {
  biomeId: string;
}

export interface HazardActivation {
  id: string;
  cell: string;
  telegraphTicks: number;
}

export interface TrailStepInput {
  cell: string;
}

export interface ArenaAdvanceInput {
  tick: number;
}

export interface ShellFlowInput {
  activeScreen: string;
  lastSeed: string;
}

export interface ShellFlow {
  primaryAction: {
    id: string;
    seed: string;
  };
  confirmationsToPlay: number;
}

export interface InputPromptRequest {
  device: string;
  action: string;
}

export interface InputPrompt {
  device: string;
  action: string;
}

export interface HudModelInput {
  imminentWarnings: string[];
  decorativeEffects: string[];
}

export interface HudModel {
  priorityWarnings: string[];
}

export interface TutorialPlanInput {
  firstRun: boolean;
  requiredTopics: string[];
}

export interface TutorialBeat {
  topic: string;
  mode: string;
}

export interface SeededRun {
  seed: string;
}

export interface BuildSeededRunInput {
  seed: string;
}

export interface BuildDailyRunInput {
  date: string;
}

export interface RunRewardInput {
  finalScore: number;
  styleGrade: string;
}

export interface RunRewards {
  unlockType: string;
  unlockCategory: string;
}

export interface SpectacleInput {
  comboThresholdCrossed: boolean;
  imminentWarning: string;
}

export interface SpectacleState {
  settings: {
    flashIntensity: number;
    screenShake: number;
  };
  simulationDifficulty: string;
}

export interface AccessibilityPresetInput {
  preset: string;
}

export interface FrameEffectsInput {
  performanceBudget: string;
}

export interface FrameEffects {
  decorativeEffectsReduced: boolean;
}
