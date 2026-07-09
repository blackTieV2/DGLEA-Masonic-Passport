# backend/src/modules

Business-capability modules for the modular monolith.

## Modules
- `identity-access`
- `lodge-district-admin`
- `member-profile`
- `passport`
- `mentor-assignment`
- `verification-workflow`
- `notifications`
- `reporting-analytics`
- `audit`
- `configuration`

## Layering inside each module
Each module contains:
- `application/`
- `domain/`
- `infrastructure/`
- `api/`

Keep module boundaries explicit; do not split into microservices.
