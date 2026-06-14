import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Download, RefreshCw, AlertCircle, FileText, Bot, Edit3 } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { resumeBuilderAPI } from '../services/api';
import './LiveEditorPage.css';

const ResumePreview = ({ data }) => {
  if (!data) {
    return (
      <div className="a4-preview empty-preview">
        <FileText size={48} className="text-muted mb-16" />
        <p>Your beautiful resume will appear here...</p>
      </div>
    );
  }

  const { personalInfo, summary, experience, projects, education, skills } = data;

  return (
    <div className="a4-preview" id="resume-a4-document">
      <div className="a4-header">
        <h1 className="a4-name" contentEditable suppressContentEditableWarning>{personalInfo?.name || 'Your Name'}</h1>
        <div className="a4-contact" contentEditable suppressContentEditableWarning>
          {personalInfo?.email && <span>{personalInfo.email}</span>}
          {personalInfo?.phone && <span> &bull; {personalInfo.phone}</span>}
          {personalInfo?.location && <span> &bull; {personalInfo.location}</span>}
          {personalInfo?.links?.map((link, i) => (
            <span key={i}> &bull; {link}</span>
          ))}
        </div>
      </div>

      {summary && (
        <div className="a4-section">
          <h2 className="a4-section-title" contentEditable suppressContentEditableWarning>Professional Summary</h2>
          <p className="a4-summary-text" contentEditable suppressContentEditableWarning>{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="a4-section">
          <h2 className="a4-section-title" contentEditable suppressContentEditableWarning>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="a4-item">
              <div className="a4-item-header">
                <span className="a4-job-title" contentEditable suppressContentEditableWarning>{exp.title}</span>
                <span className="a4-date" contentEditable suppressContentEditableWarning>{exp.date}</span>
              </div>
              <div className="a4-item-subheader">
                <span className="a4-company" contentEditable suppressContentEditableWarning>{exp.company}</span>
                {exp.location && <span className="a4-location" contentEditable suppressContentEditableWarning>, {exp.location}</span>}
              </div>
              <ul className="a4-bullets" contentEditable suppressContentEditableWarning>
                {exp.bullets?.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="a4-section">
          <h2 className="a4-section-title" contentEditable suppressContentEditableWarning>Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} className="a4-item">
              <div className="a4-item-header">
                <span>
                  <strong className="a4-job-title" contentEditable suppressContentEditableWarning>{proj.name}</strong> 
                  {proj.technologies && <span className="a4-tech" contentEditable suppressContentEditableWarning> | {proj.technologies}</span>}
                </span>
                <span className="a4-date" contentEditable suppressContentEditableWarning>{proj.date}</span>
              </div>
              <ul className="a4-bullets" contentEditable suppressContentEditableWarning>
                {proj.bullets?.map((b, idx) => <li key={idx}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {education && education.length > 0 && (
        <div className="a4-section">
          <h2 className="a4-section-title" contentEditable suppressContentEditableWarning>Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="a4-item" style={{ marginBottom: '8px' }}>
              <div className="a4-item-header">
                <strong className="a4-company" contentEditable suppressContentEditableWarning>{edu.school}</strong>
                <span className="a4-date" contentEditable suppressContentEditableWarning>{edu.date}</span>
              </div>
              <div className="a4-item-subheader" style={{ marginTop: '2px' }}>
                <span className="a4-job-title" contentEditable suppressContentEditableWarning>{edu.degree}</span>
                {edu.gpa && <span contentEditable suppressContentEditableWarning> &bull; GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills && (
        <div className="a4-section">
          <h2 className="a4-section-title" contentEditable suppressContentEditableWarning>Skills</h2>
          <div className="a4-skills" contentEditable suppressContentEditableWarning>
            {skills.languages && skills.languages.length > 0 && (
              <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>
            )}
            {skills.frameworks && skills.frameworks.length > 0 && (
              <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function LiveEditorPage() {
  const navigate = useNavigate();
  const [rawDetails, setRawDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const handleGenerate = async () => {
    if (!rawDetails || rawDetails.length < 20) {
      setError('Please provide a bit more detail so the AI can work its magic!');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const res = await resumeBuilderAPI.generate({ rawDetails });
      if (res.data.success) {
        setResumeData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to generate resume.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setRawDetails("I am Sarah. I go to State University studying CS, graduating next May. I have a 3.8 GPA. I know Java, Python, and React. Last summer I interned at TechNova where I built a React dashboard that increased team efficiency by 20%. I also have a side project called 'WeatherApp' built with Node.js and the OpenWeather API that has 500 active users.");
  };

  const handleDownloadDirectPDF = () => {
    const element = document.getElementById('resume-a4-document');
    const opt = {
      margin: 0,
      filename: 'AI_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="editor-page">
      <div className="editor-bg"><div className="ed-orb ed-orb-1" /><div className="ed-orb ed-orb-2" /></div>

      <nav className="editor-nav">
        <button className="ed-back" onClick={() => navigate('/dashboard')}><ArrowLeft size={16} /> Dashboard</button>
        <div className="ed-logo"><div className="ed-logo-icon"><Bot size={13} /></div><span>AI Resume Generator</span></div>
        <div className="ed-nav-right"></div>
      </nav>

      <div className="generator-layout">
        <div className="brain-dump-panel">
          <div className="bd-header">
            <h2>The Brain Dump</h2>
            <p>Don&apos;t worry about formatting. Just type out everything you&apos;ve done. The AI will structure it perfectly.</p>
          </div>

          <textarea
            className="bd-textarea"
            placeholder="E.g., I am a CS student graduating in 2024. I know Python and React. I worked at Starbucks for a year. I built a cool weather app using APIs..."
            value={rawDetails}
            onChange={(e) => { setRawDetails(e.target.value); setError(null); }}
            disabled={loading}
          />

          <AnimatePresence>
            {error && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bd-error">
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bd-footer">
            <button className="ed-btn-ghost" onClick={loadExample} disabled={loading}><Sparkles size={14}/> Load Example</button>
            <button className="ed-btn-primary bd-generate-btn" onClick={handleGenerate} disabled={loading || !rawDetails}>
              {loading ? <><RefreshCw size={16} className="spin" /> Generating...</> : <><Bot size={16} /> Generate Resume</>}
            </button>
          </div>
        </div>

        <div className="preview-panel" style={{ position: 'relative' }}>
          {resumeData && (
            <div style={{ position: 'absolute', top: '24px', right: '32px', zIndex: 10, display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f6', padding: '10px 16px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                <Edit3 size={16}/> Click anywhere on document to edit
              </div>
              <button 
                className="ed-btn-primary ed-btn-sm" 
                onClick={handleDownloadDirectPDF}
                style={{ padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', borderRadius: '30px' }}
              >
                <Download size={16}/> Download PDF
              </button>
            </div>
          )}
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}
