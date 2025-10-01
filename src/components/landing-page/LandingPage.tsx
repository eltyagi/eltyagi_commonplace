import React from 'react';
import './LandingPage.css';
import Navigation from '../navigation/Navigation';
import linkedinImg from '../../assets/linkedin.png'; // Adjust the path as necessary
import mediumImg from '../../assets/medium.png'; // Adjust the path as necessary
import instaImg from '../../assets/insta.png'; // Adjust the path as necessary
import PageHeader from '../page-header/PageHeader';
const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
        <div className = 'pg-title-container'>
            <PageHeader/>
        </div>

        <div className = 'pg-content fira-code-regular'>
        <strong>Hi there, I'm Lakshya and welcome to my digital commonplace!</strong><br/><br/>
        I'm an engineer, a writer. I work at <span style={{color: '#FF6F61'}}>GitHub</span> bringing an AI-native developer platform 
        to enterprises across APAC. This site is home to my life's work, and thoughts on tech,
        defence and probably a bunch of other things. Welcome!

        </div>

        <div className = 'pg-links'>
            <img src={linkedinImg} alt="LinkedIn" className='pg-link-icon' />
            <img src={mediumImg} alt="Medium" className='pg-link-icon' />
            <img src={instaImg} alt="Instagram" className='pg-link-icon' />
        </div>

        <div className = 'nav'>
            <Navigation />
            
        </div>
    </div>
  );
};

export default LandingPage;