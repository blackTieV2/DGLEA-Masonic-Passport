---
type: playbook
title: Preferred Build Order
description: Recommended order for building the platform from documentation to code
tags: [playbook, build-order]
timestamp: "2026-06-29T13:05:11Z"
status: canonical
sensitivity: internal
---

# Preferred Build Order

1. Freeze canonical names.
2. Formalise OpenAPI.
3. Scaffold backend modules.
4. Scaffold Android and web admin apps.
5. Create DB migrations and seeds.
6. Create test skeletons.
7. Implement auth and scope enforcement.
8. Implement passport draft/submission flow.
9. Implement mentor verification flow.
10. Implement dashboards, reporting, and controlled rollout features.

## Rationale

Names, contracts, and boundaries must be stable before broad UI work begins. The permission matrix and verification workflow are the highest-risk areas, so they are implemented and tested before dashboards and reporting.
