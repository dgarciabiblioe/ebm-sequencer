# MAX FOR LIVE — CANONICAL INTEGRATION SPEC v0.1

Estado: **ARCHITECTURE DECIDED / REAL SPIKE PENDING**

## Runtime

Source:

```text
TypeScript
```

Runtime build:

```text
single bundled JavaScript file compatible with the classic Max JS runtime
```

Max object:

```text
[js]
```

Do not use as primary runtime:

```text
v8
node.script
```

Runtime architecture:

```text
TypeScript source
→ bundled JS compatible with [js]
→ [js] Max adapter
→ Max-native playback
```

Development source may be modular/CommonJS, but the runtime adapter must not
require Max to resolve CommonJS modules.

Runtime JavaScript artifacts must not depend on `../` relative paths. During
development and spikes, place them where Max can resolve them directly; final
devices will include them through the packaging/freezing mechanism validated
later.

v0.1 runtime dependencies:

```text
0 external npm packages
```

## Critical timing rule

```text
NO JavaScript in per-step clock path
```

Low priority:

```text
Generate / Evolve / scoring / validation / state / UI
```

High priority Max-native:

```text
clock / step index / playback lookup / note scheduling / MIDI
```

## Live timing

Use Live transport / tempo-relative Max timing.

Concept:

```text
[metro 16n @quantize 16n]
↓
[transport] raw ticks
↓
derive global 1/16 index
↓
active playback buffer
```

480 ticks = quarter.
120 ticks = 1/16.

Do not use a free-running counter as sole source because playhead can jump.

## Live transport spike harness

Spikes that depend on Live transport must run inside a real Max for Live device.
A standalone `.maxpat` uses Max's transport context and cannot certify Live
transport synchronization. During development, keep the spike patch and its
manually saved `.amxd` harness co-located so Max resolves the spike directly.
Final inclusion remains subject to the packaging/freezing spike.

## Device type

```text
Max MIDI Effect
```

Playback:

```text
Max-native scheduler
→ midiformat
→ midiout
```

No LiveAPI required for normal playback.

## Symbolic vs playback

Source of truth:

```text
symbolic Pattern
```

Derived:

```text
playback table
(state, midiNote, velocity, gate)
```

Recommended spike storage:

```text
coll
```

Final `coll` vs `table` can be decided by real test.

## Double buffer

```text
A plays
B is written completely
swap selector atomically
```

Never mutate active buffer piecemeal.

## Quantized commit

Live stopped:

```text
apply immediately
```

Live playing:

```text
swap at CURRENT PATTERN CYCLE boundary
```

Cycle:

```text
pattern.length * 120 ticks
```

Not always next bar.

## MIDI safety

No JS note-off scheduling.

Use Max-native scheduler (`makenote`/equivalent after spike).

Required:

```text
clean NOTE ON/OFF
PANIC / all notes off
no stuck notes
```

## UI technology

Use native Live controls for actual parameters:

```text
live.dial
live.menu
live.button
```

Custom rendering only where useful:

```text
v8ui → grid/overlays
jspainter → later skin
```

Do not rebuild automation/mapping plumbing inside custom UI.

## Live parameters

Candidates:

```text
6 macros
Root
Scale when relevant
Length
Evolve Amount
target Engine if technically appropriate
```

Generate/Evolve:

```text
momentary triggers
```

not persistent toggles.

## Complex persistence

Visible TARGET parameters use Live parameter persistence.

Committed complex state:

```text
current Pattern
origin
locks
recipes
seeds
provenance
schema version
```

stored in hidden state blob.

Candidate mechanism to verify:

```text
pattr
Parameter Mode ON
Blob
Stored Only
Dict copy
```

Do not use `autopattr` as automatic Live parameter registration.

## Restore

After device init (`live.thisdevice` barrier where needed):

```text
restore parameters + state blob
↓
validate
↓
fill inactive playback buffer
↓
activate
↓
render
```

Never Generate/Evolve during restore.

## Packaging

Frozen device must include:

```text
core bundle
js adapter
UI JS
painters
patchers
```

No:

```text
absolute paths
node_modules dependency
external user files
```

## Repository boundary

```text
max/
→ may import built public core API

core/
→ never imports max/
```

## Spike tasks

```text
MAX-SPIKE-00 js/Dict
MAX-SPIKE-01 deterministic compiled function
MAX-SPIKE-02 Live clock + raw tick step
MAX-SPIKE-03 static table → MIDI
MAX-SPIKE-04 double buffer
MAX-SPIKE-05 cycle-quantized commit
MAX-SPIKE-06 Live parameters
MAX-SPIKE-07 stored-only state blob
MAX-SPIKE-08 save/load round trip
MAX-SPIKE-09 multi-instance
MAX-SPIKE-10 freeze/portable device
```

Do not connect full ELECTRONIC until these pass.

## Acceptance

```text
JS_RUNTIME
BUNDLED_JS_COMPAT
DETERMINISM
LIVE_CLOCK_SYNC
PLAYHEAD_JUMPS
TEMPO_CHANGES
MIDI
NO_STUCK_NOTES
DOUBLE_BUFFER
CYCLE_COMMIT
PARAMETER_RESTORE
STATE_RESTORE
MULTI_INSTANCE
FREEZE
```

all PASS before engine integration.
