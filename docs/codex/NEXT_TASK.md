# MAX-SPIKE-02 — Live clock and transport phase

## Read
```text
docs/spec/shared/10_MAX.md
```

## Objective
Prove in Max for Live that a native tempo-relative sixteenth clock derives the
step index from Live's real transport position, not from an autonomous counter.

## Scope
```text
max/spike/max-spike-02.maxpat
max/spike/max-spike-02-manual-setup.md
```

Create those directories if needed.

## Requirements
```text
- native `[transport]` bound to Live
- native `[metro 16n @quantize 16n]`
- raw ticks → floor(rawTicks / 120) → (globalSixteenth % 16) + 1
- visible transport state, raw ticks, global sixteenth and step index
- no JavaScript in the clock path
- run the patch through a manually saved Max MIDI Effect harness
```

## Do not
```text
- build ELECTRONIC/BODY/MACHINE
- implement MIDI output, UI, state or buffers
- use JavaScript, node.script or LiveAPI as a clock
- use an autonomous counter as the step source
```

## Verification
Manual inside the user's actual Max for Live installation:

```text
LIVE_CLOCK PASS
TRANSPORT_POSITION PASS
STEP_INDEX PASS
PLAYHEAD_RESYNC PASS
```

## Acceptance
Test stop/start, playhead jumps, loops, opening during playback, and 90, 120,
137 and 160 BPM. Manual validation in Max remains required before closure.

## Return only
```text
files changed
tests
result
blockers
```
