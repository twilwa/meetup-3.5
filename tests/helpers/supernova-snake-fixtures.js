function createRunFixture() {
  return {
    seed: "nova-alpha-001",
    tick: 41,
    heading: "up",
    pendingTurns: [],
    score: 4200,
    combo: {
      count: 3,
      multiplier: 4,
      expiresAtTick: 46,
    },
    styleGrade: "A",
    snake: {
      body: [
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 3, y: 4 },
      ],
      phaseExceptions: 1,
    },
    arena: {
      biomeId: "nebula-drift",
      size: { width: 12, height: 12 },
      occupiedCells: [
        "3,2",
        "3,3",
        "3,4",
        "5,5",
      ],
      lethalCells: ["5,5"],
      trailCells: [],
      hazards: [
        {
          id: "hazard-1",
          type: "collapse",
          cell: "5,5",
          telegraphTicksRemaining: 2,
          state: "telegraph",
        },
      ],
    },
    activeChallenge: {
      id: "tight-orbit",
      reward: "bonus-style",
    },
    activeMutations: [
      {
        id: "phase-shift",
        chargeSource: "combo-threshold",
        remainingTicks: 1,
        priority: 100,
      },
    ],
    results: null,
  };
}

function createContentManifestFixture() {
  return {
    foods: [
      {
        id: "basic-starfruit",
        family: "basic",
        cue: "steady-glow",
        baseScore: 100,
      },
      {
        id: "prism-burst",
        family: "reactive",
        cue: "prism-pulse",
        reaction: "score-bloom",
      },
      {
        id: "phase-core",
        family: "mutation-charge",
        cue: "double-beat",
        charge: "phase-shift",
      },
    ],
    hazards: [
      {
        id: "collapse-lane",
        telegraphTicks: 2,
        lethalState: "armed",
      },
    ],
    biomes: [
      {
        id: "nebula-drift",
        dominantRule: "drift",
      },
      {
        id: "mirror-lattice",
        dominantRule: "reflection",
      },
    ],
    challengeCards: [
      {
        id: "tight-orbit",
        modifier: "reduced-safe-space",
        reward: "bonus-style",
      },
    ],
  };
}

module.exports = {
  createRunFixture,
  createContentManifestFixture,
};
