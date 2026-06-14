import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Code, GraduationCap, Briefcase, Target, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProfileEditPage.css';

export default function ProfileEditPage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [basicInfo, setBasicInfo] = useState({
    name: user?.name || '',
    headline: '',
    phone: '',
    location: '',
    portfolio: '',
    linkedin: ''
  });

  const [skills, setSkills] = useState(['React', 'JavaScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');

  const [education, setEducation] = useState([
    { id: 1, degree: '', institution: '', year: '' }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: '', description: '', link: '' }
  ]);

  const [careerGoals, setCareerGoals] = useState({
    targetRole: '',
    expectedSalary: '',
    jobType: 'Full-Time',
    preferredLocation: ''
  });

  // Handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const addEducation = () => {
    setEducation([...education, { id: Date.now(), degree: '', institution: '', year: '' }]);
  };

  const updateEducation = (id, field, value) => {
    setEducation(education.map(ed => ed.id === id ? { ...ed, [field]: value } : ed));
  };

  const removeEducation = (id) => {
    setEducation(education.filter(ed => ed.id !== id));
  };

  const addProject = () => {
    setProjects([...projects, { id: Date.now(), title: '', description: '', link: '' }]);
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: basicInfo.name,
        company: basicInfo.headline // temporarily mapping headline to company
        // TODO: Expand backend model to support skills, education, projects, goals
      };
      const res = await authAPI.updateProfile(payload);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'goals', label: 'Career Goals', icon: Target },
  ];

  return (
    <div className="os-page pb-12">
      <div className="os-container max-w-4xl">
        
        <div className="flex items-center gap-4 mb-8">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Complete Your Profile</h1>
            <p className="text-muted">Manually enter your details to improve AI matching.</p>
          </div>
        </div>

        <div className="profile-edit-layout">
          {/* Sidebar Tabs */}
          <div className="profile-sidebar">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="profile-content glass-card">
            
            {/* BASIC INFO */}
            {activeTab === 'basic' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2>Basic Information</h2>
                <div className="form-grid mt-6">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" className="input-field" value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label>Professional Headline</label>
                    <input type="text" className="input-field" value={basicInfo.headline} onChange={e => setBasicInfo({...basicInfo, headline: e.target.value})} placeholder="Software Engineer @ TechCorp" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" className="input-field" value={basicInfo.phone} onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})} placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" className="input-field" value={basicInfo.location} onChange={e => setBasicInfo({...basicInfo, location: e.target.value})} placeholder="New York, NY" />
                  </div>
                  <div className="form-group">
                    <label>Portfolio URL</label>
                    <input type="url" className="input-field" value={basicInfo.portfolio} onChange={e => setBasicInfo({...basicInfo, portfolio: e.target.value})} placeholder="https://johndoe.com" />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn URL</label>
                    <input type="url" className="input-field" value={basicInfo.linkedin} onChange={e => setBasicInfo({...basicInfo, linkedin: e.target.value})} placeholder="https://linkedin.com/in/johndoe" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SKILLS */}
            {activeTab === 'skills' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2>Technical & Soft Skills</h2>
                <p className="text-muted mt-2">Add skills relevant to your target roles.</p>
                
                <form onSubmit={handleAddSkill} className="flex gap-4 mt-6 mb-8">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="E.g. React, Python, Project Management..." 
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={!newSkill.trim()}>Add Skill</button>
                </form>

                <div className="skills-container">
                  {skills.map(skill => (
                    <div key={skill} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}><X size={14} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* EDUCATION */}
            {activeTab === 'education' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2>Education History</h2>
                  <button className="btn btn-sm" onClick={addEducation}><Plus size={14} /> Add Education</button>
                </div>
                
                <div className="entry-list">
                  {education.map((ed, index) => (
                    <div key={ed.id} className="entry-card">
                      <div className="flex justify-between">
                        <h4>Education {index + 1}</h4>
                        {education.length > 1 && (
                          <button className="text-red hover:text-red-600" onClick={() => removeEducation(ed.id)}><Trash2 size={16} /></button>
                        )}
                      </div>
                      <div className="form-grid mt-4">
                        <div className="form-group">
                          <label>Degree / Certificate</label>
                          <input type="text" className="input-field" placeholder="B.S. Computer Science" value={ed.degree} onChange={e => updateEducation(ed.id, 'degree', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Institution</label>
                          <input type="text" className="input-field" placeholder="University of Technology" value={ed.institution} onChange={e => updateEducation(ed.id, 'institution', e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label>Graduation Year</label>
                          <input type="text" className="input-field" placeholder="2024" value={ed.year} onChange={e => updateEducation(ed.id, 'year', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2>Key Projects</h2>
                  <button className="btn btn-sm" onClick={addProject}><Plus size={14} /> Add Project</button>
                </div>

                <div className="entry-list">
                  {projects.map((p, index) => (
                    <div key={p.id} className="entry-card">
                      <div className="flex justify-between">
                        <h4>Project {index + 1}</h4>
                        {projects.length > 1 && (
                          <button className="text-red hover:text-red-600" onClick={() => removeProject(p.id)}><Trash2 size={16} /></button>
                        )}
                      </div>
                      <div className="form-grid mt-4">
                        <div className="form-group col-span-2">
                          <label>Project Title</label>
                          <input type="text" className="input-field" placeholder="E-commerce Analytics Dashboard" value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} />
                        </div>
                        <div className="form-group col-span-2">
                          <label>Description (Impact & Tech Stack)</label>
                          <textarea className="input-field" rows="3" placeholder="Built a dashboard using React and Node.js that increased sales visibility by 40%." value={p.description} onChange={e => updateProject(p.id, 'description', e.target.value)} />
                        </div>
                        <div className="form-group col-span-2">
                          <label>Project Link (Optional)</label>
                          <input type="url" className="input-field" placeholder="https://github.com/..." value={p.link} onChange={e => updateProject(p.id, 'link', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CAREER GOALS */}
            {activeTab === 'goals' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2>Career Goals</h2>
                <div className="form-grid mt-6">
                  <div className="form-group col-span-2">
                    <label>Target Role / Job Title</label>
                    <input type="text" className="input-field" value={careerGoals.targetRole} onChange={e => setCareerGoals({...careerGoals, targetRole: e.target.value})} placeholder="e.g. Senior Frontend Developer" />
                  </div>
                  <div className="form-group">
                    <label>Expected Salary (Annual)</label>
                    <input type="text" className="input-field" value={careerGoals.expectedSalary} onChange={e => setCareerGoals({...careerGoals, expectedSalary: e.target.value})} placeholder="e.g. $120,000" />
                  </div>
                  <div className="form-group">
                    <label>Preferred Location</label>
                    <input type="text" className="input-field" value={careerGoals.preferredLocation} onChange={e => setCareerGoals({...careerGoals, preferredLocation: e.target.value})} placeholder="e.g. Remote, or New York" />
                  </div>
                  <div className="form-group col-span-2">
                    <label>Job Type</label>
                    <select className="input-field" value={careerGoals.jobType} onChange={e => setCareerGoals({...careerGoals, jobType: e.target.value})}>
                      <option>Full-Time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Part-Time</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* Global Save Action */}
        <div className="profile-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center gap-2"><div className="spinner" style={{width: 16, height: 16}} /> Saving...</span>
            ) : (
              <span className="flex items-center gap-2"><Save size={18} /> Save Profile</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

const X = ({size}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
