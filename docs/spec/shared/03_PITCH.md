# PITCH + ENGINE CAPABILITIES — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL**

---

## 1. PitchIntent

`OCTAVE` NO es harmonic role.

```ts
export type PitchIntent =
  | { readonly kind: "ROOT"; readonly octaveOffset: number }
  | { readonly kind: "PERFECT_FIFTH"; readonly octaveOffset: number }
  | {
      readonly kind: "SCALE_DEGREE";
      readonly degree: number;
      readonly octaveOffset: number;
    }
  | {
      readonly kind: "CHROMATIC_APPROACH";
      readonly target: StablePitchTarget;
      readonly direction: "BELOW" | "ABOVE";
      readonly octaveOffset: number;
    };
```

Toda documentación/implementación antigua de:

```text
PitchRole.OCTAVE
```

queda anulada.

---

## 2. Pitch resolver

Puro, determinista, sin RNG.

```text
PitchIntent
+
PitchContext
+
ScaleCatalog
↓
ResolvedPitch
```

Range fitting:

```text
±12 semitonos
```

No hard clamp.

---

## 3. Scale relevance por engine

### ELECTRONIC

```text
scaleRelevant = true
```

Porque v0.1 puede utilizar:

```text
SCALE_DEGREE 3
```

### BODY

```text
scaleRelevant = false
```

Vocabulary:

```text
ROOT
PERFECT_FIFTH
register offset
```

### MACHINE

```text
scaleRelevant = false
```

Vocabulary:

```text
ROOT
PERFECT_FIFTH excepcional
register offset
```

UI:

```text
Scale disabled/secondary cuando scaleRelevant=false
```

El valor se conserva internamente para cambiar de engine, pero no se presenta como si alterase el resultado.

---

## 4. Built-ins

```text
CHROMATIC
MAJOR
NATURAL_MINOR
DORIAN
PHRYGIAN
MIXOLYDIAN
HARMONIC_MINOR
MINOR_PENTATONIC
```

`STRICT`:

```text
100% resolved notes inside scale
```

`CHROMATIC_APPROACH_ONLY` sólo para intents explícitos de approach.

---

## 5. Register

Registro siempre separado del harmonic intent.

```text
ROOT octaveOffset 0
ROOT octaveOffset +1
```

es la antigua notación conceptual:

```text
R / O
```

---

## 6. Engine pitch limits

### ELECTRONIC

```text
octaveOffset: 0..+1
```

### BODY

```text
octaveOffset: 0..+1
```

### MACHINE

```text
octaveOffset: 0..+1
```

v0.1 bass-oriented.

---

## 7. Hard invariants

```text
step01 / first active anchor
→ ROOT octaveOffset 0
```

cuando la engine spec lo declara.

No construir validators llamados `PitchRoleValidator`.

Usar nombres correctos:

```text
PitchIntentValidator
RegisterValidator
PitchIntentRegisterValidator
```
