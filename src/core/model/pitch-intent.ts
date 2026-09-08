export const STABLE_PITCH_TARGETS = [
  "ROOT",
  "PERFECT_FIFTH",
  "SCALE_DEGREE_3",
] as const;

export type StablePitchTarget = (typeof STABLE_PITCH_TARGETS)[number];

export type PitchIntent =
  | RootPitchIntent
  | PerfectFifthPitchIntent
  | ScaleDegreePitchIntent
  | ChromaticApproachPitchIntent;

export interface RootPitchIntent {
  readonly kind: "ROOT";
}

export interface PerfectFifthPitchIntent {
  readonly kind: "PERFECT_FIFTH";
}

export interface ScaleDegreePitchIntent {
  readonly kind: "SCALE_DEGREE";
  readonly degree: number;
}

export interface ChromaticApproachPitchIntent {
  readonly kind: "CHROMATIC_APPROACH";
  readonly target: StablePitchTarget;
  readonly direction: "below" | "above";
}
