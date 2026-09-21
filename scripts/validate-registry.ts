// Lightweight registry tests — no test framework exists in this repo yet.
// Run with: npm run validate:registry
import { PROJECTS, type ProjectStatus } from "../src/data/projects";

const VALID_STATUSES: ProjectStatus[] = ["LIVE", "ACTIVE", "PRIVATE_PREVIEW", "IN_DEVELOPMENT", "CONCEPT", "FUTURE"];
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let failures = 0;
function check(label: string, condition: boolean, detail?: string) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log(`Validating ${PROJECTS.length} project registry entries.\n`);

// Unique slugs
const slugCounts = new Map<string, number>();
for (const p of PROJECTS) slugCounts.set(p.slug, (slugCounts.get(p.slug) ?? 0) + 1);
const duplicates = [...slugCounts.entries()].filter(([, count]) => count > 1).map(([slug]) => slug);
check("all slugs are unique", duplicates.length === 0, duplicates.join(", "));

for (const p of PROJECTS) {
  check(`${p.slug}: slug is kebab-case`, SLUG_PATTERN.test(p.slug));
  check(`${p.slug}: status is a valid enum value`, VALID_STATUSES.includes(p.status), p.status);
  check(`${p.slug}: title is non-empty`, p.title.trim().length > 0);
  check(`${p.slug}: summary is non-empty`, p.summary.trim().length > 0);
  check(
    `${p.slug}: officialUrl is either null or a well-formed https URL`,
    p.officialUrl === null || /^https:\/\/.+/.test(p.officialUrl),
    p.officialUrl ?? "null"
  );
  check(`${p.slug}: ctaLabel is never the generic "Learn more"`, p.ctaLabel.trim().toLowerCase() !== "learn more");
  check(
    `${p.slug}: every relationship points at a real, visible slug`,
    p.relationships.every((slug) => PROJECTS.some((other) => other.slug === slug && other.visibility)),
    p.relationships.join(", ")
  );
  check(
    `${p.slug}: LIVE status implies a real official URL`,
    p.status !== "LIVE" || Boolean(p.officialUrl),
    "LIVE project with no officialUrl"
  );
  check(
    `${p.slug}: route would render — /projects/${p.slug}`,
    /^[a-z0-9-]+$/.test(p.slug)
  );
}

console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
process.exit(failures === 0 ? 0 : 1);
