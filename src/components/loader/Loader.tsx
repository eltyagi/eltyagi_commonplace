import { useEffect, useState } from 'react';
import './Loader.css';

interface LoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

const Loader: React.FC<LoaderProps> = ({ isLoading, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  
  // Contemplative phrases that match the site's philosophical nature
  const phrases = [
    '...',
    'gathering thoughts',
    'arranging words',
    'finding meaning',
  ];

  useEffect(() => {
    if (!isLoading) {
      // Start fade out animation
      setFadeOut(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 600); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  // Cycle through phrases while loading
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [isLoading, phrases.length]);

  if (!visible) return null;

  return (
    <div className={`loader-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-content">
        {/* Animated cursor/caret */}
        <div className="loader-cursor-container">
          <span className="loader-cursor">|</span>
        </div>
        
        {/* Typewriter text */}
        <div className="loader-text fira-code-regular">
          <span className="loader-phrase" key={currentPhrase}>
            {phrases[currentPhrase]}
          </span>
        </div>
        
        {/* Subtle progress indicator - three dots */}
        <div className="loader-dots">
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
          <span className="loader-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
