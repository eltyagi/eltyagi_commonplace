import { useEffect, useState, CSSProperties, useCallback, useRef, useMemo } from 'react';
import './Thoughts.css';
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import PageHeader from '../page-header/PageHeader';
import ProgressBar from '../progress-bar/ProgressBar';
import Loader from '../loader/Loader';
import { useScrollThreshold } from '../../hooks/useScrollThreshold';
import { HEADER_HEIGHT_COLLAPSED, HEADER_HEIGHT_EXPANDED } from '../../constants/layout';

// Lightweight frontmatter parser (replaces gray-matter)
const parseFrontmatter = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: content };
  
  const frontmatter = match[1];
  const body = match[2];
  const data: Record<string, string> = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      data[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return { data, content: body };
};

interface Post {
  title: string;
  classification: string;
  excerpt: string;
  content?: string;
  date?: string;
  filePath: string;
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

const Thoughts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isMobileContentView, setIsMobileContentView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const allPosts: Post[] = [];
        
        // Get all post modules using glob pattern
        const postModules = import.meta.glob('../../assets/posts/post*.md', { query: '?raw', eager: false });
        
        // Extract post numbers and sort in descending order (newest first)
        const postPaths = Object.keys(postModules).sort((a, b) => {
          const numA = parseInt(a.match(/post(\d+)\.md/)?.[1] || '0');
          const numB = parseInt(b.match(/post(\d+)\.md/)?.[1] || '0');
          return numB - numA; // Descending order
        });

        // Load full content for each post
        for (const path of postPaths) {
          try {
            const resolver = postModules[path];
            const postModule = await resolver() as { default: string };
            const { data, content } = parseFrontmatter(postModule.default);
            const filename = path.split('/').pop() || '';
            
            allPosts.push({
              title: data.title || 'Untitled',
              classification: data.classification || 'Uncategorized',
              excerpt: data.excerpt || '',
              date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : undefined,
              filePath: filename,
              content: content // Load content immediately
            });
          } catch (err) {
            console.error('Error loading post:', path, err);
            continue;
          }
        }

        setPosts(allPosts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading posts:', error);
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Update initial viewing state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setIsViewing(true); // Desktop shows content by default
      setIsMobileContentView(false);
      // Content is already loaded, no need to load again
    } else {
      setIsViewing(false); // Mobile doesn't show content initially
      setIsMobileContentView(false);
    }
  }, [isMobile]);

  const handleCardClick = useCallback(async (index: number) => {
    if (activeCardIndex === index) {
      // If clicking the same card, collapse it and go back to default (index 0)
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
      setIsMobileContentView(false);
    } else {
      // If clicking a different card, expand it and open the blog
      setActiveCardIndex(index);
      setIsViewing(true);
      if (isMobile) {
        setIsMobileContentView(true);
      }
    }
  }, [activeCardIndex, isMobile]);

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

  // Fixed categories for filter tabs
  const classifications = ['All', 'Poetry', 'Technology'];

  // Filter posts based on search query and active filter
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || post.classification === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [posts, searchQuery, activeFilter]);

  // Reset active card index when filters change
  useEffect(() => {
    setActiveCardIndex(0);
  }, [searchQuery, activeFilter]);

  const activePost = filteredPosts[activeCardIndex];

  return (
    <div className="thoughts" style={containerStyle}>
      <Loader isLoading={isLoading} />
      <div className = 'pg-title-container'>
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
            {activePost && (
              <div className='mobile-content-title-overlay'>{activePost.title}</div>
            )}
          </div>
          
          <div className='mobile-blog-content fira-code-regular'>
            {activePost && (
              <div className='blog-content'>
                <div className='blog-content-text krona-one-regular'>{activePost.content}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop and Mobile Card View */
        <div className='blog-container krona-one-regular'>
          {/* Progress Bar - Desktop (vertical) */}
          <div className='progress-bar-container progress-bar-container--vertical'>
            <ProgressBar
              currentIndex={activeCardIndex}
              totalCount={filteredPosts.length}
              orientation="vertical"
              onIndicatorClick={handleProgressIndicatorClick}
            />
          </div>

          {/* Progress Bar - Mobile (horizontal) */}
          <div className='progress-bar-container progress-bar-container--horizontal'>
            <ProgressBar
              currentIndex={activeCardIndex}
              totalCount={filteredPosts.length}
              orientation="horizontal"
              onIndicatorClick={handleProgressIndicatorClick}
            />
          </div>

          {/* Search and Filter Section - positioned above cards */}
          <div className='search-filter-section'>
            <div className='search-box'>
              <span className='search-icon'>🔍</span>
              <input
                type='text'
                className='search-input'
                placeholder='Search posts...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='filter-tabs'>
              {classifications.map((classification) => (
                <button
                  key={classification}
                  className={`filter-tab ${activeFilter === classification ? 'active' : ''}`}
                  onClick={() => setActiveFilter(classification)}
                >
                  {classification}
                </button>
              ))}
            </div>
            <div className='results-count'>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found
            </div>
          </div>

          <div className='blog-cards'>
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                index={index}
                title={post.title}
                classification={post.classification}
                excerpt={post.excerpt}
                content={post.content || ''}
                isExpanded={activeCardIndex === index}
                onCardClick={() => handleCardClick(index)}
              />
            ))}
          </div>

          <div ref={contentDisplayRef} className='blog-content-display fira-code-regular'>
            {activePost && !isMobile && isViewing && (
              <div className='blog-content'>
                <div className='blog-content-title'>{activePost.title}</div>
                <div className='blog-content-classification'>{activePost.classification}</div>
                {activePost.date && <div className='blog-content-date'>{activePost.date}</div>}
                <div className='blog-content-text krona-one-regular'>{activePost.content}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation - hide in mobile content view */}
      {!(isMobileContentView && isMobile) && (
        <>
          <div className="footer-overlay"></div>
          <div className='nav'>
            <Navigation />
          </div>
        </>
      )}
    </div>
  );
};

export default Thoughts;