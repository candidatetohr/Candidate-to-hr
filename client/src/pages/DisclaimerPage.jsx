import SEO from '../components/SEO';
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

## Testimonials and Success Stories

Any testimonials, case studies, or success stories featured on CandidateToHR represent individual experiences. They are not intended to represent or guarantee that anyone will achieve the same or similar results. Each user's success depends on their unique background, dedication, and external factors.

## AI Accuracy and Hallucinations

Our AI tools are built on advanced language models (such as NVIDIA NIM). However, artificial intelligence can occasionally generate incorrect, biased, or misleading information (often referred to as "hallucinations"). CandidateToHR is not responsible for any negative consequences resulting from reliance on AI-generated content.

## Fair Use and Copyright

This site may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We make such material available for educational and informational purposes under the principles of "fair use." If you wish to use copyrighted material from this site for purposes that go beyond fair use, you must obtain permission from the copyright owner.

## Indemnification

By using CandidateToHR, you agree to indemnify, defend, and hold harmless CandidateToHR, its founders, and affiliates from and against any and all claims, liabilities, damages, losses, or expenses (including reasonable attorneys' fees) arising out of or in any way connected with your use of the website or violation of this Disclaimer.

## Changes to This Disclaimer

We reserve the right to update or modify this Disclaimer at any time without prior notice.

Any changes will be posted on this page with an updated revision date.

## Contact Us

If you have any questions regarding this Disclaimer, please contact us:

**Email:** [CandidateToHR@gmail.com](mailto:CandidateToHR@gmail.com)

Thank you for using CandidateToHR.
`;

export default function DisclaimerPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="Disclaimer | CandidateToHR" 
        description="CandidateToHR Disclaimer regarding AI-generated content and employment outcomes." 
        canonical="/disclaimer"
      />
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
