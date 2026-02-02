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
}

const BlogCard = forwardRef<HTMLDivElement, BlogCardProps>(({
    title,
    classification,
    excerpt,
    isExpanded,
    onCardClick,
}, ref) => {
    return (
        <div 
            ref={ref}
            className={`blog-card ${isExpanded ? 'expanded' : ''}`} 
            onClick={onCardClick}
        >
            <div className='blog-card-classification'>{classification}</div>
            <div className='blog-card-title'>{title}</div>
            {/* Always render expandable content, control visibility via CSS */}
            <div className='blog-card-expandable'>
                {excerpt && <div className='blog-card-excerpt'>{excerpt}</div>}
            </div>
        </div>
    );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;