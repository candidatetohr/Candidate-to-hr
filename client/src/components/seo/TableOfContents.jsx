import { useState, useEffect } from 'react';
import './TableOfContents.css';
import { AlignLeft } from 'lucide-react';

export default function TableOfContents({ contentSelector = 'main' }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    let observer = null;
    let elements = [];

    // Locate elements after rendering completes
    const timer = setTimeout(() => {
      const container = document.querySelector(contentSelector);
      if (!container) return;

      elements = container.querySelectorAll('h2, h3');
      const headingList = Array.from(elements).map((el, index) => {
        // Ensure element has an ID for hashing/linking
        if (!el.id) {
          const cleanText = el.innerText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          el.id = `${cleanText}-${index}`;
        }
        return {
          id: el.id,
          text: el.innerText,
          level: el.tagName.toLowerCase()
        };
      });

      setHeadings(headingList);

      // Intersection Observer to track active header on scroll
      observer = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries.find((entry) => entry.isIntersecting);
          if (visibleEntry) {
            setActiveId(visibleEntry.target.id);
          }
        },
        { rootMargin: '-100px 0px -40% 0px' }
      );

      elements.forEach((el) => observer.observe(el));
    }, 500);

    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [contentSelector]);

  if (headings.length === 0) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset navbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="table-of-contents" aria-label="Table of Contents">
      <div className="toc-header">
        <AlignLeft size={16} />
        <span>Table of Contents</span>
      </div>
      <ul className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item toc-${h.level}`}>
            <a 
              href={`#${h.id}`} 
              className={activeId === h.id ? 'active' : ''}
              onClick={(e) => handleClick(e, h.id)}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
