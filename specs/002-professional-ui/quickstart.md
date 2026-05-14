# Quickstart: Professional UI refresh (002)

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Prerequisite**: Working [001 quickstart](../001-personal-todo-app/quickstart.md) (app runs, tests pass).

## 1. Install (repo root)

```bash
npm ci
```

## 2. Run the web app locally

```bash
# With API + DB per 001, or web-only against existing API:
npm run dev -w @todo/web
```

Open the printed local URL (typically `http://127.0.0.1:5173`).

## 3. Visual verification (SC-103 checklist)

At **≤390 px** and **≥1280 px** viewport width:

1. Typography hierarchy reads clearly (title > label > body > secondary).
2. Spacing feels consistent between list, form, and empty/error blocks.
3. Primary button and text field look like one system (radii, borders, accent).
4. Completed tasks are visually distinct but still readable.
5. Focus tab through: skip link → new task → add → row controls; focus ring visible.
6. Resize slowly: no clipped primary controls; no horizontal scroll for primary flows.

## 4. Automated regression (required before merge)

```bash
npm run ci
```

With `DATABASE_URL` set and API available (see 001 quickstart), run Playwright including axe-sensitive specs:

```bash
npm run e2e
```

**Pass bar**: zero **critical** and **serious** axe violations on primary screens; all existing journey specs still pass.

## 5. Optional: reduced motion

In DevTools → Rendering → **Emulate CSS media feature `prefers-reduced-motion`**: confirm no distracting motion on transitions you add.

## 6. Where to edit

| Concern       | Location                                                                 |
| ------------- | ------------------------------------------------------------------------ |
| Design tokens | `apps/web/src/styles/tokens.css`                                         |
| Global layout | `apps/web/src/styles/layout.css`                                         |
| Components    | `apps/web/src/components/*.tsx` (class names / structure only as needed) |
| Copy          | Same components + `HomePage`                                             |
