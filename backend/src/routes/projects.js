import express from 'express';
const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await req.db.all('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await req.db.get('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new project
router.post('/', async (req, res) => {
  try {
    const { name, budget, start_date, status } = req.body;
    
    const result = await req.db.run(
      `INSERT INTO projects (name, budget, start_date, status) 
       VALUES (?, ?, ?, ?)`,
      [name, budget, start_date, status || 'Planning']
    );
    
    // Get the inserted project
    const project = await req.db.get('SELECT * FROM projects WHERE id = ?', [result.lastID]);
    
    // Log activity
    await req.db.run(
      'INSERT INTO activity_log (entity_type, entity_id, action) VALUES (?, ?, ?)',
      ['project', result.lastID, 'created']
    );
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, budget, status, progress_percent, spent } = req.body;
    
    await req.db.run(
      `UPDATE projects 
       SET name = ?, budget = ?, status = ?, progress_percent = ?, spent = ?
       WHERE id = ?`,
      [name, budget, status, progress_percent, spent, id]
    );
    
    const project = await req.db.get('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;