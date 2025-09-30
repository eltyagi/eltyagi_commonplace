import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';
import musicIcon from '../../assets/icons/music-icon-small.svg';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Home', icon: musicIcon },
    { path: '/thoughts', label: 'Thoughts' },
    { path: '/meditations', label: 'Meditations' },
    { path: '/about', label: 'Me?' },
    { path: '/contact', label: 'Say hi?' },
  ];

  return (
    <nav className="navigation">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.icon ? (
            <img src={tab.icon} alt="Home" className="nav-icon" />
          ) : (
            tab.label
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
