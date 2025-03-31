import React from 'react';
import './Contact.css';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import Navigation from '../navigation/Navigation';

const Contact: React.FC = () => {
  return (
    <div className="contact">
      <div className = 'pg-title'>
            <div className = 'pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className = 'pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className = 'pg-title-subtitle krona-one-regular'>
                contact
            </div>
        </div>

      <div className='contact-content fira-code-regular'>
      </div>

      <div className='nav'>
        <Navigation/>
      </div>
    </div>
  );
};

export default Contact;