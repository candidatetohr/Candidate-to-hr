import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const markdown = `
# Contact Us

We would love to hear from you.

Whether you have questions, feedback, feature suggestions, partnership inquiries, or need assistance using CandidateToHR, our team is here to help.

## Get in Touch

**Email:** [Candidatetohr@gmail.com](mailto:Candidatetohr@gmail.com)

We aim to respond to all inquiries as quickly as possible.

## How Can We Help?

You can contact us regarding:

* Technical support and platform issues
* Resume analysis questions
* Interview preparation resources
* Career guidance suggestions
* Partnership and collaboration opportunities
* Feature requests and feedback
* General inquiries about CandidateToHR

## Support Hours

Our support team reviews messages regularly and strives to provide timely assistance.

## Feedback Matters

At CandidateToHR, we continuously work to improve our platform and user experience. Your feedback helps us build better tools and resources for job seekers around the world.

Thank you for choosing CandidateToHR.

We look forward to assisting you on your career journey.

**Email:** [Candidatetohr@gmail.com](mailto:Candidatetohr@gmail.com)
`;

export default function ContactPage() {
  return (
    <div className="static-page-container">
      <Helmet>
        <title>Contact Us | CandidateToHR</title>
        <meta name="description" content="Get in touch with the CandidateToHR team for support, feedback, or partnership inquiries." />
      </Helmet>
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
