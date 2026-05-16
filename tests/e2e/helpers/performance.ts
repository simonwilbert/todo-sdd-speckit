/**
 * Success-criteria timing budgets (spec 001 SC-001, SC-003, SC-004).
 * CI runners are slower — use relaxed limits when `CI` is set.
 */
export const perfBudgetMs = {
  /** SC-004: primary screen interactive (new-task field visible). */
  primaryInteractive: process.env.CI ? 4_000 : 2_000,
  /** SC-001: capture task from ready UI to row visible in list. */
  captureTask: process.env.CI ? 8_000 : 5_000,
  /** SC-003: UI reflects toggle within budget. */
  stateChange: process.env.CI ? 2_000 : 1_000,
} as const;

export function elapsedMs(start: number): number {
  return Date.now() - start;
}
