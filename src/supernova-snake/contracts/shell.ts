import type {
  HudModel,
  HudModelInput,
  InputPrompt,
  InputPromptRequest,
  RunState,
  ShellFlow,
  ShellFlowInput,
  TutorialBeat,
  TutorialPlanInput,
} from "./types.ts";

export function getShellFlow(input: ShellFlowInput): ShellFlow {
  return {
    primaryAction: {
      id: input.activeScreen === "results" ? "retry-last-run" : "play",
      seed: input.lastSeed || "nova-alpha-001",
    },
    confirmationsToPlay: input.activeScreen === "title" ? 1 : 0,
  };
}

export function mapInputPrompt(request: InputPromptRequest): InputPrompt {
  return {
    device: request.device,
    action: request.action,
  };
}

export function getHudModel(run: RunState, input: HudModelInput): HudModel {
  const lethalWarnings = input.imminentWarnings.filter((w) =>
    w.toLowerCase().includes("hazard")
  );
  return {
    priorityWarnings: lethalWarnings,
  };
}

export function buildTutorialBeatPlan(input: TutorialPlanInput): TutorialBeat[] {
  const beats: TutorialBeat[] = [];
  
  // Add beats for all required topics with "in-play" mode
  for (const topic of input.requiredTopics) {
    beats.push({ topic, mode: "in-play" });
  }
  
  return beats;
}
