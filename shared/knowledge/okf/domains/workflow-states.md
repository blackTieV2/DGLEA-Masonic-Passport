---
type: concept
title: Workflow States
description: Canonical workflow states for progress items and reviews
tags: [domain, workflow, state-machine]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Workflow States

## Progress item lifecycle

| State | Meaning |
|---|---|
| `LOCKED` | Section not yet available to the Brother. |
| `NOT_STARTED` | Available but no work recorded. |
| `DRAFT` | Brother or mentor has saved work but not submitted. |
| `SUBMITTED` | Brother has submitted the item for review. |
| `CLARIFICATION_REQUESTED` | Reviewer needs more information before deciding. |
| `VERIFIED` | Reviewer has verified the item. |
| `REJECTED` | Reviewer has rejected the item. |
| `COMPLETED` | Item is complete, either verified or marked complete by authorised role. |

## Allowed transitions

```text
LOCKED -> NOT_STARTED
NOT_STARTED -> DRAFT
DRAFT -> SUBMITTED
SUBMITTED -> VERIFIED
SUBMITTED -> REJECTED
SUBMITTED -> CLARIFICATION_REQUESTED
CLARIFICATION_REQUESTED -> DRAFT
REJECTED -> DRAFT
VERIFIED -> COMPLETED
```

## Review decisions

| Decision | Meaning |
|---|---|
| `VERIFY` | Accept the submitted item. |
| `REJECT` | Decline the submitted item; requires reason. |
| `REQUEST_CLARIFICATION` | Ask the Brother for more information; requires reason. |

## Important rules

- `SUBMITTED` is **not** the same as `VERIFIED`.
- Reject and clarification decisions must include a reason.
- Every review decision creates an audit event and a notification.
- Historical reviews are preserved under the original reviewer identity.
