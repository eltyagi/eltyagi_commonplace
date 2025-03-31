import React, { useEffect, useRef } from 'react';
import './Navigation.css';
import { Link, useLocation } from 'react-router-dom';
import navLogo from '../../assets/nav-music.svg';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && backgroundRef.current) {
      const rect = activeLink.getBoundingClientRect();
      const navRect = backgroundRef.current.parentElement?.getBoundingClientRect();
      if (navRect) {
        backgroundRef.current.style.left = `${rect.left - navRect.left}px`;
        backgroundRef.current.style.width = `${rect.width}px`;
      }
    }
  }, [location]);

  return (
    <div className="navigation fira-code-regular">
      <div className="nav-background" ref={backgroundRef}></div>
      <Link to="/" className={`nav-link link-home ${isActive('/') ? 'active' : ''}`}>
        <img src={navLogo} alt="Logo" className="nav-logo" />
      </Link>
      <Link to="/thoughts" className={`nav-link link-thoughts ${isActive('/thoughts') ? 'active' : ''}`}>
        Thoughts
      </Link>
      <Link to="/meditations" className={`nav-link link-meditations ${isActive('/meditations') ? 'active' : ''}`}>
        Meditations
      </Link>
      <Link to="/about" className={`nav-link link-about ${isActive('/about') ? 'active' : ''}`}>
        Me?
      </Link>
      <Link to="/contact" className={`nav-link link-contact ${isActive('/contact') ? 'active' : ''}`}>
        Say hi!
      </Link>
    </div>
  );
};

export default Navigation;