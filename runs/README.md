---
type: runs-index
title: Runs Folder
description: Per-run working folders for grouped agent outputs
version: 1.0
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Runs

This folder is for grouping related stage outputs into a single run when needed.

## Naming convention

```text
runs/YYYY-MM-DD-topic-slug/
```

Example:

```text
runs/2026-06-29-rbac-implementation/
```

## When to use

Use a run folder when a single piece of work spans multiple stages and you want to keep the outputs together for handoff.

## Do not

- Do not use run folders as durable knowledge storage.
- Do not duplicate canonical files here.
