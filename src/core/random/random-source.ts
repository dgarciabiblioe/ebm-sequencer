/**
 * Deterministic source of uniformly distributed values in the half-open range
 * [0, 1). Implementations keep their state per instance.
 */
export interface RandomSource {
  next(): number;
}
