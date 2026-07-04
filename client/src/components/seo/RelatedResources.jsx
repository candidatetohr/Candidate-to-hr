import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { roadmapList } from '../../data/roadmaps/index.js';
import { salaryCategories } from '../../data/salaryGuides/index.js';
import { interviewCategories } from '../../data/interviewQuestions/index.js';
import { resumeCategories } from '../../data/resumeExamples/index.js';
import { careerGuideCategories } from '../../data/careerGuides/index.js';

// Helper to calculate string similarity for finding related topics if exact match fails
const getRelevanceScore = (targetId, currentId) => {
  if (!currentId) return 0;
  if (targetId === currentId) return 100;
  
  const targetWords = targetId.split('-');
  const currentWords = currentId.split('-');
  
  let score = 0;
  targetWords.forEach(word => {
    if (currentWords.includes(word) && word.length > 2) score += 10;
  });
  return score;
};

const RelatedResources = () => {
  const location = useLocation();
  
  // Extract slug from URL (e.g. /roadmaps/data-engineer -> data-engineer)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentCategory = pathParts[0]; // e.g., 'roadmaps'
  const currentSlug = pathParts.length > 1 ? pathParts[1] : null;

  const relatedLinks = useMemo(() => {
    const allLinks = [];

    const addLinks = (categoryData, basePath, label) => {
      categoryData.forEach(item => {
        let score = getRelevanceScore(item.id, currentSlug);
        
        // Boost score if it's the exact same role in a different category (e.g., Roadmap -> Salary)
        if (item.id === currentSlug) score += 50;
        
        // If we are on a hub page, just show some random/top links
        if (!currentSlug) score = Math.random() * 20;

        allLinks.push({
          route: `/${basePath}/${item.id}`,
          title: item.title,
          typeLabel: label,
          score
        });
      });
    };

    addLinks(roadmapList, 'roadmaps', 'Roadmap');
    addLinks(salaryCategories, 'salary-guides', 'Salary Guide');
    addLinks(interviewCategories, 'interview-questions', 'Interview Prep');
    addLinks(resumeCategories, 'resume-examples', 'Resume Example');
    addLinks(careerGuideCategories, 'career-guides', 'Career Guide');

    // Sort by relevance score
    allLinks.sort((a, b) => b.score - a.score);

    // Take top 25, filter out the exact page we are currently on
    return allLinks
      .filter(link => link.route !== location.pathname)
      .slice(0, 25);

  }, [currentSlug, location.pathname]);

  const coreTools = [
    { route: '/resume-builder', title: 'AI Resume Builder' },
    { route: '/analyze', title: 'Free ATS Scanner' },
    { route: '/interview-sim', title: 'Mock Interview Simulator' },
    { route: '/skill-gap', title: 'Skill Gap Analyzer' },
  ];

  return (
    <div style={{ backgroundColor: '#0f172a', padding: '4rem 1rem', marginTop: '4rem', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: '#f8fafc', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
          Related Resources & Next Steps
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          
          {/* Topically Relevant Links Cluster */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {relatedLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.route}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  backgroundColor: '#1e293b', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '0.5rem',
                  color: '#cbd5e1', 
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  border: '1px solid #334155',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#334155';
                  e.currentTarget.style.borderColor = '#475569';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                  e.currentTarget.style.borderColor = '#334155';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                <span style={{ color: '#60a5fa', marginRight: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {link.typeLabel}
                </span>
                {link.title}
              </Link>
            ))}
          </div>
          
        </div>

        {/* Core Hubs (Always present for breadcrumbing) */}
        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px dashed #334155' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Core Career Tools
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {coreTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.route}
                style={{
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
                onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {tool.title} &rarr;
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RelatedResources;
