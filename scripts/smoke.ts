// Minimal non-regression checks against an already-running `next start`
// server (no test framework exists in this repo yet).
// Usage: npm run build && npm run start -- -p 3300 & npm run smoke
// (default BASE_URL: http://localhost:3000)

const BASE_URL = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";
const CRASH_MARKERS = ["This page couldn't load", "Application error: a client-side exception"];

let failures = 0;

function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function checkPage(path: string, expectedStatus = 200) {
  const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
  check(`${path} returns ${expectedStatus}`, res.status === expectedStatus, `got ${res.status}`);
  const body = await res.text();
  for (const marker of CRASH_MARKERS) {
    check(`${path} body does not contain crash marker "${marker}"`, !body.includes(marker));
  }
  return body;
}

async function main() {
  console.log(`Smoke tests against ${BASE_URL}`);

  // Public routes: must render directly, with no redirect and no login gate.
  for (const path of ["/", "/ecosystem", "/how-it-works", "/philosophy", "/private"]) {
    await checkPage(path);
  }

  // A known project route renders; an unknown slug 404s instead of crashing.
  await checkPage("/projects/purinstinct");
  await checkPage("/projects/this-project-does-not-exist", 404);

  // The private tool's own routes are untouched by the public rebuild:
  // still gated behind /login, and /login itself still renders safely
  // even without Firebase credentials configured.
  {
    const res = await fetch(`${BASE_URL}/carte`, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    check("/carte still redirects (protected)", [307, 308].includes(res.status), `got ${res.status}`);
    check("/carte still redirects to /login", location.endsWith("/login"), `got "${location}"`);
  }
  await checkPage("/login");

  if (failures > 0) {
    console.error(`\n${failures} smoke check(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll smoke checks passed.");
}

main().catch((err) => {
  console.error("Smoke script crashed:", err);
  process.exit(1);
});
