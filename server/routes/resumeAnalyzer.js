import express from 'express';
import {
  analyzeResumePublic,
  tailorResume,
  careerIntelligence,
  chatWithCoach,
  analyzeRejection,
  evaluateGitHubProject,
  generatePersonalBrand,
  createLearningPath,
  analyzePlacementProbability,
  analyzeResumeTruth,
} from '../controllers/resumeAnalyzerController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All public — no auth middleware
router.post('/analyze', uploadSingle, analyzeResumePublic);
router.post('/tailor', tailorResume);
router.post('/career-intelligence', careerIntelligence);
router.post('/chat', chatWithCoach);
router.post('/rejection-decoder', analyzeRejection);
router.post('/project-evaluator', evaluateGitHubProject);
router.post('/brand-builder', generatePersonalBrand);
router.post('/learning-path', createLearningPath);
router.post('/placement-probability', analyzePlacementProbability);
router.post('/truth-detector', analyzeResumeTruth);

export default router;
