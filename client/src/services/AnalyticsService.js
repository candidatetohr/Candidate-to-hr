/**
 * CandidateToHR Privacy-Conscious Analytics Service
 * Abstraction layer to track behavior, conversions, and metrics without performance bloat.
 */
export const AnalyticsService = {
  /**
   * Log events to external providers (gtag, Mixpanel, etc.)
   */
  logEvent(eventName, params = {}) {
    const isDev = import.meta.env.DEV;
    
    // In development mode, log to console for debugging
    if (isDev) {
      console.log(
        `%c[Analytics] ${eventName}`, 
        'background: #4f8ef7; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;', 
        params
      );
    }

    // Google Analytics Integration hook
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }

    // Store in local storage for session mapping (privacy-conscious, no cookies)
    try {
      const logs = JSON.parse(localStorage.getItem('c2h_analytics_logs') || '[]');
      logs.push({ eventName, params, timestamp: new Date().toISOString() });
      // Keep only last 50 events locally
      if (logs.length > 50) logs.shift();
      localStorage.setItem('c2h_analytics_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore storage errors
    }
  },

  /**
   * Track page views
   */
  pageView(path) {
    this.logEvent('page_view', { page_path: path });
  },

  /**
   * Track internal search queries
   */
  search(query, resultsCount) {
    this.logEvent('search_query', { query, results_count: resultsCount });
  },

  /**
   * Track clicks on search results
   */
  searchClick(cardTitle, destination) {
    this.logEvent('search_click', { card_title: cardTitle, destination });
  },

  /**
   * Track call-to-action button clicks
   */
  ctaClick(buttonName, path) {
    this.logEvent('cta_click', { button_name: buttonName, destination_path: path });
  },

  /**
   * Track resume uploads
   */
  resumeUpload(filename, fileType) {
    this.logEvent('resume_upload', { filename, file_type: fileType });
  },

  /**
   * Track AI tool usage
   */
  aiToolUsage(toolName, action) {
    this.logEvent('ai_tool_usage', { tool_name: toolName, action_name: action });
  },

  /**
   * Track reading completion thresholds
   */
  readingCompletion(title, durationSeconds) {
    this.logEvent('reading_completion', { title, duration_seconds: durationSeconds });
  },

  /**
   * Track scroll depth milestone triggers
   */
  scrollDepth(percent) {
    this.logEvent('scroll_depth', { milestone_percent: percent });
  },

  /**
   * Track exit pages
   */
  exitPage(path) {
    this.logEvent('exit_page', { page_path: path });
  },

  /**
   * Track 404 pages
   */
  visit404(path) {
    this.logEvent('visit_404', { original_path: path });
  },

  /**
   * Track download events
   */
  downloadEvent(filename) {
    this.logEvent('download_file', { filename });
  },

  /**
   * Track form submissions
   */
  formSubmission(formName) {
    this.logEvent('form_submission', { form_name: formName });
  }
};

export default AnalyticsService;
