import CareerKnowledgeGraph from './CareerKnowledgeGraph';
import AnalyticsService from './AnalyticsService';
import { roadmapList } from '../data/roadmaps';
import { interviewCategories } from '../data/interviewQuestions';
import { careerGuideCategories } from '../data/careerGuides';
import { salaryCategories } from '../data/salaryGuides';
import { resumeCategories } from '../data/resumeExamples';

/**
 * Levenshtein distance for fuzzy matching/typo correction
 */
function getLevenshteinDistance(a, b) {
  const tmp = [];
  let i, j, val;
  for (i = 0; i <= a.length; i++) {
    tmp.push([i]);
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        val = 0;
      } else {
        val = 1;
      }
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + val
      );
    }
  }
  return tmp[a.length][b.length];
}

const aiToolsList = [
  { id: 'analyze', title: 'AI Resume Analyzer', description: 'Score your resume against 7 AI metrics: skills match, ATS compatibility, and readability.', url: '/analyze', category: 'AI Tool' },
  { id: 'resume-builder', title: 'AI Resume Builder', description: 'Generate professional, ATS-optimized resumes using AI tailors.', url: '/resume-builder', category: 'AI Tool' },
  { id: 'live-editor', title: 'Live AI Editor', description: 'Edit your resume in real-time and see your ATS score update instantly.', url: '/live-editor', category: 'AI Tool' },
  { id: 'interview-sim', title: 'Interview Simulator', description: 'Practice with a real-time AI interviewer that grades your answers.', url: '/interview-sim', category: 'AI Tool' },
  { id: 'rejection-decoder', title: 'Rejection Decoder', description: 'Paste a rejection email and get the brutal truth on why you failed.', url: '/rejection-decoder', category: 'AI Tool' },
  { id: 'learning-path', title: 'Learning Path Generator', description: 'Generate a personalized week-by-week curriculum for your target role.', url: '/learning-path', category: 'AI Tool' },
  { id: 'placement-probability', title: 'Placement Probability', description: 'Predict your likelihood of landing specific tech roles.', url: '/placement-probability', category: 'AI Tool' },
  { id: 'truth-detector', title: 'Truth Detector', description: 'Scan your resume for overclaiming, contradictions, and credibility risks.', url: '/truth-detector', category: 'AI Tool' },
  { id: 'culture-fit', title: 'Culture Fit Analyzer', description: 'Assess alignment between your values and company culture.', url: '/culture-fit', category: 'AI Tool' },
  { id: 'offer-negotiator', title: 'Offer Negotiator', description: 'Data-driven offer evaluation and negotiation strategies.', url: '/offer-negotiator', category: 'AI Tool' },
  { id: 'skill-gap', title: 'Skill Gap Analyzer', description: 'Identify missing skills and get a plan to close them.', url: '/skill-gap', category: 'AI Tool' },
  { id: 'network-builder', title: 'Network Builder', description: 'Generate a networking and outreach plan to connect with industry experts.', url: '/network-builder', category: 'AI Tool' },
  { id: 'portfolio-optimizer', title: 'Portfolio Optimizer', description: 'Optimize your portfolio projects to impress tech recruiters.', url: '/portfolio-optimizer', category: 'AI Tool' }
];

// Pre-compiled global search index containing all search targets
const globalIndex = [
  ...roadmapList.map(item => ({
    id: item.id,
    title: item.title,
    description: item.shortDescription || '',
    category: 'Roadmap',
    url: `/roadmaps/${item.id}`
  })),
  ...interviewCategories.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    category: 'Interview Prep',
    url: `/interview-questions/${item.id}`
  })),
  ...careerGuideCategories.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    category: 'Career Guide',
    url: `/career-guides/${item.id}`
  })),
  ...salaryCategories.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    category: 'Salary Guide',
    url: `/salary-guides/${item.id}`
  })),
  ...resumeCategories.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description || '',
    category: 'Resume Example',
    url: `/resume-examples/${item.id}`
  })),
  ...aiToolsList
];

export const SearchIntelligence = {
  /**
   * Get trending career searches
   */
  getTrending() {
    return [
      { id: 'ai-engineer', title: 'AI Engineer' },
      { id: 'full-stack-developer', title: 'Full Stack Developer' },
      { id: 'platform-engineer', title: 'Platform Engineer' },
      { id: 'data-scientist', title: 'Data Scientist' }
    ];
  },

  /**
   * Get autocompletion suggestions as the user types
   */
  getSuggestions(query) {
    if (!query || query.trim().length === 0) return [];
    
    const cleanQuery = query.toLowerCase().trim();
    const careers = Object.values(CareerKnowledgeGraph.getAll());
    
    return careers
      .filter(c => c.title.toLowerCase().includes(cleanQuery) || c.skills.some(s => s.toLowerCase().includes(cleanQuery)))
      .map(c => ({
        id: c.id,
        title: c.title,
        category: c.category,
        slug: c.roadmapSlug
      }))
      .slice(0, 5);
  },

  /**
   * Global multi-category search with relevance scoring
   */
  globalSearch(query) {
    if (!query || query.trim().length === 0) return [];
    const cleanQuery = query.toLowerCase().trim();
    
    // Log search event (throttled/centralized)
    if (this._lastLoggedGlobalQuery !== cleanQuery) {
      this._lastLoggedGlobalQuery = cleanQuery;
      clearTimeout(this._globalSearchLogTimeout);
      this._globalSearchLogTimeout = setTimeout(() => {
        AnalyticsService.search(cleanQuery, 10);
      }, 1500);
    }

    const scored = globalIndex.map(item => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();
      
      let score = 0;
      
      // 1. Exact title match
      if (titleLower === cleanQuery) {
        score += 100;
      }
      // 2. Prefix title match
      else if (titleLower.startsWith(cleanQuery)) {
        score += 80;
      }
      // 3. Substring title match
      else if (titleLower.includes(cleanQuery)) {
        score += 60;
      }
      
      // 4. Word-by-word matches
      const titleWords = titleLower.split(/\s+/);
      const queryWords = cleanQuery.split(/\s+/);
      const matchedWords = queryWords.filter(w => titleWords.includes(w));
      score += matchedWords.length * 15;
      
      // 5. Description match
      if (descLower.includes(cleanQuery)) {
        score += 30;
      }
      
      // 6. Category match
      if (catLower.includes(cleanQuery)) {
        score += 20;
      }
      
      // 7. Fuzzy matching for typos (fallback when score is very low)
      if (score === 0) {
        let minDistance = 999;
        for (const tWord of titleWords) {
          for (const qWord of queryWords) {
            if (tWord.length > 2 && qWord.length > 2) {
              const dist = getLevenshteinDistance(tWord, qWord);
              if (dist < minDistance) {
                minDistance = dist;
              }
            }
          }
        }
        if (minDistance <= 2) {
          score += (30 - minDistance * 10);
        }
      }
      
      return { ...item, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },

  /**
   * Backwards compatible search for single list filtering (used on hub pages)
   */
  search(query, list) {
    if (!query || query.trim().length === 0) return list;
    
    const cleanQuery = query.toLowerCase().trim();
    
    if (this._lastLoggedQuery !== cleanQuery) {
      this._lastLoggedQuery = cleanQuery;
      clearTimeout(this._searchLogTimeout);
      this._searchLogTimeout = setTimeout(() => {
        AnalyticsService.search(cleanQuery, list.length);
      }, 1000);
    }
    
    // 1. Exact or substring matching (highest weight)
    const exactMatches = list.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) || 
      (item.category && item.category.toLowerCase().includes(cleanQuery))
    );
    
    if (exactMatches.length > 0) {
      return exactMatches;
    }
    
    // 2. Fuzzy matching (typo correction) using Levenshtein distance
    const scoredList = list.map(item => {
      const titleWords = item.title.toLowerCase().split(/\s+/);
      const queryWords = cleanQuery.split(/\s+/);
      
      let minDistance = 999;
      
      for (const tWord of titleWords) {
        for (const qWord of queryWords) {
          const dist = getLevenshteinDistance(tWord, qWord);
          if (dist < minDistance) {
            minDistance = dist;
          }
        }
      }
      
      return { item, minDistance };
    });
    
    const fuzzyMatches = scoredList
      .filter(scored => scored.minDistance <= 2)
      .sort((a, b) => a.minDistance - b.minDistance)
      .map(scored => scored.item);
      
    return fuzzyMatches;
  }
};

export default SearchIntelligence;
