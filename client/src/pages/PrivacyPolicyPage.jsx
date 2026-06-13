import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const markdown = `
# Privacy Policy

**Last Updated:** June 2026

Welcome to CandidateToHR ("we," "our," or "us"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit and use our website, CandidateToHR.

By using our website, you agree to the practices described in this Privacy Policy.

## Information We Collect

### Personal Information

We may collect personal information that you voluntarily provide, including:

* Name
* Email address
* Resume or career-related documents uploaded to the platform
* Information submitted through contact forms
* Account registration information

### Automatically Collected Information

When you visit our website, we may automatically collect certain information, including:

* IP address
* Browser type and version
* Device information
* Operating system
* Pages visited
* Time spent on pages
* Referring website URLs

## How We Use Your Information

We use the information we collect to:

* Provide and improve our services
* Analyze resumes and career-related information
* Respond to inquiries and support requests
* Enhance website functionality and user experience
* Monitor website performance and security
* Comply with legal obligations

## Cookies and Tracking Technologies

CandidateToHR may use cookies and similar technologies to:

* Improve website performance
* Remember user preferences
* Analyze website traffic
* Enhance user experience

Users can choose to disable cookies through their browser settings. However, some features of the website may not function properly.

## Google AdSense and Advertising

We may use Google AdSense and other advertising services to display advertisements on our website.

Google and its partners may use cookies to serve ads based on a user's previous visits to this website or other websites.

Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the internet.

Users may opt out of personalized advertising by visiting Google's Ads Settings.

## Analytics

We may use analytics tools such as Google Analytics to understand how visitors interact with our website. These tools may collect information such as:

* Pages visited
* Session duration
* Device information
* Geographic region
* Referral sources

This information helps us improve our services and user experience.

## Data Security

We implement reasonable technical and organizational measures to protect your information from unauthorized access, disclosure, alteration, or destruction.

While we strive to protect your data, no method of transmission over the internet or electronic storage is completely secure.

## Third-Party Services

Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third-party websites.

Users should review the privacy policies of any external websites they visit.

## Children's Privacy

CandidateToHR is not intended for children under the age of 13. We do not knowingly collect personal information from children.

If we become aware that a child has provided personal information, we will take reasonable steps to remove such information.

## Your Rights

Depending on your location and applicable laws, you may have rights regarding your personal information, including:

* Access to your information
* Correction of inaccurate information
* Deletion of personal information
* Restriction of processing
* Withdrawal of consent where applicable

Requests may be submitted using the contact information below.

## Changes to This Privacy Policy

We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date.

Continued use of the website after changes are posted constitutes acceptance of the updated Privacy Policy.

## Contact Us

If you have any questions regarding this Privacy Policy or our data practices, please contact us at:

**Email:** [Candidatetohr@gmail.com](mailto:Candidatetohr@gmail.com)

Thank you for trusting CandidateToHR.
`;

export default function PrivacyPolicyPage() {
  return (
    <div className="static-page-container">
      <Helmet>
        <title>Privacy Policy | CandidateToHR</title>
        <meta name="description" content="CandidateToHR Privacy Policy. Learn how we collect, use, and protect your information." />
      </Helmet>
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
