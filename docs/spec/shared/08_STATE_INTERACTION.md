# INTERACTION + STATE + PRESETS — CANONICAL SPEC v0.1

Estado: **CANONICAL**

## Current vs Target

```text
CURRENT = patrón que suena
TARGET  = parámetros que el usuario está preparando
APPLIED = parámetros con los que se obtuvo CURRENT
```

Mover un knob:

```text
TARGET cambia
CURRENT no cambia
```

Si TARGET != APPLIED:

```text
pending = true
```

Volver el knob a APPLIED elimina pending.

## Generate

```text
TARGET + generationSeed
→ nueva identidad
```

No usa CURRENT como fuente.

Después:

```text
current = generated
origin = generated
depth = 0
applied = target recipe
generationSeed advances in application layer
```

## Evolve

```text
CURRENT + ORIGIN + TARGET + evolveSeed + locks
→ current evolved
```

Después:

```text
origin preserved
applied = target
evolveSeed advances in application layer
```

## Seeds

Separados:

```text
generationSeed
evolveSeed
```

Engine nunca los incrementa internamente.

## Recipe

Guardar:

```text
engineId
algorithmVersion
macros
seed
pitchContext
```

## Persistence rule

```text
RESTORE != REGENERATE
```

Guardar siempre:

```text
symbolic currentPattern
+
recipe
```

El Pattern guardado es la fuente para restauración exacta aunque cambie el algoritmo.

## Provenance

```text
GENERATED
EVOLVED
MANUALLY_EDITED
LOADED_PRESET
```

Manual edit invalida la garantía de que recipe reproduce exactamente CURRENT, pero no elimina recipe como contexto.

## Device state

Persistir:

```text
schemaVersion
targetEngineId
targetMacros
targetPitchContext
currentPattern
appliedRecipe
originPattern
evolutionDepth
locks
generationSeed
evolveSeed
```

No persistir como estado musical obligatorio:

```text
hover
active tab
debug traces
candidate lists
```

## Style preset

Guarda:

```text
engine
macros
pitch context
```

Al cargar:

```text
TARGET cambia
CURRENT no cambia
pending=true
```

## Pattern preset

Guarda:

```text
exact Pattern
recipe
pitch context
locks
provenance
```

Al cargar:

```text
current = stored pattern
origin = stored pattern
depth=0
target = recipe macros when available
```

## Engine switch

```text
CURRENT BODY
TARGET MACHINE
```

BODY sigue sonando.

```text
GENERATE → nueva MACHINE
EVOLVE   → disabled
```

No BODY→MACHINE evolve en v0.1.

## Root / Scale

Son TARGET parameters.
No cambian CURRENT automáticamente.

Realtime transpose futuro será un control separado.

## Undo

Application layer debe poder conservar al menos un snapshot previo.
Integración definitiva con Ableton Undo queda para MAX spike.

Snapshot incluye:

```text
Pattern
appliedRecipe
EvolutionSession
locks
```

no sólo notes.

## Serialization

Domain state:

```text
→ serializable DTO
→ Max adapter
```

DTO sin:

```text
Map / Set / functions / class instances
```

## Versioning

```text
schemaVersion
algorithmVersion
```

Migrar schema, nunca regenerar automáticamente un pattern antiguo con algoritmo nuevo.

## Hard acceptance

```text
save/close/open → exact same symbolic pattern
seeds preserved
origin preserved
locks preserved
manual edits preserved
style preset never changes current
pattern preset restores exact pattern
```
