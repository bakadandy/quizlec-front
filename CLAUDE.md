# QuizLec Frontend

React + TypeScript + TailwindCSS frontend for the QuizLec microservices learning platform.

All API requests go through the gateway at `http://localhost:8090`. No auth exists yet — all endpoints are public.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-state vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
