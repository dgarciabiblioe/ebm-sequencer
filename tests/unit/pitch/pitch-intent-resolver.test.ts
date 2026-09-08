import {
  createChromaticApproach,
  createMidiNote,
  createPitchContext,
  resolvePitchIntent,
  resolveStablePitch,
} from "../../../src/core";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const context = createPitchContext(createMidiNote(36), "MAJOR");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "below"), 0, context) === 35, "ROOT below must be one semitone lower");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "above"), 0, context) === 37, "ROOT above must be one semitone higher");
assert(resolvePitchIntent(createChromaticApproach("PERFECT_FIFTH", "below"), 0, context) === 42, "Fifth below must be one semitone lower");
assert(resolvePitchIntent(createChromaticApproach("PERFECT_FIFTH", "above"), 0, context) === 44, "Fifth above must be one semitone higher");
assert(resolvePitchIntent(createChromaticApproach("SCALE_DEGREE_3", "below"), 0, context) === 39, "Degree three below must use the active scale");
assert(resolvePitchIntent(createChromaticApproach("SCALE_DEGREE_3", "above"), 0, context) === 41, "Degree three above must use the active scale");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "below"), 1, context) === 47, "Octave offset must precede chromatic displacement");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "above"), -1, context) === 25, "Negative octave offset must precede chromatic displacement");

const lowContext = createPitchContext(createMidiNote(0), "MAJOR");
const highContext = createPitchContext(createMidiNote(127), "MAJOR");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "below"), 0, lowContext) === 11, "Lower chromatic range fitting must add 12 once");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "above"), 0, highContext) === 116, "Upper chromatic range fitting must subtract 12 once");

assert(resolvePitchIntent({ kind: "ROOT" }, 0, context) === resolveStablePitch("ROOT", 0, context), "General ROOT resolution must delegate to stable resolution");
assert(resolvePitchIntent({ kind: "PERFECT_FIFTH" }, 0, context) === resolveStablePitch("PERFECT_FIFTH", 0, context), "General fifth resolution must delegate to stable resolution");
assert(resolvePitchIntent({ kind: "SCALE_DEGREE", degree: 3 }, 0, context) === resolveStablePitch("SCALE_DEGREE_3", 0, context), "General degree three must match stable resolution");
assert(resolvePitchIntent(createChromaticApproach("ROOT", "above"), 0, context) === 37, "General chromatic resolution must resolve its approach pitch");

const approach = createChromaticApproach("ROOT", "below");
const contextBefore = { rootMidi: context.rootMidi, scale: context.scale };
const resultA = resolvePitchIntent(approach, 0, context);
const resultB = resolvePitchIntent(approach, 0, context);
assert(approach.target === "ROOT" && approach.direction === "below", "Resolution must not mutate PitchIntent");
assert(context.rootMidi === contextBefore.rootMidi && context.scale === contextBefore.scale, "Resolution must not mutate PitchContext");
assert(resultA === resultB, "Pitch intent resolution must be deterministic");
