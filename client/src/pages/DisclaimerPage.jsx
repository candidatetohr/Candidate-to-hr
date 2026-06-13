import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const markdown = `
# Disclaimer

**Last Updated:** June 2026

The information provided on CandidateToHR ("we," "our," or "us") is intended for general informational and educational purposes only. By using this website, you acknowledge and agree to the terms outlined in this Disclaimer.

## General Information

CandidateToHR provides career-related tools, resume analysis, interview preparation resources, educational content, and career guidance materials designed to help users improve their professional development and job search efforts.

While we strive to provide accurate, useful, and up-to-date information, we make no guarantees regarding the completeness, accuracy, reliability, suitability, or availability of any information, tools, services, or content provided on this website.

## No Professional Advice

The content available on CandidateToHR is for informational and educational purposes only and should not be considered professional career, legal, financial, or employment advice.

Users should independently evaluate any information provided and seek professional guidance where appropriate.

## AI-Generated Content

Some features on CandidateToHR may use artificial intelligence to generate recommendations, resume feedback, career suggestions, or other content.

Users acknowledge that:

* AI-generated content may contain inaccuracies or limitations.
* Recommendations should be reviewed and verified before use.
* Results may vary based on the information provided by users.
* AI-generated outputs should not be relied upon as the sole basis for important career decisions.

## No Employment Guarantee

CandidateToHR does not guarantee:

* Job placement
* Interview invitations
* Employment opportunities
* Salary increases
* Career advancement
* Recruitment success

Employment outcomes depend on numerous factors, including qualifications, skills, experience, market conditions, employer requirements, and individual performance.

## External Links Disclaimer

Our website may contain links to third-party websites, products, services, or resources.

We do not control or endorse the content, accuracy, policies, or practices of third-party websites and are not responsible for any loss or damage resulting from their use.

Users access external websites at their own discretion and risk.

## Website Availability

We make reasonable efforts to maintain uninterrupted access to CandidateToHR. However, we do not guarantee that the website will always be available, secure, error-free, or free from technical interruptions.

We reserve the right to modify, suspend, or discontinue any part of the website without prior notice.

## Limitation of Liability

Under no circumstances shall CandidateToHR, its owners, contributors, affiliates, or partners be liable for any direct, indirect, incidental, consequential, or special damages arising from:

* Use of the website
* Reliance on information provided
* Career or employment decisions
* Technical issues or interruptions
* Data loss
* Third-party services or websites

Users access and use CandidateToHR at their own risk.

## User Responsibility

Users are solely responsible for:

* Verifying information before acting upon it.
* Reviewing resumes, applications, and AI-generated recommendations.
* Making independent career and employment decisions.

CandidateToHR serves as a supportive tool and educational resource, not a substitute for professional judgment.

## Changes to This Disclaimer

We reserve the right to update or modify this Disclaimer at any time without prior notice.

Any changes will be posted on this page with an updated revision date.

## Contact Us

If you have any questions regarding this Disclaimer, please contact us:

**Email:** [Candidatetohr@gmail.com](mailto:Candidatetohr@gmail.com)

Thank you for using CandidateToHR.
`;

export default function DisclaimerPage() {
  return (
    <div className="static-page-container">
      <Helmet>
        <title>Disclaimer | CandidateToHR</title>
        <meta name="description" content="CandidateToHR Disclaimer regarding AI-generated content and employment outcomes." />
      </Helmet>
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
