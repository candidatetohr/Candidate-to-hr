import SEO from '../components/SEO';
import SafeMarkdown from '../components/seo/SafeMarkdown';
import InternalLinksFooter from '../components/seo/InternalLinksFooter';
import './StaticPage.css';

const markdown = `
# Terms and Conditions

**Last Updated:** June 2026

Welcome to CandidateToHR. These Terms and Conditions govern your use of our website and services. By accessing or using CandidateToHR, you agree to comply with and be bound by these Terms and Conditions.

If you do not agree with any part of these terms, please do not use our website.

## Acceptance of Terms

By accessing and using CandidateToHR, you acknowledge that you have read, understood, and agreed to these Terms and Conditions, as well as our Privacy Policy.

## About CandidateToHR

CandidateToHR is an AI-powered career platform that provides tools, resources, resume analysis, interview preparation materials, career guidance, and educational content to help users improve their career prospects.

## User Responsibilities

By using our website, you agree to:

* Provide accurate and truthful information.
* Use the platform only for lawful purposes.
* Respect the rights of other users.
* Not engage in activities that may harm, disrupt, or interfere with the website.
* Not attempt unauthorized access to any part of the platform.

## Account Registration

Some features may require users to create an account.

You are responsible for:

* Maintaining the confidentiality of your account credentials.
* All activities conducted under your account.
* Notifying us immediately of any unauthorized access or security concerns.

We reserve the right to suspend or terminate accounts that violate these Terms.

## Intellectual Property

All content on CandidateToHR, including but not limited to:

* Website design
* Logos
* Text
* Graphics
* Software
* Features
* Educational content

is owned by or licensed to CandidateToHR and is protected by applicable intellectual property laws.

Users may not copy, reproduce, distribute, modify, or exploit website content without prior written permission.

## Resume Analysis and Career Guidance

CandidateToHR may provide AI-generated suggestions, resume evaluations, interview preparation materials, and career recommendations.

These services are intended for informational and educational purposes only.

Users acknowledge that:

* Recommendations may not always be complete or accurate.
* Results may vary based on individual circumstances.
* Employment opportunities and hiring decisions are made solely by employers.

## No Employment Guarantee

CandidateToHR does not guarantee:

* Job offers
* Interview calls
* Employment opportunities
* Salary outcomes
* Career advancement

Success depends on various factors including qualifications, skills, experience, market conditions, and employer requirements.

## Prohibited Activities

Users must not:

* Upload malicious software or harmful content.
* Attempt to hack, disrupt, or damage the platform.
* Use automated systems to access the website without authorization.
* Violate applicable laws or regulations.
* Misrepresent their identity or qualifications.

## Third-Party Links

Our website may contain links to third-party websites and services.

CandidateToHR is not responsible for:

* Third-party content
* Privacy practices
* Products or services offered by third parties

Users access third-party websites at their own risk.

## Limitation of Liability

To the fullest extent permitted by law, CandidateToHR shall not be liable for:

* Direct or indirect damages
* Loss of data
* Loss of business opportunities
* Website interruptions
* Errors or inaccuracies in content
* Decisions made based on information provided through the platform

Use of the website is at your own risk.

## Service Availability

We strive to keep CandidateToHR available and functional at all times. However, we do not guarantee uninterrupted access and may modify, suspend, or discontinue services without prior notice.

## Privacy and Data Processing

Your use of CandidateToHR is also governed by our Privacy Policy, which explains how we collect, use, and protect your information. By using our platform, you consent to the processing of your data as described in the Privacy Policy, including the use of uploaded documents (like resumes) to generate AI insights.

## Fees and Payments

Currently, core features for candidates on CandidateToHR are provided free of charge. However, we reserve the right to introduce premium features, subscription tiers, or usage fees in the future. Any changes to our pricing structure will be communicated clearly to users before they incur any charges.

## Modifications to Terms

We reserve the right to update or modify these Terms and Conditions at any time.

Changes will become effective immediately upon posting on this page. Continued use of the website constitutes acceptance of any updated terms.

## Governing Law

These Terms and Conditions shall be governed by and interpreted in accordance with the laws applicable in India.

Any disputes arising from the use of CandidateToHR shall be subject to the jurisdiction of the appropriate courts in India.

## Contact Information

If you have any questions regarding these Terms and Conditions, please contact us:

**Email:** [CandidateToHR@gmail.com](mailto:CandidateToHR@gmail.com)

Thank you for using CandidateToHR.
`;

export default function TermsPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="Terms & Conditions | CandidateToHR" 
        description="CandidateToHR Terms and Conditions. Please read these terms carefully before using our platform." 
        canonical="/terms"
      />
      
      <div className="static-content prose">
        <SafeMarkdown>{markdown}</SafeMarkdown>
      </div>
      <InternalLinksFooter />
    </div>
  );
}
