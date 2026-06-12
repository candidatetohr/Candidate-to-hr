import express from 'express';
import { generateResume } from '../controllers/resumeBuilderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateResume);

export default router;
