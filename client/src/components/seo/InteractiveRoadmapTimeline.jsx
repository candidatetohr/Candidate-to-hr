import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, CheckCircle2 } from 'lucide-react';
import './InteractiveRoadmapTimeline.css';

/**
 * InteractiveRoadmapTimeline Component
 * Replaces the static timeline with an interactive, expanding accordion timeline
 * to increase user engagement and dwell time.
 */
export default function InteractiveRoadmapTimeline({ learningPath }) {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  if (!learningPath || learningPath.length === 0) return null;

  return (
    <div className="irt-container">
      {learningPath.map((step, i) => {
        const isOpen = openIndex === i;
        const isPast = openIndex > i && openIndex !== -1;

        return (
          <div key={i} className={`irt-item ${isOpen ? 'irt-open' : ''} ${isPast ? 'irt-past' : ''}`}>
            <div className="irt-line"></div>
            
            <div className="irt-marker" onClick={() => toggleOpen(i)}>
              {isPast ? <CheckCircle2 size={20} className="text-green-400 bg-bg" /> : <div className="irt-dot"></div>}
            </div>

            <div className="irt-content card cursor-pointer hover:border-primary transition-colors" onClick={() => toggleOpen(i)}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold m-0">{step.month}</h3>
                {isOpen ? <ChevronUp className="text-secondary" /> : <ChevronDown className="text-secondary" />}
              </div>
              
              <div className={`irt-details ${isOpen ? 'expanded' : ''}`}>
                <p className="mt-16 text-secondary leading-relaxed">{step.description}</p>
                
                {/* Simulated interaction element for extra engagement */}
                <div className="mt-16 pt-16 border-t border-default flex justify-between items-center">
                  <span className="text-sm font-semibold color-primary">Estimated Time: 4-6 weeks</span>
                  <button className="btn btn-sm btn-outline" onClick={(e) => { e.stopPropagation(); toggleOpen(i+1); }}>
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
