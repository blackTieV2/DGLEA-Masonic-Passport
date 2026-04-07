# backend/src/worker

Background worker and asynchronous processing.

Typical responsibilities:
- notification dispatch jobs
- reminder scheduling
- stale workflow checks
- report/export generation jobs

Worker logic should reuse shared domain rules from backend modules.
