import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export let db;

export const initDB = async () => {
  try {
    db = await open({
      filename: './real_estate.db',
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'Planning',
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        progress_percent INTEGER DEFAULT 0,
        start_date TEXT,
        end_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        hourly_rate REAL NOT NULL,
        contact TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vendors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        contact TEXT,
        rating INTEGER DEFAULT 5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER,
        vendor_id INTEGER,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT DEFAULT CURRENT_DATE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        stock_qty REAL DEFAULT 0,
        cost_per_unit REAL NOT NULL,
        project_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ SQLite database initialized successfully');
    
    // Add sample data
    const projectCount = await db.get('SELECT COUNT(*) as count FROM projects');
    if (projectCount.count === 0) {
      await db.run(
        'INSERT INTO projects (name, budget, status, progress_percent) VALUES (?, ?, ?, ?)',
        ['Sample Real Estate Project', 500000, 'Active', 25]
      );
      console.log('✅ Sample project added');
    }
  } catch (err) {
    console.error('❌ Database initialization error:', err);
  }
};
