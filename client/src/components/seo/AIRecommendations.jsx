import { Link } from 'react-router-dom';
import CareerKnowledgeGraph from '../../services/CareerKnowledgeGraph';
import './AIRecommendations.css';
import { Sparkles, FileText, CheckSquare, Award, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

export default function AIRecommendations({ roleId, currentSlug }) {
  const career = CareerKnowledgeGraph.getById(roleId) || CareerKnowledgeGraph.getBySlug('roadmap', currentSlug);
  if (!career) return null;

  const links = CareerKnowledgeGraph.getLinks(career.id);

  const recommendations = [
    {
      title: 'Analyze Resume Compatibility',
      desc: 'Upload your current resume to see if it matches the ATS standard for this role.',
      icon: <Sparkles className="rec-icon text-amber" />,
      btnLabel: 'Analyze Now',
      path: '/analyze'
    },
    {
      title: 'Interactive Mock Interview',
      desc: 'Simulate a live technical mock interview with voice scoring for this career.',
      icon: <Zap className="rec-icon text-purple" />,
      btnLabel: 'Start Simulator',
      path: '/interview-sim'
    },
    {
      title: 'Skills Gap Analysis',
      desc: 'Validate which required technologies you are missing for this career path.',
      icon: <Target className="rec-icon text-blue" />,
      btnLabel: 'Check Skills Gap',
      path: '/skill-gap'
    },
    {
      title: 'ATS-Optimized Resume Examples',
      desc: 'Explore professional formats and sample experience bullet points.',
      icon: <FileText className="rec-icon text-green" />,
      btnLabel: 'View Templates',
      path: links.resume || '/resume-examples'
    },
    {
      title: 'Interview Q&A Prep',
      desc: 'Study technical and behavioral questions curated by senior engineers.',
      icon: <CheckSquare className="rec-icon text-red" />,
      btnLabel: 'Start Practice',
      path: links.interview || '/interview-questions'
    },
    {
      title: 'Personalized Learning Path',
      desc: 'Generate a structured weekly study plan matching your current target.',
      icon: <BookOpen className="rec-icon text-cyan" />,
      btnLabel: 'Generate Path',
      path: '/learning-path'
    }
  ];

  return (
    <div className="ai-recommendations-wrapper">
      <div className="ai-rec-header">
        <div className="ai-rec-badge">
          <span>🔮</span>
          <span>CandidateToHR AI Recommendation Engine</span>
        </div>
        <h3 className="ai-rec-title">Next Steps for Your {career.title} Journey</h3>
        <p className="ai-rec-desc">
          Based on your interest in becoming a <strong>{career.title}</strong>, our AI engine recommends the following personalized preparation resources:
        </p>
      </div>

      <div className="ai-rec-grid">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="ai-rec-card">
            <div className="card-top-icon-row">
              {rec.icon}
            </div>
            <h4 className="rec-card-title">{rec.title}</h4>
            <p className="rec-card-desc">{rec.desc}</p>
            <Link to={rec.path} className="rec-card-action-btn">
              <span>{rec.btnLabel}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
