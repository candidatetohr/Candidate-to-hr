import React from 'react';
import { Download, Rocket, PlayCircle } from 'lucide-react';
import './LearningJourneyCTA.css';

/**
 * LearningJourneyCTA Component
 * A highly visual call-to-action strip placed mid-article or end-article
 * to capture leads and increase dwell time/interaction.
 */
export default function LearningJourneyCTA({ roleName }) {
  return (
    <div className="lj-cta-container">
      <div className="lj-cta-content">
        <h3 className="text-2xl font-bold mb-8">Serious about becoming a {roleName || 'developer'}?</h3>
        <p className="text-primary mb-24 max-w-2xl mx-auto">
          Don't just read about it. Take action. Join 10,000+ developers who are using our free interactive roadmap tracking to land their next role.
        </p>
        
        <div className="lj-cta-buttons">
          <button className="btn btn-primary btn-lg flex items-center justify-center gap-8">
            <PlayCircle size={18} /> Start Interactive Tracking
          </button>
          <button className="btn btn-outline btn-lg flex items-center justify-center gap-8 bg-surface">
            <Download size={18} /> Download PDF Guide
          </button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="lj-cta-decoration lj-cta-dec-1"><Rocket size={120} opacity={0.05} /></div>
    </div>
  );
}
