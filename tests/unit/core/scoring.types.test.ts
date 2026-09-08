import {
  activeScoreDimension,
  createScoreComponent,
  createScoreWeight,
  inactiveScoreDimension,
  type ScoreDimension,
} from "../../../src/core";

const score = createScoreComponent(75);
const weight = createScoreWeight(1);
const active = activeScoreDimension(score, weight);
const inactive = inactiveScoreDimension();

// @ts-expect-error Active dimensions require a weight.
const incompleteActive: ScoreDimension = { status: "active", score };

function readScore(dimension: ScoreDimension): number | undefined {
  if (dimension.status === "inactive") {
    // @ts-expect-error Inactive dimensions have no score until narrowed to active.
    return dimension.score;
  }

  return dimension.score;
}

void active;
void inactive;
void incompleteActive;
void readScore;
