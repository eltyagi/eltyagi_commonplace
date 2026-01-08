import React from 'react';
import './BlogCard.css';

interface BlogCardProps {
    index: number;
    title: string;
    classification: string;
    excerpt?: string;
    content?: string;
    isExpanded: boolean;
    onCardClick: () => void;
    onViewStateChange: (viewing: boolean) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
    title,
    classification,
    excerpt,
    isExpanded,
    onCardClick,
    onViewStateChange
}) => {
    const handleViewButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Button expands/shows the content view
        onViewStateChange(true);
    };

    return (
        <div className={`blog-card ${isExpanded ? 'expanded' : ''}`} onClick={onCardClick}>
            <div className='blog-card-classification'>{classification}</div>
            <div className='blog-card-title'>{title}</div>
            {isExpanded && (
                <>
                    {excerpt && <div className='blog-card-excerpt'>{excerpt}</div>}
                    <div 
                        className='blog-card-view-button'
                        onClick={handleViewButtonClick}
                    >
                        View
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogCard;