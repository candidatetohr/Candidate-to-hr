import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/seo/SchemaMarkup';
import Breadcrumbs from '../components/seo/Breadcrumbs';
import CareerKnowledgeGraph from '../services/CareerKnowledgeGraph';
import CareerGraphSidebar from '../components/seo/CareerGraphSidebar';
import FAQAccordion from '../components/seo/FAQAccordion';
import './ProgrammaticCounterOfferPage.css';

export default function ProgrammaticCounterOfferPage() {
  const { role } = useParams();
  
  const career = CareerKnowledgeGraph.getById(role);

  if (!career) {
    return (
      <div className="p-48 text-center text-secondary">
        <h3>Page Not Found</h3>
        <p>The requested counter-offer negotiation planner does not exist.</p>
        <Link to="/roadmaps" className="btn btn-primary mt-16">View Careers</Link>
      </div>
    );
  }

  const titleText = `${career.title} Counter-Offer & Negotiation Script Templates`;
  const descriptionText = `Get customized negotiation scripts, email templates, and counter-offer strategies specifically tailored for a ${career.title}. Direct insights from CandidateToHR.`;

  const faqs = [
    {
      q: `How do I ask for a higher salary as a ${career.title}?`,
      a: `Focus on technical contributions, database systems optimized, architecture designs launched, and code coverage improvements. Highlight specific tools like ${career.skills.slice(0, 3).join(', ')} you bring to the table.`
    },
    {
      q: `What is a reasonable counter-offer percentage?`,
      a: `Typically, a counter-offer between 10% to 20% above the initial base salary offer is standard in the tech industry, supported by data points matching local geographic scales.`
    }
  ];

  return (
    <div className="p-seo-page-container container-standard px-6 py-8">
      <SEO 
        title={titleText} 
        description={descriptionText} 
        canonical={`/resume-summaries/${role}`}
      />
      <SchemaMarkup
        type="BreadcrumbList"
        data={[
          { name: 'Home', url: '/' },
          { name: 'Salary Guides', url: '/salary-guides' },
          { name: career.title, url: `/salary-guides/${career.id}` },
          { name: 'Counter-Offer Templates', url: `/resume-summaries/${role}` }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-24">
        <main className="lg:col-span-2 content-long-form">
          <header className="p-seo-header">
            <span className="p-seo-tag">Negotiation Script Generator</span>
            <h1 className="text-4xl font-extrabold mb-8">{career.title} Negotiation Strategy</h1>
            <p className="text-lg text-secondary mb-16">
              A comprehensive playbook designed to help you secure top-of-market compensation when receiving offers for {career.title} positions.
            </p>
          </header>

          <section className="mt-32">
            <h2>Salary Negotiation Script</h2>
            <p>
              Use the following template when discussing compensation with recruiters over the phone:
            </p>
            <div className="script-container-box">
              <p className="script-text">
                "Thank you so much for the offer! I am incredibly excited about the opportunity to join as a <strong>{career.title}</strong> and work with the team on optimizing systems. Given my background in <strong>{career.skills.slice(0, 3).join(', ')}</strong> and credentials like <strong>{career.certifications[0] || 'expert credentials'}</strong>, I was hoping we could explore a base salary closer to <strong>{career.averageSalary}</strong>. With my skills, I'm confident I can make an immediate impact on execution speed and system scalability."
              </p>
            </div>
          </section>

          <section className="mt-32">
            <h2>Email Response Template</h2>
            <p>
              Send this email draft to follow up on your verbal discussion:
            </p>
            <div className="script-container-box email">
              <pre className="email-pre">
{`Subject: Professional Offer Discussion - ${career.title}

Dear [Recruiter Name],

Thank you for sending over the written offer details. I am thrilled to join the team!

To align the compensation details with market averages for senior ${career.title} specialists bringing hands-on proficiency in ${career.skills.slice(0, 3).join(', ')}, I would like to request if we could adjust the base compensation to ${career.averageSalary}.

I appreciate your guidance and look forward to finalizing the milestones.

Best regards,
[Your Name]`}
              </pre>
            </div>
          </section>

          <FAQAccordion items={faqs} />
        </main>

        <aside className="space-y-6">
          <CareerGraphSidebar roleId={career.id} />
        </aside>
      </div>
    </div>
  );
}
