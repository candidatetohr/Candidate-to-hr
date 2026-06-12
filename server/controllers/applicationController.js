import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import {
  analyzeResume,
  generateInterviewQuestions,
  analyzeSkillsGap,
  optimizeForATS,
  rankCandidates,
  predictHireSuccess,
} from '../services/nvidiaAI.js';
import { sendApplicationConfirmation, sendStatusUpdateEmail } from '../services/emailService.js';

// @desc    Submit application with resume upload
// @route   POST /api/applications
// @access  Private
export const submitApplication = asyncHandler(async (req, res) => {
  const { jobId, candidateName, candidateEmail, candidatePhone, notes } = req.body;

  if (!jobId || !candidateName || !candidateEmail) {
    return res.status(400).json({ success: false, message: 'Job ID, candidate name, and email are required.' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
  }

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  // Check for duplicate application
  const existing = await Application.findOne({ jobId, candidateEmail: candidateEmail.toLowerCase() });
  if (existing) {
    return res.status(400).json({ success: false, message: 'This candidate has already applied for this job.' });
  }

  // Extract text from PDF
  let resumeText;
  try {
    resumeText = await extractTextFromPDF(req.file.buffer);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Create application with pending status
  const application = await Application.create({
    jobId,
    candidateName,
    candidateEmail: candidateEmail.toLowerCase(),
    candidatePhone,
    resumeFileName: req.file.originalname,
    resumeText,
    notes,
    analysisStatus: 'processing',
    submittedBy: req.user._id,
  });

  // Update job applicant count
  await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

  // Send confirmation email (non-blocking)
  sendApplicationConfirmation({
    candidateEmail: candidateEmail.toLowerCase(),
    candidateName,
    jobTitle: job.title,
    applicationId: application._id,
  }).catch(console.error);

  // Run AI analysis asynchronously (non-blocking response)
  res.status(201).json({
    success: true,
    message: 'Application submitted. AI analysis is running in the background.',
    data: application,
  });

  // AI analysis after response is sent
  try {
    const aiResult = await analyzeResume(
      resumeText,
      job.description,
      job.requirements,
      job.skills
    );

    await Application.findByIdAndUpdate(application._id, {
      aiAnalysis: aiResult,
      analysisStatus: 'completed',
    });

    // Recalculate average score for the job
    const apps = await Application.find({ jobId, analysisStatus: 'completed' });
    if (apps.length > 0) {
      const avgScore = apps.reduce((sum, a) => sum + (a.aiAnalysis?.overallScore || 0), 0) / apps.length;
      await Job.findByIdAndUpdate(jobId, { averageScore: Math.round(avgScore) });
    }
  } catch (err) {
    console.error('AI Analysis failed:', err.message);
    await Application.findByIdAndUpdate(application._id, { analysisStatus: 'failed' });
  }
});

// @desc    Bulk upload resumes
// @route   POST /api/applications/bulk
// @access  Private
export const bulkSubmitApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId || !req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Job ID and at least one resume file are required.' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const results = [];

  for (const file of req.files) {
    try {
      const resumeText = await extractTextFromPDF(file.buffer);
      const candidateName = file.originalname.replace('.pdf', '').replace(/_/g, ' ');

      const app = await Application.create({
        jobId,
        candidateName,
        candidateEmail: `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@placeholder.com`,
        resumeFileName: file.originalname,
        resumeText,
        analysisStatus: 'processing',
        submittedBy: req.user._id,
      });

      results.push({ file: file.originalname, applicationId: app._id, status: 'submitted' });

      // Async AI analysis
      analyzeResume(resumeText, job.description, job.requirements, job.skills)
        .then((aiResult) =>
          Application.findByIdAndUpdate(app._id, { aiAnalysis: aiResult, analysisStatus: 'completed' })
        )
        .catch(console.error);
    } catch (err) {
      results.push({ file: file.originalname, status: 'failed', error: err.message });
    }
  }

  await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: results.filter(r => r.status === 'submitted').length } });

  res.status(201).json({
    success: true,
    message: `Processed ${results.length} resumes. AI analysis running in background.`,
    data: results,
  });
});

// @desc    Get all applications for a job
// @route   GET /api/applications?jobId=
// @access  Private
export const getApplications = asyncHandler(async (req, res) => {
  const { jobId, status, minScore, maxScore, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;

  const query = {};
  if (jobId) query.jobId = jobId;
  if (status) query.status = status;
  if (minScore || maxScore) {
    query['aiAnalysis.overallScore'] = {};
    if (minScore) query['aiAnalysis.overallScore'].$gte = parseInt(minScore);
    if (maxScore) query['aiAnalysis.overallScore'].$lte = parseInt(maxScore);
  }

  const sortOrder = order === 'desc' ? -1 : 1;
  const sortField = sortBy === 'score' ? 'aiAnalysis.overallScore' : sortBy;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [applications, total] = await Promise.all([
    Application.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-resumeText'),
    Application.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: applications,
    pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
  });
});

// @desc    Get single application with full details
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId', 'title description requirements skills');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  res.json({ success: true, data: application });
});

// @desc    Update application pipeline status
// @route   PATCH /api/applications/:id/status
// @access  Private
export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const prevStatus = application.status;

  application.pipelineHistory.push({
    fromStatus: prevStatus,
    toStatus: status,
    changedBy: req.user._id,
    note: note || '',
  });

  application.status = status;
  await application.save();

  // Send email notification (non-blocking)
  sendStatusUpdateEmail({
    candidateEmail: application.candidateEmail,
    candidateName: application.candidateName,
    jobTitle: 'the position',
    newStatus: status,
    score: application.aiAnalysis?.overallScore,
  }).catch(console.error);

  res.json({ success: true, message: `Status updated to '${status}'.`, data: application });
});

// @desc    AI: Generate interview questions for a candidate
// @route   GET /api/applications/:id/interview-questions
// @access  Private
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId', 'title description');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  // Check if already generated and cached
  if (application.aiAnalysis?.interviewQuestions?.length > 0) {
    return res.json({ success: true, data: application.aiAnalysis.interviewQuestions, cached: true });
  }

  const questions = await generateInterviewQuestions(
    application.resumeText,
    application.jobId?.description || '',
    application.jobId?.title || 'the role'
  );

  // Cache in DB
  await Application.findByIdAndUpdate(req.params.id, {
    'aiAnalysis.interviewQuestions': questions,
  });

  res.json({ success: true, data: questions, cached: false });
});

// @desc    AI: Skills gap analysis
// @route   GET /api/applications/:id/skills-gap
// @access  Private
export const getSkillsGap = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId', 'requirements skills');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  if (application.aiAnalysis?.skillsGapAnalysis?.criticalGaps?.length > 0) {
    return res.json({ success: true, data: application.aiAnalysis.skillsGapAnalysis, cached: true });
  }

  const gapAnalysis = await analyzeSkillsGap(
    application.resumeText,
    application.jobId?.requirements || [],
    application.jobId?.skills || []
  );

  await Application.findByIdAndUpdate(req.params.id, {
    'aiAnalysis.skillsGapAnalysis': gapAnalysis,
  });

  res.json({ success: true, data: gapAnalysis, cached: false });
});

// @desc    AI: ATS score optimizer
// @route   GET /api/applications/:id/optimizer
// @access  Private
export const getATSOptimizer = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId', 'description');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const optimization = await optimizeForATS(
    application.resumeText,
    application.jobId?.description || '',
    application.aiAnalysis?.overallScore || 0
  );

  res.json({ success: true, data: optimization });
});

// @desc    AI: Rank all candidates for a job
// @route   GET /api/applications/rank?jobId=
// @access  Private
export const rankApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ success: false, message: 'jobId is required.' });
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const applications = await Application.find({ jobId, analysisStatus: 'completed' })
    .sort({ 'aiAnalysis.overallScore': -1 });

  if (applications.length === 0) {
    return res.json({ success: true, data: [], message: 'No analyzed applications found.' });
  }

  const ranking = await rankCandidates(applications, job.title, job.requirements);

  res.json({
    success: true,
    data: {
      rankedApplications: applications.map((a, i) => ({
        rank: i + 1,
        _id: a._id,
        candidateName: a.candidateName,
        overallScore: a.aiAnalysis?.overallScore || 0,
        recommendation: a.aiAnalysis?.recommendation,
        status: a.status,
      })),
      aiRankingInsights: ranking,
    },
  });
});

// @desc    AI: Hire success prediction
// @route   GET /api/applications/:id/hire-prediction
// @access  Private
export const getHirePrediction = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('jobId', 'title requirements');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  if (!application.aiAnalysis?.overallScore) {
    return res.status(400).json({ success: false, message: 'AI analysis must complete before hire prediction.' });
  }

  const prediction = await predictHireSuccess(
    application.candidateName,
    application.aiAnalysis,
    application.jobId?.title || 'the role',
    application.jobId?.requirements || []
  );

  res.json({ success: true, data: prediction });
});
