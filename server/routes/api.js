import express from 'express';
import { analyzeRepository, checkRateLimit } from '../controllers/githubController.js';
import { scrapeJobs } from '../controllers/jobController.js';

const router = express.Router();


router.post('/analyze', analyzeRepository);


router.get('/rate-limit', checkRateLimit);


router.post('/scrape-jobs', scrapeJobs);

export default router;