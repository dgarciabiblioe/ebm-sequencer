import type { ScoreComponent } from "./score-component";
import type { ScoreWeight } from "./score-weight";

export type ActiveScoreDimension = Readonly<{
  status: "active";
  score: ScoreComponent;
  weight: ScoreWeight;
}>;

export type InactiveScoreDimension = Readonly<{
  status: "inactive";
}>;

export type ScoreDimension = ActiveScoreDimension | InactiveScoreDimension;

export function activeScoreDimension(
  score: ScoreComponent,
  weight: ScoreWeight,
): ActiveScoreDimension {
  return Object.freeze({ status: "active", score, weight });
}

export function inactiveScoreDimension(): InactiveScoreDimension {
  return Object.freeze({ status: "inactive" });
}
