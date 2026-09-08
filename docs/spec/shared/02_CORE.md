# SHARED CORE — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL**

---

## 1. Regla arquitectónica

```text
SHARED CORE
≠
SHARED MUSICAL GRAMMAR
```

Dependencias:

```text
Max / CLI / UI
      ↓
Application
      ↓
Engines
      ↓
Shared Core
```

Prohibido:

```text
Core → Max
Core → Ableton
Core → engine concreto
Math.random()
estado global
utils.ts / helpers.ts
```

---

## 2. Engine capabilities

No asumir capacidades iguales.

```ts
export interface EngineCapabilities {
  readonly allowedLengths: readonly PatternLength[];
  readonly scaleRelevant: boolean;
  readonly supportsEvolve: boolean;
}
```

v0.1:

```text
ELECTRONIC
lengths: 8, 16, 32
scaleRelevant: true

BODY
lengths: 16
scaleRelevant: false

MACHINE
lengths: 16
scaleRelevant: false
```

Si target length no está permitido:

```text
INVALID_TARGET_LENGTH
```

La UI no debe ofrecer longitudes ilegales para el engine seleccionado.

---

## 3. Step

Usar discriminated union.

```ts
export type Step =
  | NoteStep
  | RestStep
  | TieStep;

export interface NoteStep {
  readonly index: number;
  readonly state: "NOTE";
  readonly pitch: PitchIntent;
  readonly locked: boolean;
}

export interface RestStep {
  readonly index: number;
  readonly state: "REST";
  readonly locked: boolean;
}

export interface TieStep {
  readonly index: number;
  readonly state: "TIE";
  readonly locked: boolean;
}
```

No existe:

```text
REST + pitch
TIE + pitch
```

---

## 4. Pattern

```ts
export interface Pattern {
  readonly engineId: EngineId;
  readonly length: PatternLength;
  readonly resolution: "1/16";
  readonly seed: number;
  readonly steps: readonly Step[];
  readonly metadata: PatternMetadata;
}
```

El Pattern es simbólico.
No sustituir `PitchIntent` por MIDI permanentemente.

---

## 5. Target realization vs Variation

Corrección arquitectónica obligatoria.

```text
ARQUETYPE / BASE STRUCTURE
↓
TARGET REALIZATION
↓
PHRASE CONSTRUCTION
↓
OPTIONAL VARIATION
↓
METRICS
↓
VALIDATION
↓
SCORING
```

`TARGET REALIZATION` sirve para cumplir macros que definen el estado objetivo:

```text
Density
register/octave target
anchor requirement
pitch vocabulary target
```

No consume el presupuesto de:

```text
VARIATION
```

`VARIATION` controla únicamente desviación opcional de una estructura ya válida.

Hard rule:

```text
un macro no puede depender de VARIATION
para tener efecto.
```

---

## 6. Scoring con dimensiones N/A

Un scorer no puede puntuar `0` una dimensión que la estructura objetivo ha desactivado.

Usar:

```ts
export interface ScoreComponent {
  readonly value: number;
  readonly weight: number;
  readonly active: boolean;
}
```

`weightedGeometricMean()`:

```text
- ignora active=false
- renormaliza los pesos activos
- requiere value 0..100
- si no hay dimensiones activas → error de invariant
```

Ejemplo BODY:

```text
B2 copiado
→ turnaroundActive = false
→ TurnaroundMatch active=false
```

---

## 7. PRNG congelado

Algoritmo v0.1:

```text
Mulberry32
```

Seed:

```text
uint32 = seed >>> 0
```

`0` es una seed válida.

Referencia exacta:

```ts
function nextUint32(state: number): [number, number] {
  let t = (state + 0x6D2B79F5) >>> 0;
  let z = t;
  z = Math.imul(z ^ (z >>> 15), z | 1);
  z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
  const result = (z ^ (z >>> 14)) >>> 0;
  return [t, result];
}

nextFloat =
result / 4294967296
```

Salida:

```text
0 <= nextFloat < 1
```

No cambiar este algoritmo después de crear golden fixtures sin incrementar:

```text
algorithmVersion
```

---

## 8. Weighted choice

Pesos:

```text
finite
>= 0
```

Si:

```text
sum(weights) <= 0
```

devolver:

```text
INVALID_WEIGHT_SET
```

No convertir silenciosamente en selección uniforme.

Selección:

```text
r = nextFloat() * sum
recorrer acumulado
primer cumulative > r
```

Orden de items forma parte del determinismo.

---

## 9. Métricas derivables

No duplicar metadata calculable.

Calcular desde pattern/cell:

```text
density
note count
rest count
actual phase
actual gap
```

Metadata declarativa sólo para priors subjetivos:

```text
stability
drive
family prior
transform weights
```

---

## 10. Métricas y provenance

Una métrica musical juzga el resultado audible.

No usar:

```text
"se aplicaron 2 transforms"
```

para cambiar el score musical si dos outputs finales son idénticos.

Transform history:

```text
diagnostics only
```

Economy musical se calcula mediante:

```text
semantic diff source ↔ result
```

---

## 11. Validators

```text
Validator
= legalidad

Scorer
= preferencia
```

Nunca compensar un hard failure mediante score.

`ValidatorPipeline`:

```text
first failure wins
```

Debug puede recopilar todos.

---

## 12. Transformations

```ts
export interface Transformation<T> {
  readonly id: string;
  canApply(value: T, context: TransformationContext): boolean;
  apply(value: T, context: TransformationContext): T;
  cost(source: T, result: T, context: TransformationContext): number;
}
```

Inmutables.

Locks siempre respetados.

---

## 13. Generate / Evolve

```text
GENERATE
= nueva identidad

EVOLVE
= transformación del current
```

Mover macros:

```text
TARGET cambia
CURRENT no cambia
```

No regeneration on knob movement.

---

## 14. Allowed pattern commit

Al cambiar CURRENT durante playback:

```text
calcular nuevo pattern
↓
cargar inactive playback buffer
↓
swap at CURRENT PATTERN CYCLE boundary
```

No asumir:

```text
cycle boundary = next bar
```

Cycle:

```text
pattern.length * 1/16
```

Ejemplos 4/4:

```text
8 steps  → 1/2 bar
16       → 1 bar
32       → 2 bars
```

---

## 15. Definition of Done Core

```text
- deterministic
- immutable
- no Max imports
- no runtime npm dependencies
- all contracts typed
- engine capabilities enforced
- N/A scoring supported
- PRNG fixture frozen
- target realization separated from Variation
```
