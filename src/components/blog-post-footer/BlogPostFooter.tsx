import { useState } from 'react';
import './BlogPostFooter.css';
import { generateSlug } from '../../utils/slug';

interface BlogPostFooterProps {
  title: string;
  date?: string;
}

const BlogPostFooter: React.FC<BlogPostFooterProps> = ({ title, date }) => {
  const [copied, setCopied] = useState(false);

  const getPostUrl = () => {
    const slug = generateSlug(title);
    return `${window.location.origin}/thoughts/${slug}`;
  };

  const handleCopyLink = async () => {
    const url = getPostUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareX = () => {
    const url = getPostUrl();
    const text = `"${title}"`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="blog-post-footer fira-code-regular">
      <div className="blog-post-footer-divider" />
      
      {date && (
        <div className="blog-post-footer-date">{date}</div>
      )}
      
      <div className="blog-post-footer-actions">
        <button 
          className={`blog-post-footer-button ${copied ? 'copied' : ''}`}
          onClick={handleCopyLink}
          aria-label="Copy link"
        >
          <span className="button-icon">🔗</span>
          <span className="button-text">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
        
        <button 
          className="blog-post-footer-button"
          onClick={handleShareX}
          aria-label="Share on X"
        >
          <span className="button-icon">𝕏</span>
          <span className="button-text">Share</span>
        </button>
      </div>
    </footer>
  );
};

export default BlogPostFooter;
