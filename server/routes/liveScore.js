import express from 'express';
import { liveScore } from '../controllers/liveScoreController.js';

const router = express.Router();

// Public — no auth
router.post('/score', liveScore);

export default router;
