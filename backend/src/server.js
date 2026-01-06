import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import noteRoutes from './routes/notes.js';
import postRoutes from './routes/posts.js';
dotenv.config();
connectDB();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/posts', postRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Judix API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      notes: '/api/notes',
      posts: '/api/posts',
      health: '/api/health',
    },
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
