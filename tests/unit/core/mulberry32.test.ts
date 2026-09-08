import { createMulberry32 } from "../../../src/core";

const UINT32_DIVISOR = 4294967296;
const GOLDEN_SEED_0 = [
  1144304738,
  1416247,
  958946056,
  627933444,
  2007157716,
  2340967985,
  2642484575,
  2787370982,
  1958536065,
  2496316458,
];
const GOLDEN_SEED_123456789 = [
  1107202814,
  4169434471,
  3372958138,
  885470128,
  1301683845,
  3208624240,
  3344635568,
  1221959552,
  71025595,
  693485573,
];
const GOLDEN_SEED_1 = [
  2693262067,
  11749833,
  2265367787,
  4213581821,
  4159151403,
  1207330352,
  2632122864,
  3095568220,
  1828783984,
  4272732017,
];
const GOLDEN_SEED_UINT32_MAX = [
  3850105811,
  813802916,
  3073704848,
  4054706436,
  3630262831,
  2315588663,
  2922715533,
  2042566601,
  583504547,
  4245337221,
];

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function sequence(seed: number, count: number): readonly number[] {
  const source = createMulberry32(seed);
  const values: number[] = [];

  for (let index = 0; index < count; index += 1) {
    values.push(Math.floor(source.next() * UINT32_DIVISOR));
  }

  return values;
}

assert(
  sequence(0, GOLDEN_SEED_0.length).join(",") === GOLDEN_SEED_0.join(","),
  "Seed 0 must match its canonical Mulberry32 fixture",
);
assert(
  sequence(123456789, GOLDEN_SEED_123456789.length).join(",") === GOLDEN_SEED_123456789.join(","),
  "Seed 123456789 must match its canonical Mulberry32 fixture",
);
assert(
  sequence(1, GOLDEN_SEED_1.length).join(",") === GOLDEN_SEED_1.join(","),
  "Seed 1 must match its canonical Mulberry32 fixture",
);
assert(
  sequence(0xFFFFFFFF, GOLDEN_SEED_UINT32_MAX.length).join(",") === GOLDEN_SEED_UINT32_MAX.join(","),
  "Seed 0xFFFFFFFF must match its canonical Mulberry32 fixture",
);
assert(
  sequence(-1, GOLDEN_SEED_UINT32_MAX.length).join(",") === GOLDEN_SEED_UINT32_MAX.join(","),
  "Seeds must normalize with uint32 semantics",
);

const first = createMulberry32(123456789);
const second = createMulberry32(123456789);
for (let index = 0; index < 100; index += 1) {
  assert(first.next() === second.next(), "Equal seeds must produce equal sequences");
}

const advanced = createMulberry32(1);
const untouched = createMulberry32(1);
advanced.next();
advanced.next();
assert(
  untouched.next() === createMulberry32(1).next(),
  "Advancing one instance must not modify another instance",
);

assert(
  sequence(1, 10).join(",") !== sequence(2, 10).join(","),
  "Different seeds must produce different sequences",
);
assert(
  sequence(123456789, 20).join(",") === sequence(123456789, 20).join(","),
  "Reconstruction with the same seed must restart the sequence",
);

const ranged = createMulberry32(0);
for (let index = 0; index < 10000; index += 1) {
  const value = ranged.next();
  assert(value >= 0 && value < 1, "RandomSource output must remain in [0, 1)");
}
