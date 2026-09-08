# MAX-SPIKE-00 — v8 runtime

## Read
```text
docs/spec/shared/10_MAX.md
```

## Objective
Create the smallest isolated Max for Live compatibility spike proving that `v8`
can load a local CommonJS JavaScript module and exchange structured data through
a Max `Dict`.

## Scope
```text
max/spike/
max/js/spike/
```

Create those directories if needed.

## Requirements
```text
- no engine code
- no TypeScript project bootstrap
- no node.script
- no LiveAPI
- one v8 object
- one local CommonJS module
- one Dict round-trip
- concise PASS/FAIL output
```

## Do not
```text
- build ELECTRONIC/BODY/MACHINE
- implement UI
- implement MIDI clock
- add npm dependencies
```

## Verification
Manual inside the user's actual Max for Live installation:

```text
V8_OBJECT       PASS
COMMONJS_REQUIRE PASS
DICT_ROUNDTRIP   PASS
```

## Acceptance
All three checks pass with no external runtime dependency.

## Return only
```text
files changed
tests
result
blockers
```
