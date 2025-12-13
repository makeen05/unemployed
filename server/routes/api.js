import express from 'express';
import { analyzeRepository, checkRateLimit } from '../controllers/githubController.js';

const router = express.Router();

// POST /api/analyze
// Analyze a GitHub repository
router.post('/analyze', analyzeRepository);

// GET /api/rate-limit - Check GitHub API rate limit
router.get('/rate-limit', checkRateLimit);

export default router;