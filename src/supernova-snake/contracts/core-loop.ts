<<<<<<< ours
import type {
  CollisionInput,
  CollisionOutcome,
  Direction,
  RunResults,
  RunState,
  RunSummaryContext,
  TurnInput,
  Cell,
} from "./types.ts";

function seededRandom(seed: string): () => number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return () => {
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export function createRunState({ seed }: { seed: string }): RunState {
  const rng = seededRandom(seed);
  const width = 12;
  const height = 12;
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height / 2);
  
  return {
    seed,
    tick: 0,
    heading: "up",
    pendingTurns: [],
    score: 0,
    combo: { count: 0, multiplier: 1, expiresAtTick: -1 },
    styleGrade: "F",
    snake: {
      body: [
        { x: startX, y: startY },
        { x: startX, y: startY + 1 },
        { x: startX, y: startY + 2 },
      ],
      phaseExceptions: 0,
    },
    arena: {
      biomeId: "nebula-drift",
      size: { width, height },
      occupiedCells: [],
      lethalCells: [],
      trailCells: [],
      hazards: [],
    },
    activeChallenge: { id: "none", reward: "none" },
    activeMutations: [],
    results: null,
  };
}

export function queueTurn(run: RunState, input: TurnInput): RunState {
  const reverseMap: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  
  if (input.direction === reverseMap[run.heading]) {
    return run;
  }
  
  return {
    ...run,
    heading: input.direction,
    pendingTurns: [...run.pendingTurns, input],
  };
}

export function advanceTick(run: RunState): RunState {
  const { body } = run.snake;
  const head = body[0];
  if (!head) {
    return run;
  }
  let newHead: Cell;
  
  switch (run.heading) {
    case "up":
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case "down":
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case "left":
      newHead = { x: head.x - 1, y: head.y };
      break;
    case "right":
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  const newBody = [newHead, ...body.slice(0, -1)];
  const newOccupied = newBody.map((c) => `${c.x},${c.y}`);
  
  return {
    ...run,
    tick: run.tick + 1,
    snake: { ...run.snake, body: newBody },
    arena: { ...run.arena, occupiedCells: newOccupied },
  };
}

export function resolveCollision(
  run: RunState,
  input: CollisionInput
): CollisionOutcome {
  if (run.snake.phaseExceptions > 0) {
    return {
      failed: false,
      consumedException: true,
      remainingPhaseExceptions: run.snake.phaseExceptions - 1,
    };
  }
  
  return {
    failed: true,
    consumedException: false,
    remainingPhaseExceptions: 0,
  };
}

export function buildRunResults(
  run: RunState,
  context: RunSummaryContext
): RunResults {
  return {
    seed: run.seed,
    finalScore: run.score,
    styleGrade: run.styleGrade,
    dominantComboChain: {
      count: run.combo.count,
      multiplier: run.combo.multiplier,
    },
    biomeId: run.arena.biomeId,
    challengeId: run.activeChallenge.id,
    reason: context.reason,
  };
}
|||||||
=======
import type {
  CollisionInput,
  CollisionOutcome,
  Direction,
  RunResults,
  RunState,
  RunSummaryContext,
  TurnInput,
  Cell,
} from "./types.ts";

function seededRandom(seed: string): () => number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return () => {
    h ^= h >>> 16;
    h = Math.imul(h, 0x7feb352d);
    h ^= h >>> 15;
    h = Math.imul(h, 0x846ca68b);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export function createRunState({ seed }: { seed: string }): RunState {
  const rng = seededRandom(seed);
  const width = 12;
  const height = 12;
  const startX = Math.floor(width / 2);
  const startY = Math.floor(height / 2);
  
  return {
    seed,
    tick: 0,
    heading: "up",
    pendingTurns: [],
    score: 0,
    combo: { count: 0, multiplier: 1, expiresAtTick: -1 },
    styleGrade: "F",
    snake: {
      body: [
        { x: startX, y: startY },
        { x: startX, y: startY + 1 },
        { x: startX, y: startY + 2 },
      ],
      phaseExceptions: 0,
    },
    arena: {
      biomeId: "nebula-drift",
      size: { width, height },
      occupiedCells: [],
      lethalCells: [],
      trailCells: [],
      hazards: [],
    },
    activeChallenge: { id: "none", reward: "none" },
    activeMutations: [],
    results: null,
  };
}

export function queueTurn(run: RunState, input: TurnInput): RunState {
  const reverseMap: Record<Direction, Direction> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  
  if (input.direction === reverseMap[run.heading]) {
    return run;
  }
  
  return {
    ...run,
    heading: input.direction,
    pendingTurns: [...run.pendingTurns, input],
  };
}

export function advanceTick(run: RunState): RunState {
  const { body } = run.snake;
  const head = body[0];
  let newHead: Cell;
  
  switch (run.heading) {
    case "up":
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case "down":
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case "left":
      newHead = { x: head.x - 1, y: head.y };
      break;
    case "right":
      newHead = { x: head.x + 1, y: head.y };
      break;
  }
  
  const newBody = [newHead, ...body.slice(0, -1)];
  const newOccupied = newBody.map((c) => `${c.x},${c.y}`);
  
  return {
    ...run,
    tick: run.tick + 1,
    snake: { ...run.snake, body: newBody },
    arena: { ...run.arena, occupiedCells: newOccupied },
  };
}

export function resolveCollision(
  run: RunState,
  input: CollisionInput
): CollisionOutcome {
  if (run.snake.phaseExceptions > 0) {
    return {
      failed: false,
      consumedException: true,
      remainingPhaseExceptions: run.snake.phaseExceptions - 1,
    };
  }
  
  return {
    failed: true,
    consumedException: false,
    remainingPhaseExceptions: 0,
  };
}

export function buildRunResults(
  run: RunState,
  context: RunSummaryContext
): RunResults {
  return {
    seed: run.seed,
    finalScore: run.score,
    styleGrade: run.styleGrade,
    dominantComboChain: {
      count: run.combo.count,
      multiplier: run.combo.multiplier,
    },
    biomeId: run.arena.biomeId,
    challengeId: run.activeChallenge.id,
    reason: context.reason,
  };
}
>>>>>>> theirs
