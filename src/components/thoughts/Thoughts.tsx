import React, { useEffect, useState } from 'react';
import matter from 'gray-matter';
import './Thoughts.css';
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import { Buffer } from 'buffer';
import PageHeader from '../page-header/PageHeader';

// Add Buffer to global scope
(globalThis as any).Buffer = Buffer;

interface Post {
  title: string;
  classification: string;
  excerpt: string;
  content?: string; // Make optional since we'll load on demand
  date?: string;
  filePath: string; // Store path for lazy loading
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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postModules = import.meta.glob<string>('../../assets/posts/*.md', { as: 'raw' });
        const allPosts: Post[] = [];

        for (const path in postModules) {
          const content = await postModules[path]();
          const { data, content: markdownContent } = matter(content);
          
          allPosts.push({
            title: data.title || 'Untitled',
            classification: data.classification || 'Uncategorized',
            excerpt: data.excerpt || markdownContent.slice(0, 150) + '...',
            date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : undefined,
            filePath: path // Store the path for lazy loading
          });
        }

        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, []);

  // Lazy load post content when needed
  const loadPostContent = async (index: number) => {
    const post = posts[index];
    if (post.content) return; // Already loaded

    try {
      const postModules = import.meta.glob<string>('../../assets/posts/*.md', { as: 'raw' });
      const content = await postModules[post.filePath]();
      const { content: markdownContent } = matter(content);
      
      // Update the post with the loaded content
      setPosts(prevPosts => {
        const newPosts = [...prevPosts];
        newPosts[index] = { ...newPosts[index], content: markdownContent };
        return newPosts;
      });
    } catch (error) {
      console.error('Error loading post content:', error);
    }
  };

  // Update initial viewing state based on screen size
  useEffect(() => {
    if (!isMobile) {
      setIsViewing(true); // Desktop shows content by default
      setIsMobileContentView(false);
      // Load first post content for desktop
      if (posts.length > 0) {
        loadPostContent(0);
      }
    } else {
      setIsViewing(false); // Mobile doesn't show content initially
      setIsMobileContentView(false);
    }
  }, [isMobile, posts.length]);

  const handleCardClick = async (index: number) => {
    if (activeCardIndex === index) {
      // If clicking the same card, toggle its expanded state
      setActiveCardIndex(0);
      setIsViewing(!isMobile); // Show content on desktop, not on mobile
    } else {
      // If clicking a different card, expand it and load its content
      setActiveCardIndex(index);
      setIsViewing(false); // Don't show content initially
      await loadPostContent(index); // Load content lazily
    }
  };

  const handleViewStateChange = async (viewing: boolean) => {
    setIsViewing(viewing);
    // Load content if viewing
    if (viewing) {
      await loadPostContent(activeCardIndex);
    }
    // On mobile, when user clicks "View", show the content view
    if (viewing && isMobile) {
      setIsMobileContentView(true);
    }
  };

  const handleBackToCards = () => {
    setIsMobileContentView(false);
  };

  const activePost = posts[activeCardIndex];

  return (
    <div className="thoughts">
      {/* Header Overlay - positioned behind header but above content */}
      <div className="header-overlay"></div>
      
      {/* Footer Overlay - positioned behind navigation but above content */}
      <div className="footer-overlay"></div>
      
      <div className = 'pg-title-container'>
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
                isViewing={activeCardIndex === index && isViewing}
                onCardClick={() => handleCardClick(index)}
                onViewStateChange={handleViewStateChange}
              />
            ))}
          </div>

          <div className='blog-content-display fira-code-regular'>
            {activePost && !isMobile && (activeCardIndex === 0 || isViewing) && (
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