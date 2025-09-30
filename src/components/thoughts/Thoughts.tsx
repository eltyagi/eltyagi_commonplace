import React, { useEffect, useState } from 'react';
import './Thoughts.css';
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import PageHeader from '../page-header/PageHeader';

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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const allPosts: Post[] = [];

        // Load post1.md
        try {
          const post1 = await import('../../assets/posts/post1.md?raw');
          const { data } = parseFrontmatter(post1.default);
          allPosts.push({
            title: data.title || 'Untitled',
            classification: data.classification || 'Uncategorized',
            excerpt: data.excerpt || '',
            date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : undefined,
            filePath: 'post1.md'
          });
        } catch (err) {
          console.error('Error loading post1:', err);
        }

        // Load post2.md
        try {
          const post2 = await import('../../assets/posts/post2.md?raw');
          const { data } = parseFrontmatter(post2.default);
          allPosts.push({
            title: data.title || 'Untitled',
            classification: data.classification || 'Uncategorized',
            excerpt: data.excerpt || '',
            date: data.date ? new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : undefined,
            filePath: 'post2.md'
          });
        } catch (err) {
          console.error('Error loading post2:', err);
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
      let module;
      if (post.filePath === 'post1.md') {
        module = await import('../../assets/posts/post1.md?raw');
      } else if (post.filePath === 'post2.md') {
        module = await import('../../assets/posts/post2.md?raw');
      }
      
      if (module) {
        const { content: markdownContent } = parseFrontmatter(module.default);
        
        // Update the post with the loaded content
        setPosts(prevPosts => {
          const newPosts = [...prevPosts];
          newPosts[index] = { ...newPosts[index], content: markdownContent };
          return newPosts;
        });
      }
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