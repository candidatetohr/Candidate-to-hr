import CareerKnowledgeGraph from './CareerKnowledgeGraph';

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
   * Search careers with typo correction & fuzzy matching
   */
  search(query, list) {
    if (!query || query.trim().length === 0) return list;
    
    const cleanQuery = query.toLowerCase().trim();
    
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
      
      // Compare word-by-word
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
    
    // Filter fuzzy matches where distance is small relative to word length (e.g. max 2 typos)
    const fuzzyMatches = scoredList
      .filter(scored => scored.minDistance <= 2)
      .sort((a, b) => a.minDistance - b.minDistance)
      .map(scored => scored.item);
      
    return fuzzyMatches;
  }
};

export default SearchIntelligence;
