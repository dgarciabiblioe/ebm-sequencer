import {
  createMidiNote,
  createOctaveOffset,
  createPitchContext,
  resolveStablePitch,
  type OctaveOffset,
  type PitchContext,
  type StablePitchTarget,
} from "../../../src/core";

const context = createPitchContext(createMidiNote(36), "MAJOR");
const target: StablePitchTarget = "ROOT";
const offset: OctaveOffset = 1;
const resolved = resolveStablePitch(target, offset, context);

// @ts-expect-error OCTAVE is not a StablePitchTarget.
const octaveTarget: StablePitchTarget = "OCTAVE";
// @ts-expect-error OctaveOffset only accepts -1, 0, or 1.
const invalidOffset: OctaveOffset = 2;
// @ts-expect-error PitchContext requires rootMidi and scale.
const incompleteContext: PitchContext = { rootMidi: createMidiNote(36) };

void resolved;
void octaveTarget;
void invalidOffset;
void incompleteContext;
