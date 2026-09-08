# PITCH + ENGINE CAPABILITIES — IMPLEMENTATION SPEC v0.1

Estado: **CANONICAL**

---

## 1. PitchIntent

`OCTAVE` NO es harmonic role.

```ts
export type StablePitchTarget =
  | "ROOT"
  | "PERFECT_FIFTH"
  | "SCALE_DEGREE_3";
```

`StablePitchTarget` contains only the stable harmonic targets used by
`CHROMATIC_APPROACH`. It does not include `OCTAVE`, `CHROMATIC`, or any other
scale degree. Register remains an independent `octaveOffset` dimension.

```ts
export type PitchIntent =
  | { readonly kind: "ROOT" }
  | { readonly kind: "PERFECT_FIFTH" }
  | {
      readonly kind: "SCALE_DEGREE";
      readonly degree: number;
    }
  | {
      readonly kind: "CHROMATIC_APPROACH";
      readonly target: StablePitchTarget;
      readonly direction: "below" | "above";
    };
```

`octaveOffset` belongs to `NoteStep`, independently of `PitchIntent`.

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

### PITCH-00 contracts

`ResolvedPitch` is a `MidiNote`: a finite integer in the inclusive MIDI range
`0..127`. `PitchContext` contains only:

```ts
export interface PitchContext {
  readonly rootMidi: MidiNote;
  readonly scale: ScaleId;
}

export type OctaveOffset = -1 | 0 | 1;
```

`rootMidi` is an absolute MIDI note; its pitch class is `rootMidi % 12`.

Built-in `ScaleId` definitions use ascending, unique semitone intervals from
ROOT, beginning at `0`:

```text
CHROMATIC        0 1 2 3 4 5 6 7 8 9 10 11
MAJOR            0 2 4 5 7 9 11
NATURAL_MINOR    0 2 3 5 7 8 10
DORIAN           0 2 3 5 7 9 10
PHRYGIAN         0 1 3 5 7 8 10
MIXOLYDIAN       0 2 4 5 7 9 10
HARMONIC_MINOR   0 2 3 5 7 8 11
MINOR_PENTATONIC 0 3 5 7 10
```

Degrees are one-based: `SCALE_DEGREE_3` resolves to `intervals[2]`. Stable
target intervals are ROOT `0`, PERFECT_FIFTH `7`, and SCALE_DEGREE_3 from the
active scale. Apply `octaveOffset * 12` after the stable target is resolved.

The resulting raw pitch uses one range-fitting correction only: add `12` when
it is below `0`, subtract `12` when it is above `127`, then reject it if still
outside `0..127`. No clamp, wrapping, or repeated fitting is allowed.

### PITCH-01 chromatic approach

`CHROMATIC_APPROACH` is an explicit one-semitone approach to a stable target:

```ts
{
  readonly kind: "CHROMATIC_APPROACH";
  readonly target: StablePitchTarget;
  readonly direction: "below" | "above";
}
```

Its resolution order is stable target, `octaveOffset`, chromatic displacement
(`below = -1`, `above = +1`), then the final single `±12` range fitting. It has
no temporal, previous-note, next-note, random, or probability semantics in
shared PITCH.

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
