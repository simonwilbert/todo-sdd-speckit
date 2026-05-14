import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/**
 * Runs axe-core against the page and fails if any violation has impact
 * `critical` or `serious` (WCAG 2.1 AA gate per spec US5).
 */
export async function expectNoCriticalOrSeriousAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  if (violations.length === 0) return;
  const lines = violations.map(
    (v) => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`,
  );
  throw new Error(`Axe found critical or serious issues:\n${lines.join("\n")}`);
}
