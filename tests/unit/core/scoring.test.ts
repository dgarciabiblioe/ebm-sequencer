import {
  activeScoreDimension,
  createScoreComponent,
  createScoreWeight,
  inactiveScoreDimension,
  weightedGeometricMean,
  type ScoreDimension,
} from "../../../src/core";

const TOLERANCE = 0.0000001;

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertApproximate(actual: number, expected: number, message: string): void {
  assert(Math.abs(actual - expected) < TOLERANCE, `${message}: expected ${expected}, received ${actual}`);
}

function assertThrows(action: () => void, message: string): void {
  let didThrow = false;

  try {
    action();
  } catch {
    didThrow = true;
  }

  assert(didThrow, message);
}

for (const value of [0, 25, 50, 75, 83.5, 100]) {
  assert(createScoreComponent(value) === value, `ScoreComponent must accept ${value}`);
}

for (const value of [-0.001, 100.001, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  assertThrows(() => createScoreComponent(value), `ScoreComponent must reject ${value}`);
}

for (const value of [0.1, 1, 10]) {
  assert(createScoreWeight(value) === value, `ScoreWeight must accept ${value}`);
}

for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
  assertThrows(() => createScoreWeight(value), `ScoreWeight must reject ${value}`);
}

const score0 = createScoreComponent(0);
const score25 = createScoreComponent(25);
const score50 = createScoreComponent(50);
const score75 = createScoreComponent(75);
const score80 = createScoreComponent(80);
const score100 = createScoreComponent(100);
const weight1 = createScoreWeight(1);
const weight3 = createScoreWeight(3);

assert(weightedGeometricMean([activeScoreDimension(score75, weight1)]) === 75, "One dimension must retain its score");
assertApproximate(
  weightedGeometricMean([activeScoreDimension(score25, weight1), activeScoreDimension(score100, weight1)]),
  50,
  "Equal weights must calculate the geometric mean",
);
assertApproximate(
  weightedGeometricMean([activeScoreDimension(score50, weight1), activeScoreDimension(score100, weight3)]),
  84.08964152537145,
  "Different weights must calculate the weighted geometric mean",
);
assertApproximate(
  weightedGeometricMean([
    activeScoreDimension(score80, weight1),
    inactiveScoreDimension(),
    activeScoreDimension(score50, weight3),
  ]),
  Math.exp((Math.log(80) + (3 * Math.log(50))) / 4),
  "Inactive dimensions must be excluded and active weights reweighted",
);
assert(
  weightedGeometricMean([
    activeScoreDimension(score75, weight1),
    inactiveScoreDimension(),
    inactiveScoreDimension(),
  ]) === 75,
  "Inactive dimensions must not alter an active aggregate",
);
assert(
  weightedGeometricMean([activeScoreDimension(score100, weight1), activeScoreDimension(score0, weight1)]) === 0,
  "An active score of 0 must veto the aggregate",
);
assertThrows(
  () => weightedGeometricMean([inactiveScoreDimension(), inactiveScoreDimension()]),
  "All inactive dimensions must fail",
);
assertThrows(() => weightedGeometricMean([]), "An empty dimension array must fail");
assertApproximate(
  weightedGeometricMean([activeScoreDimension(score50, weight1), activeScoreDimension(score100, weight3)]),
  weightedGeometricMean([
    activeScoreDimension(score50, createScoreWeight(10)),
    activeScoreDimension(score100, createScoreWeight(30)),
  ]),
  "Scaling all weights must not change the aggregate",
);

const dimensions: readonly ScoreDimension[] = [
  { status: "active", score: score50, weight: weight1 },
  { status: "inactive" },
];
const originalReferences = [...dimensions];
const originalScore = dimensions[0].status === "active" ? dimensions[0].score : undefined;
weightedGeometricMean(dimensions);
assert(dimensions.length === 2, "Aggregation must not change input array length");
assert(dimensions[0] === originalReferences[0] && dimensions[1] === originalReferences[1], "Aggregation must not replace dimensions");
assert(dimensions[0].status === "active" && dimensions[0].score === originalScore, "Aggregation must not mutate dimensions");
