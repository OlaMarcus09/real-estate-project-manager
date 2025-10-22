import express from 'express';
import cors from 'cors';
import { initDB, db } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Projects routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await req.db.all('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, budget, start_date, status } = req.body;
    const result = await req.db.run(
      'INSERT INTO projects (name, budget, start_date, status) VALUES (?, ?, ?, ?)',
      [name, budget, start_date, status || 'Planning']
    );
    const project = await req.db.get('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'SQLite'
  });
});

// Initialize and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 Projects API: http://localhost:${PORT}/api/projects`);
  });
});
