# MACHINE ENGINE — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL / AUDIT FIXED**

Grammar:

```text
cell → run → phase displacement → re-anchor
```

Length v0.1:

```text
16 ONLY
```

Dual grid:

```text
CELL GRID
+
BAR GRID
```

---

# 1. Macros

```text
DENSITY
REPEAT
PHASE
ANCHOR
GAP
VARIATION
```

Pitch is secondary.

---

# 2. Archetypes

```text
MCH01 LOCK-4      XXX-
MCH02 LOCK-GAP-4  X-X-
MCH03 PUSH-3      XX-
MCH04 OFFSET-3    X-X
MCH05 DRIFT-5     XXX--
MCH06 CUT-5       XX-X-
```

No references to discarded draft cells are canonical.

---

# 3. DENSITY

Corrected mapping:

```text
targetDensity =
40 + 50 * densityNorm
```

Range:

```text
40..90
```

Tolerance:

```text
±10 points
```

This replaces the old 35..90 mapping.

---

# 4. MachineDensityRealizer

TARGET REALIZATION, not Variation.

Candidate preparation order:

```text
1. score base archetypes provisionally
2. for EACH archetype, enumerate density-realized cells of its family length
3. discard archetypes with zero feasible realized cells
4. combine archetype prior score + best realized-cell compatibility
5. TOP-3 archetype/cell pairs
6. seeded weighted selection
```

For each archetype/family length `L`, enumerate all binary cell masks of length:

```text
3 / 4 / 5
```

Hard:

```text
first cell step = NOTE
at least 1 NOTE
max 2 consecutive RESTS cyclically
```

For:

```text
targetPhase > 30
```

require:

```text
at least one REST
```

so cell phase remains audible.

Expand each candidate to 16 with normal tail truncation.
Calculate actual phrase density.

Keep candidates satisfying:

```text
abs(actualDensity-targetDensity) <= 10
```

If none for that archetype:

```text
archetype infeasible for current target
```

and remove before weighted archetype selection.

Score density-realized cells:

```text
baseCellIdentity       .45
densityMatch           .25
gapMatch               .20
mechanicalDrive        .10
```

TOP-3 seeded selection.

This allows extreme DENSITY values without making `X--` a base archetype.

---

# 5. CellBoundarySalience

PHASE must represent something audible.

Definitions:

```text
internalSignature =
100 if cell has at least one NOTE and one REST
0 otherwise

boundaryContrast =
100 if last cell state != first cell state
0 otherwise
```

Score:

```text
CellBoundarySalience =
0.85 * internalSignature
+
0.15 * boundaryContrast
```

Because high-PHASE candidates require at least one REST:

```text
phase cannot come solely from hidden metadata.
```

---

# 6. PhaseDepthMetric

Alignment cycle:

```text
cycleSteps = lcm(cellLength, 16)
```

Normalize using supported range:

```text
PhaseDepth =
100 *
(cycleSteps - 16)
/
(80 - 16)
```

Clamp 0..100.

Expected:

```text
L4 → 0
L3 → 50
L5 → 100
```

---

# 7. PhaseRateMetric

Measures speed of perceived displacement.

```text
if cellLength % 4 == 0:
  0
else:
  100 * (3 / cellLength)
```

Clamp.

Expected:

```text
L3 → 100
L5 → 60
L4 → 0
```

---

# 8. BarPhaseDiversityMetric

For every cell onset in the 16-step phrase:

```text
residue =
(globalStep - 1) mod 4
```

Count unique residues.

```text
BarPhaseDiversity =
100 * (uniqueResidues - 1) / 3
```

Expected:

```text
L4 → 0
L3 → 100
L5 → 100
```

---

# 9. PhaseDisplacementMetric

```text
phasePotential =
0.40 * BarPhaseDiversity
+
0.50 * PhaseRate
+
0.10 * PhaseDepth
```

Final:

```text
PhaseDisplacement =
phasePotential
*
(CellBoundarySalience / 100)
```

Expected canonical base tendency:

```text
LOCK-4     low
PUSH-3     highest / fast
DRIFT-5    high but slower
```

This replaces the ambiguous old Phase formula.

---

# 10. PHASE macro

```text
targetPhase =
10 + 80 * smoothstep(phaseNorm)
```

Archetype scoring uses:

```text
PhaseMatch
```

only.

REMOVE separate:

```text
cellLengthMatch
```

from the archetype score to avoid counting PHASE twice.

Corrected archetype score:

```text
densityMatch      .20
phaseMatch        .35
gapMatch          .20
repetitionMatch   .10
stability         .10
familyPrior       .05
```

---

# 11. ANCHOR mapping — corrected

`MachineMacroMapper` no conoce el `actualPhase` del candidato.

Primero usa el PHASE target:

```text
requiredAnchorForTarget =
40 + 40 * smoothstep(targetPhase / 100)
```

Entonces ANCHOR controla grounding adicional:

```text
targetAnchor =
requiredAnchorForTarget
+
anchorNorm * (95 - requiredAnchorForTarget)
```

Después de generar el candidato, el validator calcula por separado:

```text
requiredReAnchorForActual =
40 + 40 * smoothstep(actualPhase / 100)

actualReAnchor >= requiredReAnchorForActual
```

Therefore:

```text
ANCHOR 0
= minimum legal grounding for current PHASE

ANCHOR 100
= 95
```

No dead knob range.

---

# 12. Midpoint anchor probability

```text
minimumMidpointProbability =
0.10 + 0.40 * smoothstep(targetPhase / 100)

midpointProbability =
minimumMidpointProbability
+
anchorNorm *
(0.95 - minimumMidpointProbability)
```

Again:

```text
full knob range remains effective.
```

---

# 13. ReAnchor realization

ReAnchor required by:

```text
PHASE / ANCHOR target
```

is TARGET REALIZATION.

It does NOT consume:

```text
VARIATION transform budget.
```

Phrase start:

```text
step1 NOTE
ROOT reg0
hard
```

Optional midpoint:

```text
step9
```

selected according to target midpoint probability and seed, then realized before optional Variation.

---

# 14. ReAnchorMetric

```text
40% PhraseStart
25% MidpointGrounding
20% CyclicReset
15% AnchorRegister
```

PhraseStart:

```text
hard ROOT reg0 →100
```

MidpointGrounding:

```text
step9 NOTE ROOT reg0 →100
otherwise 0
```

CyclicReset:

```text
last active transition into step1
```

Score:

```text
last REST then step1 ROOT      →100
last ROOT reg0 then step1 ROOT →90
last ROOT reg+1 → step1 ROOT   →80
FIFTH → step1 ROOT             →90
other                          →60
```

AnchorRegister:

```text
all designated anchor events ROOT reg0
```

percentage.

Hard:

```text
actualReAnchor >= requiredReAnchor(actualPhase)
```

---

# 15. REPEAT

```text
targetMechanicalRepetition =
60 + 40 * repetitionNorm

cellIdentityMin =
70 + 25 * repetitionNorm
```

Hard global floor:

```text
MechanicalRepetition >= 60
CellIdentity >= 60
```

---

# 16. MechanicalRepetitionMetric

No transform-history scoring.

```text
60% exact cell recurrence
30% average cell-state identity
10% semantic economy
```

Semantic economy:

```text
100 - normalized semantic diff
```

between:

```text
base expanded run
candidate run
```

Tail truncated by phrase boundary is excluded.

---

# 17. GAP

```text
targetGap =
25 + 70 * smoothstep(gapNorm)
```

No mapping to discarded cells.

GAP influences:

```text
density-realized cell selection
```

not raw rest count directly.

---

# 18. GapStructureMetric

Normalize relative to existing rests.

If:

```text
restCount == 0
```

GapStructure:

```text
0
```

Otherwise:

```text
50% RestPhaseRecurrence
25% CellRestIdentity
15% Articulation
10% BoundaryContribution
```

### RestPhaseRecurrence

For every REST phase index in base cell:

```text
fraction of complete repetitions
where same phase index remains REST
```

average.

### CellRestIdentity

Jaccard similarity:

```text
rest phase set of each repetition
vs
base cell rest set
```

average.

### Articulation

For each rest run:

```text
followed by NOTE within cell/next cell
```

percentage.

### BoundaryContribution

```text
last REST → first NOTE
```

scores 100, otherwise 0.

This measures organization, not amount.

---

# 19. VARIATION

```text
v = variationNorm ^ 1.5

identityMin =
92 - 27*v
```

Optional transforms:

```text
0–20   → 0
21–65  → max1
66–100 → max2
```

Only optional operations consume this budget.

---

# 20. Optional transforms

```text
ROTATE_CELL
SHIFT_PHASE
SKIP_CELL
REPEAT_CELL
TRUNCATE_CELL
```

`REANCHOR` is NOT optional when target realization requires it.

Hard:

```text
cellLength unchanged
max2 optional transforms
```

---

# 21. Pitch / register

v0.1:

```text
ROOT dominant
PERFECT_FIFTH exceptional
octaveOffset 0/+1
```

Internal register variation default:

```text
eligible non-anchor NOTE probability = 0.15
```

Fixed profile constant v0.1.

Hard:

```text
step1 reg0
re-anchor reg0
max 2 consecutive reg+1
max 1 fifth / 16
```

No OCTAVE macro.
No BounceMetric.

Scale irrelevant v0.1.

---

# 22. Archetype reachability

MCH01–MCH06 must each be selected by at least one tested target/seed combination.

If an archetype is never selected:

```text
audit score/mapping
```

before shipping.

---

# 23. Quality

```text
PhaseMatch               .30
MechanicalRepetition     .25
ReAnchorMatch            .25
GapStructureMatch        .15
IdentityMatch            .05
```

Active-aware weighted geometric mean.

---

# 24. Validators

```text
Structural
Cell
Density
CellBoundarySalience
Phase
ReAnchor
Gap
MechanicalRepetition
CellIdentity
PitchIntent/Register
```

Hard:

```text
length16
cellLength3/4/5
step1 ROOT reg0
max2 rests cyclically
phase/reanchor legality
cell identity>=60
no invisible high-phase cell
```

---

# 25. Listening audit requirement

Specific A/B test:

```text
Does MCH01/MCH02 cover enough rigid Belgian-machine character?
```

If NO:

```text
design a new 4/8-step family in v0.2
```

Do NOT add it before listening.
