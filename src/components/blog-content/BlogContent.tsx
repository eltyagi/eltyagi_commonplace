import React from 'react';
import './BlogContent.css';

interface BlogContentProps {
    title: string;
    date: string;
    content: string;
    author?: string;
}

const BlogContent: React.FC = () => {
    return (
        <div className='blog-content'>
            your blog content goes here
        </div>
    );
};

export default BlogContent;