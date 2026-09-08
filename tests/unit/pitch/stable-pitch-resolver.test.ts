import {
  SCALE_IDS,
  createMidiNote,
  createOctaveOffset,
  createPitchContext,
  getScaleDefinition,
  resolveStablePitch,
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

for (const value of [0, 36, 60, 127]) {
  assert(createMidiNote(value) === value, `MidiNote must accept ${value}`);
}

for (const value of [-1, 128, 60.5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  assertThrows(() => createMidiNote(value), `MidiNote must reject ${value}`);
}

for (const value of [-1, 0, 1]) {
  assert(createOctaveOffset(value) === value, `OctaveOffset must accept ${value}`);
}

for (const value of [-2, 2, 0.5]) {
  assertThrows(() => createOctaveOffset(value), `OctaveOffset must reject ${value}`);
}

const context = createPitchContext(createMidiNote(36), "MAJOR");
assert(resolveStablePitch("ROOT", 0, context) === 36, "ROOT must resolve to rootMidi");
assert(resolveStablePitch("PERFECT_FIFTH", 0, context) === 43, "PERFECT_FIFTH must resolve to rootMidi + 7");
assert(resolveStablePitch("ROOT", 1, context) === 48, "OctaveOffset +1 must add 12 semitones");
assert(resolveStablePitch("ROOT", -1, context) === 24, "OctaveOffset -1 must subtract 12 semitones");
assert(resolveStablePitch("PERFECT_FIFTH", 1, context) === 55, "Fifth plus octave must retain its harmonic role");

const expectedThirdDegrees: Readonly<Record<(typeof SCALE_IDS)[number], number>> = {
  CHROMATIC: 2,
  MAJOR: 4,
  NATURAL_MINOR: 3,
  DORIAN: 3,
  PHRYGIAN: 3,
  MIXOLYDIAN: 4,
  HARMONIC_MINOR: 3,
  MINOR_PENTATONIC: 5,
};
for (const scale of SCALE_IDS) {
  const definition = getScaleDefinition(scale);
  const intervals = definition.intervals;
  assert(intervals[0] === 0, `${scale} must begin at ROOT`);
  assert(intervals.length >= 3, `${scale} must contain a third degree`);
  assert(intervals.every((interval) => Number.isInteger(interval) && interval >= 0 && interval <= 11), `${scale} intervals must be MIDI pitch-class intervals`);
  assert(intervals.every((interval, index) => index === 0 || interval > intervals[index - 1]), `${scale} intervals must be unique and ascending`);
  assert(resolveStablePitch("SCALE_DEGREE_3", 0, createPitchContext(createMidiNote(36), scale)) === 36 + expectedThirdDegrees[scale], `${scale} third degree must resolve canonically`);
}

const upperFit = createPitchContext(createMidiNote(125), "MAJOR");
const lowerFit = createPitchContext(createMidiNote(2), "MAJOR");
assert(resolveStablePitch("PERFECT_FIFTH", 0, upperFit) === 120, "Upper range fitting must subtract exactly 12");
assert(resolveStablePitch("ROOT", -1, lowerFit) === 2, "Lower range fitting must add exactly 12");
assert(resolveStablePitch("PERFECT_FIFTH", 0, upperFit) !== 127, "Range fitting must not clamp to 127");
assertThrows(
  () => resolveStablePitch("PERFECT_FIFTH", 1, createPitchContext(createMidiNote(127), "MAJOR")),
  "A pitch outside MIDI range after one fit must fail",
);

const contextBefore = { rootMidi: context.rootMidi, scale: context.scale };
const rootResultA = resolveStablePitch("ROOT", 0, context);
const rootResultB = resolveStablePitch("ROOT", 0, context);
assert(context.rootMidi === contextBefore.rootMidi && context.scale === contextBefore.scale, "Resolution must not mutate PitchContext");
assert(rootResultA === rootResultB, "Stable pitch resolution must be deterministic");
assertThrows(
  () => resolveStablePitch("ROOT", 2 as never, context),
  "Resolver must reject invalid octave offsets at runtime",
);
