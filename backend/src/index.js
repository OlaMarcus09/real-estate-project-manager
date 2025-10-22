import express from 'express';
import cors from 'cors';
import { initDB, db } from './config/database.js';
import projectRoutes from './routes/projects.js';
import workerRoutes from './routes/workers.js';
import vendorRoutes from './routes/vendors.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/vendors', vendorRoutes);

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
  });
});
