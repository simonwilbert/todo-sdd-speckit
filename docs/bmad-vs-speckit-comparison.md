# BMAD vs Spec Kit — plain comparison

I built essentially the same product twice: first with **BMAD** on **todo-sdd** (Next.js, Drizzle, that whole stack), then with **Spec Kit** in **this repo** (`todo-sdd-speckit`). This note is how they felt to me, not a methodology essay.

**What counts as the Spec Kit build here**

Feature **001** is the MVP (tasks, API, Postgres, Docker, tests, CI). Feature **002** is extra polish (tokens, layout). You can ignore 002 if you only care about “did Spec Kit ship a todo app.”

---

## How the work actually flowed

**BMAD (todo-sdd)**  
Work came in **epics and stories** with a PRD and architecture behind it. I did not live inside one rigid file chain. Instead there was a mix of **PRD language**, **architecture constraints**, and **story-sized chunks** — bootstrap, Drizzle + Docker, CRUD API + UI, responsive pass, accessibility, then QA and CI. AI did a lot of the scaffolding (routes, validation, components, tests, Playwright, workflows). I made the calls that mattered: e.g. keeping **DB access lazy** (`getDb()` style) instead of risky patterns at module load, aligning **ports and env** with what we actually run, tightening **error payloads and UX copy** to match the intent of the specs, and choosing **“critical only” for axe in Jest** while accepting that full WCAG would need manual follow-up. I also kept an **AI integration log** as a table: epic/story, what AI did, what I reviewed, what shipped. That was my traceability story — closer to “honest lab notebook” than to a single `spec.md`.

**Spec Kit (this repo)**  
Here the path is deliberately **linear**: constitution → `spec.md` → `plan.md` (+ OpenAPI, data model, quickstart) → **`tasks.md`** with numbered checkboxes grouped by user story. The “who speaks” is mostly **markdown**, not personas. When I work with the model, the next step is often obvious because **the task list already says what to do**. That is calming when you want less drift.

**In one sentence**  
BMAD for me was **stories + architecture + a log of who decided what**. Spec Kit is **one folder of spec artefacts + a long ordered task list** before you lean on the model for implementation.

---

## What landed on disk (artefacts)

**BMAD side (from memory of todo-sdd)**  
PRD-style requirements (including things like **FR-12 / SC-7** and traceability expectations), architecture notes, UX specs, **QA report**, **README** that pointed reviewers at the right places, and that **AI integration log** with epics (foundations, todo workflow, responsive, a11y, quality gates, setup, ops hardening, coverage uplift, E2E fixes). Tests and CI grew around **`npm run verify`**-style gates. I did **not** lean on a single OpenAPI file in the tree the way this Spec Kit repo does — contracts were more “proved by route tests + Playwright.”

**Spec Kit side (this repo)**  
Everything predictable lives under **`specs/001-personal-todo-app/`**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, **`contracts/openapi.yaml`**, `quickstart.md`, **`tasks.md`**. There is a short **`docs/ai-mcp-usage-log.md`** — useful, but much thinner than my BMAD integration table. The constitution in **`.specify/memory/constitution.md`** is the non-negotiable bar (tests, coverage, journeys, containers, etc.).

Neither pile is “wrong.” BMAD’s artefacts matched **how my course and reviewers wanted to see decisions**. Spec Kit’s tree matches **how Cursor and the Spec Kit commands want the repo laid out**.

---

## Team fit (solo, with AI)

I was effectively **solo with AI help** on both.

BMAD’s **personas** sometimes helped me sanity-check wording or roles, but day to day I was still just me deciding whether a generated PR or test was good enough. The **integration log** was where I wrote down “AI did X, I checked Y” — that mattered more to me than role-play.

Spec Kit felt best when I wanted **less narrative drift**: open `tasks.md`, do the next item, run **`npm run ci`**, move on. It can feel like homework up front.

If someone new cloned both repos, they might find **this Spec Kit layout faster to navigate** because filenames are boring and consistent. They might find **BMAD’s README + log + QA report** faster to understand **what a human actually signed off on** during the build.

---

## AI — what was different in practice

**BMAD**  
Slices were **story-sized or architectural** (bootstrap stack, migrations, CRUD, responsive, axe, Playwright, coverage uplift). The model wrote a lot; I reviewed for **real-world footguns**. Example: Playwright started failing on delete because the UI gained a **confirm step** — the old E2E still assumed one click. That is the kind of thing **AI missed until I fixed the spec of what “delete” meant in the test**. Another theme: **Next dev origins**, Turbopack quirks, **Docker `app` and Playwright both wanting port 3000** — I documented workarounds (stop the app container, or env to reuse a server). So BMAD + AI was powerful, but **framework and environment sharp edges** still needed a human paying attention.

**Spec Kit**  
The model gets **narrower prompts** because `tasks.md` is the backlog. **`docs/ai-mcp-usage-log.md`** here is only a few dated lines — fine for a small team, not the same accountability grid I kept on todo-sdd. I still have to remember to run **full E2E with a real `DATABASE_URL`** when I want confidence, not just CI defaults.

**What stayed true on both**  
Garbage in, garbage out. Clear goal in the prompt beats vague “make it better.”

---

## Strengths and weaknesses (how I see it)

**BMAD — what I liked**  
Good for **talking in product and epic language** first. Good when the course wants **explicit human vs AI accountability** (my log table did that job). Good when the stack is **Next + Drizzle + Compose** and half the battle is **documenting port clashes and verify scripts** for the next poor soul.

**BMAD — what annoyed me**  
Easy for artefacts to **spread** (README here, qa-report there, log elsewhere). Easy for **tests to lag a UX tweak** (confirm delete). You still have to **translate** “we shipped a story” into “CI is actually telling the truth.”

**Spec Kit — what I liked**  
**One spec folder**, **OpenAPI in repo**, **tasks.md** as a single spine. Very good when I want **repeatability** (feature 002 followed the same pattern as 001). Constitution + gates up front means fewer “we’ll add CI later” excuses.

**Spec Kit — what annoyed me**  
Up-front **rigidity**. This repo’s constitution still says **BMAD-anchored** in places while the workflow is Spec Kit — small confusion until someone cleans the wording.

---

## When I’d pick which (personal rule of thumb)

- Still **figuring out what we’re building**, lots of discovery → **BMAD-style** conversation and thin vertical slices, then freeze what matters.
- Already know the MVP, want **audit trail from requirement → test → merge** → **Spec Kit** (or something shaped like it).
- **Course submission** that grades **documentation of AI use** → I liked my **BMAD integration log**; Spec Kit’s short log would need **stretching** if the rubric wants that level of detail.

---

## Brief checklist (what the assignment wanted)

| Deliverable             | Where it lives                                         |
| ----------------------- | ------------------------------------------------------ |
| Spec Kit spec artefacts | `specs/001-personal-todo-app/` (+ optional `002`)      |
| Reimplemented app       | `apps/web`, `apps/api`, `packages/shared`, `tests/e2e` |
| This comparison         | You’re reading it                                      |

---

## Closing

**BMAD** on todo-sdd felt like **running a build with a story map and a lab notebook** — flexible, sometimes messy, very honest once I wrote down what AI did vs what I checked. **Spec Kit** here felt like **filing flight plans then flying the checklist** — less romantic, easier to not lose the plot. I’d use BMAD-flavoured workflow when **narrative and reviewer-facing logs** matter most; I’d use Spec Kit when I want **the repo itself to be the single spine** from spec to CI.
