import React from 'react';
import './ToolEditorial.css';

export default function ToolEditorial({
  whatItDoes,
  howItWorks,
  whoShouldUse,
  benefits,
  limitations,
  bestPractices,
  faq
}) {
  return (
    <section className="tool-editorial">
      <div className="editorial-container">
        
        {whatItDoes && (
          <div className="editorial-section">
            <h2>What This Tool Does</h2>
            <div dangerouslySetInnerHTML={{ __html: whatItDoes }} />
          </div>
        )}

        {howItWorks && (
          <div className="editorial-section">
            <h2>How It Works</h2>
            <div dangerouslySetInnerHTML={{ __html: howItWorks }} />
          </div>
        )}

        {whoShouldUse && (
          <div className="editorial-section">
            <h2>Who Should Use This Tool</h2>
            <div dangerouslySetInnerHTML={{ __html: whoShouldUse }} />
          </div>
        )}

        {benefits && (
          <div className="editorial-section">
            <h2>Benefits of Using This Tool</h2>
            <div dangerouslySetInnerHTML={{ __html: benefits }} />
          </div>
        )}

        {limitations && (
          <div className="editorial-section">
            <h2>Limitations to Keep in Mind</h2>
            <div dangerouslySetInnerHTML={{ __html: limitations }} />
          </div>
        )}

        {bestPractices && (
          <div className="editorial-section">
            <h2>Best Practices for Maximum Impact</h2>
            <div dangerouslySetInnerHTML={{ __html: bestPractices }} />
          </div>
        )}

        {faq && faq.length > 0 && (
          <div className="editorial-section faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              {faq.map((item, index) => (
                <div key={index} className="faq-item">
                  <h3>{item.q}</h3>
                  <p>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
