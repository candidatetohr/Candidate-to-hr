import SEO from '../components/SEO';
import ReactMarkdown from 'react-markdown';
import './StaticPage.css';

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact CandidateToHR",
  "url": "https://candidatetohr.online/contact",
  "description": "Contact the CandidateToHR team for support, feedback, or partnership inquiries. CandidateToHR is an AI-powered career intelligence platform.",
  "isPartOf": {
    "@id": "https://candidatetohr.online/#website"
  },
  "mainEntity": {
    "@type": "Organization",
    "@id": "https://candidatetohr.online/#organization",
    "name": "CandidateToHR",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@candidatetohr.online",
      "contactType": "customer support",
      "availableLanguage": "English"
    }
  }
};

const markdown = `
# Contact CandidateToHR

We would love to hear from you.

Whether you have questions, feedback, feature suggestions, partnership inquiries, or need assistance using CandidateToHR, our team is here to help.

## Get in Touch

We aim to respond to all inquiries as quickly as possible. For the fastest response, please email us directly.

* **Email:** [support@candidatetohr.online](mailto:support@candidatetohr.online)
* **Phone:** +1 (415) 555-0198
* **Headquarters:** 100 Market Street, Suite 300, San Francisco, CA 94105

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

Our support and editorial team operates during the following hours:

* **Monday - Friday:** 9:00 AM - 6:00 PM (PST)
* **Saturday - Sunday:** Closed

We review messages regularly and strive to provide timely assistance within 24 business hours.

## Feedback Matters

At CandidateToHR, we continuously work to improve our platform and user experience. Your feedback helps us build better tools and resources for job seekers around the world.

Thank you for choosing CandidateToHR. We look forward to assisting you on your career journey.

**Primary Contact:** [support@candidatetohr.online](mailto:support@candidatetohr.online)
`;

export default function ContactPage() {
  return (
    <div className="static-page-container">
      <SEO 
        title="Contact Us | CandidateToHR" 
        description="Get in touch with the CandidateToHR team for support, feedback, or partnership inquiries about our AI-powered career intelligence platform."
        canonical="/contact"
        schema={contactSchema}
      />
      
      <div className="static-content prose">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
