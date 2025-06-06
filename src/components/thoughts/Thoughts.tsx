import React, { useEffect, useState } from 'react';
import matter from 'gray-matter';
import './Thoughts.css';
import logoImg from '../../assets/music.svg';
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
  content: string;
}

const Thoughts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(true);

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
            content: markdownContent
          });
        }

        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, []);

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

  const activePost = posts[activeCardIndex];

  return (
    <div className="thoughts">
      <div className = 'pg-title-container'>
            <PageHeader/>
        </div>

      <div className='blog-container krona-one-regular'>
        <div className='blog-cards'>
          {posts.map((post, index) => (
            <BlogCard
              key={index}
              index={index}
              title={post.title}
              classification={post.classification}
              excerpt={post.excerpt}
              content={post.content}
              isExpanded={activeCardIndex === index}
              isViewing={activeCardIndex === index && isViewing}
              onCardClick={() => handleCardClick(index)}
              onViewStateChange={handleViewStateChange}
            />
          ))}
        </div>

        <div className='blog-content-display krona-one-regular'>
          {activePost && (activeCardIndex === 0 || isViewing) && (
            <div className='blog-content'>
              <div className='blog-content-title'>{activePost.title}</div>
              <div className='blog-content-classification'>{activePost.classification}</div>
              <div className='blog-content-text krona-one-regular'>{activePost.content}</div>
            </div>
          )}
        </div>
      </div>

      <div className='nav'>
        <div className='nav-bg'></div>
        <Navigation />
      </div>
    </div>
  );
};

export default Thoughts;