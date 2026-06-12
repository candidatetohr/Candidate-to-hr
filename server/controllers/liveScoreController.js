import { quickScoreText } from '../services/nvidiaAI.js';

/**
 * POST /api/live-score/score
 * Public — no auth. Accepts plain text, returns quick AI scores.
 * Body: { resumeText: string, jobDescription?: string }
 */
export const liveScore = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || resumeText.trim().length < 30) {
      return res.json({
        success: true,
        data: { overallScore: 0, skillsScore: 0, experienceScore: 0, communicationScore: 0, topIssue: 'Start typing your resume to see a live score.', topStrength: '', level: 'junior' },
      });
    }

    const result = await quickScoreText(resumeText.trim(), jobDescription?.trim() || '');

    res.json({
      success: true,
      data: {
        overallScore: Math.min(100, Math.max(0, result.overallScore || 0)),
        skillsScore: Math.min(100, Math.max(0, result.skillsScore || 0)),
        experienceScore: Math.min(100, Math.max(0, result.experienceScore || 0)),
        communicationScore: Math.min(100, Math.max(0, result.communicationScore || 0)),
        topIssue: result.topIssue || '',
        topStrength: result.topStrength || '',
        level: result.level || 'mid',
      },
    });
  } catch (err) {
    next(err);
  }
};
