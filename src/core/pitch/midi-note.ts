declare const midiNoteBrand: unique symbol;

export type MidiNote = number & {
  readonly [midiNoteBrand]: "MidiNote";
};

export function isMidiNote(value: number): value is MidiNote {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= 127;
}

export function createMidiNote(value: number): MidiNote {
  if (!isMidiNote(value)) {
    throw new Error("MidiNote must be a finite integer in the range 0..127");
  }

  return value;
}
