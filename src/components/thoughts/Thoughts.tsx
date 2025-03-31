import React, { useEffect, useState } from 'react';
import matter from 'gray-matter';
import './Thoughts.css';
import logoImg from '../../assets/music.svg';
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import BlogContent from '../blog-content/BlogContent';
import { Buffer } from 'buffer';


// Add Buffer to global scope
globalThis.Buffer = Buffer;

interface Post {
  title: string;
  classification: string;
  excerpt: string;
  content: string;
}

const Thoughts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

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

  return (
    <div className="thoughts">
      <div className='pg-title'>
            <div className='pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className='pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className='pg-title-subtitle krona-one-regular'>
                thoughts
            </div>

        </div>

        <div className='blog'>
          <div className='blog-content'>
            <BlogContent />
          </div>
          <div className='blog-list'>
            {posts.map((post, index) => (
              <BlogCard
                key={index}
                classification={post.classification}
                title={post.title}
                excerpt={post.excerpt}
              />
            ))}
          </div>
        </div>

        <div className='nav'>
            <Navigation />
        </div>
    </div>
  );
};

export default Thoughts;