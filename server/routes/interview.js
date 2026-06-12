import express from 'express';
import { gradeAnswer, sessionSummary } from '../controllers/interviewController.js';

const router = express.Router();

// Public — no auth
router.post('/grade', gradeAnswer);
router.post('/summary', sessionSummary);

export default router;
