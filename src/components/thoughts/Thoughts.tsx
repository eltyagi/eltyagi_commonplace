import React from 'react';
import './Thoughts.css';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import Navigation from '../navigation/Navigation';
import BlogCard from '../blog-card/BlogCard';
import BlogContent from '../blog-content/BlogContent';


const Thoughts: React.FC = () => {
  return (
    <div className="thoughts">
      <div className = 'pg-title'>
            <div className = 'pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className = 'pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className = 'pg-title-subtitle krona-one-regular'>
                thoughts
            </div>

        </div>

        <div className = 'blog'>
          <div className = 'blog-content'>
            <BlogContent/>
          </div>
          <div className = 'blog-list'>
            <BlogCard/>
          </div>
        </div>

        <div className = 'nav'>
            <Navigation />
        </div>
    </div>
  );
};

export default Thoughts;