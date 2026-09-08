# BODY ENGINE — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL / AUDIT FIXED**

Grammar:

```text
anchor → response → repeat → turnaround
```

Phrase:

```text
A B | A2 B2
```

Normal:

```text
A B | A B'
```

Length v0.1:

```text
16 ONLY
```

---

# 1. Macros

```text
DENSITY
REPEAT
SYNC
VARIATION
OCTAVE
TENSION
```

---

# 2. Base archetypes

```text
B01
A XXX-
B XX-X

B02
A XXXX
B XXX-

B03
A XXX-
B X-XX

B04
A XX-X
B XXX-

B05
A X-X-
B XX-X

B06
A XXX-
B XX-X
```

Pitch/register patterns in the old docs are NOT canonical data.
Pitch is realized after rhythm.

Metadata:

```text
stability
drive/body prior
transform weights
```

Density is calculated.

---

# 3. Density mapping

```text
targetDensity =
50 + 50 * densityNorm
```

Range:

```text
50..100%
```

BODY uses an 8-step core:

```text
A+B
```

Target core hits:

```text
round(targetDensity * 8 / 100)
clamp 4..8
```

Resulting core density quanta:

```text
50
62.5
75
87.5
100
```

Validator tolerance:

```text
±6.25
```

---

# 4. BodyDensityRealizer

This is TARGET REALIZATION, not Variation.

After archetype selection:

1. enumerate all 8-step NOTE/REST cores with exact target hit count.

Hard constraints:

```text
step1 NOTE
step5 NOTE
A activeCount >= 2
B activeCount >= 2
max 2 consecutive rests
```

2. score candidates:

```text
baseCoreIdentity    0.55
metricDrive         0.20
pickupCompatibility 0.15
A/B balance         0.10
```

### baseCoreIdentity

```text
state similarity vs selected archetype
```

### metricDrive

Reward NOTE on:

```text
1 / 5
then 3 / 7
```

anchors 1/5 are already hard.

### pickupCompatibility

Depends on current SYNC target:

```text
4 / 8 NOTE
before next anchor NOTE
```

### A/B balance

```text
100 - abs(activeA - activeB) * 25
```

Clamp.

3. TOP-3 seeded weighted choice.

This guarantees DENSITY works even with:

```text
VARIATION = 0
```

---

# 5. REPEAT

For second half:

```text
A2CopyProbability =
0.85 + 0.15 * repNorm

B2CopyProbability =
0.25 + 0.75 * repNorm
```

A is deliberately more stable.

`REPEAT` selects:

```text
whether a block may differ
```

not distance.

---

# 6. VARIATION

```text
v = variationNorm ^ 1.5

identityMin =
92 - 32 * v
```

Optional structural transforms:

```text
0–20   → 0
21–69  → max 1
70–100 → max 2
```

Target realization of:

```text
Density
Octave
Sync/Pickup
Tension vocabulary
Anchor requirements
```

does NOT consume this budget.

---

# 7. Turnaround activation

```text
turnaroundActive =
(B2 copied == false)
AND
(maxOptionalTransforms > 0)
```

If false:

```text
B2 = B
TurnaroundMatch.active = false
```

Do not score turnaround as zero.

---

# 8. SYNC

Visible macro controls two targets:

```text
s = smoothstep(syncNorm)

syncTarget   = 5 + 60*s
pickupTarget = 15 + 55*s

downbeatPreservationMin =
95 - 20*syncNorm
```

Pickup and Sync are separate metrics.

---

# 9. PickupMetric

Privileged transitions:

```text
4→5
8→9
12→13
16→1
```

Valid:

```text
pickup NOTE
+
next anchor NOTE
+
salience condition
```

Salience condition, al menos una:

```text
previous step = REST
OR
pickup register differs from previous active NOTE
OR
pickup harmonic intent differs from previous active NOTE
```

Una línea de semicorcheas completamente homogénea no obtiene pickup score alto
sólo por contener NOTE en 4/8/12/16.

Role suitability:

```text
ROOT+1 preferred
ROOT0 allowed
FIFTH only if valid turnaround/tension
```

Score:

```text
35% anticipatory placement
30% anchor preservation
20% register/intent suitability
15% structural repetition
```

All components normalized 0..100.

---

# 10. AnchorGravityMetric

This is low-register anchoring, not tonal root gravity.

```text
AnchorGravity =
30% PhraseStart
25% MetricAnchoring
25% ReturnFrequency
20% CyclicResolution
```

### PhraseStart

```text
step1 NOTE
ROOT
octaveOffset 0
→ 100
else reject
```

### MetricAnchoring

Strong positions:

```text
1,5,9,13
```

Score:

```text
100 *
count(ROOT reg0 NOTE on strong positions)
/
4
```

### ReturnFrequency

For each NOTE whose pitch is not:

```text
ROOT reg0
```

find whether ROOT reg0 occurs within next:

```text
2 NOTE events
```

Score:

```text
100 * successfulReturns / eligibleEvents
```

If no eligible event:

```text
100
```

### CyclicResolution

Last active event before loop:

```text
ROOT reg0        → 100
PERFECT_FIFTH    → 90
ROOT reg+1       → 80
other            → 60
```

Step1 is guaranteed ROOT reg0.

Hard floor:

```text
>= max(70, targetProfile.anchorMin)
```

---

# 11. BounceMetric

Bounce measures ORGANIZATION of register movement, not octave count.

```text
Bounce =
40% RegisterAlternation
30% MetricPlacement
20% ReturnBehaviour
10% StructuralCoherence
```

### RegisterAlternation

Across consecutive NOTE events:

```text
100 *
registerChanges
/
max(1, noteTransitions)
```

### MetricPlacement

Expected tendency:

```text
strength >=3 → reg0 preferred
strength <=2 → reg+1 preferred
```

Score = percentage of NOTE events matching preference.

### ReturnBehaviour

For every reg+1 NOTE:

```text
ROOT reg0 within next 1–2 NOTE events
```

percentage successful.

If no reg+1 events:

```text
100 only when bounceTarget <= 30
otherwise 0
```

### StructuralCoherence

Average register-pattern identity:

```text
A ↔ A2
B ↔ B2
```

Only compare active NOTE positions.

If B2 intentionally variant:

```text
still compare, but no hard equality.
```

---

# 12. OCTAVE

```text
o = smoothstep(octaveNorm)

octaveRatioTarget =
60 * o

bounceTarget =
25 + 60 * o

anchorGravityMin =
85 - 15 * octaveNorm
```

Hard:

```text
octaveOffset 0/+1
max 2 consecutive +1 events
step1 reg0
```

`octaveRatioTarget` controls amount.
`BounceMetric` controls organization.

Do not count quantity twice.

---

# 13. Pitch vocabulary / TENSION

Normal vocabulary:

```text
ROOT reg0/reg+1
```

TENSION:

```text
0–20
FIFTH disabled

21–60
FIFTH eligible mainly B2/B'

61–100
FIFTH eligible B or B2/B'
prefer phrase end
```

Hard:

```text
max 1 PERFECT_FIFTH per 16 steps
```

Pitch target realization is independent from Variation.

---

# 14. Fifth resolution

Every PERFECT_FIFTH must resolve to:

```text
ROOT octaveOffset 0
```

within the next:

```text
2 NOTE events
```

Loop wrap counts.

If no valid placement exists:

```text
do not place fifth
```

High TENSION never overrides this rule.

---

# 15. Turnaround transforms

Only when `turnaroundActive=true`:

```text
REST_SHIFT
OCTAVE_LIFT
FIFTH_TENSION
PICKUP_INSERT
HIT_REMOVE
```

Hard:

```text
changes <= variation budget
Identity(B,B2) >= variation identityMin
B2 changes only B region
A2 never modified by B turnaround
```

---

# 16. Quality score

Active components:

```text
BounceMatch         .30
AnchorGravityMatch  .25
PickupMatch         .15
TurnaroundMatch     .20
IdentityMatch       .10
```

Use active-aware weighted geometric mean.

`TurnaroundMatch` active only when turnaroundActive.

---

# 17. Validators

Order:

```text
Structural
Density
Downbeat
AnchorGravity
Bounce hard limits
Pickup legality
Turnaround
Identity
Tension
Register
```

Hard:

```text
length=16
step1 ROOT reg0
A/B structure
A active>=2
B active>=2
AnchorGravity>=70
max fifth=1
fifth resolves within2 NOTE
max consecutive reg+1=2
no invalid output
```

---

# 18. BODY listening rule

Do not widen harmonic vocabulary before listening corpus.

High-density rolling region MUST now be reachable through `BodyDensityRealizer`.

Keep:

```text
max one fifth
```

until corpus proves otherwise.
