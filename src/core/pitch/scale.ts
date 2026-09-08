export const SCALE_IDS = [
  "CHROMATIC",
  "MAJOR",
  "NATURAL_MINOR",
  "DORIAN",
  "PHRYGIAN",
  "MIXOLYDIAN",
  "HARMONIC_MINOR",
  "MINOR_PENTATONIC",
] as const;

export type ScaleId = (typeof SCALE_IDS)[number];

export interface ScaleDefinition {
  readonly intervals: readonly number[];
}

const SCALE_DEFINITIONS: Readonly<Record<ScaleId, ScaleDefinition>> = Object.freeze({
  CHROMATIC: Object.freeze({ intervals: Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) }),
  MAJOR: Object.freeze({ intervals: Object.freeze([0, 2, 4, 5, 7, 9, 11]) }),
  NATURAL_MINOR: Object.freeze({ intervals: Object.freeze([0, 2, 3, 5, 7, 8, 10]) }),
  DORIAN: Object.freeze({ intervals: Object.freeze([0, 2, 3, 5, 7, 9, 10]) }),
  PHRYGIAN: Object.freeze({ intervals: Object.freeze([0, 1, 3, 5, 7, 8, 10]) }),
  MIXOLYDIAN: Object.freeze({ intervals: Object.freeze([0, 2, 4, 5, 7, 9, 10]) }),
  HARMONIC_MINOR: Object.freeze({ intervals: Object.freeze([0, 2, 3, 5, 7, 8, 11]) }),
  MINOR_PENTATONIC: Object.freeze({ intervals: Object.freeze([0, 3, 5, 7, 10]) }),
});

export function getScaleDefinition(scale: ScaleId): ScaleDefinition {
  return SCALE_DEFINITIONS[scale];
}
