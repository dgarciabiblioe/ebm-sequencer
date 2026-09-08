import {
  CANDIDATE_RETRIES_EXHAUSTED,
  MAX_CANDIDATE_ATTEMPTS,
  InvalidFallbackError,
  invalidValidation,
  runCandidatePipeline,
  summarizeCandidateTelemetry,
  validValidation,
  validateCandidate,
  type CandidateRunTelemetry,
  type Validator,
} from "../../../src/core";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, errorType: new (...arguments_: never[]) => Error, message: string): void {
  let thrown: Error | undefined;

  try {
    action();
  } catch (error) {
    thrown = error as Error;
  }

  assert(thrown instanceof errorType, message);
}

const acceptPositive: Validator<number> = (candidate) => (
  candidate > 0 ? validValidation() : invalidValidation("not-positive")
);

let firstAttemptCalls = 0;
let firstFallbackCalls = 0;
const firstAttempt = runCandidatePipeline(
  (attemptNumber) => {
    firstAttemptCalls += 1;
    return attemptNumber;
  },
  [acceptPositive],
  () => {
    firstFallbackCalls += 1;
    return 1;
  },
);
assert(firstAttempt.status === "accepted", "A valid first attempt must be accepted");
assert(firstAttempt.candidateAttempts === 1 && firstAttempt.retriesUsed === 0, "First acceptance must use no retries");
assert(firstAttemptCalls === 1 && firstFallbackCalls === 0, "First acceptance must skip later work and fallback");
assert(!firstAttempt.telemetry.usedFallback && firstAttempt.telemetry.fallbackReason === null, "Accepted telemetry must not report fallback");

const thirdAttempt = runCandidatePipeline(
  (attemptNumber) => attemptNumber,
  [(candidate) => (candidate === 3 ? validValidation() : invalidValidation("not-third"))],
  () => 3,
);
assert(thirdAttempt.status === "accepted", "Third valid attempt must be accepted");
assert(thirdAttempt.candidateAttempts === 3 && thirdAttempt.retriesUsed === 2, "Third acceptance must report two retries");

const validationCalls: string[] = [];
const firstFailure = validateCandidate(1, [
  () => {
    validationCalls.push("A");
    return validValidation();
  },
  () => {
    validationCalls.push("B");
    return invalidValidation("reason-B");
  },
  () => {
    validationCalls.push("C");
    return invalidValidation("reason-C");
  },
]);
assert(firstFailure.status === "invalid" && firstFailure.reason === "reason-B", "First validation failure must win");
assert(validationCalls.join(",") === "A,B", "Validators after the first failure must not run");

let maximumFallbackCalls = 0;
let highestAttempt = 0;
const lastAttempt = runCandidatePipeline(
  (attemptNumber) => {
    highestAttempt = Math.max(highestAttempt, attemptNumber);
    return attemptNumber;
  },
  [(candidate) => (candidate === MAX_CANDIDATE_ATTEMPTS ? validValidation() : invalidValidation("not-last"))],
  () => {
    maximumFallbackCalls += 1;
    return MAX_CANDIDATE_ATTEMPTS;
  },
);
assert(lastAttempt.status === "accepted" && lastAttempt.candidateAttempts === 33 && lastAttempt.retriesUsed === 32, "Attempt 33 must remain eligible");
assert(highestAttempt === 33 && maximumFallbackCalls === 0, "A valid last attempt must not execute fallback or attempt 34");

let exhaustedFallbackCalls = 0;
const exhausted = runCandidatePipeline(
  () => 0,
  [acceptPositive],
  () => {
    exhaustedFallbackCalls += 1;
    return 1;
  },
);
assert(exhausted.status === "fallback", "Exhaustion must use a caller-provided valid fallback");
if (exhausted.status === "fallback") {
  assert(exhausted.value === 1 && exhausted.candidateAttempts === 33 && exhausted.retriesUsed === 32, "Fallback must not count as a candidate attempt");
  assert(exhausted.fallbackReason === CANDIDATE_RETRIES_EXHAUSTED, "Fallback reason must be canonical");
  assert(exhaustedFallbackCalls === 1 && exhausted.telemetry.usedFallback, "Fallback must run once and report telemetry");
}

let fallbackValidationCalls = 0;
runCandidatePipeline(
  () => 0,
  [
    (candidate) => {
      fallbackValidationCalls += 1;
      return candidate === 1 ? validValidation() : invalidValidation("not-fallback");
    },
  ],
  () => 1,
);
assert(fallbackValidationCalls === 34, "Fallback must use the same validator after 33 failed candidates");

assertThrows(
  () => runCandidatePipeline(() => 0, [acceptPositive], () => 0),
  InvalidFallbackError,
  "An invalid fallback must throw instead of being returned",
);

const telemetryRuns: readonly CandidateRunTelemetry[] = [
  firstAttempt.telemetry,
  firstAttempt.telemetry,
  thirdAttempt.telemetry,
  exhausted.telemetry,
];
const originalTelemetryReferences = [...telemetryRuns];
const summary = summarizeCandidateTelemetry(telemetryRuns);
assert(summary.runCount === 4 && summary.fallbackCount === 1 && summary.fallbackRate === 0.25, "Telemetry summary must derive fallback statistics");
assert(summary.retryHistogram.length === 33, "Retry histogram must cover 0..32");
assert(summary.retryHistogram[0] === 2 && summary.retryHistogram[2] === 1 && summary.retryHistogram[32] === 1, "Retry histogram must be indexed by retries used");
assert(telemetryRuns[0] === originalTelemetryReferences[0], "Telemetry summary must not mutate input arrays");
const emptySummary = summarizeCandidateTelemetry([]);
assert(emptySummary.runCount === 0 && emptySummary.fallbackCount === 0 && emptySummary.fallbackRate === 0, "Empty telemetry must summarize to zero values");
assert(emptySummary.retryHistogram.every((count) => count === 0), "Empty telemetry histogram must contain only zeroes");

const deterministicRun = () => runCandidatePipeline(
  (attemptNumber) => attemptNumber,
  [(candidate) => (candidate === 2 ? validValidation() : invalidValidation("not-second"))],
  () => 2,
);
const deterministicA = deterministicRun();
const deterministicB = deterministicRun();
assert(
  deterministicA.status === deterministicB.status
    && deterministicA.candidateAttempts === deterministicB.candidateAttempts
    && deterministicA.retriesUsed === deterministicB.retriesUsed,
  "A deterministic producer must produce deterministic results and telemetry",
);
