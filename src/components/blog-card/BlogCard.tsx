import React, { useState } from 'react';
import './BlogCard.css';

interface BlogCardProps {
    classification: string;
    title: string;
    excerpt: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ classification, title, excerpt }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isViewing, setIsViewing] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleClick = () => setIsViewing(!isViewing);

    const getButtonText = () => {
        if (isViewing) return "viewing";
        if (isHovered) return "view?";
        return "view";
    };

    return (
        <div className="blog-card fira-code-regular">
            <div className="blog-classification">{classification}</div>
            <hr className="blog-divider"/>
            <h2 className="blog-title">{title}</h2>
            <p className="blog-excerpt">{excerpt}</p>
            <button 
                className={`blog-button ${isViewing ? 'viewing' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {getButtonText()}
            </button>
        </div>
    );
};

export default BlogCard;