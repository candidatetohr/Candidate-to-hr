import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const markdown = `
# About CandidateToHR

## Empowering Careers with AI

CandidateToHR is an AI-powered career development platform designed to help job seekers build stronger resumes, prepare confidently for interviews, and make informed career decisions.

In today's competitive job market, many candidates struggle with creating ATS-friendly resumes, identifying skill gaps, preparing for interviews, and understanding which career opportunities best match their abilities. CandidateToHR was created to solve these challenges by providing intelligent tools and resources that simplify the job search journey.

## Our Mission

Our mission is to make career growth accessible, personalized, and data-driven for everyone.

We believe that every candidate deserves access to professional-quality career guidance, regardless of their background or experience level. By leveraging artificial intelligence and modern technology, we aim to help job seekers improve their employability and achieve their career goals.

## What We Offer

### AI Resume Analysis

Our platform analyzes resumes and provides insights to help candidates improve formatting, keyword optimization, ATS compatibility, and overall resume quality.

### Interview Preparation

We provide extensive interview preparation resources, including technical, behavioral, and HR interview questions across multiple domains and industries.

### Career Guidance

CandidateToHR helps users understand potential career paths, identify required skills, and prepare for future opportunities through educational content and practical recommendations.

### Resume Examples

Our collection of resume examples and templates helps candidates create professional resumes that align with industry standards and recruiter expectations.

### Skill Development Resources

We continuously publish career-related content, interview guides, and learning resources to support candidates in their professional development journey.

## Who We Serve

CandidateToHR is built for:

* Students preparing for internships and campus placements
* Fresh graduates entering the job market
* Professionals seeking career transitions
* Experienced candidates pursuing better opportunities
* Individuals looking to improve their resumes and interview performance

## Why Choose CandidateToHR

* AI-powered career assistance
* User-friendly and accessible platform
* ATS-focused resume recommendations
* Comprehensive interview preparation resources
* Regularly updated career content
* Continuous innovation and improvement

## Our Vision

We envision a future where technology removes barriers to career success. CandidateToHR aims to become a trusted platform that connects talent with opportunity by providing intelligent career tools and actionable insights.

## Editorial Policy & Quality Standards

At CandidateToHR, we adhere to strict editorial guidelines to ensure our content is accurate, trustworthy, and actionable. 

* **Expert Review:** All career guides, salary data, and interview questions are reviewed by experienced HR professionals, technical recruiters, and industry veterans.
* **Data-Driven Insights:** Our tools leverage NVIDIA NIM AI and industry data to provide objective, non-biased feedback.
* **Continuous Updates:** The job market changes rapidly. We regularly update our resources to reflect the latest hiring trends, ATS algorithms, and salary benchmarks.

## Our Team of Experts

CandidateToHR is built by a team of passionate engineers, data scientists, and former technical recruiters. We combine deep technical expertise with years of talent acquisition experience to build tools that genuinely bridge the gap between candidates and HR.

Our advisory board includes professionals from top technology companies, ensuring our platform meets the high standards expected by modern recruiters.

## Contact & Company Information

**CandidateToHR**
Email: support@candidatetohr.online
Headquarters: San Francisco, CA

If you have any questions regarding CandidateToHR, please visit our [Contact Us](/contact) page or reach out to our support team.

Thank you for choosing CandidateToHR as your career development partner.
`;

export default function AboutPage() {
  return (
    <div className="static-page-container">
      <SEO title="About Us | CandidateToHR" description="Learn about CandidateToHR, our mission, and how we empower careers with AI." />
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
