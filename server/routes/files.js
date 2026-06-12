import express from 'express';
import { protect } from '../middleware/auth.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get PDF resume as buffer/stream (returns base64 or raw buffer)
// @route   GET /api/files/resume/:applicationId
// @access  Private
router.get('/resume/:applicationId', protect, asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.applicationId).select('resumeText resumeFileName');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  // Since we store in memory and don't persist the binary, return resume text
  res.json({
    success: true,
    data: {
      fileName: application.resumeFileName,
      textContent: application.resumeText,
    },
  });
}));

export default router;
