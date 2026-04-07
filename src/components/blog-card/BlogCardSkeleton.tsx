import Skeleton from '../skeleton/Skeleton';
import './BlogCardSkeleton.css';

const BlogCardSkeleton = () => {
  return (
    <div className="blog-card-skeleton">
      {/* Classification skeleton */}
      <div style={{ padding: '8px' }}>
        <Skeleton width="30%" height="16px" borderRadius="0px" />
      </div>

      {/* Title skeleton (hidden initially like actual title) */}
      <div
        style={{
          padding: '0 16px',
          borderTop: '1px solid #99352F',
          maxHeight: '0',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <Skeleton width="60%" height="18px" borderRadius="0px" />
      </div>

      {/* Excerpt skeletons */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton width="100%" height="12px" borderRadius="0px" />
        <Skeleton width="85%" height="12px" borderRadius="0px" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
