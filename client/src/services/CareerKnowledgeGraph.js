import graphData from '../data/careerKnowledgeGraph.json';

/**
 * Career Knowledge Graph Service
 * Provides helper methods to dynamically query career connections and prevent hardcoding.
 */
export const CareerKnowledgeGraph = {
  /**
   * Get the entire career knowledge graph data.
   */
  getAll() {
    return graphData;
  },

  /**
   * Get a career node by its ID (e.g. 'data-engineer').
   */
  getById(id) {
    return graphData[id] || null;
  },

  /**
   * Find a career node by matching any of its page slugs.
   * @param {('roadmap'|'resume'|'interview'|'salary'|'careerGuide')} type 
   * @param {string} slug 
   */
  getBySlug(type, slug) {
    if (!slug) return null;
    const cleanSlug = slug.toLowerCase();
    
    return Object.values(graphData).find(career => {
      switch (type) {
        case 'roadmap':
          return career.roadmapSlug && career.roadmapSlug.toLowerCase() === cleanSlug;
        case 'resume':
          return career.resumeSlug && career.resumeSlug.toLowerCase() === cleanSlug;
        case 'interview':
          return career.interviewSlug && career.interviewSlug.toLowerCase() === cleanSlug;
        case 'careerGuide':
          return career.careerGuideSlug && career.careerGuideSlug.toLowerCase() === cleanSlug;
        case 'salary':
          if (Array.isArray(career.salarySlugs)) {
            return career.salarySlugs.some(s => s.toLowerCase() === cleanSlug);
          }
          return false;
        default:
          return false;
      }
    }) || null;
  },

  /**
   * Get all connected assets/URLs for a career node.
   * Useful for dynamic quick-links and related resource sidebars.
   */
  getLinks(id) {
    const career = this.getById(id);
    if (!career) return null;

    return {
      roadmap: career.roadmapSlug ? `/roadmaps/${career.roadmapSlug}` : null,
      resume: career.resumeSlug ? `/resume-examples/${career.resumeSlug}` : null,
      interview: career.interviewSlug ? `/interview-questions/${career.interviewSlug}` : null,
      salary: Array.isArray(career.salarySlugs) && career.salarySlugs.length > 0 
        ? `/salary-guides/${career.salarySlugs[0]}` 
        : null,
      careerGuide: career.careerGuideSlug ? `/career-guides/${career.careerGuideSlug}` : null
    };
  },

  /**
   * Get related career nodes based on the graph's connections.
   */
  getRelated(id) {
    const career = this.getById(id);
    if (!career || !Array.isArray(career.relatedCareers)) return [];
    
    return career.relatedCareers
      .map(relatedId => this.getById(relatedId))
      .filter(Boolean);
  }
};

export default CareerKnowledgeGraph;
