import type { StablePitchTarget } from "../model/pitch-intent";
import { createMidiNote, type MidiNote } from "./midi-note";
import { isOctaveOffset, type OctaveOffset, type PitchContext } from "./pitch-context";
import { getScaleDefinition } from "./scale";

export type ResolvedPitch = MidiNote;

export function resolveStableTargetInterval(target: StablePitchTarget, context: PitchContext): number {
  switch (target) {
    case "ROOT":
      return 0;
    case "PERFECT_FIFTH":
      return 7;
    case "SCALE_DEGREE_3":
      return getScaleDefinition(context.scale).intervals[2];
  }
}

export function fitMidiRangeByOctave(rawPitch: number): MidiNote {
  const rangeFittedPitch = rawPitch < 0 ? rawPitch + 12 : rawPitch > 127 ? rawPitch - 12 : rawPitch;

  return createMidiNote(rangeFittedPitch);
}

export function resolveStablePitch(
  target: StablePitchTarget,
  octaveOffset: OctaveOffset,
  context: PitchContext,
): ResolvedPitch {
  if (!isOctaveOffset(octaveOffset)) {
    throw new Error("OctaveOffset must be -1, 0, or 1");
  }

  const rawPitch = context.rootMidi + resolveStableTargetInterval(target, context) + (12 * octaveOffset);

  return fitMidiRangeByOctave(rawPitch);
}
