# CANONICAL SPEC — MATHEMATICAL VERIFICATION v0.1

Estado: **PASS**

This report validates the audit fixes before implementation.

---

## BODY density feasibility

`BodyDensityRealizer` constraints were exhaustively enumerated over all:

```text
2^8 = 256
```

possible A+B rhythm cores.

Legal candidate counts:

```text
target 50.0%   / 4 hits → 9 candidates
target 62.5%   / 5 hits → 18
target 75.0%   / 6 hits → 15
target 87.5%   / 7 hits → 6
target 100.0%  / 8 hits → 1
```

Result:

```text
BODY DENSITY 0..100
→ every quantized target feasible
```

including:

```text
VARIATION = 0
```

---

## MACHINE density feasibility

The corrected mapping:

```text
40..90%
```

was tested against:

```text
DENSITY = 0/25/50/75/100
PHASE   = 0/25/50/75/100
```

For every pair, all legal 3/4/5-step binary cells were enumerated with:

```text
first step NOTE
max 2 cyclic consecutive rests
at least one REST when targetPhase > 30
density tolerance ±10
```

Result:

```text
25/25 macro-pair corners
→ at least one feasible cell
```

No impossible density/phase corner remains in this grid.

---

## MACHINE Phase ordering

Canonical base tendencies produced by the new formula:

```text
MCH01 LOCK-4       0.00
MCH02 LOCK-GAP-4   0.00

MCH03 PUSH-3      95.00
MCH04 OFFSET-3    80.75

MCH05 DRIFT-5     80.00
MCH06 CUT-5       80.00
```

Result:

```text
LOCK < DRIFT
PUSH-3 has the strongest/fastest displacement
OFFSET-3 remains high but less salient than PUSH-3
```

This fixes the previous GCD formula conflict.

---

## MACHINE Anchor range

Using corrected mapping:

```text
ANCHOR 0
= legal minimum for PHASE target

ANCHOR 100
= 95
```

Every ANCHOR value changes the target even at high PHASE.

Examples:

```text
targetPhase 50
ANCHOR 0/25/50/75/100
60.00 / 68.75 / 77.50 / 86.25 / 95.00
```

```text
targetPhase 90
78.88 / 82.91 / 86.94 / 90.97 / 95.00
```

No previous 50–70% dead zone remains.

---

## ELECTRONIC length/repetition

Canonical correction:

```text
motifLength = 4
```

For length 8:

```text
2 blocks
block1 exact
block2 may vary
```

No impossible requirement for two exact motif copies.

For length 16/32:

```text
at least 2 exact motif copies
```

remains valid.

---

## PRNG

Mulberry32 algorithm and concrete uint32 fixtures are frozen.

Result:

```text
golden fixtures can now be stable
```

---

# Verification status

```text
AUDIT BLOCKERS        RESOLVED
MATHEMATICAL CORNERS  VERIFIED
CANONICAL CONTRADICTIONS FOUND IN SECOND PASS
                      RESOLVED
LISTENING QUESTIONS   REMAIN INTENTIONALLY EMPIRICAL
```
