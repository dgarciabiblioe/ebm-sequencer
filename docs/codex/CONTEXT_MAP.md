# CODEX CONTEXT MAP

Read `AGENTS.md` + `docs/spec/00_INDEX.md` first.

Then use ONLY the row matching the task prefix.

| Task prefix | Required spec | Optional only if task needs it |
|---|---|---|
| MAX-SPIKE | `docs/spec/shared/10_MAX.md` | none |
| CORE | `docs/spec/shared/02_CORE.md` | `03_PITCH.md` only for pitch contracts |
| PITCH | `docs/spec/shared/03_PITCH.md` | `02_CORE.md` |
| ELEC | `docs/spec/engines/04_ELECTRONIC.md` | `02_CORE.md`, `03_PITCH.md` |
| BODY | `docs/spec/engines/05_BODY.md` | `02_CORE.md`, `03_PITCH.md` |
| MACHINE | `docs/spec/engines/06_MACHINE.md` | `02_CORE.md`, `03_PITCH.md` |
| EVOLVE | `docs/spec/shared/07_EVOLVE.md` | relevant engine spec |
| STATE | `docs/spec/shared/08_STATE_INTERACTION.md` | `07_EVOLVE.md` |
| UI | `docs/spec/shared/09_UI.md` | `08_STATE_INTERACTION.md` |
| TEST | `docs/spec/shared/11_TESTS.md` | relevant engine/shared spec |

Rules:

```text
Do not read audit specs during normal work.
Do not read specs for other engines.
Do not cat every canonical file.
Use targeted grep/sed only when a referenced section is needed.
```
