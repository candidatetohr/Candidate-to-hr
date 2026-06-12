import { gradeInterviewAnswer, summarizeInterviewSession } from '../services/nvidiaAI.js';

/**
 * POST /api/interview/grade
 * Public — no auth.
 * Body: { question, answer, category, jobTitle }
 */
export const gradeAnswer = async (req, res, next) => {
  try {
    const { question, answer, category = 'general', jobTitle = 'Software Engineer' } = req.body;
    if (!question) return res.status(400).json({ success: false, message: 'question is required.' });

    const result = await gradeInterviewAnswer(question, answer || '', category, jobTitle);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/interview/summary
 * Public — no auth.
 * Body: { session: [{question, answer, grade, category}], jobTitle }
 */
export const sessionSummary = async (req, res, next) => {
  try {
    const { session = [], jobTitle = 'Software Engineer' } = req.body;
    if (!session.length) {
      return res.status(400).json({ success: false, message: 'session data is required.' });
    }

    const result = await summarizeInterviewSession(session, jobTitle);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
