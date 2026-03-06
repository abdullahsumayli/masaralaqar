import Database from "better-sqlite3";
import { logger } from "../utils/logger.js";

const db = new Database("masar-ai.sqlite");

db.pragma("journal_mode = WAL");

const init = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      phone TEXT PRIMARY KEY,
      city TEXT,
      property_type TEXT,
      purpose TEXT,
      budget TEXT,
      last_message_hash TEXT,
      last_message_id TEXT,
      last_message_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      city TEXT,
      property_type TEXT,
      purpose TEXT,
      budget TEXT,
      message TEXT,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      city TEXT,
      property_type TEXT,
      price TEXT,
      image TEXT,
      link TEXT
    );
  `);

  logger.info("Database initialized");
};

export { db, init };
