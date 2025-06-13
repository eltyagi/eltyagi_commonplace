import React, { useState } from 'react';
import './Meditations.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';
import BlogCard from '../blog-card/BlogCard';

const Meditations: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(true);

  // Hardcoded content for the three sections
  const meditationSections = [
    {
      title: "Sceneries from my world",
      classification: "Visual Gallery",
      excerpt: "A collection of beautiful moments and places that inspire me daily.",
      content: `Welcome to my visual journey through life's beautiful moments.

These are the scenes that capture my attention, inspire my thoughts, and remind me of the beauty that surrounds us every day. From urban landscapes to natural wonders, each image tells a story of discovery and wonder.

Note: This section will soon feature an embedded Instagram gallery showcasing these moments in their full glory.`
    },
    {
      title: "Tech Stack",
      classification: "Technology",
      excerpt: "The tools and technologies that power my digital creations.",
      content: `Here's the technology stack that I work with and love:

Frontend Development:
• React & TypeScript - For building robust user interfaces
• Vite - Lightning-fast build tool and development server
• CSS3 & Modern Styling - Creating beautiful, responsive designs

Development Tools:
• VS Code - My preferred code editor
• Git & GitHub - Version control and collaboration
• ESLint - Code quality and consistency

Design & Planning:
• Figma - UI/UX design and prototyping
• Notion - Project planning and documentation

Currently Learning:
• Advanced React patterns
• Backend development with Node.js
• Mobile development with React Native

The beauty of technology lies not just in what it can do, but in how elegantly it can solve real-world problems.`
    },
    {
      title: "Principles",
      classification: "Philosophy",
      excerpt: "Core values and guiding questions that shape my approach to life and work.",
      content: `My Guiding Principles:

1. Continuous Learning
   "Stay curious, stay humble. Every day offers a chance to learn something new."

2. Quality over Quantity
   "Better to do fewer things excellently than many things poorly."

3. Empathy in Design
   "Build for humans, not just for code. Consider the person behind every interaction."

4. Sustainable Progress
   "Progress isn't just about moving forward; it's about moving forward in a way that can be maintained."

Questions I Ask Myself:

• How can I make this better for the end user?
• What would I want if I were in their position?
• Is this solution sustainable and maintainable?
• Am I solving the right problem?
• How can I learn from this experience?
• What value am I creating for others?

These principles and questions guide my decisions, both in technology and in life. They remind me that behind every line of code, there's a human story waiting to be told.`
    }
  ];

  const handleCardClick = (index: number) => {
    if (activeCardIndex === index) {
      // If clicking the same card, toggle its expanded state
      setActiveCardIndex(0);
      setIsViewing(true);
    } else {
      // If clicking a different card, expand it and reset viewing state
      setActiveCardIndex(index);
      setIsViewing(false);
    }
  };

  const handleViewStateChange = (viewing: boolean) => {
    setIsViewing(viewing);
  };

  const activeSection = meditationSections[activeCardIndex];

  return (
    <div className="meditations">
      <div className="pg-title-container">
        <PageHeader/>
      </div>

      <div className='meditation-container krona-one-regular'>
        <div className='meditation-cards'>
          {meditationSections.map((section, index) => (
            <BlogCard
              key={index}
              index={index}
              title={section.title}
              classification={section.classification}
              excerpt={section.excerpt}
              content={section.content}
              isExpanded={activeCardIndex === index}
              isViewing={activeCardIndex === index && isViewing}
              onCardClick={() => handleCardClick(index)}
              onViewStateChange={handleViewStateChange}
            />
          ))}
        </div>

        <div className='meditation-content-display krona-one-regular'>
          {activeSection && (activeCardIndex === 0 || isViewing) && (
            <div className='meditation-content'>
              <div className='meditation-content-title'>{activeSection.title}</div>
              <div className='meditation-content-classification'>{activeSection.classification}</div>
              <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
            </div>
          )}
        </div>
      </div>

      <div className="nav">
        <Navigation />
      </div>
    </div>
  );
};

export default Meditations;