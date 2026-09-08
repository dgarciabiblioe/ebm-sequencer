import {
  createChromaticApproach,
  createMidiNote,
  createPitchContext,
  resolvePitchIntent,
  type ChromaticApproachDirection,
  type StablePitchTarget,
} from "../../../src/core";

const context = createPitchContext(createMidiNote(36), "MAJOR");
const direction: ChromaticApproachDirection = "below";
const target: StablePitchTarget = "SCALE_DEGREE_3";
const approach = createChromaticApproach(target, direction);
const resolved = resolvePitchIntent(approach, 0, context);

// @ts-expect-error CHROMATIC_APPROACH only accepts below or above.
const invalidDirection: ChromaticApproachDirection = "up";
// @ts-expect-error OCTAVE is not a stable chromatic target.
const invalidTarget: StablePitchTarget = "OCTAVE";
// @ts-expect-error CHROMATIC_APPROACH cannot target itself.
const recursiveTarget = createChromaticApproach("CHROMATIC_APPROACH", "below");

void resolved;
void invalidDirection;
void invalidTarget;
void recursiveTarget;
