import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3000; // Fixed to port 3000

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GitHub Job Matcher API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Express Server running on http://localhost:${PORT}`);
});