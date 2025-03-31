import React from 'react';
import './AboutMe.css';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import Navigation from '../navigation/Navigation';

const AboutMe: React.FC = () => {
  return (
    <div className="about-me">
      <div className = 'pg-title'>
            <div className = 'pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className = 'pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className = 'pg-title-subtitle krona-one-regular'>
                dock
            </div>
        </div>

      <div className='about-me-content fira-code-regular'>
      </div>

      <div className='nav'>
        <Navigation/>
      </div>
    </div>
  );
};

export default AboutMe;