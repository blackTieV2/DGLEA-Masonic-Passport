# DGLEA Masonic Passport — Pilot Issue Log Template

Use this log to record every issue found during the pilot. Copy the row for each new issue.

## Issue Log

| Issue ID | Reporter | Date / Time | Build Variant | App Version / Commit | Device / Emulator | Severity | Description | Screenshots / Logs | Privacy Impact | Immediate Containment | Owner | Status | Resolution | Lessons Learned |
|----------|----------|-------------|---------------|----------------------|-------------------|----------|-------------|--------------------|----------------|------------------------|-------|--------|------------|-----------------|
| | | | debug / staging | | | Critical / High / Medium / Low | | | | | | Open / In progress / Resolved / Closed | | |
| | | | debug / staging | | | Critical / High / Medium / Low | | | | | | Open / In progress / Resolved / Closed | | |

## Severity Definitions

- **Critical:** Real member data exposed or entered; auth bypass outside debug; privacy incident; staging/release points to wrong backend.
- **High:** Blocks most pilot users or corrupts progress data.
- **Medium:** Degraded experience with workaround.
- **Low:** Cosmetic or minor documentation issue.

## Privacy Impact Definitions

- **None:** No personal or sensitive data involved.
- **Potential:** Synthetic or anonymised data only, but could expose information if mishandled.
- **Confirmed:** Real personal or sensitive data was entered, viewed, or shared.

## Containment Examples

- Stop using the app / feature.
- Sign out and clear app data.
- Disable the affected test account.
- Recall or delete the affected file.
- Reinstall the previous APK.

## Notes

- Do not include passwords, tokens, or real member data in this log.
- Attach screenshots only after redacting any personal or sensitive information.
- Link to the pull request or commit that resolves the issue once available.
