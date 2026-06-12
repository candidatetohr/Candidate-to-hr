import express from 'express';
import {
  submitApplication, bulkSubmitApplications, getApplications,
  getApplication, updateStatus, getInterviewQuestions,
  getSkillsGap, getATSOptimizer, rankApplications, getHirePrediction,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingle, uploadBulk } from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All application routes require auth

router.get('/rank', rankApplications);
router.post('/bulk', uploadBulk, bulkSubmitApplications);
router.route('/').get(getApplications).post(uploadSingle, submitApplication);
router.route('/:id').get(getApplication);
router.patch('/:id/status', updateStatus);
router.get('/:id/interview-questions', getInterviewQuestions);
router.get('/:id/skills-gap', getSkillsGap);
router.get('/:id/optimizer', getATSOptimizer);
router.get('/:id/hire-prediction', getHirePrediction);

export default router;
