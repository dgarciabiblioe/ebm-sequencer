# AGENTS.md — EBM Sequencer

## Context policy

1. Do NOT scan the whole repository before starting.
2. Read `docs/spec/00_INDEX.md`.
3. Read only the files listed for the current task in `docs/codex/CONTEXT_MAP.md`.
4. `docs/spec/audit/*` is forbidden unless the task explicitly requests audit/debugging.
5. Never use old design-history documents as implementation sources.
6. If required behaviour is not in the canonical spec: stop and report a blocker. Do not invent music rules.

## Scope policy

- Modify only files explicitly allowed by the current task.
- Do not refactor unrelated code.
- Do not add dependencies without explicit justification.
- Reuse shared core; do not duplicate engine logic.
- No Max/Ableton imports inside core/engines.
- No `Math.random()`.
- No global mutable state.
- No `utils.ts`, `helpers.ts`, `common.ts` or junk-drawer modules.
- Files/folders: kebab-case.
- Types/classes: PascalCase.
- Functions/variables: camelCase.
- Constants: SCREAMING_SNAKE_CASE.
- Prefer pure functions and immutable data.
- Musical configuration should be declarative.

## Tests

Every behavioural change requires focused tests.
Run only the smallest relevant test command during development.
Before finishing, run the task verification command.
Keep terminal output short.

## Output

Return only:

```text
files changed
tests
result
blockers
```

No long explanation or full logs unless explicitly requested.

## Engine naming

Canonical engine names are:

```text
ELECTRONIC / BODY / MACHINE
```

Use `electronic` for IDs, paths and kebab-case filenames.
Do not introduce aliases or alternative engine names.
