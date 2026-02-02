import './SiteFooter.css';

const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer fira-code-regular">
      <div className="site-footer-divider" />
      <div className="site-footer-content">
        <span className="site-footer-copyright">
          © {currentYear} · Built with intention
        </span>
        <button 
          className="site-footer-top-button" 
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </footer>
  );
};

export default SiteFooter;
