# CANONICAL SPEC INDEX v0.1

Estado: **IMPLEMENTATION SOURCE OF TRUTH**

Codex debe leer este archivo y después **sólo** la spec indicada para la tarea actual.

Documentos antiguos de diseño NO forman parte de este repositorio.

## General

```text
docs/spec/01_CODE_STANDARDS.md
docs/spec/ENGINE_NAMING.md
```

## Shared

```text
docs/spec/shared/02_CORE.md
docs/spec/shared/03_PITCH.md
docs/spec/shared/07_EVOLVE.md
docs/spec/shared/08_STATE_INTERACTION.md
docs/spec/shared/09_UI.md
docs/spec/shared/10_MAX.md
docs/spec/shared/11_TESTS.md
```

## Engines

```text
docs/spec/engines/04_ELECTRONIC.md
docs/spec/engines/05_BODY.md
docs/spec/engines/06_MACHINE.md
```

## Audit evidence — do NOT read during normal implementation

```text
docs/spec/audit/12_AUDIT_RESOLUTION.md
docs/spec/audit/13_MATH_VERIFICATION.md
```

Only read audit files when debugging a specification inconsistency.

## Precedence

```text
current task
>
canonical spec for that task
>
code standards
```

If a task contradicts canonical spec:

```text
STOP
report blocker
do not invent a rule
```

## Current capabilities

```text
ELECTRONIC  8 / 16 / 32
BODY     16
MACHINE  16
```

## Build order

```text
MAX SPIKE
CORE
PITCH
ELECTRONIC
BODY
MACHINE
EVOLVE
STATE
UI
SKIN
```
