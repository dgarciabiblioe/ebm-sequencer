# MAX-SPIKE-01 — compiled deterministic function

## Read
```text
docs/spec/shared/10_MAX.md
```

## Objective
Create an isolated Max for Live spike proving that TypeScript compiles into one
ES5-compatible JavaScript artifact loadable by `[js]`.

## Scope
```text
max/spike/
```

Create those directories if needed.

## Requirements
```text
- no engine code
- pure deterministic TypeScript function
- thin Max adapter TypeScript file
- one generated JavaScript runtime artifact
- one `[js]` object
- no node.script or LiveAPI
```

## Do not
```text
- build ELECTRONIC/BODY/MACHINE
- implement UI or MIDI clock
- add runtime dependencies
```

## Verification
Manual inside the user's actual Max for Live installation:

```text
COMPILED_FUNCTION PASS
DETERMINISM       PASS
FIXTURE           PASS
```

## Acceptance
The fixture `nextProbe(123456789)` must produce `920370032` and outlet that
value. Manual validation in Max remains required before closure.

## Return only
```text
files changed
tests
result
blockers
```
