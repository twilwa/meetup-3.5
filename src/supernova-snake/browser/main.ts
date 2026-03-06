import { advanceArena, armHazard, recordTrailStep } from "../contracts/arenas.ts";
import { advanceTick, buildRunResults, createRunState, queueTurn } from "../contracts/core-loop.ts";
import { activateMutation, tickMutationTimers } from "../contracts/mutations.ts";
import type {
  Cell,
  Direction,
  HazardState,
  RunState,
  SpectacleState,
} from "../contracts/types.ts";
import { applyAccessibilityPreset, createSpectacleState } from "../contracts/spectacle.ts";
import {
  nextTickInterval,
  pickBiomeTheme,
  pickPickupKind,
  type BiomeTheme,
  type PickupKind,
} from "./game-model.ts";

const CELL_SIZE = 28;

interface PickupModel {
  kind: PickupKind;
  cell: Cell;
  score: number;
  comboBoost: number;
  label: string;
  fill: string;
  glow: string;
}

type BrowserState = {
  run: RunState;
  pickup: PickupModel;
  lastTickAt: number;
  status: "ready" | "running" | "failed";
  pendingReset: boolean;
  bestScore: number;
  phaseCharges: number;
  flash: number;
  shake: number;
  biome: BiomeTheme;
  spectacle: SpectacleState;
};

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Missing #app root");
}

root.innerHTML = `
  <div class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">Supernova Snake</p>
        <h1>Cosmic arcade slice</h1>
        <p id="biome-rule" class="subhead"></p>
      </div>
      <div class="hero-actions">
        <button id="play-button" class="play-button" type="button">Launch Run</button>
        <button id="preset-button" class="secondary-button" type="button">Reduced FX: Off</button>
      </div>
    </header>
    <section class="layout">
      <div class="board-wrap">
        <canvas id="board" width="336" height="336" aria-label="Supernova Snake board"></canvas>
        <div class="board-overlay">
          <span id="pickup-label" class="pickup-label"></span>
        </div>
      </div>
      <aside class="panel">
        <dl class="stats">
          <div><dt>Status</dt><dd id="status-value">ready</dd></div>
          <div><dt>Biome</dt><dd id="biome-value">Nebula Drift</dd></div>
          <div><dt>Score</dt><dd id="score-value">0</dd></div>
          <div><dt>Best</dt><dd id="best-value">0</dd></div>
          <div><dt>Combo</dt><dd id="combo-value">x1</dd></div>
          <div><dt>Phase</dt><dd id="phase-value">0 charges</dd></div>
          <div><dt>Seed</dt><dd id="seed-value">nova-alpha-001</dd></div>
        </dl>
        <div class="copy">
          <p>Arrow keys or WASD to steer. Space spends a phase charge and lets you ghost through armed hazards and walls.</p>
          <p>Gold stars are clean points. Prism orbs fork hazard pressure. Phase cores charge the emergency mutation.</p>
          <p id="message-value">Press Launch Run to start.</p>
        </div>
      </aside>
    </section>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#board");
const playButton = document.querySelector<HTMLButtonElement>("#play-button");
const presetButton = document.querySelector<HTMLButtonElement>("#preset-button");
const statusValue = document.querySelector<HTMLElement>("#status-value");
const biomeValue = document.querySelector<HTMLElement>("#biome-value");
const scoreValue = document.querySelector<HTMLElement>("#score-value");
const bestValue = document.querySelector<HTMLElement>("#best-value");
const comboValue = document.querySelector<HTMLElement>("#combo-value");
const phaseValue = document.querySelector<HTMLElement>("#phase-value");
const seedValue = document.querySelector<HTMLElement>("#seed-value");
const messageValue = document.querySelector<HTMLElement>("#message-value");
const biomeRuleValue = document.querySelector<HTMLElement>("#biome-rule");
const pickupLabel = document.querySelector<HTMLElement>("#pickup-label");

if (
  !canvas ||
  !playButton ||
  !presetButton ||
  !statusValue ||
  !biomeValue ||
  !scoreValue ||
  !bestValue ||
  !comboValue ||
  !phaseValue ||
  !seedValue ||
  !messageValue ||
  !biomeRuleValue ||
  !pickupLabel
) {
  throw new Error("Missing browser UI element");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas 2D context unavailable");
}

const seedFromClock = () => `nova-${new Date().toISOString().slice(0, 19).replaceAll(/[:T]/g, "-")}`;
const cellKey = (cell: Cell) => `${cell.x},${cell.y}`;
const fromCellKey = (value: string): Cell => {
  const [rawX = "0", rawY = "0"] = value.split(",");
  return { x: Number(rawX), y: Number(rawY) };
};

const pickupStyle = (kind: PickupKind) => {
  switch (kind) {
    case "prism":
      return {
        score: 180,
        comboBoost: 2,
        label: "Prism Burst",
        fill: "#ff8ad8",
        glow: "rgba(255, 138, 216, 0.38)",
      };
    case "phase":
      return {
        score: 140,
        comboBoost: 1,
        label: "Phase Core",
        fill: "#9bff8a",
        glow: "rgba(155, 255, 138, 0.38)",
      };
    case "star":
    default:
      return {
        score: 100,
        comboBoost: 1,
        label: "Starfruit",
        fill: "#ffd166",
        glow: "rgba(255, 209, 102, 0.35)",
      };
  }
};

const syncOccupiedCells = (run: RunState): RunState => ({
  ...run,
  arena: {
    ...run.arena,
    occupiedCells: run.snake.body.map((segment) => cellKey(segment)),
  },
});

const replaceHead = (run: RunState, head: Cell): RunState => ({
  ...run,
  snake: {
    ...run.snake,
    body: [head, ...run.snake.body.slice(1)],
  },
});

const isOutOfBounds = (run: RunState, cell: Cell) =>
  cell.x < 0 ||
  cell.y < 0 ||
  cell.x >= run.arena.size.width ||
  cell.y >= run.arena.size.height;

const wrapCell = (run: RunState, cell: Cell): Cell => ({
  x: (cell.x + run.arena.size.width) % run.arena.size.width,
  y: (cell.y + run.arena.size.height) % run.arena.size.height,
});

const findSafeCell = (run: RunState, blocked: Set<string>): Cell => {
  const occupied = new Set(run.snake.body.map((segment) => cellKey(segment)));
  const hazardCells = new Set(run.arena.hazards.map((hazard) => hazard.cell));

  for (let y = 0; y < run.arena.size.height; y += 1) {
    for (let x = 0; x < run.arena.size.width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key) && !hazardCells.has(key) && !blocked.has(key)) {
        return { x, y };
      }
    }
  }

  return { x: 0, y: 0 };
};

const createPickup = (run: RunState): PickupModel => {
  const kind = pickPickupKind(run.seed, run.tick, run.score);
  const style = pickupStyle(kind);
  return {
    kind,
    cell: findSafeCell(run, new Set()),
    ...style,
  };
};

const createBrowserState = (seed: string): BrowserState => {
  const biome = pickBiomeTheme(seed);
  let run = syncOccupiedCells(createRunState({ seed }));
  run = { ...run, arena: { ...run.arena, biomeId: biome.id } };
  return {
    run,
    pickup: createPickup(run),
    lastTickAt: performance.now(),
    status: "ready",
    pendingReset: false,
    bestScore: 0,
    phaseCharges: 1,
    flash: 0,
    shake: 0,
    biome,
    spectacle: createSpectacleState(run, {
      comboThresholdCrossed: false,
      imminentWarning: "",
    }),
  };
};

let state = createBrowserState("nova-alpha-001");

const setMessage = (message: string) => {
  messageValue.textContent = message;
};

const hasPhaseShift = (run: RunState) =>
  run.activeMutations.some((mutation) => mutation.id === "phase-shift");

const updateHud = () => {
  statusValue.textContent = state.status;
  biomeValue.textContent = state.biome.name;
  scoreValue.textContent = String(state.run.score);
  bestValue.textContent = String(state.bestScore);
  comboValue.textContent = `x${state.run.combo.multiplier}`;
  phaseValue.textContent = hasPhaseShift(state.run)
    ? `${state.phaseCharges} charges, phase live`
    : `${state.phaseCharges} charges`;
  seedValue.textContent = state.run.seed;
  biomeRuleValue.textContent = state.biome.rule;
  pickupLabel.textContent = state.pickup.label;
  root.style.setProperty("--biome-accent", state.biome.accent);
  root.style.setProperty("--biome-accent-soft", state.biome.accentSoft);
  root.style.setProperty("--biome-bg-a", state.biome.backgroundA);
  root.style.setProperty("--biome-bg-b", state.biome.backgroundB);
};

const drawStarfield = () => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, state.biome.backgroundA);
  gradient.addColorStop(1, state.biome.backgroundB);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const seed = state.run.tick + state.run.score;
  const starCount = state.spectacle.settings.flashIntensity < 1 ? 18 : 40;
  for (let index = 0; index < starCount; index += 1) {
    const x = (index * 37 + seed * 3) % canvas.width;
    const y = (index * 53 + seed * 2) % canvas.height;
    const size = 1 + ((index + state.run.combo.multiplier) % 3);
    ctx.fillStyle = index % 7 === 0 ? state.biome.accent : "rgba(255,255,255,0.5)";
    ctx.fillRect(x, y, size, size);
  }
};

const drawGrid = () => {
  drawStarfield();
  ctx.save();
  const shake = state.shake * state.spectacle.settings.screenShake;
  ctx.translate(shake * 0.8, shake * 0.2);
  for (let y = 0; y < state.run.arena.size.height; y += 1) {
    for (let x = 0; x < state.run.arena.size.width; x += 1) {
      ctx.strokeStyle = `rgba(110, 163, 255, ${0.06 + state.run.combo.multiplier * 0.008})`;
      ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  ctx.restore();
};

const drawTrail = () => {
  for (const cell of state.run.arena.trailCells) {
    const point = fromCellKey(cell);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(point.x * CELL_SIZE + 8, point.y * CELL_SIZE + 8, CELL_SIZE - 16, CELL_SIZE - 16);
  }
};

const drawHazards = () => {
  for (const hazard of state.run.arena.hazards) {
    const point = fromCellKey(hazard.cell);
    const centerX = point.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = point.y * CELL_SIZE + CELL_SIZE / 2;
    const telegraph = hazard.state === "telegraph";
    ctx.strokeStyle = telegraph ? "rgba(255, 90, 95, 0.7)" : "rgba(255, 70, 80, 1)";
    ctx.lineWidth = telegraph ? 2 : 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, telegraph ? CELL_SIZE * 0.32 : CELL_SIZE * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    if (!telegraph) {
      ctx.fillStyle = "rgba(255, 70, 80, 0.24)";
      ctx.fillRect(point.x * CELL_SIZE + 3, point.y * CELL_SIZE + 3, CELL_SIZE - 6, CELL_SIZE - 6);
    }
  }
};

const drawPickup = () => {
  const centerX = state.pickup.cell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = state.pickup.cell.y * CELL_SIZE + CELL_SIZE / 2;
  ctx.fillStyle = state.pickup.glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, CELL_SIZE * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = state.pickup.fill;
  ctx.beginPath();
  ctx.arc(centerX, centerY, CELL_SIZE * 0.25, 0, Math.PI * 2);
  ctx.fill();
};

const drawSnake = () => {
  state.run.snake.body.forEach((segment, index) => {
    const activePhase = hasPhaseShift(state.run);
    ctx.fillStyle = index === 0 ? state.biome.accent : activePhase ? "#b2ff9e" : "#1b9aaa";
    ctx.shadowBlur = index === 0 ? 22 * state.spectacle.settings.flashIntensity : 0;
    ctx.shadowColor = activePhase ? "#9bff8a" : state.biome.accent;
    ctx.fillRect(
      segment.x * CELL_SIZE + 2,
      segment.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4,
    );
    ctx.shadowBlur = 0;
  });
};

const drawFlash = () => {
  if (state.flash <= 0.02) {
    return;
  }
  ctx.fillStyle = `rgba(255,255,255,${Math.min(0.18, state.flash) * state.spectacle.settings.flashIntensity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawTrail();
  drawHazards();
  drawPickup();
  drawSnake();
  drawFlash();
  state.flash = Math.max(0, state.flash - 0.035);
  state.shake *= 0.82;
  updateHud();
};

const failRun = (reason: string) => {
  const results = buildRunResults(state.run, { reason });
  state = {
    ...state,
    status: "failed",
    pendingReset: true,
    bestScore: Math.max(state.bestScore, results.finalScore),
    flash: 0.22,
    shake: 8,
    run: {
      ...state.run,
      results,
    },
  };
  setMessage(`Run over at ${results.finalScore}. Collapse reason: ${reason}.`);
};

const spawnHazardAt = (cell: Cell, telegraphTicks: number) => {
  state.run = armHazard(state.run, {
    id: `hazard-${state.run.tick}-${cell.x}-${cell.y}`,
    cell: cellKey(cell),
    telegraphTicks,
  });
};

const spawnAmbientHazard = () => {
  const blocked = new Set([cellKey(state.pickup.cell)]);
  const target = findSafeCell(state.run, blocked);
  spawnHazardAt(target, 2);
};

const triggerPrismFork = (origin: Cell) => {
  const offsets: Cell[] = [
    { x: 2, y: 0 },
    { x: -2, y: 0 },
    { x: 0, y: 2 },
  ];

  for (const offset of offsets) {
    const target = wrapCell(state.run, { x: origin.x + offset.x, y: origin.y + offset.y });
    if (!state.run.snake.body.some((segment) => segment.x === target.x && segment.y === target.y)) {
      spawnHazardAt(target, 1);
    }
  }
};

const collectPickup = (previousTail: Cell) => {
  const head = state.run.snake.body[0];
  if (!head || head.x !== state.pickup.cell.x || head.y !== state.pickup.cell.y) {
    return;
  }

  const nextComboMultiplier = Math.min(
    state.run.combo.multiplier + state.pickup.comboBoost,
    9,
  );
  state.run = {
    ...state.run,
    score: state.run.score + state.pickup.score * state.run.combo.multiplier,
    combo: {
      count: state.run.combo.count + 1,
      multiplier: nextComboMultiplier,
      expiresAtTick: state.run.tick + 8,
    },
    snake: {
      ...state.run.snake,
      body: [...state.run.snake.body, previousTail],
    },
  };

  if (state.pickup.kind === "phase") {
    state.phaseCharges += 1;
    state.flash = 0.18;
    setMessage("Phase Core banked. Space can ghost through the next collapse line.");
  } else if (state.pickup.kind === "prism") {
    triggerPrismFork(head);
    state.shake = 6;
    state.flash = 0.14;
    setMessage("Prism Burst split the lane. Read the telegraphs and keep moving.");
  } else {
    setMessage("Starfruit clean. Combo pressure rising.");
  }

  state.run = syncOccupiedCells(state.run);
  state.pickup = createPickup(state.run);
};

const advanceSimulation = () => {
  const previousTail = state.run.snake.body[state.run.snake.body.length - 1];
  const previousHead = state.run.snake.body[0];

  if (!previousTail || !previousHead) {
    return;
  }

  state.run = advanceTick(state.run);
  const currentHead = state.run.snake.body[0];

  if (!currentHead) {
    return;
  }

  if (isOutOfBounds(state.run, currentHead)) {
    if (hasPhaseShift(state.run)) {
      state.run = replaceHead(state.run, wrapCell(state.run, currentHead));
      state.flash = 0.12;
      setMessage("Phase Shift bent space. You cut through the wall and stayed alive.");
    } else {
      failRun("wall");
      return;
    }
  }

  state.run = recordTrailStep(state.run, { cell: cellKey(previousHead) });
  state.run = syncOccupiedCells(state.run);
  state.run = advanceArena(state.run, { tick: state.run.tick });

  const head = state.run.snake.body[0];
  if (!head) {
    return;
  }

  const selfCollision = state.run.snake.body
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
  if (selfCollision) {
    failRun("self");
    return;
  }

  const armedHazard = state.run.arena.hazards.find(
    (hazard) => hazard.cell === cellKey(head) && hazard.state === "armed",
  );
  if (armedHazard) {
    if (hasPhaseShift(state.run)) {
      state.run = {
        ...state.run,
        arena: {
          ...state.run.arena,
          hazards: state.run.arena.hazards.filter((hazard) => hazard.id !== armedHazard.id),
        },
      };
      state.flash = 0.16;
      setMessage("Phase Shift burned through an armed hazard.");
    } else {
      failRun("hazard");
      return;
    }
  }

  if (state.run.tick % 7 === 0 && state.run.score > 0) {
    spawnAmbientHazard();
  }

  collectPickup(previousTail);
  state.run = tickMutationTimers(state.run);
  state.spectacle = createSpectacleState(state.run, {
    comboThresholdCrossed: state.run.combo.multiplier >= 4,
    imminentWarning: armedHazard ? "hazard" : "",
  });
};

const tick = (now: number) => {
  if (state.status !== "running") {
    render();
    requestAnimationFrame(tick);
    return;
  }

  const interval = nextTickInterval(state.run.combo.multiplier, hasPhaseShift(state.run));
  if (now - state.lastTickAt < interval) {
    render();
    requestAnimationFrame(tick);
    return;
  }

  state.lastTickAt = now;
  advanceSimulation();
  render();
  requestAnimationFrame(tick);
};

const launchRun = () => {
  const nextSeed = state.pendingReset ? seedFromClock() : state.run.seed;
  const next = createBrowserState(nextSeed);
  state = {
    ...next,
    bestScore: state.bestScore,
    status: "running",
  };
  setMessage("Run live. Chain pickups, manage prism forks, and save phase for panic moments.");
  render();
};

const keyToDirection: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (state.status === "running" && state.phaseCharges > 0 && !hasPhaseShift(state.run)) {
      event.preventDefault();
      state.phaseCharges -= 1;
      state.run = activateMutation(state.run, {
        id: "phase-shift",
        durationTicks: 6,
      });
      state.flash = 0.12;
      state.shake = 4;
      setMessage("Phase Shift online. Walls and hazards fold for a few beats.");
    }
    return;
  }

  const direction = keyToDirection[event.key];
  if (!direction || state.status !== "running") {
    return;
  }

  event.preventDefault();
  state.run = queueTurn(state.run, { tick: state.run.tick, direction });
});

playButton.addEventListener("click", launchRun);

presetButton.addEventListener("click", () => {
  const reduced = state.spectacle.settings.flashIntensity < 1;
  state.spectacle = applyAccessibilityPreset(
    createSpectacleState(state.run, {
      comboThresholdCrossed: state.run.combo.multiplier >= 4,
      imminentWarning: "",
    }),
    { preset: reduced ? "default" : "reduced-sensory" },
  );
  presetButton.textContent = reduced ? "Reduced FX: Off" : "Reduced FX: On";
  state.flash = reduced ? 0.12 : 0.05;
});

render();
requestAnimationFrame(tick);
