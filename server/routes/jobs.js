import express from 'express';
import {
  getJobs, getJob, createJob, updateJob, deleteJob,
  generateJD, checkBias, getJobStats,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All job routes require auth

router.get('/stats', getJobStats);
router.route('/').get(getJobs).post(createJob);
router.post('/generate-jd', generateJD);
router.route('/:id').get(getJob).put(updateJob).delete(deleteJob);
router.post('/:id/generate-jd', generateJD);
router.get('/:id/bias-check', checkBias);

export default router;
