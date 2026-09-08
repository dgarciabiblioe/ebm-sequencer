import type { EngineId, Step } from "../../../src/core";

const rootIntent = { kind: "ROOT" } as const;

const ambiguousRest: Step = {
  index: 1,
  kind: "REST",
  locked: false,
  // @ts-expect-error REST cannot carry NOTE-only fields.
  pitchIntent: rootIntent,
  octaveOffset: 0,
};

// @ts-expect-error OCTAVE is not a PitchIntent kind.
const octaveIntent = { kind: "OCTAVE" } as const satisfies Step;

// @ts-expect-error minimal is not a public EngineId.
const minimalEngine: EngineId = "minimal";

void ambiguousRest;
void octaveIntent;
void minimalEngine;
