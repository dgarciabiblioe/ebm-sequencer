# TEST + ACCEPTANCE SPEC v0.1

Estado: **CANONICAL**

Random batch alone is insufficient.

Testing has four layers.

---

# 1. Invariants

Every engine:

```text
0 crashes
0 NaN
0 infinite retry
0 invalid output
same request + same seed = same output
locks never violated
MIDI/pitch range legal
```

---

# 2. Full macro feasibility grid

For six macros:

```text
0 / 25 / 50 / 75 / 100
```

Run every combination:

```text
5^6 = 15,625
```

per engine.

At least:

```text
1 deterministic seed per combination
```

Then a second seed sample over:

```text
10% random subset
```

Result for each combination:

```text
VALID
CONSTRAINED
BUG
```

`CONSTRAINED` only allowed when explicitly documented by grammar.
It is not a silent failure.

---

# 3. Threshold suites

Explicitly test around every branch boundary.

ELECTRONIC examples:

```text
20/21
69/70
25/26 Tension
60/61 Tension
69/70 Variation
```

BODY:

```text
20/21 Tension
60/61 Tension
20/21 Variation
69/70 Variation
```

MACHINE:

```text
20/21 Variation
65/66 Variation
PHASE values around 30 boundary salience rule
```

Use:

```text
boundary-1
boundary
boundary+1
```

where meaningful.

---

# 4. Macro response tests

Hold all other macros constant.
Sweep one macro:

```text
0,10,20,...100
```

Across:

```text
>=100 seeds
```

Measure median/mean target metric.

Expected aggregate trend:

```text
DENSITY ↑ → actual density non-decreasing
OCTAVE ↑ → high-register ratio non-decreasing
PHASE ↑ → phase metric non-decreasing
ANCHOR ↑ → reanchor non-decreasing
GAP ↑ → gap structure non-decreasing
```

Individual seeds do not need perfect monotonicity.
Aggregate response must be clear.

---

# 5. Archetype distribution

For each engine/profile:

Track:

```text
selection count per archetype
```

Hard:

```text
every archetype reachable
```

Review trigger:

```text
one archetype >70% in a neutral/default sweep
```

unless explicitly intended.

---

# 6. Fallback telemetry

Always report:

```text
fallbackCount
fallbackRate
fallbackReason
retry histogram
```

Never only:

```text
INVALID 0
```

Review trigger:

```text
fallbackRate >5%
```

in default/central macro region:

```text
25..75
```

This is a review trigger, not an automatic musical failure.

Extreme corners may be higher but must be visible.

---

# 7. Candidate retry

```text
MAX_CANDIDATE_RETRIES = 32
```

Track:

```text
mean retries
p95 retries
max retries
```

No fallback through relaxed hard validators.

---

# 8. PRNG fixture

Freeze:

```text
seed 0
seed 1
seed 123456789
seed 0xFFFFFFFF
```

Canonical `nextUint32` fixtures:

```text
seed 0
1144304738
1416247
958946056
627933444
2007157716
2340967985
2642484575
2787370982
1958536065
2496316458
```

```text
seed 1
2693262067
11749833
2265367787
4213581821
4159151403
1207330352
2632122864
3095568220
1828783984
4272732017
```

```text
seed 123456789
1107202814
4169434471
3372958138
885470128
1301683845
3208624240
3344635568
1221959552
71025595
693485573
```

```text
seed 4294967295
3850105811
813802916
3073704848
4054706436
3630262831
2315588663
2922715533
2042566601
583504547
4245337221
```

`nextFloat` is exactly:

```text
nextUint32 / 4294967296
```

Any fixture change requires an `algorithmVersion` bump.

---

# 9. Golden fixtures

Per engine include:

```text
default
low density
high density
low/high sync or phase
low/high variation
pitch/register edge
```

Golden fixture contains:

```text
algorithmVersion
macros
seed
selected archetype
symbolic pattern
metrics
```

---

# 10. Chained Evolve stress

Per engine:

```text
Generate P0
EVOLVE ×100
```

Mutation:

```text
25 / 50 / 75 / 100
```

Verify:

```text
origin identity floors
locks
engineId
length
grammar
```

---

# 11. Musical corpus

Per engine:

```text
20–30 seeds
```

Labels:

```text
KEEP
BORDERLINE
REJECT
```

Do not alter formulas from intuition before this corpus exists.

---

# 12. Engine-specific listening

ELECTRONIC:

```text
few-pitch sequencer
staccato
not random gate
```

BODY:

```text
bassline/body/rolling
not generic arpeggiator
```

MACHINE:

```text
audible cell displacement
not abstract polymeter exercise
```

---

# 13. Implementation GO gate

All must pass:

```text
[ ] canonical specs only
[ ] PRNG frozen
[ ] feasibility grid runs
[ ] no impossible undocumented corner
[ ] archetypes reachable
[ ] fallback telemetry exists
[ ] target macros independently effective
[ ] scale relevance respected in UI
```
