# WORKING WITH CODEX — LOW TOKEN WORKFLOW

## Normal workflow

Keep this repository open in Codex.

For almost every task, send only:

```text
Lee AGENTS.md e implementa docs/codex/NEXT_TASK.md.
```

Do NOT paste canonical specs into the prompt.

## After each task

1. Review Codex's short result.
2. Run/confirm verification.
3. If PASS, update:
   - `docs/codex/STATUS.md`
   - `docs/codex/NEXT_TASK.md`
4. Start a fresh Codex task/chat when context has become large.

## Context budget

Codex should normally read:

```text
AGENTS.md
00_INDEX.md
NEXT_TASK.md
1 primary spec
```

Only add one optional spec if `CONTEXT_MAP.md` says it is required.

## Never do this

```text
"read all docs"
"analyze the whole repository"
"implement the entire engine"
"review everything before coding"
```

Those prompts waste context and encourage unrelated refactors.

## Task size

Good:

```text
one metric
one validator
one transform
one mapper
one spike
```

Bad:

```text
implement BODY
implement all Max integration
finish the project
```

## Codex output

Keep it to:

```text
files changed
tests
result
blockers
```

Never ask for full logs unless there is a failure that needs diagnosis.
