export const MAX_CANDIDATE_RETRIES = 32;
export const MAX_CANDIDATE_ATTEMPTS = MAX_CANDIDATE_RETRIES + 1;
export const CANDIDATE_RETRIES_EXHAUSTED = "candidate-retries-exhausted";

export type FallbackReason = typeof CANDIDATE_RETRIES_EXHAUSTED;

export type CandidateProducer<T> = (attemptNumber: number) => T;
export type FallbackProducer<T> = () => T;

export interface CandidateRunTelemetry {
  readonly candidateAttempts: number;
  readonly retriesUsed: number;
  readonly usedFallback: boolean;
  readonly fallbackReason: FallbackReason | null;
}

export interface AcceptedCandidateRunResult<T> {
  readonly status: "accepted";
  readonly value: T;
  readonly candidateAttempts: number;
  readonly retriesUsed: number;
  readonly telemetry: CandidateRunTelemetry;
}

export interface FallbackCandidateRunResult<T> {
  readonly status: "fallback";
  readonly value: T;
  readonly candidateAttempts: number;
  readonly retriesUsed: number;
  readonly fallbackReason: FallbackReason;
  readonly telemetry: CandidateRunTelemetry;
}

export type CandidateRunResult<T> = AcceptedCandidateRunResult<T> | FallbackCandidateRunResult<T>;
