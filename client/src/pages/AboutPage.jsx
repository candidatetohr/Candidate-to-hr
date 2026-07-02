import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const DOMAIN = 'https://candidatetohr.online';

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${DOMAIN}/about#webpage`,
  "name": "About CandidateToHR — AI Career Intelligence Platform",
  "url": `${DOMAIN}/about`,
  "description": "Learn about CandidateToHR, our mission, our AI-powered career intelligence platform, and how we help students and professionals accelerate their careers.",
  "isPartOf": {
    "@id": `${DOMAIN}/#website`
  },
  "about": {
    "@type": "Organization",
    "@id": `${DOMAIN}/#organization`,
    "name": "CandidateToHR",
    "url": DOMAIN,
    "description": "CandidateToHR is an AI-powered career intelligence platform helping students and professionals improve resumes, prepare for interviews, discover career roadmaps, and accelerate career growth.",
    "foundingDate": "2024",
    "knowsAbout": [
      "AI Resume Analysis",
      "ATS Optimization",
      "Career Roadmaps",
      "Interview Preparation",
      "Skill Gap Analysis",
      "Career Intelligence"
    ]
  }
};

const markdown = `
# About CandidateToHR

## CandidateToHR — AI Career Intelligence Platform

**CandidateToHR** is an AI-powered career intelligence platform designed to help students, fresh graduates, and seasoned professionals build stronger resumes, prepare confidently for interviews, identify skill gaps, and make smarter career decisions.

Founded in 2024, CandidateToHR was built to solve a real and frustrating problem: talented candidates being filtered out by automated systems before a human recruiter ever sees their resume. Today, CandidateToHR serves thousands of job seekers every month, helping them navigate the modern job market with AI-driven insights.

## Our Mission

CandidateToHR's mission is to make career growth accessible, personalized, and data-driven for everyone — regardless of background, experience level, or access to expensive career coaching.

We believe every candidate deserves professional-quality career guidance. By combining artificial intelligence, real-time market data, and evidence-based career science, CandidateToHR helps you understand where you stand, what you're missing, and exactly how to improve.

## What Makes CandidateToHR Different

Unlike generic job boards or static resume templates, CandidateToHR is built as a **career intelligence platform** — an active system that analyzes, scores, and gives you specific, actionable feedback tailored to your profile and target role.

### AI Resume Analyzer

CandidateToHR's resume analysis engine, powered by **NVIDIA NIM AI**, evaluates your resume across seven critical dimensions: Skills Match, Experience Relevance, Education Alignment, Communication Quality, ATS Compatibility, Keyword Density, and Overall Score. You get a 0–100 score in under 60 seconds.

### ATS Score Optimizer

75% of resumes are filtered out before a human ever reads them. CandidateToHR identifies exactly which keywords and phrases your resume is missing from any job description, and provides step-by-step fixes to improve your ATS pass rate.

### Career Roadmaps

CandidateToHR maintains comprehensive, regularly updated career roadmaps for 25+ technology roles — from Software Engineer to AI Engineer to DevSecOps. Each roadmap includes required skills, learning timelines, salary benchmarks, and interview preparation resources.

### Interview Preparation

CandidateToHR provides thousands of real interview questions across 20+ technical domains, including System Design, Behavioral, JavaScript, Python, Data Science, Machine Learning, and more.

### AI Mock Interview Simulator

CandidateToHR's AI Mock Interviewer conducts real-time voice-based interview sessions, grades your answers, identifies weak spots, and provides a detailed readiness report before your actual interview.

### Skill Gap Analyzer

CandidateToHR maps your current skills against the market demands for your target role, identifies exactly what you're missing, and generates a prioritized learning plan to close those gaps efficiently.

### Additional AI Tools

CandidateToHR also offers:

* **Placement Probability Engine** — Predict your likelihood of landing specific roles
* **Resume Truth Detector** — Scan for overclaiming, contradictions, and credibility risks
* **Rejection Decoder** — Diagnose why your applications aren't converting
* **Learning Path Optimizer** — AI-generated week-by-week curriculum for your target role
* **Offer Negotiator** — Data-driven offer evaluation and negotiation strategies
* **Culture Fit Analyzer** — Assess alignment between your values and company culture
* **AI Career Coach** — Real-time chat with an AI coach that knows your resume

## Technology

CandidateToHR is built on a modern **MERN stack** (MongoDB, Express, React, Node.js) and powered by **NVIDIA NIM AI** for all generative AI features. Our infrastructure is designed for speed, reliability, and privacy.

## Editorial Policy & Quality Standards

At CandidateToHR, we adhere to strict editorial guidelines to ensure our content is accurate, trustworthy, and actionable.

* **Expert Review:** All career guides, salary data, and interview questions are reviewed by experienced HR professionals, technical recruiters, and industry veterans.
* **Data-Driven Insights:** Our tools leverage NVIDIA NIM AI and industry data to provide objective, unbiased feedback.
* **Continuous Updates:** We regularly update our resources to reflect the latest hiring trends, ATS algorithms, and salary benchmarks.

## E-E-A-T Commitment

CandidateToHR is committed to the highest standards of **Experience, Expertise, Authoritativeness, and Trustworthiness** (E-E-A-T):

* **Experience:** Built by professionals who have directly experienced the hiring process from both sides — as candidates and as recruiters.
* **Expertise:** Our AI systems and editorial content are developed by engineers and HR professionals with deep domain knowledge.
* **Authoritativeness:** CandidateToHR's career data is sourced from real hiring market research, industry databases, and verified recruiter input.
* **Trustworthiness:** We are transparent about our AI methods, never fabricate statistics, and maintain strict privacy standards.

## Who CandidateToHR Serves

CandidateToHR is built for:

* Students preparing for internships and campus placements
* Fresh graduates entering the job market
* Professionals seeking career transitions
* Experienced candidates pursuing better opportunities
* Individuals looking to improve their resumes and interview performance
* Recruiters screening candidates with AI-powered tools

## Our Vision

CandidateToHR envisions a future where technology removes barriers to career success. We aim to become the trusted career intelligence platform that bridges the gap between talented candidates and the right opportunities — at scale, and for everyone.

## Contact & Company Information

**CandidateToHR** — AI Career Intelligence Platform

Email: [support@candidatetohr.online](mailto:support@candidatetohr.online)

Website: [candidatetohr.online](https://candidatetohr.online)

If you have any questions about CandidateToHR, please visit our [Contact Us](/contact) page or reach out to our support team directly.

Thank you for choosing CandidateToHR as your career development partner.
`;

export default function AboutPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="About CandidateToHR | AI Career Intelligence Platform" 
        description="CandidateToHR is an AI-powered career intelligence platform helping students and professionals improve resumes, prepare for interviews, discover career roadmaps, and accelerate career growth."
        canonical="/about"
        schema={organizationSchema}
      />
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
