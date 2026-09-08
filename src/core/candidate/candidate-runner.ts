import {
  CANDIDATE_RETRIES_EXHAUSTED,
  MAX_CANDIDATE_ATTEMPTS,
  type CandidateProducer,
  type CandidateRunResult,
  type CandidateRunTelemetry,
  type FallbackProducer,
} from "./candidate-contract";
import { validateCandidate, type Validator } from "./candidate-validation";

export class InvalidFallbackError extends Error {
  constructor(reason: string) {
    super(`Fallback candidate is invalid: ${reason}`);
    this.name = "InvalidFallbackError";
  }
}

function createTelemetry(
  candidateAttempts: number,
  retriesUsed: number,
  usedFallback: boolean,
): CandidateRunTelemetry {
  return Object.freeze({
    candidateAttempts,
    retriesUsed,
    usedFallback,
    fallbackReason: usedFallback ? CANDIDATE_RETRIES_EXHAUSTED : null,
  });
}

export function runCandidatePipeline<T>(
  producer: CandidateProducer<T>,
  validators: readonly Validator<T>[],
  fallbackProducer: FallbackProducer<T>,
): CandidateRunResult<T> {
  for (let attemptNumber = 1; attemptNumber <= MAX_CANDIDATE_ATTEMPTS; attemptNumber += 1) {
    const candidate = producer(attemptNumber);
    const validation = validateCandidate(candidate, validators);

    if (validation.status === "valid") {
      const retriesUsed = attemptNumber - 1;

      return Object.freeze({
        status: "accepted" as const,
        value: candidate,
        candidateAttempts: attemptNumber,
        retriesUsed,
        telemetry: createTelemetry(attemptNumber, retriesUsed, false),
      });
    }
  }

  const fallback = fallbackProducer();
  const fallbackValidation = validateCandidate(fallback, validators);

  if (fallbackValidation.status === "invalid") {
    throw new InvalidFallbackError(fallbackValidation.reason);
  }

  return Object.freeze({
    status: "fallback" as const,
    value: fallback,
    candidateAttempts: MAX_CANDIDATE_ATTEMPTS,
    retriesUsed: MAX_CANDIDATE_ATTEMPTS - 1,
    fallbackReason: CANDIDATE_RETRIES_EXHAUSTED as typeof CANDIDATE_RETRIES_EXHAUSTED,
    telemetry: createTelemetry(MAX_CANDIDATE_ATTEMPTS, MAX_CANDIDATE_ATTEMPTS - 1, true),
  });
}
