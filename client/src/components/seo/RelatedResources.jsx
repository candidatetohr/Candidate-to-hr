import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './RelatedResources.css';

export default function RelatedResources({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="related-resources-wrapper">
      <h3 className="related-title">Related Resources</h3>
      <div className="related-grid">
        {items.map((item, index) => (
          <Link key={index} to={item.url} className="related-card">
            <div className="related-icon">{item.icon || '📄'}</div>
            <div className="related-content">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div className="related-arrow">
              <ChevronRight size={16} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
