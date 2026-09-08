import {
  ENGINE_IDS,
  STABLE_PITCH_TARGETS,
  createNote,
  createPattern,
  createRest,
  createTie,
  isEngineId,
  type PatternMetadata,
  type Step,
} from "../../../src/core";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, message: string): void {
  let didThrow = false;

  try {
    action();
  } catch {
    didThrow = true;
  }

  assert(didThrow, message);
}

const rootIntent = { kind: "ROOT" } as const;
const note = createNote({
  index: 1,
  pitchIntent: rootIntent,
  octaveOffset: 1,
  locked: false,
});
const rest = createRest({ index: 2, locked: false });
const tie = createTie({ index: 3, locked: true });
const metadata: PatternMetadata = { engineId: "electronic" };
const steps: readonly Step[] = [
  note,
  rest,
  tie,
  createRest({ index: 4, locked: false }),
  createRest({ index: 5, locked: false }),
  createRest({ index: 6, locked: false }),
  createRest({ index: 7, locked: false }),
  createRest({ index: 8, locked: false }),
];
const pattern = createPattern({ length: 8, seed: 0, steps, metadata });

assert(note.kind === "NOTE", "NOTE must be constructible");
assert(rest.kind === "REST", "REST must be constructible");
assert(tie.kind === "TIE", "TIE must be constructible");
assert(pattern.steps.length === 8, "Pattern must preserve its steps");
assert(pattern.steps[0] === note, "Pattern must preserve step identity");
assert(pattern.metadata.engineId === "electronic", "PatternMetadata must preserve engineId");
assert(note.pitchIntent.kind === "ROOT", "PitchIntent must remain symbolic");
assert(note.octaveOffset === 1, "octaveOffset must remain independent");
assert(!("octaveOffset" in note.pitchIntent), "PitchIntent must not contain octaveOffset");
assert(!("pitchIntent" in rest) && !("pitchIntent" in tie), "REST and TIE must not carry pitch intent");
assert(STABLE_PITCH_TARGETS.join(",") === "ROOT,PERFECT_FIFTH,SCALE_DEGREE_3", "StablePitchTarget contract changed");
assert(STABLE_PITCH_TARGETS.length === 3, "OCTAVE must not be stable");
assert(ENGINE_IDS.join(",") === "electronic,body,machine", "minimal must not be an engine ID");
assert(!isEngineId("minimal"), "minimal must not be accepted as an engine ID");
assertThrows(
  () => createPattern({ length: 12, seed: 0, steps, metadata }),
  "Unsupported pattern lengths must be rejected",
);
assertThrows(
  () => createPattern({ length: 8, seed: 0, steps: steps.slice(0, 7), metadata }),
  "Mismatched pattern step counts must be rejected",
);
