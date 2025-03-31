import React from 'react';
import './LandingPage.css';
import Navigation from '../navigation/Navigation';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import linkedinImg from '../../assets/linkedin.png'; // Adjust the path as necessary
import mediumImg from '../../assets/medium.png'; // Adjust the path as necessary
import instaImg from '../../assets/insta.png'; // Adjust the path as necessary
const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
        <div className = 'pg-title'>
            <div className = 'pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className = 'pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className = 'pg-title-subtitle krona-one-regular'>
                commonplace
            </div>

        </div>

        <div className = 'pg-content fira-code-regular'>
        Hi there, I’m Lakshya and welcome to my digital home!<br/><br/>
        I am a Solutions Engineer, <a href='https://github.com/eltyagi'>GitHub</a>. By day, I help CTOs, 
        Engineering Managers and VPs drive engineering productivity. 
        By night, I am building, creating and teaching and more..
        There is much to cover, so much to learn so I am happy to have you here.
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