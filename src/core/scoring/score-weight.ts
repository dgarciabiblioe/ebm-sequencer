declare const scoreWeightBrand: unique symbol;

export type ScoreWeight = number & {
  readonly [scoreWeightBrand]: "ScoreWeight";
};

export function createScoreWeight(value: number): ScoreWeight {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("ScoreWeight must be a finite number greater than 0");
  }

  return value as ScoreWeight;
}
