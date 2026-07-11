import { db } from "./connection.js";

/**
 * Ordered migrations; `PRAGMA user_version` tracks the last applied index.
 * Append only — never edit an applied migration.
 */
const migrations: string[] = [
  // 001 — initial schema
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    pw_hash TEXT,
    google_sub TEXT UNIQUE,
    plan TEXT NOT NULL DEFAULT 'free',
    created_at INTEGER NOT NULL,
    last_login_at INTEGER
  );

  CREATE TABLE sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    ua TEXT,
    revoked_at INTEGER
  );
  CREATE INDEX idx_sessions_user ON sessions(user_id);

  CREATE TABLE designs (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    kind TEXT NOT NULL CHECK(kind IN ('qr','barcode')),
    config_json TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX idx_designs_user ON designs(user_id, updated_at DESC);

  CREATE TABLE dynamic_qrs (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    destination TEXT NOT NULL,
    name TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX idx_dynamic_user ON dynamic_qrs(user_id, created_at DESC);

  CREATE TABLE scans (
    id INTEGER PRIMARY KEY,
    qr_id TEXT NOT NULL REFERENCES dynamic_qrs(id) ON DELETE CASCADE,
    ts INTEGER NOT NULL,
    country TEXT,
    device TEXT,
    is_bot INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX idx_scans_qr_ts ON scans(qr_id, ts);

  CREATE TABLE quota_counters (
    bucket TEXT NOT NULL,
    day TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, day)
  );

  CREATE TABLE contact_messages (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    message TEXT,
    ip_hash TEXT,
    created_at INTEGER NOT NULL
  );
  `,
];

export function migrate(): void {
  const current = db.pragma("user_version", { simple: true }) as number;
  for (let i = current; i < migrations.length; i++) {
    db.transaction(() => {
      db.exec(migrations[i]);
      db.pragma(`user_version = ${i + 1}`);
    })();
    console.log(`migrated to version ${i + 1}`);
  }
}

// Run directly (`node dist/db/migrate.js`) or imported by index.ts.
migrate();
