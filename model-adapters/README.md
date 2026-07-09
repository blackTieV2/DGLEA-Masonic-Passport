---
type: adapter-index
title: Model Adapter Index
description: Thin tool-specific adapters for LLM and IDE tools
tags: [adapters, model-neutrality]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Model Adapters

This folder contains thin adapters for tools that look for model-specific instruction files.

## Important

These files contain **no unique project truth**. They exist only to point the tool back to the canonical model-neutral instructions.

## Canonical instructions

1. `AGENTS.md` — workspace identity and universal rules
2. `CONTEXT.md` — task routing and stage selection
3. `stages/<stage>/CONTEXT.md` — stage contract

## Available adapters

| Tool | Adapter |
|---|---|
| Claude | [claude.md](claude.md) |
| OpenAI Codex | [openai-codex.md](openai-codex.md) |
| Gemini | [gemini.md](gemini.md) |
| GitHub Copilot | [copilot.md](copilot.md) |
| Cursor | [cursor.md](cursor.md) |
| Windsurf | [windsurf.md](windsurf.md) |
