import express from 'express';
import { analyzeRepository, checkRateLimit } from '../controllers/githubController.js';
import { scrapeJobs } from '../controllers/jobController.js';

const router = express.Router();

// POST /api/analyze
// Analyze a GitHub repository
router.post('/analyze', analyzeRepository);

// GET /api/rate-limit - Check GitHub API rate limit
router.get('/rate-limit', checkRateLimit);

// POST /
router.post('/scrape-jobs', scrapeJobs);

export default router;