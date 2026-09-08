# EVOLVE — CANONICAL IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL**

## Semántica

```text
GENERATE = crea identidad
EVOLVE   = transforma identidad existente
```

EVOLVE trabaja siempre sobre `Pattern` simbólico, no sobre MIDI resuelto.

## Origin / Source

```text
originPattern
= patrón base de la sesión

sourcePattern
= current pattern de esta operación
```

Cada candidato se valida contra ambos:

```text
candidate vs source
candidate vs origin
```

Esto impide random walk ilimitado.

`SET AS BASE`:

```text
origin = current
depth = 0
```

## Request

```ts
export interface EvolveRequest<TMacros> {
  readonly sourcePattern: Pattern;
  readonly originPattern: Pattern;
  readonly macros: TMacros;
  readonly mutationAmount: number; // 0..100
  readonly mutationScope: MutationScope;
  readonly locks: PatternLocks;
  readonly seed: number;
}
```

EVOLVE v0.1 no cambia:

```text
engineId
length
resolution
```

## Mutation scope

```text
RHYTHM
HARMONIC_INTENT
REGISTER
PHRASE_STRUCTURE
ARTICULATION (future)
```

## Locks

Step locks pueden proteger de forma independiente:

```text
state
harmonicIntent
register
articulation
```

Hard invariant:

```text
locked candidate field == source field
```

## Pattern diff

Core mide:

```text
changedStepStates
changedHarmonicIntents
changedRegisters
changedArticulations
changedIndexes
```

No existe una única distancia universal.
Cada engine pondera dominios.

## Mutation amount

```text
0
→ no-op exacto

1..60
→ max 1 optional transform

61..100
→ max 2 optional transforms
```

La distancia objetivo se compara mediante target band; no significa `% de steps random`.

## Identity

Hard:

```text
ParentIdentity >= engine parent floor
OriginIdentity >= engine origin floor
```

Policies iniciales:

```text
ELECTRONIC
amount: 0/25/50/75/100
parent: 100/90/80/68/55
origin: 100/88/78/70/62

BODY
parent: 100/91/82/70/60
origin: 100/90/82/74/68

MACHINE
parent: 100/90/80/68/60
origin: 100/88/78/68/60
```

## Engine semantics

ELECTRONIC:
```text
preserva motif/repetition
```

BODY:
```text
preserva A/B, anchor, bounce
A más estable que B
```

MACHINE:
```text
preserva cellLength, cell identity, phase/re-anchor legality
cellLength nunca cambia en EVOLVE v0.1
```

## Scoring

Sólo después de hard validation:

```text
MutationDistanceMatch .35
EngineQuality         .35
ParentIdentityMatch   .10
OriginIdentityMatch   .15
Novelty               .05
```

Active-aware weighted geometric mean.

## Determinismo

```text
same engine/source/origin/macros/amount/scope/locks/seed
=
same result
```

Engine no incrementa seed.

## No-change válido

```text
amount=0
fully locked
no meaningful legal transform
```

puede devolver:

```text
ok=true
changed=false
source unchanged
```

## Retry / fallback

```text
MAX_EVOLVE_RETRIES = 32
```

Fallback:

```text
reduce transform count
→ more conservative transform
→ microvariation
→ unchanged source
```

Nunca relajar:

```text
locks
engine validators
origin floor
```

## Tests

Obligatorios:

```text
100 chained evolves / engine
origin floor never violated
1000 randomized lock tests
same request deterministic
amount0 no-op
fully locked no-op
```
