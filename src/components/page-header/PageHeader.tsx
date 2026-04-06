import React from 'react';
import { useLocation } from 'react-router-dom';
import './PageHeader.css';
import logoImg from '../../assets/music-luxe.svg';
import SplitText from '../split-text/SplitText';

interface PageHeaderProps {
  isCollapsed?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
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
    <div className={`page-header ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`pg-title ${isLandingPage ? 'pg-title-center' : ''}`}>
        <div className='pg-title-name krona-one-regular'>
          <SplitText text="eltyagi's" stagger={0.04} delay={0} />
        </div>
        <div className='pg-title-icon'>
          <img className='pg-title-icon-img' src={logoImg} alt="Logo" />
        </div>
        <div className='pg-title-subtitle krona-one-regular'>
          <SplitText text={getSubtitle()} stagger={0.04} delay={0.36} />
        </div>
      </div>
    </div>
  );
};

export default PageHeader;