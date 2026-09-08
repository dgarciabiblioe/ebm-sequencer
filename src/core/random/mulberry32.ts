import type { RandomSource } from "./random-source";

const UINT32_DIVISOR = 4294967296;
const MULBERRY32_INCREMENT = 0x6D2B79F5;

/**
 * Creates the canonical Mulberry32 deterministic PRNG.
 *
 * This generator is intended for reproducible musical generation and is not
 * cryptographically secure.
 */
export function createMulberry32(seed: number): RandomSource {
  let state = seed >>> 0;

  return {
    next(): number {
      const nextState = (state + MULBERRY32_INCREMENT) >>> 0;
      let value = nextState;

      state = nextState;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

      return ((value ^ (value >>> 14)) >>> 0) / UINT32_DIVISOR;
    },
  };
}
