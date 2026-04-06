# apps/android

Android client application.

## Purpose

Supports day-to-day user workflows:
- authentication and session handling
- passport viewing and draft creation
- submission actions
- mentor verification actions where authorized
- notification-driven tasks

## Architectural note

This client is a presentation layer over the shared backend.
Domain rules, permission checks, and workflow state transitions are enforced server-side.
