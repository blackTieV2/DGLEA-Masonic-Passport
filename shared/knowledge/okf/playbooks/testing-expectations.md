---
type: playbook
title: Testing Expectations
description: Bias and priority for tests in the DGLEA Masonic Passport platform
tags: [playbook, testing]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Testing Expectations

## Test bias

Bias toward:

- unit tests for business rules
- integration tests for workflow and persistence
- a smaller set of meaningful end-to-end tests

## Highest-priority test areas

1. permissions and scope
2. verification workflow state transitions
3. audit generation
4. district/lodge boundary enforcement
5. reporting and analytics correctness
6. feature-flag targeting

## Coverage checklist for new features

When implementing a new feature, add or update tests for:

- allowed behaviour
- denied behaviour
- invalid workflow state transitions
- cross-scope access attempts
- audit implications where relevant

## Security test focus

- Horizontal access checks: Brother cannot view another Brother.
- Lodge cannot view another Lodge.
- Mentor cannot review unassigned Brother unless Lodge role permits.
- District Mentor cannot modify Brother submissions without separate assignment.

## Privacy test focus

- No restricted ritual wording in seeded data.
- Enquirer deletion removes personal details but retains outcome metrics.
- Logs are redacted: no tokens, secrets, ritual detail, or private notes.
