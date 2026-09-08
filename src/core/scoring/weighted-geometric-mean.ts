import { createScoreComponent, type ScoreComponent } from "./score-component";
import type { ScoreDimension } from "./score-dimension";

export function weightedGeometricMean(dimensions: readonly ScoreDimension[]): ScoreComponent {
  let activeCount = 0;
  let singleActiveScore: ScoreComponent | undefined;
  let totalWeight = 0;
  let weightedLogSum = 0;

  for (const dimension of dimensions) {
    if (dimension.status === "inactive") {
      continue;
    }

    if (dimension.score === 0) {
      return createScoreComponent(0);
    }

    activeCount += 1;
    singleActiveScore = dimension.score;
    totalWeight += dimension.weight;
    weightedLogSum += dimension.weight * Math.log(dimension.score);
  }

  if (totalWeight === 0) {
    throw new Error("weightedGeometricMean requires at least one active dimension");
  }

  if (activeCount === 1 && singleActiveScore !== undefined) {
    return singleActiveScore;
  }

  return createScoreComponent(Math.exp(weightedLogSum / totalWeight));
}
