// Vérifications minimales de non-régression contre un serveur `next start`
// déjà lancé (aucun framework de test n'existe encore dans ce dépôt).
// Usage : npm run build && npm run start -- -p 3300 & npm run smoke
// (BASE_URL par défaut : http://localhost:3000)

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

async function main() {
  console.log(`Smoke tests against ${BASE_URL}`);

  // 1. `/` must redirect to /login when logged out, and must not itself
  //    500 or hang in a loop.
  {
    const res = await fetch(`${BASE_URL}/`, { redirect: "manual" });
    const location = res.headers.get("location") ?? "";
    check("/ redirects (redirect status)", [307, 308].includes(res.status), `got ${res.status}`);
    check("/ redirects to /login when logged out", location.endsWith("/login"), `got "${location}"`);
  }

  // 2. `/login` must render (200), not crash, and not itself redirect
  //    (no redirect loop between / and /login).
  {
    const res = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
    check("/login returns 200", res.status === 200, `got ${res.status}`);
    const body = await res.text();
    for (const marker of CRASH_MARKERS) {
      check(`/login body does not contain crash marker "${marker}"`, !body.includes(marker));
    }
  }

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
