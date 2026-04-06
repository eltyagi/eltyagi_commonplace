import { forwardRef } from 'react';
import './BlogCard.css';

interface BlogCardProps {
    index: number;
    title: string;
    classification: string;
    excerpt?: string;
    content?: string;
    isExpanded: boolean;
    onCardClick: () => void;
    onViewClick?: () => void;
}

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(({
    title,
    classification,
    excerpt,
    isExpanded,
    onCardClick,
    onViewClick,
}, ref) => {
    return (
        <div 
            ref={ref}
            className={`blog-card ${isExpanded ? 'expanded' : ''}`} 
            onClick={onCardClick}
            data-cursor-label="Read"
        >
            <div className='blog-card-classification'>{classification}</div>
            <div className='blog-card-title'>{title}</div>
            {/* Always render expandable content, control visibility via CSS */}
            <div className='blog-card-expandable'>
                {excerpt && <div className='blog-card-excerpt'>{excerpt}</div>}
                {onViewClick && (
                    <button
                        className='blog-card-view-button'
                        onClick={(e) => { e.stopPropagation(); onViewClick(); }}
                    >
                        View
                    </button>
                )}
            </div>
        </div>
    );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;