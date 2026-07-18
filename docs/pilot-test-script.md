# DGLEA Masonic Passport — Pilot Test Script

Use this script to verify the app behaves correctly during a pilot demonstration. Record any failures or unexpected behaviour in the “Result / Notes” column.

## Prerequisites

- A debug or staging APK built from `main` (or the branch under test).
- Backend running and reachable from the device/emulator.
- Firebase Auth test user configured (for real sign-in tests) OR debug demo account enabled (for local debug tests only).
- No real member personal data until privacy review is complete.

## Test Cases

### T1 — Install and launch

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 1.1 | Install the APK on the pilot device/emulator. | Installation succeeds without errors. | |
| 1.2 | Open the app from the launcher. | Branded splash/loading screen appears; no crash. | |
| 1.3 | Wait for the app to finish loading. | App reaches the sign-in screen. | |

### T2 — Sign-in screen presentation

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 2.1 | Inspect the sign-in screen. | Title, subtitle, email and password fields, and primary “Sign In” button are visible and not clipped. | |
| 2.2 | Check status bar / camera cut-out. | No UI element overlaps the status bar or camera cut-out. | |
| 2.3 | Inspect debug/demo panel (debug builds only). | Panel is collapsed by default and clearly labelled as debug/demo. | |

### T3 — Real Firebase sign-in

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 3.1 | Enter the Firebase test user email address. | Email field accepts input. | |
| 3.2 | Enter the test user password. | Password field masks input. | |
| 3.3 | Tap “Sign In”. | Button shows loading state briefly, then app advances. | |
| 3.4 | Verify landing screen. | Profile / passport landing screen loads and shows the correct member identity. | |

### T4 — Debug demo account sign-in (debug builds only)

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 4.1 | Expand the debug/demo panel. | Panel expands and shows the Brother EA demo account option. | |
| 4.2 | Tap the demo account connect button. | App signs in via local dev-auth fallback and reaches the landing screen. | |
| 4.3 | Confirm backend call. | Backend receives `X-Dev-Auth-Firebase-Uid` (not `Authorization: Bearer`). | |

### T5 — Profile / passport view

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 5.1 | From the landing screen, view the profile. | Profile data loads: name, lodge, rank/role. | |
| 5.2 | View degree progress. | Progress cards or list shows entered/provisional/verified status. | |
| 5.3 | Tap a degree item if interactive. | Details or approval status is shown. | |

### T6 — Reference content

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 6.1 | Open the reference content section. | List or index of reference material loads. | |
| 6.2 | Select a reference item. | Content renders and is readable. | |
| 6.3 | Navigate back. | App returns to the previous screen without error. | |

### T7 — PDF export / download / share

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 7.1 | Trigger passport PDF export/download. | PDF is generated and saved/shared successfully. | |
| 7.2 | Open the generated PDF. | PDF contains member name, lodge, and degree progress. | |
| 7.3 | Use the system share sheet if available. | Share intent opens and the PDF can be shared. | |

### T8 — Logout and re-entry

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 8.1 | Tap “Sign Out”. | App returns to the sign-in screen. | |
| 8.2 | Inspect the sign-in screen. | Email and password fields are enabled; “Sign In” button shows “Sign In” (not stuck on “Signing in…”). | |
| 8.3 | Sign in again. | App returns to the landing screen successfully. | |

### T9 — Error handling

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 9.1 | Enter an invalid password and tap “Sign In”. | App shows a clear error message and remains on the sign-in screen. | |
| 9.2 | Attempt to use the app with no network. | Appropriate offline/error messaging is shown. | |

### T10 — Staging build sanity

| Step | Action | Expected Result | Result / Notes |
|------|--------|-----------------|----------------|
| 10.1 | Install the staging APK. | App installs and launches. | |
| 10.2 | Confirm debug demo panel is absent. | Staging build does not show demo account controls. | |
| 10.3 | Confirm `ALLOW_DEV_AUTH` is false. | Dev-auth fallback cannot be used. | |

## Issue Log

| ID | Test case | Issue description | Severity | Owner |
|----|-----------|-------------------|----------|-------|
| | | | | |

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Pilot co-ordinator | | | |
| Lodge Secretary | | | |
| Mentor representative | | | |
