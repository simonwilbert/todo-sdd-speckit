# MVP accessibility review (manual)

**Date**: 2026-05-14  
**Feature**: 001-personal-todo-app  
**Complements**: Automated axe scans in `tests/e2e/journeys/us5.responsive-a11y.spec.ts` (critical + serious must be zero).

## Automated coverage

- `@axe-core/playwright` on empty home and populated list (mobile + desktop widths in the US5 spec).
- Component tests assert labelled controls and live regions where implemented (`TodoCreateForm`, `TodoItem`, etc.).

## Manual checks performed / recommended

| Check                                                                                 | Result / notes                                                                                                                          |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Keyboard-only** primary flow: skip link → new task → add → toggle complete → delete | Tab order uses visible skip link, form controls, and per-row actions; focus-visible styles present in `apps/web/src/styles/layout.css`. |
| **Screen reader** task-added and completion announcements                             | Polite live regions on create success and completion toggle; validation errors use `role="status"` on visible error text.               |
| **Touch targets (mobile)**                                                            | CSS min heights for buttons/inputs at narrow breakpoints; empty-state CTA covered in US5 e2e.                                           |
| **Zoom / reflow**                                                                     | Layout uses constrained shell; US5 e2e asserts no horizontal overflow on primary viewports.                                             |
| **Color contrast (non-text UI)**                                                      | Rely on axe + visual spot-check of completed vs incomplete task styling.                                                                |

## Residual risk

- Manual VoiceOver / NVDA passes on real devices are still recommended before a public beta.
- Third-party browser extensions can interfere with focus tests; use a clean profile when re-verifying.
