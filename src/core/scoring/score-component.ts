declare const scoreComponentBrand: unique symbol;

export type ScoreComponent = number & {
  readonly [scoreComponentBrand]: "ScoreComponent";
};

export function createScoreComponent(value: number): ScoreComponent {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("ScoreComponent must be a finite number in the range 0..100");
  }

  return value as ScoreComponent;
}
