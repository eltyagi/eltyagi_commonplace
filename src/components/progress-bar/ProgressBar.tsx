import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  /** Index of the currently active card (0-based) */
  currentIndex: number;
  /** Total number of cards */
  totalCount: number;
  /** Orientation of the progress bar */
  orientation: 'vertical' | 'horizontal';
  /** Callback when an indicator is clicked */
  onIndicatorClick?: (index: number) => void;
}

/**
 * Progress bar component showing card navigation state.
 * Displays lines for collapsed cards, a box for the active card.
 * Supports both vertical (desktop) and horizontal (mobile) orientations.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalCount,
  orientation,
  onIndicatorClick,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className={`progress-bar progress-bar--${orientation}`}>
      {Array.from({ length: totalCount }, (_, index) => {
        const isActive = index === currentIndex;
        return (
          <button
            key={index}
            className={`progress-indicator ${isActive ? 'progress-indicator--active' : 'progress-indicator--inactive'}`}
            onClick={() => onIndicatorClick?.(index)}
            aria-label={`Go to card ${index + 1}${isActive ? ' (current)' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="progress-indicator__shape" />
          </button>
        );
      })}
    </div>
  );
};

export default ProgressBar;
