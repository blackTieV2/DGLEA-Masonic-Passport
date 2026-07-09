---
type: build-notes
title: Core rebuild implementation notes
timestamp: "2026-07-01"
status: in-progress
---

# Core Rebuild Implementation Notes

Completed the first approved rebuild slice:

- Removed the mounted arbitrary-user and destructive database-reset modules.
- Changed the API prefix to `/api/v1` and added canonical `/me` and `/me/passport` routes.
- Enforced active role-assignment dates and exact Lodge/District scope checks.
- Fixed multiple-Lodge listing so it cannot widen to all Brothers.
- Added authorization to activity reads and isolated private notes to their author.
- Separated activity write permission from read permission.
- Prevented locked/submitted progress from being silently reverted to draft.
- Added optimistic progress versions and atomic review/draft/submit/clarification transactions containing audit and notification writes.
- Replaced destructive cascade relations with restrictive history-preserving foreign keys.
- Added a committed baseline Prisma migration and stopped ignoring migrations.
- Restored the checked-in Gradle wrapper launchers and disabled Android backup.

Android API/auth replacement remains in progress. The client still contains retired endpoint DTOs and is not yet compatible with Firebase-backed `/api/v1`.
