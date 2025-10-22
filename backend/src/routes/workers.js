import express from 'express';
const router = express.Router();

// GET all workers
router.get('/', async (req, res) => {
  try {
    const workers = await req.db.all('SELECT * FROM workers ORDER BY created_at DESC');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new worker
router.post('/', async (req, res) => {
  try {
    const { name, role, hourly_rate, contact } = req.body;
    const result = await req.db.run(
      'INSERT INTO workers (name, role, hourly_rate, contact) VALUES (?, ?, ?, ?)',
      [name, role, hourly_rate, contact]
    );
    const worker = await req.db.get('SELECT * FROM workers WHERE id = ?', [result.lastID]);
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
