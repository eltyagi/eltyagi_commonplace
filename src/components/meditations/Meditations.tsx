import { useEffect, useState, useRef, useCallback, CSSProperties } from 'react';
import './Meditations.css';
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';
import BlogCard from '../blog-card/BlogCard';
import ProgressBar from '../progress-bar/ProgressBar';
import Loader from '../loader/Loader';
import matter from 'gray-matter';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import { HEADER_HEIGHT_COLLAPSED, HEADER_HEIGHT_EXPANDED } from '../../constants/layout';

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
  isCarousel?: boolean;
}

// Custom hook for responsive design
const useIsMobile = () => {
  // Initialize with actual value to prevent flash of wrong layout
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 480;
    }
    return false;
  });

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Carousel component for rotating images
const ImageCarousel: React.FC<{ images: SceneryImage[] }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="carousel-loading">
        <div className="loading-spinner"></div>
        <span>Loading images...</span>
      </div>
    );
  }

  return (
    <div className="image-carousel">
      <div className="carousel-image-container">
        {images.map((image, index) => (
          <LazyImage
            key={image.filename}
            src={image.src}
            alt={image.caption}
            className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

const Meditations: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isMobileContentView, setIsMobileContentView] = useState<boolean>(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);
  const [sceneryImages, setSceneryImages] = useState<SceneryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);
  const [sectionsLoading, setSectionsLoading] = useState<boolean>(true);
  const [meditationSections, setMeditationSections] = useState<MeditationSection[]>([]);
  const isMobile = useIsMobile();
  const isHeaderCollapsed = useScrollThreshold();
  const headerHeight = isHeaderCollapsed ? HEADER_HEIGHT_COLLAPSED : HEADER_HEIGHT_EXPANDED;
  const containerStyle: CSSProperties = {
    '--header-height-current': `${headerHeight}px`
  } as CSSProperties;

  // Refs for scrolling to cards when progress bar is clicked
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref for scrolling content to top
  const contentDisplayRef = useRef<HTMLDivElement>(null);

  // Load meditation content from markdown files
  useEffect(() => {
    const loadMeditationContent = async () => {
      try {
        setSectionsLoading(true);
        const sections: MeditationSection[] = [];

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
            
            // Check if this is the about-me file to set isCarousel
            const isAboutMe = path.includes('about-me.md');
            
            sections.push({
              title: parsed.data.title || "Untitled",
              classification: parsed.data.classification || "General",
              excerpt: parsed.data.excerpt,
              content: parsed.content,
              isCarousel: isAboutMe
            });
          } catch (error) {
            console.error(`Failed to load ${path}:`, error);
          }
        }

        // Sort sections to ensure About Me comes first
        sections.sort((a, b) => {
          if (a.isCarousel) return -1;
          if (b.isCarousel) return 1;
          return 0;
        });

        console.log('All sections loaded:', sections);
        setMeditationSections(sections);
      } catch (error) {
        console.error('Error loading meditation content:', error);
      } finally {
        setSectionsLoading(false);
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

  const handleCardClick = useCallback((index: number) => {
    if (activeCardIndex === index) {
      // If clicking the same card, collapse it and go back to default (index 0)
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
      setIsMobileContentView(false);
    } else {
      // If clicking a different card, expand it (in place, no scroll)
      setActiveCardIndex(index);
      // On desktop, show content immediately
      // On mobile, just expand the card (don't show content yet)
      if (!isMobile) {
        setIsViewing(true);
      }
      // Don't set isMobileContentView here - wait for View button click
    }
  }, [activeCardIndex, isMobile]);

  const handleViewStateChange = (viewing: boolean) => {
    if (viewing) {
      // User clicked View button - show content
      setIsViewing(true);
      if (isMobile) {
        setIsMobileContentView(true);
      }
    } else {
      // Collapse back to default card (index 0)
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
      setIsMobileContentView(false);
    }
  };

  // Handle progress bar indicator click - scroll to card and expand it
  const handleProgressIndicatorClick = useCallback((index: number) => {
    setActiveCardIndex(index);
    // Scroll the card into view
    const card = cardRefs.current[index];
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Scroll content display to top
    if (contentDisplayRef.current) {
      contentDisplayRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Also scroll the main window to top for content visibility
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isMobile) {
      setIsViewing(true);
    }
  }, [isMobile]);

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

  // Combined loading state - wait for both sections and images
  const isLoading = sectionsLoading || imagesLoading;

  return (
    <div className="meditations" style={containerStyle}>
      <Loader isLoading={isLoading} />
      <div className="pg-title-container">
        <PageHeader isCollapsed={isHeaderCollapsed}/>
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
                {/* Render carousel content with split paragraphs */}
                {activeSection.isCarousel && activeSection.content && (
                  <>
                    {(() => {
                      const paragraphs = activeSection.content.trim().split('\n\n').filter(p => p.trim());
                      const midpoint = Math.floor(paragraphs.length / 2);
                      const firstHalf = paragraphs.slice(0, midpoint).join('\n\n');
                      const secondHalf = paragraphs.slice(midpoint).join('\n\n');
                      
                      return (
                        <>
                          <div className='meditation-content-text krona-one-regular'>{firstHalf}</div>
                          <ImageCarousel images={sceneryImages} />
                          <div className='meditation-content-text krona-one-regular'>{secondHalf}</div>
                        </>
                      );
                    })()}
                  </>
                )}
                
                {/* Regular content rendering for non-carousel sections */}
                {!activeSection.isCarousel && !activeSection.isGallery && activeSection.content && (
                  <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
                )}
                
                {/* Render gallery for sceneries section on mobile */}
                {activeSection.isGallery && (
                  <div className="sceneries-gallery mobile-gallery">
                    {imagesLoading ? (
                      <div className="gallery-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading beautiful moments...</span>
                      </div>
                    ) : (
                      sceneryImages.slice(0, 8).map((image, index) => (
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
      ) : sectionsLoading ? (
        /* Loading state */
        <div className='meditation-container krona-one-regular'>
          <div className='meditation-loading'>
            <div className='loading-spinner'></div>
          </div>
        </div>
      ) : (
        /* Desktop and Mobile Card View */
        <div className='meditation-container krona-one-regular'>
          {/* Progress Bar - Desktop (vertical) */}
          <div className='progress-bar-container progress-bar-container--vertical'>
            <ProgressBar
              currentIndex={activeCardIndex}
              totalCount={meditationSections.length}
              orientation="vertical"
              onIndicatorClick={handleProgressIndicatorClick}
            />
          </div>

          {/* Progress Bar - Mobile (horizontal) */}
          <div className='progress-bar-container progress-bar-container--horizontal'>
            <ProgressBar
              currentIndex={activeCardIndex}
              totalCount={meditationSections.length}
              orientation="horizontal"
              onIndicatorClick={handleProgressIndicatorClick}
            />
          </div>

          <div className='meditation-cards'>
            {meditationSections.map((section, index) => (
              <BlogCard
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
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


          <div ref={contentDisplayRef} className='meditation-content-display fira-code-regular'>
            {activeSection && !isMobile && isViewing && (
              <div className='meditation-content'>
                <div className='meditation-content-title'>{activeSection.title}</div>
                <div className='meditation-content-classification'>{activeSection.classification}</div>
                
                {/* Render carousel content with split paragraphs */}
                {activeSection.isCarousel && activeSection.content && (
                  <>
                    {(() => {
                      const paragraphs = activeSection.content.trim().split('\n\n').filter(p => p.trim());
                      const midpoint = Math.floor(paragraphs.length / 2);
                      const firstHalf = paragraphs.slice(0, midpoint).join('\n\n');
                      const secondHalf = paragraphs.slice(midpoint).join('\n\n');
                      
                      return (
                        <>
                          <div className='meditation-content-text krona-one-regular'>{firstHalf}</div>
                          <ImageCarousel images={sceneryImages} />
                          <div className='meditation-content-text krona-one-regular'>{secondHalf}</div>
                        </>
                      );
                    })()}
                  </>
                )}
                
                {/* Regular content rendering for non-carousel sections */}
                {!activeSection.isCarousel && !activeSection.isGallery && activeSection.content && (
                  <div className='meditation-content-text krona-one-regular'>{activeSection.content}</div>
                )}
                
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
        <>
          <div className="footer-overlay"></div>
          <div className="nav">
            <Navigation />
          </div>
        </>
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