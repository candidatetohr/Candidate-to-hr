import { extractTextFromPDF } from '../services/pdfService.js';
import {
  analyzeResume,
  analyzeSkillsGap,
  optimizeForATS,
  generateInterviewQuestions,
  tailorResumeToJob,
  analyzeCareerFit,
  decodeRejection,
  evaluateProject,
  buildPersonalBrand,
  generateLearningPath,
  predictPlacement,
  detectResumeLies,
  evaluateCultureFit,
  negotiateOffer,
  buildNetworkStrategy,
  analyzePortfolio,
  analyzeSkillsGapPublic,
} from '../services/nvidiaAI.js';
import axios from 'axios';
import { rotateApiKey, getCurrentKey } from '../services/nvidiaAI.js';

const NIM_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NIM_MODEL = 'meta/llama-3.1-8b-instruct';

// ─── 1. FULL ANALYSIS ─────────────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/analyze
 * Public — no auth. Body (multipart/form-data): resume (PDF), jobTitle?, jobDescription?
 */
export const analyzeResumePublic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
    }

    const jobTitle = req.body.jobTitle?.trim() || 'General Position';
    const jobDescription = req.body.jobDescription?.trim() ||
      'We are looking for a skilled professional with relevant experience and a strong educational background. The ideal candidate should have excellent communication skills and be able to work effectively in a team environment.';

    // Extract text from PDF
    let resumeText;
    try {
      resumeText = await extractTextFromPDF(req.file.buffer);
    } catch {
      return res.status(422).json({ success: false, message: 'Could not read the PDF. Please ensure it is a valid, text-based PDF.' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(422).json({ success: false, message: 'Resume appears to be empty or could not be parsed. Please try a different PDF.' });
    }

    // Run core analyses in parallel
    const [analysisResult, skillsGapResult, interviewQsResult] = await Promise.all([
      analyzeResume(resumeText, jobDescription, [], []),
      analyzeSkillsGap(resumeText, [], []),
      generateInterviewQuestions(resumeText, jobDescription, jobTitle),
    ]);

    // ATS optimizer uses the score from analysis
    const optimizerResult = await optimizeForATS(
      resumeText,
      jobDescription,
      analysisResult.overallScore
    );

    res.json({
      success: true,
      data: {
        jobTitle,
        resumeText, // ← returned so client can use for tailor/chat/career intel
        analysis: analysisResult,
        skillsGap: skillsGapResult,
        interviewQuestions: interviewQsResult,
        optimizer: optimizerResult,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── 2. RESUME TAILOR ─────────────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/tailor
 * Public — no auth. Body: { resumeText, jobDescription, jobTitle }
 */
export const tailorResume = async (req, res, next) => {
  try {
    const { resumeText, jobDescription, jobTitle } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'resumeText is required.' });
    }
    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({ success: false, message: 'Please provide a job description to tailor against.' });
    }

    const result = await tailorResumeToJob(
      resumeText.trim(),
      jobDescription.trim(),
      jobTitle?.trim() || 'Target Role'
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 3. CAREER INTELLIGENCE ───────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/career-intelligence
 * Public — no auth. Body: { resumeText }
 */
export const careerIntelligence = async (req, res, next) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'resumeText is required.' });
    }

    const result = await analyzeCareerFit(resumeText.trim());
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 4. CAREER COACH STREAMING CHAT ──────────────────────────────────────────
/**
 * POST /api/resume-analyzer/chat
 * Public — no auth. Streams SSE.
 * Body: { message, context: { resumeText, jobTitle, analysis, history: [] } }
 */
export const chatWithCoach = async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'message is required.' });

    const { resumeText = '', jobTitle = 'the target role', analysis = {}, history = [] } = context;

    const systemPrompt = `You are Candidatetohr Career Coach — a world-class career advisor with deep expertise in resume optimization, job searching, salary negotiation, and career growth.

You have full context of this candidate's profile:
- Target Role: ${jobTitle}
- Resume ATS Score: ${analysis.overallScore || 'N/A'}/100
- Skills Match: ${analysis.skillsMatchScore || 'N/A'}/100
- Top Strengths: ${(analysis.strengths || []).slice(0, 3).join(', ') || 'N/A'}
- Missing Skills: ${(analysis.missingSkills || []).slice(0, 3).join(', ') || 'N/A'}
- Recommendation: ${analysis.recommendation || 'N/A'}
${resumeText ? `\nRESUME SUMMARY (first 1200 chars):\n${resumeText.substring(0, 1200)}` : ''}

You are conversational, encouraging, and brutally honest when needed. Give specific, actionable advice. Keep responses concise (2-4 paragraphs max). Use markdown for formatting (bullet points, bold text).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8), // Keep last 8 turns of conversation
      { role: 'user', content: message },
    ];

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Stream from NVIDIA NIM
    const nimResponse = await axios.post(
      `${NIM_BASE_URL}/chat/completions`,
      { model: NIM_MODEL, messages, stream: true, max_tokens: 1024, temperature: 0.7, top_p: 0.9 },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCurrentKey()}`,
        },
        responseType: 'stream',
        timeout: 90000,
      }
    );

    let buffer = '';
    nimResponse.data.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n');
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
        } catch { /* skip malformed chunks */ }
      }
    });

    nimResponse.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    nimResponse.data.on('error', (err) => {
      console.error('NIM stream error:', err.message);
      res.end();
    });

    req.on('close', () => nimResponse.data.destroy());

  } catch (err) {
    if (!res.headersSent) next(err);
    else res.end();
  }
};

// ─── 5. AI REJECTION DECODER ─────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/rejection-decoder
 * Body: { resumeText, jobDescription, rejectionEmail }
 */
export const analyzeRejection = async (req, res, next) => {
  try {
    const { resumeText, jobDescription, rejectionEmail } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, message: 'resumeText and jobDescription are required.' });
    }
    const result = await decodeRejection(resumeText, jobDescription, rejectionEmail);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 6. PROJECT EVALUATOR ────────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/project-evaluator
 * Body: { projectDescription }
 */
export const evaluateGitHubProject = async (req, res, next) => {
  try {
    const { projectDescription } = req.body;
    if (!projectDescription) {
      return res.status(400).json({ success: false, message: 'projectDescription is required.' });
    }
    const result = await evaluateProject(projectDescription);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 7. AI PERSONAL BRAND BUILDER ────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/brand-builder
 * Body: { resumeText }
 */
export const generatePersonalBrand = async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'resumeText is required.' });
    }
    const result = await buildPersonalBrand(resumeText);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 8. SKILL GAP ANALYZER 2.0 & LEARNING PATH ───────────────────────────────
/**
 * POST /api/resume-analyzer/learning-path
 * Body: { resumeText, targetRole, hoursPerWeek }
 */
export const createLearningPath = async (req, res, next) => {
  try {
    const { resumeText, targetRole, hoursPerWeek } = req.body;
    if (!resumeText || !targetRole) {
      return res.status(400).json({ success: false, message: 'resumeText and targetRole are required.' });
    }
    const result = await generateLearningPath(resumeText, targetRole, hoursPerWeek || 5);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 9. PLACEMENT PROBABILITY ENGINE ─────────────────────────────────────────
/**
 * POST /api/resume-analyzer/placement-probability
 * Body: { cgpa, degree, skills, projects }
 */
export const analyzePlacementProbability = async (req, res, next) => {
  try {
    const { cgpa, degree, skills, projects } = req.body;
    if (!skills || !projects) {
      return res.status(400).json({ success: false, message: 'skills and projects are required.' });
    }
    const result = await predictPlacement(cgpa || 'N/A', degree || 'N/A', skills, projects);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 10. AI RESUME TRUTH DETECTOR ────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/truth-detector
 * Body: { resumeText }
 */
export const analyzeResumeTruth = async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ success: false, message: 'resumeText is required.' });
    }
    const result = await detectResumeLies(resumeText);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 11. AI CULTURE FIT ANALYZER ─────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/culture-fit
 * Body: { resumeText, companyValues }
 */
export const analyzeCultureFitPublic = async (req, res, next) => {
  try {
    const { resumeText, companyValues } = req.body;
    if (!resumeText || !companyValues) {
      return res.status(400).json({ success: false, message: 'resumeText and companyValues are required.' });
    }
    const result = await evaluateCultureFit(resumeText, companyValues);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 12. AI OFFER NEGOTIATOR ──────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/offer-negotiator
 * Body: { offerDetails, targetSalary }
 */
export const analyzeOfferNegotiator = async (req, res, next) => {
  try {
    const { offerDetails, targetSalary } = req.body;
    if (!offerDetails || !targetSalary) {
      return res.status(400).json({ success: false, message: 'offerDetails and targetSalary are required.' });
    }
    const result = await negotiateOffer(offerDetails, targetSalary);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 13. AI NETWORK BUILDER ───────────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/network-builder
 * Body: { resumeText, networkingGoal }
 */
export const analyzeNetworkBuilder = async (req, res, next) => {
  try {
    const { resumeText, networkingGoal } = req.body;
    if (!resumeText || !networkingGoal) {
      return res.status(400).json({ success: false, message: 'resumeText and networkingGoal are required.' });
    }
    const result = await buildNetworkStrategy(resumeText, networkingGoal);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 14. AI PORTFOLIO OPTIMIZER ───────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/portfolio-optimizer
 * Body: { portfolioDetails, resumeText }
 */
export const analyzePortfolioOptimizer = async (req, res, next) => {
  try {
    const { portfolioDetails, resumeText } = req.body;
    if (!portfolioDetails || !resumeText) {
      return res.status(400).json({ success: false, message: 'portfolioDetails and resumeText are required.' });
    }
    const result = await analyzePortfolio(portfolioDetails, resumeText);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// ─── 15. SKILL GAP ANALYZER PUBLIC ────────────────────────────────────────────
/**
 * POST /api/resume-analyzer/skill-gap
 * Body: { resumeText, targetRole }
 */
export const analyzeSkillGapPublic = async (req, res, next) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || !targetRole) {
      return res.status(400).json({ success: false, message: 'resumeText and targetRole are required.' });
    }
    const result = await analyzeSkillsGapPublic(resumeText, targetRole);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
