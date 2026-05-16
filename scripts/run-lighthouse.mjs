#!/usr/bin/env node
/**
 * Run Lighthouse against the web app and write reports under docs/qa/.
 * Usage:
 *   npm run perf:lighthouse
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:5174 npm run perf:lighthouse
 *
 * Start the web app first (e.g. npm run dev -w @todo/web -- --port 5174)
 * or set PLAYWRIGHT_BASE_URL to a running instance.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "docs", "qa");
const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5174";
const url = baseUrl.replace(/\/$/, "") + "/";

async function waitForUrl(target, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(target, { signal: AbortSignal.timeout(2_000) });
      if (res.ok || res.status === 304) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1_000));
  }
  throw new Error(`App not reachable at ${target} — start the web dev server first.`);
}

async function runLighthouse() {
  const chromeLauncher = await import("chrome-launcher");
  const lighthouse = (await import("lighthouse")).default;

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox"],
  });
  try {
    const options = {
      logLevel: "error",
      output: "json",
      onlyCategories: ["performance", "accessibility"],
      port: chrome.port,
    };
    const runnerResult = await lighthouse(url, options);
    const reportJson = runnerResult.report;
    const lhr = JSON.parse(reportJson);

    await mkdir(outDir, { recursive: true });
    const jsonPath = join(outDir, "lighthouse-latest.json");
    await writeFile(jsonPath, reportJson, "utf8");

    const perf = lhr.categories.performance?.score ?? null;
    const a11y = lhr.categories.accessibility?.score ?? null;
    const perfPct = perf === null ? "n/a" : `${Math.round(perf * 100)}`;
    const a11yPct = a11y === null ? "n/a" : `${Math.round(a11y * 100)}`;

    const summaryPath = join(outDir, "lighthouse-summary.md");
    const summary = `# Lighthouse snapshot

**Captured**: ${new Date().toISOString()}  
**URL**: ${url}  
**JSON**: [lighthouse-latest.json](./lighthouse-latest.json)

| Category | Score |
| -------- | ----- |
| Performance | ${perfPct} |
| Accessibility | ${a11yPct} |
`;
    await writeFile(summaryPath, summary, "utf8");

    console.log(`Lighthouse performance: ${perfPct}`);
    console.log(`Lighthouse accessibility: ${a11yPct}`);
    console.log(`Wrote ${jsonPath}`);
    console.log(`Wrote ${summaryPath}`);
    console.log("Merge scores into docs/qa/performance-report.md if needed.");
  } finally {
    await chrome.kill();
  }
}

async function main() {
  console.log(`Waiting for ${url} ...`);
  await waitForUrl(url);
  await runLighthouse();
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
