import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, FileText, CheckCircle, Eye, AlertCircle, Phone, Lock, EyeOff } from 'lucide-react';
import './StaticPage.css';

export default function TrustCenterPage() {
  const policies = [
    {
      title: 'Privacy Policy',
      desc: 'Learn how we collect, process, protect, and respect your personal career files and ATS resume data.',
      icon: <Lock className="text-blue" size={24} />,
      path: '/privacy-policy'
    },
    {
      title: 'Terms of Service',
      desc: 'Understand the terms, usage guidelines, and rules for creating resumes and taking mock interviews on our site.',
      icon: <FileText className="text-purple" size={24} />,
      path: '/terms'
    },
    {
      title: 'AI Usage & Ethics Policy',
      desc: 'Complete disclosure on NVIDIA NIM model scoring, data parameters, and our ethical standards for automated resume parsing.',
      icon: <Shield className="text-amber" size={24} />,
      path: '/ai-policy'
    },
    {
      title: 'Editorial Standards',
      desc: 'Our policy on career guides correctness, fact-checking cycles, primary sources citation, and quarterly freshness validation.',
      icon: <CheckCircle className="text-green" size={24} />,
      path: '/editorial-policy'
    },
    {
      title: 'Fact Checking Policy',
      desc: 'How we verify salary averages, credential guidelines, and syllabus outlines with real industry leads.',
      icon: <CheckCircle className="text-cyan" size={24} />,
      path: '/trust/fact-checking'
    },
    {
      title: 'Cookie Disclosures',
      desc: 'How we leverage privacy-conscious logs to optimize tool performance without third-party tracking identifiers.',
      icon: <Eye className="text-red" size={24} />,
      path: '/trust/cookies'
    },
    {
      title: 'Accessibility Statement',
      desc: 'Our commitment to keyboard-only accessibility, contrast levels, and WCAG 2.2 AA standards compliance.',
      icon: <AlertCircle className="text-yellow" size={24} />,
      path: '/trust/accessibility'
    },
    {
      title: 'Security Disclosures',
      desc: 'How we secure file transmission sockets and run automated cleanup rules to erase analyzed PDF copies.',
      icon: <Shield className="text-pink" size={24} />,
      path: '/trust/security'
    }
  ];

  return (
    <div className="static-page">
      <SEO 
        title="Trust & Transparency Center | CandidateToHR"
        description="CandidateToHR Trust Center. Read our privacy policies, AI disclosures, editorial standards, accessibility statement, and cookie disclosures."
        canonical="/trust"
        type="WebPage"
      />

      <div className="static-hero">
        <div className="static-container text-center">
          <div className="hub-badge">
            <span>🛡️</span> E-E-A-T Verified Trust Center
          </div>
          <h1 className="static-title">Trust & Transparency</h1>
          <p className="static-subtitle">
            At CandidateToHR, we build our platform to be reliable, transparent, and data-driven. Read our policies below to see how we protect your career journey.
          </p>
        </div>
      </div>

      <div className="static-container mt-48">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          margin: '32px 0'
        }}>
          {policies.map((p, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
            }}
            className="hover-card"
            >
              <div style={{ marginBottom: '16px' }}>{p.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>{p.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', flexGrow: 1, marginBottom: '20px' }}>{p.desc}</p>
              <Link to={p.path} style={{
                color: 'var(--color-primary)',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.9rem'
              }}>
                Read Policy <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
