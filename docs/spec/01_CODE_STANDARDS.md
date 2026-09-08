# EBM SEQUENCER — CODE STANDARDS
## Convenciones de código, arquitectura y reglas para Codex

Estado: **ACTIVE**

Este documento es fuente de verdad para todo el código del proyecto.

# 1. Naming

## Archivos y carpetas

Usar siempre:

```text
kebab-case
```

Ejemplos:

```text
electronic-engine.ts
seeded-rng.ts
identity-metric.ts
rest-shift.ts
validator-pipeline.ts
```

No mezclar nombres de archivo con mayúsculas.

## Clases, interfaces y tipos

```text
PascalCase
```

Ejemplos:

```text
ElectronicEngine
SeededRng
Pattern
Archetype
IdentityMetric
```

## Funciones y variables

```text
camelCase
```

Ejemplos:

```text
calculateIdentity()
selectArchetype()
baseMotif
targetDensity
```

## Constantes

```text
SCREAMING_SNAKE_CASE
```

Ejemplos:

```text
MAX_RETRIES
DEFAULT_PATTERN_LENGTH
MIN_IDENTITY_SCORE
```

# 2. Principios de diseño

```text
- 1 archivo = 1 responsabilidad clara
- funciones puras siempre que sea posible
- clases sólo cuando exista una abstracción real
- composición antes que herencia
- dependencias explícitas
- sin estado global
- sin números mágicos
- sin lógica musical duplicada
- sin funciones gigantes
- sin abstracciones prematuras
```

# 3. Configuración musical como datos

Evitar:

```text
if (archetype === "M01") ...
else if (archetype === "M02") ...
```

Preferir:

```text
const archetypes = {
  M01: {
    pattern: [1, 1, 1, 0],
    transforms: {
      restShift: "HIGH",
      removeHit: "MEDIUM"
    }
  }
}
```

La gramática musical debe declararse como datos siempre que sea posible.

# 4. Arquitectura

```text
src/

  core/
    model/
    metrics/
    transforms/
    validators/
    rng/

  engines/
    electronic/
    body/
    machine/

  adapters/
    cli/
    max/
```

Regla de dependencias:

```text
Max / CLI
    ↓
Engine
    ↓
Core
```

Nunca:

```text
Core → Max
```

# 5. Patrones permitidos

Usar sólo cuando resuelvan un problema concreto:

```text
Strategy
Command
Specification
Dependency Injection
Ports & Adapters
```

No introducir patrones por estética arquitectónica.

# 6. Strategy

```text
SequencerEngine
├── ElectronicEngine
├── BodyEngine
└── MachineEngine
```

Cada motor conserva su propia gramática.

# 7. Command para transformaciones

Cada transformación debe encapsular:

```text
canApply()
apply()
cost()
```

# 8. Specification para validadores

```text
DensityValidator
SyncValidator
IdentityValidator
RestRunValidator
PhraseValidator
```

Pipeline:

```text
validators.every(v => v.validate(candidate))
```

# 9. Dependency Injection

Inyectar:

```text
RNG
ArchetypeRepository
TransformationRegistry
ValidatorPipeline
```

El core no crea dependencias globales por su cuenta.

# 10. Inmutabilidad

Preferir:

```text
basePattern
  ↓ transform
newPattern
```

No mutar el patrón fuente silenciosamente.

# 11. TypeScript

Preferencia:

```text
TypeScript para core y engines
↓
compilación a JavaScript
```

El adaptador Max se decidirá después del spike técnico de compatibilidad.

# 12. Prohibiciones

Evitar archivos genéricos:

```text
utils.ts
helpers.ts
common.ts
misc.ts
```

Evitar también:

```text
- clases que sólo envuelven una función
- herencia profunda
- singletons
- estado global
- Math.random() dentro del core
- lógica Max dentro del core
- dependencias circulares
```

# 13. Regla para nuevas abstracciones

Antes de crear una nueva abstracción:

```text
1. comprobar si ya existe una equivalente
2. justificar por qué es necesaria
3. preferir composición frente a herencia
4. evitar wrappers sin valor
5. evitar abstracciones genéricas
```

# 14. Tests

Todo comportamiento nuevo debe incluir tests.

```text
- unit tests
- deterministic tests
- invariants cuando aplique
- golden fixtures para resultados sensibles
```

# 15. Logging

Por defecto:

```text
QUIET
```

Salida de verificación:

```text
PASS 42 tests
FAIL 1
<short reason>
```

No imprimir logs completos salvo modo debug.

# 16. Definition of Done

Una tarea termina cuando:

```text
- código implementado
- tests añadidos
- tests pasan
- no rompe tests previos
- output de verificación breve
- docs actualizadas si cambia contrato
```

# 17. Formato de tareas para Codex

Cada tarea debe incluir sólo:

```text
- objetivo
- scope
- archivos permitidos
- restricciones
- tests
- comando de verificación
- criterio de aceptación
```

Prompt base:

```text
Implementa Task XX según la documentación del proyecto.

Scope:
...

Do not:
...

Verification:
...

Return only:
- files changed
- tests
- result
- blockers
```
