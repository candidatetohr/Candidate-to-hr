import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { roadmapList } from '../../data/roadmaps/index.js';
import { salaryCategories } from '../../data/salaryGuides/index.js';
import { interviewCategories } from '../../data/interviewQuestions/index.js';
import { resumeCategories } from '../../data/resumeExamples/index.js';
import { careerGuideCategories } from '../../data/careerGuides/index.js';
import './RelatedResources.css';

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

export default function RelatedResources({ items }) {
  const location = useLocation();
  
  // Extract slug from URL (e.g. /roadmaps/data-engineer -> data-engineer)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentCategory = pathParts[0]; // e.g., 'roadmaps'
  const currentSlug = pathParts.length > 1 ? pathParts[1] : null;

  const relatedLinks = useMemo(() => {
    if (items && items.length > 0) return [];
    
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

    // Take top 4, filter out the exact page we are currently on
    return allLinks
      .filter(link => link.route !== location.pathname)
      .slice(0, 4);

  }, [items, currentSlug, location.pathname]);

  // If we have custom items, render them
  if (items && items.length > 0) {
    return (
      <div className="related-resources-wrapper">
        <h2 className="related-title">Related Resources & Next Steps</h2>
        <div className="related-grid">
          {items.map((item, idx) => (
            <Link key={idx} to={item.url} className="related-card">
              <span className="related-icon" role="img" aria-hidden="true">
                {item.icon || '🔗'}
              </span>
              <div className="related-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <div className="related-arrow">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // If no items, and we are not on an SEO content page, do not render anything
  const isSEOPage = ['roadmaps', 'salary-guides', 'interview-questions', 'resume-examples', 'career-guides'].includes(currentCategory);
  if (!isSEOPage) return null;

  // Otherwise, render the fallback topically relevant links
  return (
    <div className="related-resources-wrapper">
      <h2 className="related-title">Related Resources & Next Steps</h2>
      <div className="related-grid">
        {relatedLinks.map((link, idx) => (
          <Link key={idx} to={link.route} className="related-card">
            <span className="related-icon" role="img" aria-hidden="true">💡</span>
            <div className="related-content">
              <h4>{link.title}</h4>
              <p>Explore this verified {link.typeLabel.toLowerCase()} guide on CandidateToHR.</p>
            </div>
            <div className="related-arrow">
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
