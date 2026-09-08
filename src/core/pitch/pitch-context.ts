import type { MidiNote } from "./midi-note";
import type { ScaleId } from "./scale";

export type OctaveOffset = -1 | 0 | 1;

export interface PitchContext {
  readonly rootMidi: MidiNote;
  readonly scale: ScaleId;
}

export function isOctaveOffset(value: number): value is OctaveOffset {
  return value === -1 || value === 0 || value === 1;
}

export function createOctaveOffset(value: number): OctaveOffset {
  if (!isOctaveOffset(value)) {
    throw new Error("OctaveOffset must be -1, 0, or 1");
  }

  return value;
}

export function createPitchContext(rootMidi: MidiNote, scale: ScaleId): PitchContext {
  return Object.freeze({ rootMidi, scale });
}
