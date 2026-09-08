# ELECTRONIC ENGINE — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL / AUDIT FIXED**

Grammar:

```text
motif → repeat → controlled deform
```

Estética objetivo:

```text
early EBM
DAF-like sequencer discipline
staccato
few pitches
repetition before variation
```

---

# 1. Capabilities

```text
resolution: 1/16
lengths: 8 / 16 / 32
motifLength v0.1: 4 ONLY
monophonic
scaleRelevant: true
```

La antigua posibilidad `motifLength 2/8` queda fuera de v0.1.

---

# 2. Macros

```text
DENSITY
REPEAT
SYNC
VARIATION
OCTAVE
TENSION
```

---

# 3. Density mapping

```text
targetDensity =
50 + 50 * densityNorm
```

Rango estilístico:

```text
50..100%
```

El motif de 4 pasos tiene hit counts:

```text
2 → 50%
3 → 75%
4 → 100%
```

Target motif hit count:

```text
round(targetDensity * 4 / 100)
clamp 2..4
```

El target se cuantiza deliberadamente al vocabulario ELECTRONIC.

Density realization ocurre ANTES de Variation.

---

# 4. Archetypes

```text
M01 XXX-
M02 XX-X
M03 X-XX
M04 XXXX
M05 X-X-
M06 XX--
M07 X--X
```

Metadata calculable:

```text
density → calcular
```

Metadata declarativa permitida:

```text
drive
stability
sync prior
pickup prior
transform weights
```

No duplicar density manualmente.

---

# 5. Archetype selection

Targets:

```text
densityTarget
syncTarget
pickupTarget
```

Score:

```text
densityMatch     0.45
syncMatch        0.20
pickupMatch      0.15
drive            0.10
stability        0.10
```

TOP-3:

```text
weighted seeded choice
```

No siempre top1.

---

# 6. Metrical strength

Por cada bloque de 16:

```text
01 02 03 04 | 05 06 07 08 | 09 10 11 12 | 13 14 15 16
 5  1  2  1 |  3  1  2  1 |  4  1  2  1 |  3  1  2  1
```

Para 32:

```text
repetir la misma jerarquía por bar
```

Step 17 es nuevo bar start con strength 5.

---

# 7. SyncMetric

Para cada NOTE `i`:

1. encontrar el siguiente step `j`, dentro del mismo loop, con:

```text
strength[j] > strength[i]
```

2. Si `j` es REST:

```text
eventContribution =
(strength[j] - strength[i]) / 4
```

Si `j` es NOTE:

```text
0
```

Score:

```text
SyncMetric =
100 *
sum(eventContribution)
/
max(1, noteCount)
```

Rango:

```text
0..100
```

Strong-position notes no producen sync por sí solas.

---

# 8. PickupMetric

Pickup positions:

```text
4→5
8→9
12→13
16→1(next bar/loop)
```

Repetir por cada bar.

Valid pickup:

```text
previous step REST
+
pickup step NOTE
+
next anchor NOTE
```

Esto evita puntuar como pickup una línea continua `XXXX` en la que la anticipación
no es perceptualmente saliente.

Score:

```text
100 * validPickups / pickupOpportunities
```

No confundir:

```text
pickup
≠
syncopation
```

---

# 9. SYNC macro mapping

```text
s = smoothstep(syncNorm)

syncTarget   = 60 * s
pickupTarget = 10 + 50 * s
```

Step 1:

```text
NOTE hard rule en v0.1
```

No existe la antigua excepción ambigua de "salvo sync alto".

Step 9:

```text
preferred, not hard
```

---

# 10. Phrase weights

El antiguo array de 4 bloques se generaliza mediante interpolación lineal.

Knots:

```text
x: 0.000  0.333  0.667  1.000
w: 0.250  0.400  0.550  1.000
```

Para:

```text
blockIndex 0..blockCount-1
x = blockIndex / (blockCount - 1)
```

interpolar linealmente.

Casos:

```text
8 steps  → 2 blocks
16       → 4
32       → 8
```

Último bloque siempre:

```text
1.0
```

---

# 11. REPEAT

Controla:

```text
qué blocks permanecen copia literal
```

No controla distancia de una variación.

Base:

```text
copyProbability =
0.45 + 0.55 * repetitionNorm
```

Aplicar phrase weight:

```text
variationProbability(block) =
(1 - copyProbability) * phraseWeight(block)
```

Block 1:

```text
no variar en Generate v0.1
```

Exact-copy rule:

```text
blockCount = 2 (length 8)
→ block1 exact
→ block2 puede variar dentro del Identity floor
→ NO exigir una segunda copia exacta

blockCount >= 4
→ motif exacto debe aparecer al menos 2 veces
```

Esto permite que `VARIATION` tenga efecto real en 8 steps sin perder el origen.

---

# 12. VARIATION

```text
v = variationNorm ^ 1.5
```

Identity floor:

```text
identityMin =
95 - 40 * v
```

Referencia:

```text
0   → 95
50  → ~81
100 → 55
```

Max optional transforms:

```text
0–20   → 0
21–69  → 1
70–100 → 2
```

Target realization no cuenta aquí.

---

# 13. Rhythmic Identity Metric

Eliminar `accent similarity`.

Final:

```text
60% step-state similarity
25% strong-anchor preservation
15% density similarity
```

### Step similarity

```text
100 * equalStateSteps / length
```

### Strong-anchor preservation

Strong positions:

```text
1,5,9,13... per bar
```

Score:

```text
source strong NOTE positions
que siguen NOTE en candidate
/
source strong NOTE positions
```

Si source no tiene strong NOTE:

```text
100
```

### Density similarity

```text
100 - abs(sourceDensity - candidateDensity)
```

Clamp 0..100.

---

# 14. Transformations — exact semantics

## REST_SHIFT

Enumerar pares adyacentes:

```text
NOTE REST
REST NOTE
```

swap.

No wrap.

Preserva density.

## SWAP_POSITIONS

Elegir:

```text
un NOTE
+
un REST
```

no adyacentes.

Intercambiar estados.

Preserva density.

## REMOVE_HIT

```text
NOTE → REST
```

Nunca step1.
Debe mantener:

```text
>= 2 hits / 4-step motif
max 2 rests consecutivos
```

## ADD_HIT

```text
REST → NOTE
```

## ROTATE

Rotación cíclica del motif:

```text
-1 o +1 step
```

Sólo permitida:

```text
VARIATION >= 70
SYNC >= 70
```

y el resultado debe mantener:

```text
step1 NOTE
```

---

# 15. Transformation cost

```text
baseCost
+ 10 * changedSteps
+ densityChangePenalty
+ syncChangePenalty
+ 20 if a strong anchor changes
```

Base:

```text
REST_SHIFT       15
SWAP_POSITIONS   20
ADD_HIT          20
REMOVE_HIT       25
ROTATE           45
```

---

# 16. Pitch grammar v0.1

Pitch assignment ocurre DESPUÉS de ritmo.

Vocabulary por TENSION:

```text
TENSION 0–25
ROOT only

26–60
ROOT + PERFECT_FIFTH eligible

61–100
ROOT + PERFECT_FIFTH + SCALE_DEGREE 3 eligible
```

Hard limits por 8 steps:

```text
non-root events <= 2
perfect fifth <= 1
scale degree 3 <= 1
```

First active:

```text
ROOT octaveOffset 0
```

Strong bar anchors:

```text
prefer ROOT octaveOffset 0
```

---

# 17. TENSION mapping

```text
t = tensionNorm

if t <= .25:
  fifthWeight = 0
  degree3Weight = 0

if .25 < t <= .60:
  fifthWeight = smoothstep((t-.25)/.35)
  degree3Weight = 0

if t > .60:
  fifthWeight = 1
  degree3Weight = smoothstep((t-.60)/.40)
```

Selection seeded, sujeto a hard limits.

Pitch target realization NO consume Variation.

---

# 18. OCTAVE mapping

```text
o = smoothstep(octaveNorm)

highRegisterRatioTarget =
50 * o
```

Hard:

```text
octaveOffset ∈ {0,+1}
max 2 consecutive +1 NOTE events
step1 = 0
```

Register placement:

```text
weak/offbeat positions favorecen +1
strong anchors favorecen 0
```

No usar BODY BounceMetric.

---

# 19. Pitch repetition

El 4-step pitch-intent/register motif se repite junto al rhythm motif.

Optional pitch/register variation:

```text
sólo en blocks que ya están autorizados para variar
```

Target realization de OCTAVE/TENSION puede afectar el motif base antes de copiarlo.

---

# 20. Validators

Orden:

```text
Structural
Density
Step1
Sync
Pickup
Identity
Repetition
PitchIntent
Register
```

Hard:

```text
length allowed
motifLength=4
step1 NOTE ROOT reg0
>= 2 hits per motif
max 2 consecutive rests
identity >= target floor
pitch limits
```

---

# 21. Acceptance

ELECTRONIC debe ser convincente con:

```text
simple mono saw/pulse
static filter
no delay
no arp
```

Debe sonar:

```text
repetitivo
duro
pegadizo
restringido
```

No:

```text
random melody
generic arpeggiator
random gate
```
