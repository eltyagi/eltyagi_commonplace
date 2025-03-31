import React from 'react';
import './Meditations.css';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import Navigation from '../navigation/Navigation';

const Meditations: React.FC = () => {
  return (
    <div className="meditations">
       <div className = 'pg-title'>
            <div className = 'pg-title-name krona-one-regular'>
                eltyagi's
            </div>
            <div className='pg-title-icon'>
                <img className = 'pg-title-icon-img' src={logoImg} alt="Logo" />
            </div>
            <div className = 'pg-title-subtitle krona-one-regular'>
                meditations
            </div>

        </div>

        <div className = 'meditations-content fira-code-regular'>
        </div>

        <div className='nav'>
          <Navigation/>
        </div>
    </div>
  );
};

export default Meditations;