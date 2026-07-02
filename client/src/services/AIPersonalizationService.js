import CareerKnowledgeGraph from './CareerKnowledgeGraph';

/**
 * CandidateToHR AI Personalization Service
 * Caches and serves custom recommendations based on user activities and graph connections.
 */
export const AIPersonalizationService = {
  STORAGE_KEY: 'c2h_user_profile',

  /**
   * Save user career interest profile details
   */
  setUserInterest(careerId) {
    try {
      const profile = {
        primaryCareerId: careerId,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      // Ignore storage block errors
    }
  },

  /**
   * Get cached user career interest profile
   */
  getUserInterest() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  },

  /**
   * Get dynamic personalization recommendations based on profile
   */
  getRecommendations() {
    const profile = this.getUserInterest();
    if (!profile || !profile.primaryCareerId) {
      // Fallback: Default to trending AI engineer path
      return CareerKnowledgeGraph.getById('ai-engineer');
    }
    return CareerKnowledgeGraph.getById(profile.primaryCareerId) || CareerKnowledgeGraph.getById('ai-engineer');
  }
};

export default AIPersonalizationService;
