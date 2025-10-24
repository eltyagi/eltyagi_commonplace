import React, { useEffect, useState, useRef, useCallback } from 'react';
import './Meditations.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';
import BlogCard from '../blog-card/BlogCard';
import matter from 'gray-matter';

// Optimized LazyImage component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}> = ({ src, alt, className = '', onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setIsInView(true);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [handleIntersection]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    console.error('Failed to load image:', src);
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`lazy-image-container ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {isInView && !hasError && (
        <>
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          />
          {!isLoaded && (
            <div className="image-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
        </>
      )}
      {!isInView && (
        <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      {hasError && (
        <div className="image-placeholder">
          <span style={{ fontSize: '12px', color: '#999' }}>Failed to load</span>
        </div>
      )}
    </div>
  );
};

// Interface for image data
interface SceneryImage {
  src: string;
  caption: string;
  filename: string;
  loaded: boolean;
}

// Interface for meditation section
interface MeditationSection {
  title: string;
  classification: string;
  excerpt?: string;
  content?: string;
  isGallery?: boolean;
}

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
  const [sceneryImages, setSceneryImages] = useState<SceneryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);
  const [meditationSections, setMeditationSections] = useState<MeditationSection[]>([
    {
      title: "Sceneries from my world",
      classification: "Visual Gallery",
      isGallery: true
    }
  ]);
  const isMobile = useIsMobile();

  // Load meditation content from markdown files
  useEffect(() => {
    const loadMeditationContent = async () => {
      try {
        const sections: MeditationSection[] = [
          {
            title: "Sceneries from my world",
            classification: "Visual Gallery",
            isGallery: true
          }
        ];

        // Load markdown files using glob
        const meditationFiles = import.meta.glob('../../assets/meditations/*.md', { 
          query: '?raw',
          import: 'default'
        });

        console.log('Found meditation files:', Object.keys(meditationFiles));

        // Load each markdown file
        for (const path of Object.keys(meditationFiles)) {
          try {
            const content = await meditationFiles[path]() as string;
            const parsed = matter(content);
            console.log('Loaded meditation file:', path, parsed);
            
            sections.push({
              title: parsed.data.title || "Untitled",
              classification: parsed.data.classification || "General",
              excerpt: parsed.data.excerpt,
              content: parsed.content
            });
          } catch (error) {
            console.error(`Failed to load ${path}:`, error);
          }
        }

        console.log('All sections loaded:', sections);
        setMeditationSections(sections);
      } catch (error) {
        console.error('Error loading meditation content:', error);
      }
    };

    loadMeditationContent();
  }, []);

  // Load scenery images dynamically
  useEffect(() => {
    const loadImages = async () => {
      try {
        setImagesLoading(true);
        const imageModules = import.meta.glob('../../assets/sceneries/*.{png,jpg,jpeg,gif,webp}', { eager: false });
        
        console.log('Found image modules:', Object.keys(imageModules));
        
        const imagePromises = Object.entries(imageModules).map(async ([path, resolver]) => {
          const filename = path.split('/').pop() || '';
          // Skip README and placeholder files
          if (filename.toLowerCase().includes('readme') || filename.toLowerCase().includes('placeholder')) {
            return null;
          }
          
          try {
            const module = await resolver() as { default: string };
            console.log('Loaded image:', filename, module.default);
            return {
              src: module.default,
              caption: ``,
              filename: filename,
              loaded: false
            };
          } catch (error) {
            console.warn(`Failed to load image: ${filename}`, error);
            return null;
          }
        });

        const loadedImages = (await Promise.all(imagePromises))
          .filter((img): img is SceneryImage => img !== null)
          .sort((a, b) => b.filename.localeCompare(a.filename)); // Sort by filename (newest first if using timestamps)

        console.log('Total loaded images:', loadedImages.length);
        setSceneryImages(loadedImages);
      } catch (error) {
        console.error('Error loading scenery images:', error);
      } finally {
        setImagesLoading(false);
      }
    };

    loadImages();
  }, []);

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
      // If clicking the same card, collapse it and go back to default (index 0)
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
      setIsMobileContentView(false);
    } else {
      // If clicking a different card, immediately show its content
      setActiveCardIndex(index);
      setIsViewing(true); // Always show content immediately
      // On mobile, show the content view
      if (isMobile) {
        setIsMobileContentView(true);
      }
    }
  };

  const handleViewStateChange = (viewing: boolean) => {
    // When user clicks "Viewing", collapse back to default card (index 0)
    if (!viewing) {
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
      setIsMobileContentView(false);
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
                    {imagesLoading ? (
                      <div className="gallery-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading beautiful moments...</span>
                      </div>
                    ) : (
                      sceneryImages.slice(0, 6).map((image, index) => (
                        <div key={image.filename} className="scenery-card">
                          <LazyImage
                            src={image.src}
                            alt={image.caption}
                            onClick={() => handleImageClick(index)}
                          />
                          <span className="scenery-caption">{image.caption}</span>
                        </div>
                      ))
                    )}
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
                onCardClick={() => handleCardClick(index)}
                onViewStateChange={handleViewStateChange}
              />
            ))}
          </div>


          <div className='meditation-content-display fira-code-regular'>
            {activeSection && !isMobile && isViewing && (
              <div className='meditation-content'>
                <div className='meditation-content-title'>{activeSection.title}</div>
                <div className='meditation-content-classification'>{activeSection.classification}</div>
                <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
                
                {/* Render gallery for sceneries section */}
                {activeSection.isGallery && (
                  <div className="sceneries-gallery">
                    {imagesLoading ? (
                      <div className="gallery-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading beautiful moments...</span>
                      </div>
                    ) : (
                      sceneryImages.map((image, index) => (
                        <div key={image.filename} className="scenery-card">
                          <LazyImage
                            src={image.src}
                            alt={image.caption}
                            onClick={() => handleImageClick(index)}
                          />
                          <span className="scenery-caption">{image.caption}</span>
                        </div>
                      ))
                    )}
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
      {expandedImageIndex !== null && sceneryImages.length > 0 && sceneryImages[expandedImageIndex] && (
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
            {sceneryImages.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meditations;