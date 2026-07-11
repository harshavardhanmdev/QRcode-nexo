import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { config } from "../config.js";

mkdirSync(path.dirname(path.resolve(config.DATABASE_PATH)), { recursive: true });

export const db = new Database(config.DATABASE_PATH);

db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");
db.pragma("foreign_keys = ON");
db.pragma("synchronous = NORMAL");
