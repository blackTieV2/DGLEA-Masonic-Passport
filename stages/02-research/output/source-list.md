---
type: source-list
title: Workspace takeover discovery sources
timestamp: "2026-07-01"
status: complete
---

# Source List

| Source | Scope used | Purpose |
|---|---|---|
| `AGENTS.md` | Full (provided and canonical) | Universal workspace rules |
| `CONTEXT.md` | Full | Stage routing and loading boundaries |
| `stages/00-triage/CONTEXT.md` | Full | Triage contract |
| `stages/02-research/CONTEXT.md` | Full | Discovery contract |
| `stages/01-intake/output/project-brief.md` | Full | Active project brief |
| `README.md` | Full | Human entrypoint and referenced paths |
| `workspace.manifest.yaml` | Full | Declared workspace inventory |
| `model-adapters/*.md` | Full | Model-neutrality audit |
| `_config/*.md` | Frontmatter and opening sections | Configuration existence and format |
| `shared/knowledge/okf/**/*.md` | Metadata audit; index/log read fully | Durable knowledge structure and history |
| `archive/original-agents.md` | Full | Preservation and migration comparison |
| `setup/*.md` | Full | Questionnaire and onboarding audit |
| `stages/*/CONTEXT.md` | Required-section scan | Stage contract compliance |
| `stages/*/stage.manifest.yaml` | Existence check | Machine-readable routing coverage |
| Repository filename inventory | Paths only, excluding `.git`, dependency, build, and dist folders | Tree, instruction, naming, and sensitive-filename discovery |
| `git status --short` | Full status | Existing change and migration risk |

Application source and formal documentation bodies were not loaded.
