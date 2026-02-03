import { useNavigate, useLocation } from 'react-router-dom';
import './Navigation.css';

// Inline SVG component for the music icon with currentColor
const MusicIcon = () => (
  <svg className="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_nav)">
      <path d="M23.3881 9.68359H22.252V14.236H23.3881V9.68359Z" fill="currentColor"/>
      <path d="M7.44301 9.68355H8.57924V8.53984H9.72296V7.40362H14.2753V8.53984H15.419V7.40362H18.8352V8.53984H19.9714V17.6521H21.1151V15.3796H22.2514V14.2359H21.1151V9.68355H22.2514V8.53984H21.1151V3.98745H19.9714V5.12368H18.8352V3.98745H16.5552V2.84375H8.57924V3.98745H7.44301V5.12368H6.30679V7.40362H5.16309V3.98745H4.02685V7.40362H2.89062V8.53984H7.44301V9.68355Z" fill="currentColor"/>
      <path d="M19.9721 17.6523H18.8359V18.7961H19.9721V17.6523Z" fill="currentColor"/>
      <path d="M19.9721 2.84375H18.8359V3.98745H19.9721V2.84375Z" fill="currentColor"/>
      <path d="M18.8352 15.3789H17.6914V16.5152H18.8352V15.3789Z" fill="currentColor"/>
      <path d="M18.8352 11.957H17.6914V14.237H18.8352V11.957Z" fill="currentColor"/>
      <path d="M18.8352 1.70703H17.6914V2.84327H18.8352V1.70703Z" fill="currentColor"/>
      <path d="M8.57975 18.7969V21.0805H6.30729V22.2167H4.02734V23.3529H22.2518V22.2167H19.972V21.0805H17.692V19.9369H18.8356V18.8005L8.57975 18.7969ZM16.5558 22.2131H12.0034V21.0805H9.72345V19.9369H16.5595L16.5558 22.2131Z" fill="currentColor"/>
      <path d="M17.6915 16.5156H14.2754V17.6518H17.6915V16.5156Z" fill="currentColor"/>
      <path d="M14.2768 15.3789H13.1406V16.5152H14.2768V15.3789Z" fill="currentColor"/>
      <path d="M13.1401 11.957H12.0039V14.237H13.1401V11.957Z" fill="currentColor"/>
      <path d="M14.2764 8.53906H12.0039V9.68278H14.2764V8.53906Z" fill="currentColor"/>
      <path d="M17.6904 8.53906H15.418V9.68278H17.6904V8.53906Z" fill="currentColor"/>
      <path d="M9.72378 9.68359H8.58008V14.236H9.72378V9.68359Z" fill="currentColor"/>
      <path d="M17.6918 0.570312H7.44336V1.70654H17.6918V0.570312Z" fill="currentColor"/>
      <path d="M8.5796 17.6523H7.44336V18.7961H8.5796V17.6523Z" fill="currentColor"/>
      <path d="M8.5796 14.2344H7.44336V15.3781H8.5796V14.2344Z" fill="currentColor"/>
      <path d="M2.89062 15.3789V16.5152H6.30679V17.6514H7.44302V15.3789H2.89062Z" fill="currentColor"/>
      <path d="M7.44482 1.70703H6.30859V2.84327H7.44482V1.70703Z" fill="currentColor"/>
      <path d="M6.30776 2.84375H5.16406V3.98745H6.30776V2.84375Z" fill="currentColor"/>
      <path d="M5.16358 9.68359H4.02734V10.8198H5.16358V9.68359Z" fill="currentColor"/>
      <path d="M4.02685 10.8203H2.89062V13.1002H4.02685V10.8203Z" fill="currentColor"/>
      <path d="M2.89176 14.2344H1.74805V15.3781H2.89176V14.2344Z" fill="currentColor"/>
      <path d="M2.89176 8.53906H1.74805V9.68278H2.89176V8.53906Z" fill="currentColor"/>
      <path d="M1.74756 9.68359H0.611328V14.236H1.74756V9.68359Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_nav">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Home', hasIcon: true },
    { path: '/thoughts', label: 'Thoughts' },
    { path: '/meditations', label: 'Meditations' },
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
          {tab.hasIcon ? <MusicIcon /> : tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
