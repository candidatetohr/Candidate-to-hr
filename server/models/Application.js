import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema({
  question: String,
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'situational', 'role-specific', 'culture-fit'],
    default: 'technical',
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  suggestedAnswer: String,
}, { _id: false });

const aiAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, min: 0, max: 100, default: 0 },
  skillsMatchScore: { type: Number, min: 0, max: 100, default: 0 },
  experienceMatchScore: { type: Number, min: 0, max: 100, default: 0 },
  educationMatchScore: { type: Number, min: 0, max: 100, default: 0 },
  communicationScore: { type: Number, min: 0, max: 100, default: 0 },
  strengths: [String],
  weaknesses: [String],
  matchedSkills: [String],
  missingSkills: [String],
  recommendation: {
    type: String,
    enum: ['strong_hire', 'hire', 'maybe', 'no_hire'],
    default: 'maybe',
  },
  summary: String,
  detailedFeedback: String,
  atsOptimizations: [String],
  interviewQuestions: [interviewQuestionSchema],
  skillsGapAnalysis: {
    criticalGaps: [String],
    niceToHaveGaps: [String],
    learningResources: [String],
    timeToFill: String,
  },
  biasFlags: [String],
  analyzedAt: { type: Date, default: Date.now },
}, { _id: false });

const pipelineHistorySchema = new mongoose.Schema({
  fromStatus: String,
  toStatus: String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note: String,
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required'],
  },
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
  },
  candidateEmail: {
    type: String,
    required: [true, 'Candidate email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  candidatePhone: {
    type: String,
    trim: true,
  },
  resumeFileId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  resumeFileName: {
    type: String,
    default: null,
  },
  resumeText: {
    type: String,
    default: '',
  },
  aiAnalysis: {
    type: aiAnalysisSchema,
    default: null,
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'],
    default: 'applied',
  },
  pipelineHistory: [pipelineHistorySchema],
  notes: {
    type: String,
    default: '',
  },
  tags: [String],
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, { timestamps: true });

// Index for efficient querying
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ candidateEmail: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ 'aiAnalysis.overallScore': -1 });

export default mongoose.model('Application', applicationSchema);
