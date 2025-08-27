import React from 'react';
import './AboutMe.css';
import profileImg from '../../assets/myimg.png'; // Profile image
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me">
      {/* Header Overlay - positioned behind header but above content */}
      <div className="header-overlay"></div>
      
      {/* Footer Overlay - positioned behind navigation but above content */}
      <div className="footer-overlay"></div>
      
     <div className = 'pg-title-container'>
            <PageHeader/>
        </div>

      <div className='about-me-main-content'>
        <div className='about-me-image'>
          <img src={profileImg} alt="Profile" className='profile-img' />
        </div>
        
        <div className='about-me-text fira-code-regular'>
          Hi there, I'm Lakshya and welcome to my digital home!<br/><br/>
          I am a Solutions Engineer, <a href='https://github.com/eltyagi'>GitHub</a>. By day, I help CTOs, 
          Engineering Managers and VPs drive engineering productivity. 
          By night, I am building, creating and teaching and more..
          There is much to cover, so much to learn so I am happy to have you here.
        </div>
      </div>

      <div className='nav'>
        <Navigation/>
      </div>
    </div>
  );
};

export default AboutMe;