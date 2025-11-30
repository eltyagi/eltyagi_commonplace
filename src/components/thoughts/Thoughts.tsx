import React, { useEffect, useState, CSSProperties } from 'react';
import './Thoughts.css';
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import PageHeader from '../page-header/PageHeader';
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

const Thoughts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isMobileContentView, setIsMobileContentView] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const isHeaderCollapsed = useScrollThreshold();
  const headerHeight = isHeaderCollapsed ? HEADER_HEIGHT_COLLAPSED : HEADER_HEIGHT_EXPANDED;
  const containerStyle: CSSProperties = {
    '--header-height-current': `${headerHeight}px`
  } as CSSProperties;

  useEffect(() => {
    const loadPosts = async () => {
      try {
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
      } catch (error) {
        console.error('Error loading posts:', error);
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

  const handleCardClick = async (index: number) => {
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

  const handleViewStateChange = async (viewing: boolean) => {
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

  const activePost = posts[activeCardIndex];

  return (
    <div className="thoughts" style={containerStyle}>
      {/* Header Overlay - positioned behind header but above content */}
      <div className="header-overlay"></div>
      
      {/* Footer Overlay - positioned behind navigation but above content */}
      <div className="footer-overlay"></div>
      
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
          <div className='blog-cards'>
            {posts.map((post, index) => (
              <BlogCard
                key={index}
                index={index}
                title={post.title}
                classification={post.classification}
                excerpt={post.excerpt}
                content={post.content || ''}
                isExpanded={activeCardIndex === index}
                onCardClick={() => handleCardClick(index)}
                onViewStateChange={handleViewStateChange}
              />
            ))}
          </div>

          <div className='blog-content-display fira-code-regular'>
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
        <div className='nav'>
          <Navigation />
        </div>
      )}
    </div>
  );
};

export default Thoughts;