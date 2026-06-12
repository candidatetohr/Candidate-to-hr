import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
export const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [
    totalJobs,
    openJobs,
    totalApplications,
    pipelineBreakdown,
    recentApplications,
    topJobs,
  ] = await Promise.all([
    Job.countDocuments({ createdBy: userId }),
    Job.countDocuments({ createdBy: userId, status: 'open' }),
    Application.countDocuments({ submittedBy: userId }),
    Application.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: 'jobs',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job',
        },
      },
      { $unwind: '$job' },
      { $match: { 'job.createdBy': userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Application.find({})
      .populate({ path: 'jobId', match: { createdBy: userId }, select: 'title' })
      .sort({ createdAt: -1 })
      .limit(5)
      .then(apps => apps.filter(a => a.jobId)),
    Job.find({ createdBy: userId })
      .sort({ applicantCount: -1 })
      .limit(5)
      .select('title applicantCount averageScore status'),
  ]);

  // Compute hired/rejected counts
  const pipeline = {};
  pipelineBreakdown.forEach(({ _id, count }) => {
    pipeline[_id] = count;
  });

  res.json({
    success: true,
    data: {
      summary: {
        totalJobs,
        openJobs,
        totalApplications,
        hiredCount: pipeline.hired || 0,
        rejectedCount: pipeline.rejected || 0,
        interviewCount: pipeline.interview || 0,
      },
      pipelineBreakdown: pipeline,
      recentApplications: recentApplications.map(a => ({
        _id: a._id,
        candidateName: a.candidateName,
        jobTitle: a.jobId?.title,
        status: a.status,
        score: a.aiAnalysis?.overallScore || null,
        createdAt: a.createdAt,
      })),
      topJobs,
    },
  });
});

// @desc    Get score distribution for a job
// @route   GET /api/analytics/scores?jobId=
// @access  Private
export const getScoreDistribution = asyncHandler(async (req, res) => {
  const { jobId } = req.query;
  const match = jobId ? { jobId: new (await import('mongoose')).default.Types.ObjectId(jobId) } : {};

  const distribution = await Application.aggregate([
    { $match: { ...match, analysisStatus: 'completed' } },
    {
      $bucket: {
        groupBy: '$aiAnalysis.overallScore',
        boundaries: [0, 20, 40, 60, 70, 80, 90, 101],
        default: 'N/A',
        output: {
          count: { $sum: 1 },
          candidates: { $push: '$candidateName' },
        },
      },
    },
  ]);

  const labels = ['0-19', '20-39', '40-59', '60-69', '70-79', '80-89', '90-100'];
  const formattedDist = distribution.map((bucket, i) => ({
    range: labels[i] || 'N/A',
    count: bucket.count,
  }));

  res.json({ success: true, data: formattedDist });
});

// @desc    Get hiring funnel metrics
// @route   GET /api/analytics/funnel
// @access  Private
export const getFunnel = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const funnel = await Application.aggregate([
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job',
      },
    },
    { $unwind: '$job' },
    { $match: { 'job.createdBy': userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgScore: { $avg: '$aiAnalysis.overallScore' },
      },
    },
  ]);

  const stages = ['applied', 'screening', 'interview', 'offer', 'hired'];
  const funnelData = stages.map(stage => {
    const found = funnel.find(f => f._id === stage);
    return {
      stage,
      count: found?.count || 0,
      avgScore: Math.round(found?.avgScore || 0),
    };
  });

  res.json({ success: true, data: funnelData });
});

// @desc    Get time-to-hire analytics
// @route   GET /api/analytics/time-to-hire
// @access  Private
export const getTimeToHire = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const hired = await Application.aggregate([
    {
      $lookup: {
        from: 'jobs',
        localField: 'jobId',
        foreignField: '_id',
        as: 'job',
      },
    },
    { $unwind: '$job' },
    { $match: { 'job.createdBy': userId, status: 'hired' } },
    {
      $project: {
        daysToHire: {
          $divide: [
            { $subtract: ['$updatedAt', '$createdAt'] },
            1000 * 60 * 60 * 24,
          ],
        },
        jobTitle: '$job.title',
      },
    },
    {
      $group: {
        _id: '$jobTitle',
        avgDaysToHire: { $avg: '$daysToHire' },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({ success: true, data: hired });
});
