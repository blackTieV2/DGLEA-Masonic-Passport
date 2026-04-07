# module: reporting-analytics

Business-capability module for **reporting-analytics**.

## Layer structure
- application/ — use cases, orchestration, and ports
- domain/ — core domain model and domain services
- infrastructure/ — adapters for persistence, messaging, external systems
- api/ — transport/controller layer and DTO mapping

## Override/history analytics implications (current canonical model)

The service core now uses a **same-record override model**:
- `passport_records.status` is updated to the override target status.
- Historical truth is preserved in `verification_decisions` (`decision_type='OVERRIDDEN'` with `prior_status` and `new_status`) and `audit_events` metadata.

### Reporting guidance
- Current-state KPIs should be read from `passport_records.status`.
- Override frequency and governance metrics should be derived from `verification_decisions` and `audit_events`.
- A record that was overridden should be counted as overridden **only in override-event metrics**, not as a separate current-state status bucket.

No concrete analytics query service is implemented yet.
