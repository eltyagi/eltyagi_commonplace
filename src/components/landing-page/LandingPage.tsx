import Navigation from '../navigation/Navigation';
import './LandingPage.css';
import musicIconLarge from '../../assets/icons/music-icon-large.svg';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="site-title">eltyagi's</h1>
          <img src={musicIconLarge} alt="Music Icon" className="music-icon-large" />
          <h1 className="site-subtitle">commonplace</h1>
        </div>
      </header>
      
      <main className="landing-main">
        <p className="welcome-text">
          Hi there, I'm Lakshya and welcome to my digital home!
          <br /><br />
          I am a Solutions Engineer, GitHub. By day, I help CTOs, Engineering Managers and VPs drive engineering productivity. By night, I am building, creating and teaching and more..There is much to cover, so much to learn so I am happy to have you here.
        </p>
      </main>
      
      <Navigation />
    </div>
  );
};

export default LandingPage;
