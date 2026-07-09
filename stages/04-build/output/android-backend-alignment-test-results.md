---
type: test-results
title: Android and backend alignment test results
timestamp: "2026-07-02"
status: complete
---

# Test Results

## Passed

- `backend` `npm run typecheck`
- `backend` `npm test -- --runInBand` (`25` tests passed)
- `backend` `npm run build`
- `backend` `npm run test:e2e`
- Android `./gradlew test`
- Android `./gradlew assembleDebug`

## Notes

- Android SDK path used in this workspace: `C:\Users\BlackTie\AppData\Local\Android\Sdk`
