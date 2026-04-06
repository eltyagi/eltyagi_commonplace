import React from 'react';
import './SplitText.css';

interface SplitTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  stagger?: number; // delay between chars, default 0.03s
  delay?: number;   // initial delay before animation starts
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  as: Tag = 'span',
  stagger = 0.03,
  delay = 0
}) => {
  return (
    <Tag className={`split-text ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char"
          style={{ animationDelay: `${delay + i * stagger}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
