import { useState, useEffect } from 'react';
import './ReadingProgress.css';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const scrolled = (window.scrollY / totalHeight) * 100;
        setProgress(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="reading-progress-container" 
      role="progressbar" 
      aria-valuenow={Math.round(progress)} 
      aria-valuemin="0" 
      aria-valuemax="100"
    >
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}
