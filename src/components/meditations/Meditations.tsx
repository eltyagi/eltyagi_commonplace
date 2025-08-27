import React, { useEffect, useState } from 'react';
import './Meditations.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';
import BlogCard from '../blog-card/BlogCard';

// Custom hook for responsive design
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const Meditations: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isMobileContentView, setIsMobileContentView] = useState<boolean>(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Hardcoded content for the three sections
  const meditationSections = [
    {
      title: "Sceneries from my world",
      classification: "Visual Gallery",
      excerpt: "A collection of beautiful moments and places that inspire me daily.",
      content: `Welcome to my visual journey through life's beautiful moments.

These are the scenes that capture my attention, inspire my thoughts, and remind me of the beauty that surrounds us every day. From urban landscapes to natural wonders, each image tells a story of discovery and wonder.`,
      isGallery: true // Special flag to render gallery instead of text
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

  // Update initial viewing state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setIsViewing(true); // Desktop shows content by default
      setIsMobileContentView(false);
    } else {
      setIsViewing(false); // Mobile doesn't show content initially
      setIsMobileContentView(false);
    }
  }, [isMobile]);

  const handleCardClick = (index: number) => {
    if (activeCardIndex === index) {
      // If clicking the same card, toggle its expanded state
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile

    } else {
      // If clicking a different card, expand it and reset viewing state
      setActiveCardIndex(index);
      setIsViewing(false); // Don't show content initially
    }
  };

  const handleViewStateChange = (viewing: boolean) => {
    setIsViewing(viewing);
    // On mobile, when user clicks "View", show the content view
    if (viewing && isMobile) {
      setIsMobileContentView(true);
    }
  };

  const handleBackToCards = () => {
    setIsMobileContentView(false);
  };

  const handleImageClick = (index: number) => {
    setExpandedImageIndex(index);
  };

  const handleCloseExpandedImage = () => {
    setExpandedImageIndex(null);
  };

  const sceneryImages = [
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
    { src: "/src/assets/sceneries/myimg.png", caption: "San Diego, 2024" },
  ];

  const activeSection = meditationSections[activeCardIndex];

  return (
    <div className="meditations">
      {/* Header Overlay - positioned behind header but above content */}
      <div className="header-overlay"></div>
      
      {/* Footer Overlay - positioned behind navigation but above content */}
      <div className="footer-overlay"></div>
      
      <div className="pg-title-container">
        <PageHeader/>
      </div>

      {/* Mobile Content View */}
      {isMobileContentView && isMobile ? (
        <div className='mobile-content-view'>
          {/* Header Overlay with Title and Back Button - Static */}
          <div className="mobile-content-overlay">
            <div className='mobile-back-button' onClick={handleBackToCards}>
              <span className='back-icon'>←</span>
              <span className='back-text'>Back</span>
            </div>
            {activeSection && (
              <div className='mobile-content-title-overlay'>{activeSection.title}</div>
            )}
          </div>
          
          <div className='mobile-meditation-content fira-code-regular'>
            {activeSection && (
              <div className='meditation-content'>
                <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
                
                {/* Render gallery for sceneries section on mobile */}
                {activeSection.isGallery && (
                  <div className="sceneries-gallery mobile-gallery">
                    {sceneryImages.slice(0, 6).map((image, index) => (
                      <div 
                        key={index} 
                        className="scenery-card" 
                        onClick={() => handleImageClick(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={image.src} alt={image.caption} />
                        <span className="scenery-caption">{image.caption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop and Mobile Card View */
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


          <div className='meditation-content-display fira-code-regular'>
            {activeSection && !isMobile && (activeCardIndex === 0 || isViewing) && (
              <div className='meditation-content'>
                <div className='meditation-content-title'>{activeSection.title}</div>
                <div className='meditation-content-classification'>{activeSection.classification}</div>
                <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
                
                {/* Render gallery for sceneries section */}
                {activeSection.isGallery && (
                  <div className="sceneries-gallery">
                    {sceneryImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="scenery-card" 
                        onClick={() => handleImageClick(index)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={image.src} alt={image.caption} />
                        <span className="scenery-caption">{image.caption}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation - hide in mobile content view */}
      {!(isMobileContentView && isMobile) && (
        <div className="nav">
          <Navigation />
        </div>
      )}

      {/* Expanded Image Modal */}
      {expandedImageIndex !== null && (
        <div className="image-modal-overlay" onClick={handleCloseExpandedImage}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={handleCloseExpandedImage}>
              ×
            </button>
            <img 
              src={sceneryImages[expandedImageIndex].src} 
              alt={sceneryImages[expandedImageIndex].caption}
              className="expanded-image"
            />
            <div className="expanded-image-caption">
              {sceneryImages[expandedImageIndex].caption}
            </div>
            
            {/* Navigation arrows */}
            <button 
              className="image-nav-button prev" 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImageIndex(
                  expandedImageIndex > 0 ? expandedImageIndex - 1 : sceneryImages.length - 1
                );
              }}
            >
              ‹
            </button>
            <button 
              className="image-nav-button next" 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImageIndex(
                  expandedImageIndex < sceneryImages.length - 1 ? expandedImageIndex + 1 : 0
                );
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meditations;