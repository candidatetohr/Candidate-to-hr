import axios from 'axios';
import https from 'https';

const NIM_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NIM_MODEL = 'meta/llama-3.1-8b-instruct';

// ─── API KEY POOL MANAGER ──────────────────────────────────────────────────
// Parse comma-separated keys from NVIDIA_API_KEYS, fallback to NVIDIA_API_KEY
const getApiKeys = () => {
  const keysStr = process.env.NVIDIA_API_KEYS || process.env.NVIDIA_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);
  return keys.length > 0 ? keys : ['']; // Ensure at least one element (even if empty)
};

let apiKeys = getApiKeys();
let currentKeyIndex = 0;

export const rotateApiKey = () => {
  if (apiKeys.length <= 1) return; // No rotation possible if only 1 key
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  console.log(` [NVIDIA NIM] Rotated to API Key ${currentKeyIndex + 1} of ${apiKeys.length}`);
};

const getCurrentKey = () => apiKeys[currentKeyIndex];
export { getCurrentKey };

// Force IPv4 to prevent AggregateError from Node.js dual-stack Happy Eyeballs
const ipv4Agent = new https.Agent({ family: 4 });

const nimClient = axios.create({
  baseURL: NIM_BASE_URL,
  httpsAgent: ipv4Agent,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for large prompts
});

// Use interceptor to dynamically inject the active key
nimClient.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getCurrentKey()}`;
  return config;
});

/**
 * Core NIM chat completion call
 */
const callNIM = async (systemPrompt, userPrompt, maxTokens = 2048) => {
  try {
    const response = await nimClient.post('/chat/completions', {
      model: NIM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
      top_p: 0.9,
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) throw new Error('No response from NVIDIA NIM');
    return content;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      console.error(`NIM API Error (${status}):`, error.response.data);
      
      // If we hit a rate limit (429) or auth error (401, 403), throw a specific error object
      if (status === 429 || status === 401 || status === 403) {
        throw { isRotationCandidate: true, status, originalError: error };
      }
      
      throw new Error(`NIM API error: ${error.response.data?.detail || error.response.statusText}`);
    }
    console.error('NIM Network Error:', error.code || error.message);
    throw error;
  }
};

/**
 * Retry wrapper with automatic API key rotation and exponential back-off
 */
const callNIMWithRetry = async (systemPrompt, userPrompt, maxTokens, retries = 3) => {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await callNIM(systemPrompt, userPrompt, maxTokens);
    } catch (err) {
      lastErr = err;
      
      // If it's a rotation candidate (401/403/429), immediately rotate and retry without heavy backoff
      if (err.isRotationCandidate) {
        console.warn(`️ NIM Error ${err.status} - Triggering API Key Rotation...`);
        rotateApiKey();
        // Brief pause to allow the network to breathe before retrying with new key
        await new Promise(r => setTimeout(r, 500));
        continue; // Skip the exponential backoff, retry immediately
      }

      if (attempt < retries) {
        const wait = 1500 * (attempt + 1); // 1.5 s → 3 s
        console.warn(`NIM network/timeout failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${wait}ms…`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  // If we exhaust retries and the last error was our custom object, throw the original
  if (lastErr?.isRotationCandidate) throw lastErr.originalError;
  throw lastErr;
};

/**
 * Parse JSON safely from AI response
 */
const parseJSON = (text) => {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
    // Try raw parse
    return JSON.parse(text.trim());
  } catch {
    // Return raw text if not parseable
    return { raw: text };
  }
};

// ─── 1. RESUME ANALYSIS ──────────────────────────────────────────────────────
export const analyzeResume = async (resumeText, jobDescription, jobRequirements = [], jobSkills = []) => {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and senior recruiter with 20 years of experience. 
Analyze resumes objectively and provide structured, fair assessments.
Always respond with valid JSON only, no markdown, no explanation outside JSON.`;

  const userPrompt = `Analyze this resume against the job posting and return a detailed JSON assessment.

JOB DESCRIPTION:
${jobDescription}

REQUIRED SKILLS: ${jobSkills.join(', ') || 'Not specified'}
REQUIREMENTS: ${jobRequirements.join('\n') || 'Not specified'}

RESUME TEXT:
${resumeText}

Return ONLY this JSON structure (no other text):
{
  "overallScore": <number 0-100>,
  "skillsMatchScore": <number 0-100>,
  "experienceMatchScore": <number 0-100>,
  "educationMatchScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "matchedSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<missing_skill1>", "<missing_skill2>"],
  "recommendation": "<strong_hire|hire|maybe|no_hire>",
  "summary": "<2-3 sentence executive summary>",
  "detailedFeedback": "<detailed paragraph of feedback>",
  "atsOptimizations": ["<improvement tip 1>", "<improvement tip 2>", "<improvement tip 3>"]
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 2000);
  const parsed = parseJSON(raw);

  // Ensure scores are within bounds
  return {
    overallScore: Math.min(100, Math.max(0, parsed.overallScore || 0)),
    skillsMatchScore: Math.min(100, Math.max(0, parsed.skillsMatchScore || 0)),
    experienceMatchScore: Math.min(100, Math.max(0, parsed.experienceMatchScore || 0)),
    educationMatchScore: Math.min(100, Math.max(0, parsed.educationMatchScore || 0)),
    communicationScore: Math.min(100, Math.max(0, parsed.communicationScore || 0)),
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    matchedSkills: parsed.matchedSkills || [],
    missingSkills: parsed.missingSkills || [],
    recommendation: parsed.recommendation || 'maybe',
    summary: parsed.summary || '',
    detailedFeedback: parsed.detailedFeedback || '',
    atsOptimizations: parsed.atsOptimizations || [],
    analyzedAt: new Date(),
  };
};

// ─── 2. JOB DESCRIPTION GENERATOR ────────────────────────────────────────────
export const generateJobDescription = async (title, keywords = [], companyInfo = '', level = 'mid') => {
  const systemPrompt = `You are an expert technical recruiter and HR professional specializing in writing compelling, inclusive, and effective job descriptions that attract top talent.`;

  const userPrompt = `Write a comprehensive and engaging job description for the following role:

Job Title: ${title}
Experience Level: ${level}
Key Skills/Keywords: ${keywords.join(', ')}
Company Info: ${companyInfo || 'A fast-growing technology company'}

Generate a complete job description including:
1. Role Overview (2-3 sentences)
2. Key Responsibilities (6-8 bullet points)
3. Required Qualifications (5-6 items)
4. Nice-to-Have Qualifications (3-4 items)
5. What We Offer (4-5 benefits)

Make it engaging, specific, and inclusive. Avoid gender-coded language.
Format with clear sections using markdown headers.`;

  return await callNIM(systemPrompt, userPrompt, 1500);
};

// ─── 3. INTERVIEW QUESTIONS GENERATOR ────────────────────────────────────────
export const generateInterviewQuestions = async (resumeText, jobDescription, jobTitle) => {
  const systemPrompt = `You are a senior technical interviewer and hiring manager who creates targeted, insightful interview questions based on candidate backgrounds and job requirements.
Always respond with valid JSON only.`;

  const userPrompt = `Generate interview questions for this candidate applying for: ${jobTitle}

JOB DESCRIPTION:
${jobDescription.substring(0, 1000)}

CANDIDATE RESUME SUMMARY:
${resumeText.substring(0, 1500)}

Return ONLY this JSON:
{
  "questions": [
    {
      "question": "<question text>",
      "category": "<technical|behavioral|situational|role-specific|culture-fit>",
      "difficulty": "<easy|medium|hard>",
      "suggestedAnswer": "<what a good answer looks like>"
    }
  ]
}

Generate exactly 10 questions: 3 technical, 3 behavioral, 2 situational, 1 role-specific, 1 culture-fit.`;

  const raw = await callNIM(systemPrompt, userPrompt, 2000);
  const parsed = parseJSON(raw);
  return parsed.questions || [];
};

// ─── 4. SKILLS GAP ANALYSIS ───────────────────────────────────────────────────
export const analyzeSkillsGap = async (resumeText, jobRequirements, jobSkills) => {
  const systemPrompt = `You are a career development expert and technical skills assessor who provides actionable, specific skills gap analyses with learning resources.
Always respond with valid JSON only.`;

  const userPrompt = `Perform a detailed skills gap analysis comparing this candidate's profile to the job requirements.

JOB REQUIRED SKILLS: ${jobSkills.join(', ')}
JOB REQUIREMENTS: ${jobRequirements.join('\n')}

CANDIDATE RESUME:
${resumeText.substring(0, 2000)}

Return ONLY this JSON:
{
  "criticalGaps": ["<skill absolutely required but missing>"],
  "niceToHaveGaps": ["<beneficial skills not present>"],
  "existingStrengths": ["<skills candidate already has>"],
  "learningResources": ["<specific course/resource to fill gap>"],
  "timeToFill": "<estimated time to close critical gaps e.g. '3-6 months'>",
  "developmentPath": "<paragraph describing recommended learning journey>"
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 1500);
  return parseJSON(raw);
};

// ─── 5. BIAS DETECTION ────────────────────────────────────────────────────────
export const detectBias = async (jobDescription) => {
  const systemPrompt = `You are a Diversity, Equity & Inclusion (DEI) expert who identifies biased language in job descriptions and suggests inclusive alternatives.
Always respond with valid JSON only.`;

  const userPrompt = `Analyze this job description for biased language, exclusionary terms, or patterns that might discourage qualified candidates.

JOB DESCRIPTION:
${jobDescription}

Return ONLY this JSON:
{
  "biasScore": <number 0-100 where 0=no bias, 100=highly biased>,
  "flaggedPhrases": [
    {
      "phrase": "<biased phrase>",
      "type": "<gender|age|cultural|disability|other>",
      "suggestion": "<inclusive alternative>"
    }
  ],
  "overallAssessment": "<paragraph summary>",
  "inclusivityScore": <number 0-100>,
  "recommendations": ["<recommendation 1>", "<recommendation 2>"]
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 1000);
  return parseJSON(raw);
};

// ─── 6. ATS SCORE OPTIMIZER ───────────────────────────────────────────────────
export const optimizeForATS = async (resumeText, jobDescription, currentScore) => {
  const systemPrompt = `You are an expert resume writer and ATS optimization specialist who knows exactly what ATS systems look for and how to maximize resume scores.
Always respond with valid JSON only.`;

  const userPrompt = `The candidate's resume scored ${currentScore}/100 on ATS matching. Provide specific, actionable optimization suggestions.

JOB DESCRIPTION:
${jobDescription.substring(0, 800)}

CURRENT RESUME:
${resumeText.substring(0, 1500)}

Return ONLY this JSON:
{
  "currentScore": ${currentScore},
  "potentialScore": <number - achievable score after optimizations>,
  "criticalFixes": ["<must-do fix 1>", "<must-do fix 2>"],
  "keywordSuggestions": ["<missing keyword to add>"],
  "formattingTips": ["<formatting improvement>"],
  "sectionImprovements": {
    "summary": "<how to improve professional summary>",
    "experience": "<how to improve experience section>",
    "skills": "<how to improve skills section>"
  },
  "quickWins": ["<easy fix that has high impact>"]
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 1500);
  return parseJSON(raw);
};

// ─── 7. CANDIDATE RANKING ────────────────────────────────────────────────────
export const rankCandidates = async (candidates, jobTitle, jobRequirements) => {
  const systemPrompt = `You are a senior talent acquisition specialist who objectively ranks candidates based on their fit for a role.`;

  const candidateSummaries = candidates.map((c, i) =>
    `Candidate ${i + 1}: ${c.candidateName} - Score: ${c.aiAnalysis?.overallScore || 0}/100 - Skills: ${c.aiAnalysis?.matchedSkills?.join(', ') || 'N/A'}`
  ).join('\n');

  const userPrompt = `Rank these ${candidates.length} candidates for: ${jobTitle}

Requirements: ${jobRequirements.join(', ')}

Candidates:
${candidateSummaries}

Provide a brief ranking justification for the top 3 candidates in plain text.`;

  return await callNIM(systemPrompt, userPrompt, 500);
};

// ─── 8. QUICK LIVE SCORE (lightweight — for real-time editor) ─────────────────
export const quickScoreText = async (resumeText, jobDescription = '') => {
  const systemPrompt = `You are an expert ATS scorer. Analyze resume text quickly and return concise JSON scores. Always respond with valid JSON only, no markdown.`;

  const userPrompt = `Quickly score this resume text${jobDescription ? ' against the job description' : ' as a general assessment'}.
${jobDescription ? `JOB DESCRIPTION:\n${jobDescription.substring(0, 500)}\n\n` : ''}
RESUME TEXT:
${resumeText.substring(0, 3000)}

Return ONLY this JSON:
{
  "overallScore": <0-100>,
  "skillsScore": <0-100>,
  "experienceScore": <0-100>,
  "communicationScore": <0-100>,
  "topIssue": "<single most important thing to fix right now — be specific>",
  "topStrength": "<single biggest strength>",
  "level": "<junior|mid|senior|lead>"
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 400);
  return parseJSON(raw);
};

// ─── 9. RESUME TAILORING ──────────────────────────────────────────────────────
export const tailorResumeToJob = async (resumeText, jobDescription, jobTitle) => {
  const systemPrompt = `You are an expert resume writer specializing in tailoring resumes to specific job descriptions.
Rewrite resume sections to naturally incorporate job keywords while maintaining authenticity and truthfulness.
Always respond with valid JSON only.`;

  const userPrompt = `Tailor this resume to perfectly match the job description for: ${jobTitle}

JOB DESCRIPTION:
${jobDescription.substring(0, 1200)}

CURRENT RESUME:
${resumeText.substring(0, 2500)}

Rewrite the resume to better match this job without fabricating experience. Return ONLY this JSON:
{
  "tailoredSummary": "<rewritten professional summary optimized for this role — 3-4 sentences>",
  "tailoredExperience": "<key experience bullets rewritten with job-relevant keywords — 5-7 bullets starting with action verbs>",
  "tailoredSkills": "<comma-separated skills list reordered and expanded to match the job>",
  "addedKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>"],
  "estimatedNewScore": <predicted new ATS score 0-100>,
  "scoreBefore": <estimated current ATS score>,
  "tailoringNotes": "<2-3 sentences explaining the key changes made and why>"
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 1500);
  return parseJSON(raw);
};

// ─── 10. INTERVIEW ANSWER GRADING ─────────────────────────────────────────────
export const gradeInterviewAnswer = async (question, answer, category, jobTitle) => {
  const systemPrompt = `You are a senior technical interviewer with 15+ years of experience conducting ${jobTitle} interviews.
Grade candidate answers objectively and provide specific, actionable, encouraging feedback.
Always respond with valid JSON only.`;

  const userPrompt = `Grade this interview answer for a ${category} question:

QUESTION: ${question}
CANDIDATE ANSWER: ${answer || '(No answer provided)'}

Return ONLY this JSON:
{
  "grade": <1-10>,
  "verdict": "<excellent|good|adequate|needs_work|poor>",
  "strongPoints": ["<what they did well 1>", "<what they did well 2>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>"],
  "missedPoints": ["<important point they should have covered>"],
  "modelAnswer": "<a brief example of what a great answer includes — 2-3 sentences>",
  "encouragement": "<one genuine sentence of encouragement>"
}`;

  const raw = await callNIM(systemPrompt, userPrompt, 800);
  return parseJSON(raw);
};

// ─── 11. INTERVIEW SESSION SUMMARY & WEAKNESS ANALYZER ───────────────────────
export const summarizeInterviewSession = async (sessionData, jobTitle) => {
  const systemPrompt = `You are a senior hiring manager summarizing a mock interview session performance report.
Be encouraging but honest. Provide an actionable 4-pillar weakness analysis. Always respond with valid JSON only.`;

  const sessionText = sessionData.map((q, i) =>
    `Q${i + 1} [${q.category}] Grade: ${q.grade}/10\nQuestion: ${q.question}\nAnswer: ${q.answer}`
  ).join('\n\n');

  const avgGrade = sessionData.reduce((sum, q) => sum + (q.grade || 0), 0) / sessionData.length;

  const userPrompt = `Summarize this mock interview session for a ${jobTitle} role.
Average raw grade: ${avgGrade.toFixed(1)}/10

SESSION DATA:
${sessionText}

Return ONLY this JSON:
{
  "overallScore": <0-100 — overall interview performance score>,
  "readinessLevel": "<not_ready|developing|almost_ready|ready|exceptional>",
  "verdict": "<2-sentence honest overall assessment>",
  "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "categoryBreakdown": {
    "confidence": <0-100>,
    "technical": <0-100>,
    "communication": <0-100>,
    "problemSolving": <0-100>
  },
  "criticalGaps": ["<gap 1>", "<gap 2>"],
  "nextSteps": ["<specific action to prepare better 1>", "<specific action 2>", "<specific action 3>"],
  "confidenceMessage": "<one encouraging closing statement to motivate continued practice>"
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1000);
  return parseJSON(raw);
};

// ─── 12. CAREER INTELLIGENCE ──────────────────────────────────────────────────
export const analyzeCareerFit = async (resumeText) => {
  const systemPrompt = `You are a career counselor and talent intelligence expert who maps professional profiles to optimal career roles.
Always respond with valid JSON only, no markdown.`;

  const userPrompt = `Analyze this resume and identify the best-fit career roles, salary potential, and career trajectory.

RESUME:
${resumeText.substring(0, 2500)}

Return ONLY this JSON:
{
  "topRoles": [
    {
      "title": "<role title>",
      "fitScore": <0-100>,
      "salaryRange": "<e.g. $85k–$120k>",
      "reasoning": "<2 sentences why this role fits>",
      "topCompanies": ["<company1>", "<company2>", "<company3>"]
    }
  ],
  "careerLevel": "<junior|mid|senior|lead|principal|executive>",
  "primaryDomain": "<e.g. Full-Stack Development, Data Science, DevOps>",
  "uniqueStrengths": ["<unique differentiator 1>", "<unique differentiator 2>", "<unique differentiator 3>"],
  "careerTrajectory": "<1-2 sentences on the most natural career growth path>",
  "skillsToUnlock": [
    {"skill": "<skill>", "impact": "<what doors it opens>", "timeToLearn": "<e.g. 2-3 months>"}
  ],
  "marketDemand": "<high|medium|low>",
  "salaryPotential": {
    "current": "<estimated current market value>",
    "oneYear": "<after 1 year of growth>",
    "threeYear": "<after 3 years of focused growth>"
  }
}

Generate exactly 5 top roles ordered by fitScore descending.
Include exactly 3 skillsToUnlock.`;

  const raw = await callNIM(systemPrompt, userPrompt, 2000);
  return parseJSON(raw);
};

// ─── 13. HIRE SUCCESS PREDICTOR ───────────────────────────────────────────────
export const predictHireSuccess = async (candidateName, aiAnalysis, jobTitle, jobRequirements) => {
  const systemPrompt = `You are a senior talent analytics expert who predicts hire success probability.
Always respond with valid JSON only.`;

  const userPrompt = `Predict the hire success probability for this candidate applying for ${jobTitle}.

CANDIDATE: ${candidateName}
OVERALL SCORE: ${aiAnalysis.overallScore}/100
SKILLS MATCH: ${aiAnalysis.skillsMatchScore}/100
EXPERIENCE MATCH: ${aiAnalysis.experienceMatchScore}/100
EDUCATION MATCH: ${aiAnalysis.educationMatchScore}/100
COMMUNICATION SCORE: ${aiAnalysis.communicationScore}/100
RECOMMENDATION: ${aiAnalysis.recommendation}
MATCHED SKILLS: ${(aiAnalysis.matchedSkills || []).join(', ')}
MISSING SKILLS: ${(aiAnalysis.missingSkills || []).join(', ')}
STRENGTHS: ${(aiAnalysis.strengths || []).join(', ')}
WEAKNESSES: ${(aiAnalysis.weaknesses || []).join(', ')}
JOB REQUIREMENTS: ${jobRequirements.join(', ')}

Return ONLY this JSON:
{
  "successProbability": <0-100 percent chance of succeeding in this role>,
  "riskLevel": "<low|medium|high>",
  "topRiskFactors": ["<risk 1>", "<risk 2>"],
  "topSuccessFactors": ["<success factor 1>", "<success factor 2>"],
  "overqualifiedRisk": <0-100 — risk of leaving due to underchallenge>,
  "skillVelocity": "<slow|moderate|fast — how quickly candidate appears to be growing>",
  "retentionLikelihood": "<low|medium|high — likelihood of staying 2+ years>",
  "verdict": "<2 sentences on whether to proceed with this candidate and why>"
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 800);
  return parseJSON(raw);
};

// ─── 14. AI REJECTION DECODER ────────────────────────────────────────────────
export const decodeRejection = async (resumeText, jobDescription, rejectionEmail = '') => {
  const systemPrompt = `You are a brutally honest but constructive technical recruiter. Your job is to analyze a candidate's resume against a job description (and optional rejection email) to tell them exactly why they were rejected. Always respond with valid JSON only.`;

  const userPrompt = `Analyze this rejection scenario and provide the hard truth.

RESUME TEXT:
${resumeText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

${rejectionEmail ? `REJECTION EMAIL:\n${rejectionEmail.substring(0, 1000)}\n\n` : ''}

Return ONLY this JSON:
{
  "topReasons": [
    {"reason": "<Specific reason for rejection>", "severity": "<high|medium>"},
    {"reason": "<Specific reason for rejection>", "severity": "<high|medium>"}
  ],
  "missingSkills": ["<skill1>", "<skill2>"],
  "resumeWeaknesses": ["<weakness1>", "<weakness2>"],
  "harshTruth": "<1 punchy sentence summarizing the main gap>",
  "actionPlan": [
    "<concrete step 1>",
    "<concrete step 2>",
    "<concrete step 3>"
  ]
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1000);
  return parseJSON(raw);
};

// ─── 15. PROJECT EVALUATOR ───────────────────────────────────────────────────
export const evaluateProject = async (projectDescription) => {
  const systemPrompt = `You are a senior engineering manager evaluating a candidate's side project. Assess it for technical depth, uniqueness, and interview value. Always respond with valid JSON only.`;

  const userPrompt = `Evaluate this project:

PROJECT DESCRIPTION:
${projectDescription.substring(0, 3000)}

Return ONLY this JSON:
{
  "uniquenessScore": <0-100>,
  "resumeValueScore": <0-100>,
  "interviewDifficultyScore": <0-100>,
  "projectType": "<e.g. CRUD App, ML Model, System Design, etc>",
  "strengths": ["<strength1>", "<strength2>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "suggestedFeatures": [
    {"feature": "<feature idea>", "reason": "<why it improves the project>"}
  ],
  "likelyInterviewQuestions": ["<q1>", "<q2>", "<q3>"]
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 800);
  return parseJSON(raw);
};

// ─── 16. AI PERSONAL BRAND BUILDER ───────────────────────────────────────────
export const buildPersonalBrand = async (resumeText) => {
  const systemPrompt = `You are an expert personal branding coach and copywriter for tech professionals. Generate personal branding content based on their resume. Always respond with valid JSON only.`;

  const userPrompt = `Generate personal branding materials based on this resume:

RESUME TEXT:
${resumeText.substring(0, 3000)}

Return ONLY this JSON:
{
  "brandTagline": "<1 punchy sentence for LinkedIn headline>",
  "aboutMeSection": "<2-3 engaging paragraphs for LinkedIn About section>",
  "linkedinPostIdea": {
    "topic": "<topic based on their experience>",
    "hook": "<catchy first sentence>",
    "body": "<short post body>",
    "hashtags": ["<tag1>", "<tag2>"]
  },
  "githubReadmeBio": "<Short, developer-focused bio for GitHub profile README>"
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1500);
  return parseJSON(raw);
};

// ─── 17. SKILL GAP ANALYZER 2.0 & LEARNING PATH ──────────────────────────────
export const generateLearningPath = async (resumeText, targetRole, hoursPerWeek) => {
  const systemPrompt = `You are a technical career strategist and curriculum designer. Based on a candidate's current resume and their target role, identify exactly what is missing and generate a week-by-week learning roadmap. Always respond with valid JSON only.`;

  const userPrompt = `Generate a learning path for this candidate.

TARGET ROLE: ${targetRole}
HOURS AVAILABLE PER WEEK: ${hoursPerWeek}

RESUME TEXT:
${resumeText.substring(0, 3000)}

Return ONLY this JSON:
{
  "currentMatchPercentage": <0-100>,
  "timeToReady": "<e.g. 8 weeks>",
  "existingSkills": ["<skill1>", "<skill2>"],
  "missingSkills": [
    {"skill": "<skill1>", "priority": "<High|Medium|Low>"}
  ],
  "roadmap": [
    {
      "week": "Week 1-2",
      "focus": "<Topic>",
      "description": "<What to learn and why>",
      "milestone": "<Mini-project or goal>"
    }
  ]
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1200);
  return parseJSON(raw);
};

// ─── 18. PLACEMENT PROBABILITY ENGINE ────────────────────────────────────────
export const predictPlacement = async (cgpa, degree, skills, projects) => {
  const systemPrompt = `You are a statistical talent prediction engine. Based on a candidate's profile, predict their probability of landing specific roles. You must also estimate their market salary. Always respond with valid JSON only.`;

  const userPrompt = `Predict placement probability for this profile:

CGPA: ${cgpa}
DEGREE: ${degree}
SKILLS: ${skills}
PROJECTS/EXPERIENCE:
${projects.substring(0, 2000)}

Return ONLY this JSON:
{
  "topRoles": [
    {
      "title": "<Role Title>",
      "probability": <0-100>,
      "salaryEstimate": "<e.g. $80k - $100k>",
      "why": "<1 sentence reasoning>"
    }
  ],
  "profileStrength": <0-100>,
  "biggestBlocker": "<What is holding them back from a higher probability?>",
  "quickWin": "<1 actionable thing to do this week to boost probability>"
}

Generate exactly 4 distinct roles they could apply for.`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1000);
  return parseJSON(raw);
};

// ─── 19. AI RESUME TRUTH DETECTOR ────────────────────────────────────────────
export const detectResumeLies = async (resumeText) => {
  const systemPrompt = `You are a skeptical, forensic background investigator. Your job is to analyze a resume for overclaiming, buzzword-stuffing, contradictions, or fake skills by looking for missing supporting evidence (e.g., claiming "Expert in Kubernetes" but no projects mentioning deployment). Always respond with valid JSON only.`;

  const userPrompt = `Analyze this resume and look for suspicious claims:

RESUME TEXT:
${resumeText.substring(0, 3000)}

Return ONLY this JSON:
{
  "overallTrustScore": <0-100 — lower means more suspicious>,
  "flags": [
    {
      "claim": "<Specific claim from resume>",
      "riskLevel": "<High|Medium|Low>",
      "reason": "<Why this is suspicious (e.g. no evidence provided, unrealistic timeline)>"
    }
  ],
  "interrogationQuestions": [
    "<A tough interview question designed to test one of their suspicious claims>"
  ],
  "verdict": "<1-2 sentences summarizing the authenticity of the resume>"
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 1000);
  return parseJSON(raw);
};

// ─── 20. AI RESUME BUILDER (FROM SCRATCH) ────────────────────────────────────
export const buildResumeFromDetails = async (rawDetails, name, email) => {
  const systemPrompt = `You are an expert resume writer. The user will provide a messy brain-dump of their experience, skills, and education.
Your job is to structure it into a professional, highly polished, ATS-friendly resume layout.
Format experience bullets using strong action verbs and STAR method where possible.
Always respond with valid JSON only, using the exact schema requested.`;

  const userPrompt = `Convert the following raw details into a professional resume.
Make assumptions to professionalize the language, but DO NOT fabricate non-existent jobs or degrees.

USER DETAILS (Brain Dump):
${rawDetails.substring(0, 3000)}

Default Name to use if not specified: ${name}
Default Email to use if not specified: ${email}

Return ONLY this JSON:
{
  "personalInfo": {
    "name": "<Full Name>",
    "email": "<Email>",
    "phone": "<Phone or empty>",
    "location": "<City, State or empty>",
    "links": ["<LinkedIn/GitHub links or empty>"]
  },
  "summary": "<A powerful 3-4 sentence professional summary>",
  "experience": [
    {
      "title": "<Job Title>",
      "company": "<Company Name>",
      "date": "<e.g., Jan 2020 - Present>",
      "location": "<Location or Remote>",
      "bullets": [
        "<Action-driven achievement bullet>",
        "<Action-driven achievement bullet>"
      ]
    }
  ],
  "projects": [
    {
      "name": "<Project Name>",
      "technologies": "<Tech Stack used>",
      "date": "<e.g., 2023>",
      "bullets": [
        "<What was built and the impact>"
      ]
    }
  ],
  "education": [
    {
      "degree": "<Degree Name>",
      "school": "<School Name>",
      "date": "<e.g., May 2024>",
      "gpa": "<GPA or empty>"
    }
  ],
  "skills": {
    "languages": ["<Language 1>", "<Language 2>"],
    "frameworks": ["<Framework 1>"],
    "tools": ["<Tool 1>"]
  }
}`;

  const raw = await callNIMWithRetry(systemPrompt, userPrompt, 2500);
  return parseJSON(raw);
};
