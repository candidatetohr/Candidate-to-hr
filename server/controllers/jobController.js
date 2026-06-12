import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateJobDescription, detectBias } from '../services/nvidiaAI.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = asyncHandler(async (req, res) => {
  const { search, status, jobType, experienceLevel, page = 1, limit = 12 } = req.query;

  const query = { createdBy: req.user._id };

  if (status) query.status = status;
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [jobs, total] = await Promise.all([
    Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Job.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: jobs,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  // Get top candidates
  const topCandidates = await Application.find({ jobId: job._id })
    .sort({ 'aiAnalysis.overallScore': -1 })
    .limit(5)
    .select('candidateName candidateEmail status aiAnalysis.overallScore aiAnalysis.recommendation resumeFileName');

  res.json({ success: true, data: job, topCandidates });
});

// @desc    Create job
// @route   POST /api/jobs
// @access  Private
export const createJob = asyncHandler(async (req, res) => {
  const { title, description, requirements, skills, location, jobType, salaryRange, experienceLevel, department, deadline } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const job = await Job.create({
    title,
    description,
    requirements: Array.isArray(requirements) ? requirements : [],
    skills: Array.isArray(skills) ? skills : [],
    location,
    jobType,
    salaryRange,
    experienceLevel,
    department,
    deadline,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Job created successfully.', data: job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  res.json({ success: true, message: 'Job updated successfully.', data: job });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  // Also delete all applications for this job
  await Application.deleteMany({ jobId: req.params.id });

  res.json({ success: true, message: 'Job and all associated applications deleted.' });
});

// @desc    AI: Generate job description
// @route   POST /api/jobs/:id/generate-jd  (or POST /api/jobs/generate-jd)
// @access  Private
export const generateJD = asyncHandler(async (req, res) => {
  const { title, keywords, companyInfo, experienceLevel } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Job title is required to generate a description.' });
  }

  const generatedJD = await generateJobDescription(title, keywords, companyInfo, experienceLevel);

  res.json({
    success: true,
    message: 'Job description generated successfully.',
    data: { generatedDescription: generatedJD },
  });
});

// @desc    AI: Check job description for bias
// @route   GET /api/jobs/:id/bias-check
// @access  Private
export const checkBias = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  const biasAnalysis = await detectBias(job.description);

  res.json({
    success: true,
    message: 'Bias check completed.',
    data: biasAnalysis,
  });
});

// @desc    Get jobs statistics summary
// @route   GET /api/jobs/stats
// @access  Private
export const getJobStats = asyncHandler(async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { createdBy: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalApplicants: { $sum: '$applicantCount' },
        avgScore: { $avg: '$averageScore' },
      },
    },
  ]);

  res.json({ success: true, data: stats });
});
