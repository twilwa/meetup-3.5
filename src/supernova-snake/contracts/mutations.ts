import type {
  MutationActivation,
  MutationCharge,
  MutationChargeTrigger,
  MutationPriorityResolution,
  MutationResolutionInput,
  RunState,
} from "./types.ts";

export function earnMutationCharge(
  run: RunState,
  trigger: MutationChargeTrigger
): MutationCharge {
  return {
    id: "phase-shift",
    source: trigger.source,
    readable: true,
  };
}

export function activateMutation(
  run: RunState,
  activation: MutationActivation
): RunState {
  const mutation = run.activeMutations.find((m) => m.id === activation.id);
  if (mutation) {
    mutation.remainingTicks = activation.durationTicks;
  } else {
    return {
      ...run,
      activeMutations: [
        ...run.activeMutations,
        {
          id: activation.id,
          chargeSource: "manual",
          remainingTicks: activation.durationTicks,
          priority: 100,
        },
      ],
    };
  }
  return run;
}

export function tickMutationTimers(run: RunState): RunState {
  const warnings: string[] = [];
  const updated = run.activeMutations
    .map((m) => {
      // Check for expiry warning BEFORE decrementing
      if (m.remainingTicks === 1) {
        warnings.push(`${m.id}-expiring`);
      }
      return {
        ...m,
        remainingTicks: m.remainingTicks - 1,
      };
    })
    .filter((m) => m.remainingTicks > 0);

  return {
    ...run,
    activeMutations: updated,
    warnings: warnings,
  };
}

export function resolveMutationPriority(
  inputs: MutationResolutionInput[]
): MutationPriorityResolution {
  const sorted = [...inputs].sort((a, b) => b.priority - a.priority);
  return {
    priorityOrder: sorted.map((i) => i.id),
    winningEffect: sorted[0]?.effect || "",
  };
}
