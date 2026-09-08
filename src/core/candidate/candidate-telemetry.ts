import { MAX_CANDIDATE_RETRIES, type CandidateRunTelemetry } from "./candidate-contract";

export interface CandidateTelemetrySummary {
  readonly runCount: number;
  readonly fallbackCount: number;
  readonly fallbackRate: number;
  readonly retryHistogram: readonly number[];
}

export function summarizeCandidateTelemetry(
  runs: readonly CandidateRunTelemetry[],
): CandidateTelemetrySummary {
  const retryHistogram = Array.from({ length: MAX_CANDIDATE_RETRIES + 1 }, () => 0);
  let fallbackCount = 0;

  for (const run of runs) {
    retryHistogram[run.retriesUsed] += 1;

    if (run.usedFallback) {
      fallbackCount += 1;
    }
  }

  return Object.freeze({
    runCount: runs.length,
    fallbackCount,
    fallbackRate: runs.length === 0 ? 0 : fallbackCount / runs.length,
    retryHistogram: Object.freeze(retryHistogram),
  });
}
