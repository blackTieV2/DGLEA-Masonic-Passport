# DGLEA Masonic Passport — Android UX Beauty Plan & Roadmap

**Document Status:** Draft v1
**Author:** GitHub Copilot
**Date:** 2026-07-21

---

## 1. Purpose

This document records the full takeover plan to make the DGLEA Masonic Passport Android app visually beautiful, user-friendly, and production-ready.

It is written for the next mobile-focused engineer or UX owner who will execute the Android polish work while preserving the current functional backend integration and privacy/security constraints.

This plan is intentionally hyper-detailed and actionable. It covers:

- the current visual and UX state of the Android app
- a design system foundation
- a phase-by-phase roadmap
- screen-level polish tasks
- accessibility, dark mode, and quality guardrails
- suggested sprint cadence and acceptance criteria

---

## 2. Objectives

### 2.1 Primary objective

Transform the current functional Android app from utilitarian to beautiful, trustworthy, and easy to use.

### 2.2 Secondary objectives

- Preserve the existing backend and auth flow.
- Avoid large platform rewrites in the short term.
- Build reusable UI patterns so future screens can be added quickly.
- Make the app feel like a connected DGLEA product rather than a raw developer prototype.

### 2.3 UX outcomes

- clear visual hierarchy and branded identity
- consistent spacing, typography, and color usage
- intentional motion, state feedback, and affordances
- accessible touch targets and screen-reader friendliness
- polished sign-in, passport, mentor, and reference flows

---

## 3. Scope

This plan covers the Android app only.

In-scope:
- `apps/android/app/src/main/java/com/dglea/passport/ui/theme/*`
- key screen files under `apps/android/app/src/main/java/com/dglea/passport/ui/screens/*`
- shared theme, typography, and surface system
- onboarding/sign-in flows, passport dashboard, progress flows, mentor queue, reference content
- dark mode and accessibility improvements

Out-of-scope for this phase:
- backend API changes
- web-admin portal implementation
- Flutter migration as the first step
- production deployment or signing workflows beyond local UX

---

## 4. Guiding design principles

1. **Calm clarity** — reduce noise, use whitespace, make status information easy to scan.
2. **Trustworthy structure** — use clear headings, cards, and labels across screens.
3. **Action-first** — surface the next meaningful action, not raw data.
4. **Consistent system** — shared colors, typography, spacing, and components.
5. **Accessible by default** — keep contrast, touch size, semantics, and navigation clear.
6. **Preserve privacy** — the UI must never suggest storing restricted ritual content.
7. **Minimal risk** — update the Compose UI incrementally rather than rewriting the app.

---

## 5. Current state summary

### 5.1 Strengths
- The app is functionally complete for the current MVP flows.
- It uses Jetpack Compose and Material 3.
- The backend integration and auth model are already wired.
- Documentation, handover notes, and local dev flows are in place.

### 5.2 Deficits
- UI screens use raw text and button stacks instead of polished layouts.
- The color palette is present but not semantic or brand-focused.
- Progress flows are hard to scan and overwhelm users.
- There are few empty/loading/error states with meaningful UI.
- The debug/demo panel on sign-in is visible and visually heavy.
- Dark mode is present but not intentionally designed.
- Accessibility and content descriptions are incomplete.

---

## 6. High-level roadmap

The roadmap is organized into five sequential phases. Each phase has explicit deliverables and acceptance criteria.

### Phase 1 — Foundation
- Build the theme and design system.
- Create shared layout and navigation primitives.
- Define the app's visual identity.

### Phase 2 — Core screen refresh
- Redesign sign-in and home/passport screens.
- Improve profile/progress and mentor review screens.
- Polish reference content.

### Phase 3 — States and feedback
- Add skeleton/loading states.
- Add empty states and error states.
- Improve action feedback and success messages.

### Phase 4 — Accessibility and polish
- Add dark mode refinement.
- Ensure screen-reader support.
- Fix contrast and touch target issues.

### Phase 5 — Quality, QA, and launch preparation
- Stabilize the polished UI and build verification.
- Document the UI system for future teams.
- Verify with device and emulator tests.

---

## 7. Phase 1 — Foundation

### 7.1 Theme and tokens

Create a stronger theme foundation in `ui/theme/`:

#### 7.1.1 Colors
- Replace raw colors with semantic tokens:
  - `Primary`, `OnPrimary`
  - `Secondary`, `OnSecondary`
  - `Background`, `Surface`, `SurfaceVariant`
  - `Error`, `Success`, `Warning`
  - `Outline`, `InverseSurface`
- Add brand-friendly accent values in addition to the current DGLEA palette.

#### 7.1.2 Typography
- Define a complete Material typography scale in `Type.kt`:
  - `displayLarge`, `headlineSmall`, `titleMedium`, `bodyLarge`, `bodySmall`, `labelLarge`
- Prefer readable, modern font weights.
- Use a single family or secondary family for emphasis.

#### 7.1.3 Shapes
- Standardize shapes in a new `Shape.kt` or theme constant:
  - `small = 8.dp`
  - `medium = 16.dp`
  - `large = 24.dp`
- Use these shapes for cards, buttons, and surfaces.

#### 7.1.4 Spacing
- Define spacing constants in a `Spacing` object or use consistent dp values:
  - `4.dp`, `8.dp`, `12.dp`, `16.dp`, `24.dp`, `32.dp`, `48.dp`
- Use them across screens.

### 7.2 Shared component primitives

Create reusable UI components in a new package or file:

- `DgleaScaffold` — standard top app bar, optional bottom nav, safe drawing padding.
- `SectionCard` — card with title, optional subtitle, content slot.
- `StatusChip` — consistent badge for statuses like `Submitted`, `In review`, `Clarification required`.
- `ActionButton` — primary, secondary, destructive button styles.
- `InfoRow` — label + value rows for details.
- `DividerSpacer` — subtle dividers between sections.
- `PrimarySurface`, `NeutralSurface` — consistent background surfaces.

### 7.3 Navigation and structure

Document the Android primary screen structure:
- Sign-in / splash
- Home dashboard
- Passport overview
- Passport item detail
- Mentor queue
- Reference content
- Settings/profile

If desired, create a lightweight `Navigation.kt` file with named routes.

### 7.4 Brand direction

Choose a visual tone for the app:
- calm, dignified, confident
- minimal ornamentation
- strong headings and generous whitespace
- support for DGLEA identity without overwhelming ritual sensitivity

Add a small branded launch screen or header if the assets are available.

---

## 8. Phase 2 — Core screen refresh

### 8.1 Connect / sign-in screen

Deliverables:
- a polished sign-in card with headline, description, and credentials form
- a visible but low-priority debug panel hidden behind expansion
- inline validation and error handling
- a clean primary call-to-action button

UI changes:
- replace centered stacked text with a `Surface` card and stronger heading
- add a small brand mark or badge area
- make `onSignIn` disabled until email and password are valid
- if debug mode is active, show a compact tile with `Expand` rather than a full panel

Accessibility:
- `contentDescription` on icons
- field labels and hint text
- clear error message semantics

### 8.2 Home / My Passport overview

Deliverables:
- summary header card with current user, lodge, stage, and next action
- a progress summary bar or status chips for milestone completion
- a smaller action row for `Refresh`, `Share PDF`, and `Profile`
- a compact list of passport sections with clear affordances

UI changes:
- replace large nested loops of cards with a dashboard pattern
- use `LazyColumn` for performance if the passport has many sections
- create a `PassportSectionCard` component with summary and status
- bring the note editor into a modal or inline expandable section instead of top-level repeated inputs

Interaction improvements:
- make progress cards tappable to open details
- only show `Save Draft` / `Submit` when relevant for the selected item
- keep the screen from feeling like a raw backend form

### 8.3 Profile progress and mentor screens

Deliverables:
- structured progress summary screens with card groups
- clear mentor review item cards with action ribbons
- better use of `Button`, `OutlinedButton`, and `ElevatedButton`

UI changes:
- use cards for each mentor assignment and review item
- show the item title, student name, status, and key dates
- show help text for `Clarification requested` and `Rejected`

### 8.4 Reference content

Deliverables:
- more readable reference content layout
- clearly separated sections and headings
- search/filter chips for content categories
- a simple empty state if no content is available

UI changes:
- wrap long text in `Column` with `padding` and `verticalArrangement`
- provide a `Search` text field at the top
- use cards or surfaces for each reference topic

### 8.5 Screen layout consistency

Ensure all screens use the same:
- horizontal padding
- vertical spacing units
- header treatment
- card elevation
- typography hierarchy
- icon style and sizes

---

## 9. Phase 3 — States and feedback

### 9.1 Loading states

Deliverables:
- skeleton or placeholder UI for initial content load
- button disable states while network actions run
- full-screen progress indicator for startup flows

Details:
- add a `LoadingScreen` Composable for data fetching states
- add placeholder cards for `MyPassportScreen` and `ReferenceContentScreen`
- show `CircularProgressIndicator` inside action buttons when in progress

### 9.2 Empty states

Deliverables:
- friendly empty states for no passport, no mentor items, and no reference content
- `Try again` or `Refresh` calls to action

Details:
- use soft illustrations, icons, and clear copy
- keep the tone supportive rather than punitive
- add a `No items yet` card for empty passport sections

### 9.3 Error states

Deliverables:
- persistent inline error banners for failed loads
- retry retry actions and recovery suggestions
- clear distinction between validation errors and network errors

Details:
- add a shared `ErrorBanner` Composable
- use `MaterialTheme.colorScheme.errorContainer` where available
- provide `Retry` buttons on load failure screens

### 9.4 Success feedback

Deliverables:
- toast/snackbar or in-screen confirmation for actions
- visible state change after `Save Draft`, `Submit`, `Respond`, and `Share PDF`
- subtle success animation or icon change

Details:
- create a `UiMessage` model and snackbar host in `DgleaScaffold`
- show transient confirmation for completed actions
- use a success badge or inline copy for saved drafts

---

## 10. Phase 4 — Accessibility and polish

### 10.1 Dark mode

Deliverables:
- intentional dark theme palette
- consistent contrast for text and surfaces
- themed icons and cards

Details:
- update `Theme.kt` to support both light and dark schemes
- verify all screens in dark mode using the emulator
- ensure text, chips, and buttons meet WCAG-like contrast ratios

### 10.2 Accessibility

Deliverables:
- screen reader-friendly labels
- tappable controls with 48dp minimum hit area
- semantic structure for headings and form fields

Details:
- add `contentDescription` on icons and action controls
- use `semantics` for dynamic content and error messages
- ensure form fields announce validation state correctly

### 10.3 Polish

Deliverables:
- aligned spacing and grid rhythm
- standardized card elevation and shadows
- intentional motion and transitions

Details:
- use consistent `padding` across all screen sections
- animate screen transitions with `Crossfade` or `AnimatedVisibility`
- ensure `Button` and `Card` styling is consistent across UI

---

## 11. Phase 5 — Quality, QA, and launch preparation

### 11.1 Quality guardrails

Deliverables:
- all UI changes pass compile and lint checks
- app behavior remains functionally identical to current flows
- visual regressions are minimized

Details:
- keep the same backend contracts intact
- avoid any UI changes that require backend API updates
- verify no new debug-only behavior is exposed in production build

### 11.2 Testing and verification

Deliverables:
- manual verification on a physical or emulated Android device
- smoke test for sign-in, passport refresh, PDF download, and review actions
- walkthrough of dark mode and accessibility states

Details:
- run `./gradlew :app:assembleDebug`
- run `./gradlew :app:test`
- manually verify the sign-in screen, passport overview, and mentor queue

### 11.3 Documentation and handoff

Deliverables:
- update this roadmap with implementation notes
- add a short `README` or `UX NOTES` section into `apps/android/README.md`
- commit the design tokens and reusable component guidelines

Details:
- document any new shared composables in comments or a dedicated `ui/README.md`
- add a short section to `apps/android/README.md` titled "Android UX system"
- note any future UX scope such as `Profile`, `Notifications`, or `Lodge admin` screens

---

## 12. Suggested sprint cadence

### Sprint 1
- complete Phase 1 foundation work
- update theme tokens and shared component primitives
- redesign the sign-in screen
- verify the app builds and runs

### Sprint 2
- redesign `MyPassportScreen`
- add loading/empty/error states for passport data
- improve the PDF share action UI

### Sprint 3
- redesign mentor review and profile/progress screens
- polish reference content layout
- add dark mode and accessibility fixes

### Sprint 4
- finish polish and QA
- document the new UI system
- hand off or merge with a clean PR

---

## 13. Acceptance criteria

- `apps/android/app` builds successfully in `debug` and `release`
- the sign-in flow remains functional and new UI is consistent
- passport overview is readable, with clear status and actions
- mentor review and reference content screens are visually improved
- dark mode works and has no broken layouts
- accessibility labels exist for icons and primary actions
- loading, empty, and error states are present and useful
- changes are documented in `docs/04-ux/DGLEA_Masonic_Passport_Android_UX_Beauty_Roadmap_v1.md`

---

## 14. Additional notes

- The app should not be rewritten in Flutter as the first step. This plan intentionally improves the current Compose app.
- Keep backend integration and auth flow as-is. The UX work is presentation-layer only.
- The current `apps/web-admin` folder remains out of scope until the Android UX is settled.
- Future work can include notifications, offline cache, PDF preview, and a web admin UI.
