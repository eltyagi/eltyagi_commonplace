import React from 'react';
import './AboutMe.css';
import profileImg from '../../assets/myimg.png'; // Profile image
import Navigation from '../navigation/Navigation';
import PageHeader from '../page-header/PageHeader';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me">
     <div className = 'pg-title-container'>
            <PageHeader/>
        </div>

      <div className='about-me-main-content'>
        <div className='about-me-image'>
          <img src={profileImg} alt="Profile" className='profile-img' />
        </div>
        
        <div className='about-me-text fira-code-regular'>

          

        </div>
      </div>

      <div className='nav'>
        <Navigation/>
      </div>
    </div>
  );
};

export default AboutMe;