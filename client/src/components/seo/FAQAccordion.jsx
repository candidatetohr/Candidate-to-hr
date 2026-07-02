import { useState } from 'react';
import './FAQAccordion.css';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SchemaMarkup from './SchemaMarkup';

export default function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!items || items.length === 0) return null;

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-accordion-section" aria-label="Frequently Asked Questions">
      {/* Schema Injection */}
      <SchemaMarkup type="FAQPage" data={items} />

      <h3 className="faq-main-title">Frequently Asked Questions</h3>
      
      <div className="faq-accordion-list">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
              <button 
                className="faq-question-trigger"
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
              >
                <span className="faq-question-text">
                  <HelpCircle size={16} className="faq-icon-decoration" />
                  {item.q || item.question}
                </span>
                <ChevronDown size={18} className="chevron-toggle" />
              </button>
              
              <div className="faq-answer-panel" aria-hidden={!isOpen}>
                <div className="faq-answer-content">
                  {item.a || item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
