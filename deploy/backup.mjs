// Nightly SQLite backup using the app's own better-sqlite3 (no sqlite3 CLI
// needed — the server is a minimized Ubuntu). Run from the repo root:
//   node deploy/backup.mjs
// Scheduled via the systemd user timer installed by deploy/install-timers.sh.
import { createRequire } from "node:module";
import { mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DB = process.env.DATABASE_PATH
  ? path.resolve(ROOT, process.env.DATABASE_PATH)
  : path.join(ROOT, "server", "data", "qrdock.db");
const OUT_DIR = path.join(ROOT, "backups");
const KEEP = 14;

if (!existsSync(DB)) {
  console.error(`no database at ${DB} — nothing to back up`);
  process.exit(0);
}

const require = createRequire(path.join(ROOT, "server", "package.json"));
const Database = require("better-sqlite3");

mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const dest = path.join(OUT_DIR, `qrdock-${stamp}.db`);

const db = new Database(DB, { readonly: true });
await db.backup(dest);
db.close();
console.log(`${new Date().toISOString()} backed up -> ${dest}`);

// rotate: keep newest KEEP
const old = readdirSync(OUT_DIR)
  .filter((f) => /^qrdock-\d{4}-\d{2}-\d{2}\.db$/.test(f))
  .sort()
  .reverse()
  .slice(KEEP);
for (const f of old) {
  rmSync(path.join(OUT_DIR, f));
  console.log(`rotated out ${f}`);
}
