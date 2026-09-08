import type { EngineId } from "./engine-id";
import type { PitchIntent } from "./pitch-intent";

export const PATTERN_LENGTHS = [8, 16, 32] as const;

export type PatternLength = (typeof PATTERN_LENGTHS)[number];

export type Step = NoteStep | RestStep | TieStep;

export interface NoteStep {
  readonly index: number;
  readonly kind: "NOTE";
  readonly pitchIntent: PitchIntent;
  readonly octaveOffset: number;
  readonly locked: boolean;
}

export interface RestStep {
  readonly index: number;
  readonly kind: "REST";
  readonly locked: boolean;
}

export interface TieStep {
  readonly index: number;
  readonly kind: "TIE";
  readonly locked: boolean;
}

export interface PatternMetadata {
  readonly engineId: EngineId;
}

export interface Pattern {
  readonly length: PatternLength;
  readonly resolution: "1/16";
  readonly seed: number;
  readonly steps: readonly Step[];
  readonly metadata: PatternMetadata;
}

export interface NoteStepInput {
  readonly index: number;
  readonly pitchIntent: PitchIntent;
  readonly octaveOffset: number;
  readonly locked: boolean;
}

export interface IndexedStepInput {
  readonly index: number;
  readonly locked: boolean;
}

export interface PatternInput {
  readonly length: number;
  readonly seed: number;
  readonly steps: readonly Step[];
  readonly metadata: PatternMetadata;
}

export function createNote(input: NoteStepInput): NoteStep {
  return Object.freeze({
    index: input.index,
    kind: "NOTE" as const,
    pitchIntent: input.pitchIntent,
    octaveOffset: input.octaveOffset,
    locked: input.locked,
  });
}

export function createRest(input: IndexedStepInput): RestStep {
  return Object.freeze({
    index: input.index,
    kind: "REST" as const,
    locked: input.locked,
  });
}

export function createTie(input: IndexedStepInput): TieStep {
  return Object.freeze({
    index: input.index,
    kind: "TIE" as const,
    locked: input.locked,
  });
}

export function createPattern(input: PatternInput): Pattern {
  if (!isPatternLength(input.length)) {
    throw new RangeError(`Unsupported pattern length: ${input.length}`);
  }

  if (input.steps.length !== input.length) {
    throw new RangeError(
      `Pattern length ${input.length} does not match ${input.steps.length} steps`,
    );
  }

  return Object.freeze({
    length: input.length,
    resolution: "1/16" as const,
    seed: input.seed,
    steps: Object.freeze([...input.steps]),
    metadata: Object.freeze({ engineId: input.metadata.engineId }),
  });
}

export function isPatternLength(value: number): value is PatternLength {
  return PATTERN_LENGTHS.some((patternLength) => patternLength === value);
}
