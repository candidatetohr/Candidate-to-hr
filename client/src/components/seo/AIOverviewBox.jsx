import './AIOverviewBox.css';
import { Target, HelpCircle, CheckCircle2, ListFilter } from 'lucide-react';

export default function AIOverviewBox({ quickAnswer, takeaways = [], definition, stats = {} }) {
  return (
    <section className="ai-overview-box" aria-label="AI Search Summary & Key Takeaways">
      <div className="ai-overview-header">
        <div className="ai-badge-header">
          <span className="sparkle-pulse">✨</span>
          <span>Google AI Overview Optimizer</span>
        </div>
      </div>

      <div className="ai-overview-content-grid">
        {/* Left Side: Definition & Quick Answer */}
        <div className="ai-definition-side">
          {definition && (
            <div className="definition-node">
              <h4 className="definition-title-sub"><HelpCircle size={15} /> Definition</h4>
              <p className="definition-p"><strong>{definition}</strong></p>
            </div>
          )}

          {quickAnswer && (
            <div className="quick-answer-node">
              <h4 className="definition-title-sub"><CheckCircle2 size={15} /> Quick Summary</h4>
              <p className="quick-answer-p">{quickAnswer}</p>
            </div>
          )}
        </div>

        {/* Right Side: Quick Stats Table */}
        {Object.keys(stats).length > 0 && (
          <div className="ai-stats-side">
            <h4 className="definition-title-sub"><ListFilter size={15} /> Career Metrics</h4>
            <div className="stats-comparison-table">
              {Object.entries(stats).map(([label, val]) => (
                <div key={label} className="stats-comparison-row">
                  <span className="stats-comp-label">{label}</span>
                  <span className="stats-comp-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Takeaways Section */}
      {takeaways && takeaways.length > 0 && (
        <div className="ai-takeaways-node">
          <h4 className="definition-title-sub"><Target size={15} /> Key Takeaways & Core Skills</h4>
          <ul className="takeaways-list-grid">
            {takeaways.map((item, idx) => (
              <li key={idx} className="takeaways-list-item">
                <span className="bullet-bullet">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
