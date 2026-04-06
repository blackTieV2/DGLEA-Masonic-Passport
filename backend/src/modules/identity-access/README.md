# module: identity-access

Business-capability module for authentication, session handling, and authorization foundations.

## Implemented in this slice
- auth/session service scaffolding (`login`, `refresh`, `logout`)
- current user read model service (`/me` equivalent contract)
- role/capability evaluation primitives
- lodge/district/assigned-member scope enforcement primitives
- in-memory session store adapter for bootstrap/testing

## Layer structure
- application/ — use cases, orchestration, and ports
- domain/ — permission and scope rules
- infrastructure/ — session store adapter implementations
- api/ — endpoint-facing contracts and handlers

No feature business workflows are implemented here yet beyond auth/session and permission foundation.
