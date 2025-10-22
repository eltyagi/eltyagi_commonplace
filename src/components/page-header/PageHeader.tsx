import React from 'react';
import { useLocation } from 'react-router-dom';
import './PageHeader.css';
import logoImg from '../../assets/music-luxe.svg';

const PageHeader: React.FC = () => {
  const location = useLocation();
  
  const getSubtitle = () => {
    switch (location.pathname) {
      case '/':
        return 'commonplace';
      case '/thoughts':
        return 'thoughts';
      case '/meditations':
        return 'meditations';
      case '/contact':
        return 'contact';
      default:
        return 'commonplace';
    }
  };

  return (
    <div className="page-header">
      <div className='pg-title'>
        <div className='pg-title-name krona-one-regular'>
          eltyagi's
        </div>
        <div className='pg-title-icon'>
          <img className='pg-title-icon-img' src={logoImg} alt="Logo" />
        </div>
        <div className='pg-title-subtitle krona-one-regular'>
          {getSubtitle()}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;