import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../../publishers.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

export const getDb = (): DatabaseType => db;

export const initDatabase = () => {
  // Create publishers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS publishers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publisher_id TEXT UNIQUE NOT NULL,
      alias_name TEXT NOT NULL,
      file_name TEXT,
      is_active INTEGER DEFAULT 1,
      publisher_dashboard TEXT,
      monitor_dashboard TEXT,
      qa_status_dashboard TEXT,
      custom_css TEXT,
      tags TEXT,
      allowed_domains TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create pages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publisher_id TEXT NOT NULL,
      page_type TEXT NOT NULL,
      selector TEXT NOT NULL,
      position TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE CASCADE
    )
  `);

  // Create audit_logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      publisher_id TEXT NOT NULL,
      action TEXT NOT NULL,
      field_name TEXT,
      old_value TEXT,
      new_value TEXT,
      changed_by TEXT NOT NULL,
      changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_publishers_publisher_id ON publishers(publisher_id);
    CREATE INDEX IF NOT EXISTS idx_publishers_alias_name ON publishers(alias_name);
    CREATE INDEX IF NOT EXISTS idx_pages_publisher_id ON pages(publisher_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_publisher_id ON audit_logs(publisher_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at);
  `);

  console.log("✓ Database initialized successfully");
};

export const closeDatabase = () => {
  db.close();
};
