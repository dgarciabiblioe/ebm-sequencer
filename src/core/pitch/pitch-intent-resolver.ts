import {
  type ChromaticApproachPitchIntent,
  type PitchIntent,
  type StablePitchTarget,
} from "../model/pitch-intent";
import type { MidiNote } from "./midi-note";
import type { OctaveOffset, PitchContext } from "./pitch-context";
import { getScaleDefinition } from "./scale";
import {
  fitMidiRangeByOctave,
  resolveStablePitch,
  resolveStableTargetInterval,
} from "./stable-pitch-resolver";

export type ChromaticApproachDirection = ChromaticApproachPitchIntent["direction"];

export function createChromaticApproach(
  target: StablePitchTarget,
  direction: ChromaticApproachDirection,
): ChromaticApproachPitchIntent {
  return Object.freeze({ kind: "CHROMATIC_APPROACH", target, direction });
}

function resolveScaleDegree(degree: number, octaveOffset: OctaveOffset, context: PitchContext): MidiNote {
  const intervals = getScaleDefinition(context.scale).intervals;

  if (!Number.isInteger(degree) || degree < 1 || degree > intervals.length) {
    throw new Error("SCALE_DEGREE must reference a degree in the active scale");
  }

  return fitMidiRangeByOctave(context.rootMidi + intervals[degree - 1] + (12 * octaveOffset));
}

function resolveChromaticApproach(
  pitchIntent: ChromaticApproachPitchIntent,
  octaveOffset: OctaveOffset,
  context: PitchContext,
): MidiNote {
  const chromaticOffset = pitchIntent.direction === "below" ? -1 : 1;
  const rawStablePitch = context.rootMidi
    + resolveStableTargetInterval(pitchIntent.target, context)
    + (12 * octaveOffset);

  return fitMidiRangeByOctave(rawStablePitch + chromaticOffset);
}

export function resolvePitchIntent(
  pitchIntent: PitchIntent,
  octaveOffset: OctaveOffset,
  context: PitchContext,
): MidiNote {
  switch (pitchIntent.kind) {
    case "ROOT":
      return resolveStablePitch("ROOT", octaveOffset, context);
    case "PERFECT_FIFTH":
      return resolveStablePitch("PERFECT_FIFTH", octaveOffset, context);
    case "SCALE_DEGREE":
      return resolveScaleDegree(pitchIntent.degree, octaveOffset, context);
    case "CHROMATIC_APPROACH":
      return resolveChromaticApproach(pitchIntent, octaveOffset, context);
  }
}
