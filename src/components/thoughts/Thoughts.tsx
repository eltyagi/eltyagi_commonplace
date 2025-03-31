import React from 'react';
import './Thoughts.css';
import logoImg from '../../assets/music.svg'; // Adjust the path as necessary
import Navigation from '../navigation/Navigation';

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

        </div>

        <div className = 'nav'>
            <Navigation />
        </div>
    </div>
  );
};

export default Thoughts;