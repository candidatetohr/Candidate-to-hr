import express from 'express';
import { getOverview, getScoreDistribution, getFunnel, getTimeToHire } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/scores', getScoreDistribution);
router.get('/funnel', getFunnel);
router.get('/time-to-hire', getTimeToHire);

export default router;
