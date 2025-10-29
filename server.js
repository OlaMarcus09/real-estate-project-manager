const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        units INTEGER,
        status VARCHAR(50) DEFAULT 'Planning',
        budget DECIMAL(15,2),
        spent DECIMAL(15,2) DEFAULT 0,
        start_date DATE,
        progress_percent INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS workers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        hourly_rate DECIMAL(10,2),
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        hours_worked DECIMAL(10,2) DEFAULT 0,
        contact VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        contact VARCHAR(255),
        rating INTEGER DEFAULT 5,
        total_spent DECIMAL(15,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        quantity INTEGER DEFAULT 0,
        unit_price DECIMAL(10,2),
        min_stock INTEGER DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

initDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Real Estate API is running',
    currency: 'Nigerian Naira (₦)',
    version: '2.0.0'
  });
});

// PROJECTS ENDPOINTS
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const { name, budget, start_date, status, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (name, budget, start_date, status, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, budget, start_date, status, location]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { name, budget, spent, start_date, status, progress_percent } = req.body;
  try {
    const result = await pool.query(
      'UPDATE projects SET name=$1, budget=$2, spent=$3, start_date=$4, status=$5, progress_percent=$6 WHERE id=$7 RETURNING *',
      [name, budget, spent, start_date, status, progress_percent, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// WORKERS ENDPOINTS - UPDATED TO MATCH FRONTEND
app.get('/api/workers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/workers', async (req, res) => {
  const { name, role, hourly_rate, contact } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO workers (name, role, hourly_rate, contact) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, hourly_rate, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/workers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, hourly_rate, contact } = req.body;
  try {
    const result = await pool.query(
      'UPDATE workers SET name=$1, role=$2, hourly_rate=$3, contact=$4 WHERE id=$5 RETURNING *',
      [name, role, hourly_rate, contact, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/workers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM workers WHERE id=$1', [id]);
    res.json({ message: 'Worker deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VENDORS ENDPOINTS
app.get('/api/vendors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vendors', async (req, res) => {
  const { name, category, contact, rating } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO vendors (name, category, contact, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, contact, rating]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, contact, rating } = req.body;
  try {
    const result = await pool.query(
      'UPDATE vendors SET name=$1, category=$2, contact=$3, rating=$4 WHERE id=$5 RETURNING *',
      [name, category, contact, rating, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM vendors WHERE id=$1', [id]);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INVENTORY ENDPOINTS
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inventory', async (req, res) => {
  const { name, category, quantity, unit_price, min_stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, category, quantity, unit_price, min_stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, quantity, unit_price, min_stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, quantity, unit_price, min_stock } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inventory SET name=$1, category=$2, quantity=$3, unit_price=$4, min_stock=$5 WHERE id=$6 RETURNING *',
      [name, category, quantity, unit_price, min_stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM inventory WHERE id=$1', [id]);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ANALYTICS ENDPOINT
app.get('/api/analytics', async (req, res) => {
  try {
    const projectsCount = await pool.query('SELECT COUNT(*) FROM projects');
    const workersCount = await pool.query('SELECT COUNT(*) FROM workers');
    const vendorsCount = await pool.query('SELECT COUNT(*) FROM vendors');
    const inventoryCount = await pool.query('SELECT COUNT(*) FROM inventory');
    const totalBudget = await pool.query('SELECT COALESCE(SUM(budget), 0) as total FROM projects');
    const totalSpent = await pool.query('SELECT COALESCE(SUM(spent), 0) as total FROM projects');

    res.json({
      projects: parseInt(projectsCount.rows[0].count),
      workers: parseInt(workersCount.rows[0].count),
      vendors: parseInt(vendorsCount.rows[0].count),
      inventory: parseInt(inventoryCount.rows[0].count),
      total_budget: parseFloat(totalBudget.rows[0].total),
      total_spent: parseFloat(totalSpent.rows[0].total),
      currency: 'NGN'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Real Estate API running on port ${PORT}`);
  console.log(`💰 Currency: Nigerian Naira (₦)`);
  console.log(`🌍 Health check: http://localhost:${PORT}/api/health`);
});
