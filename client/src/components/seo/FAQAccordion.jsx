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

  const handleKeyDown = (e, idx) => {
    const triggers = document.querySelectorAll('.faq-question-trigger');
    const total = triggers.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        triggers[(idx + 1) % total].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        triggers[(idx - 1 + total) % total].focus();
        break;
      case 'Home':
        e.preventDefault();
        triggers[0].focus();
        break;
      case 'End':
        e.preventDefault();
        triggers[total - 1].focus();
        break;
      default:
        break;
    }
  };

  return (
    <section className="faq-accordion-section" aria-label="Frequently Asked Questions">
      {/* Schema Injection */}
      <SchemaMarkup type="FAQPage" data={items} />

      <h3 className="faq-main-title">Frequently Asked Questions</h3>
      
      <div className="faq-accordion-list">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const buttonId = `faq-btn-${idx}`;
          const panelId = `faq-panel-${idx}`;
          
          return (
            <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
              <button 
                id={buttonId}
                className="faq-question-trigger"
                onClick={() => toggleAccordion(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="faq-question-text">
                  <HelpCircle size={16} className="faq-icon-decoration" />
                  {item.q || item.question}
                </span>
                <ChevronDown size={18} className="chevron-toggle" />
              </button>
              
              <div 
                id={panelId}
                className="faq-answer-panel" 
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
              >
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
