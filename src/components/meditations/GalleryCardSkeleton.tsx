import Skeleton from '../skeleton/Skeleton';
import './GalleryCardSkeleton.css';

interface GalleryCardSkeletonProps {
  isMobile?: boolean;
}

const GalleryCardSkeleton = ({ isMobile = false }: GalleryCardSkeletonProps) => {
  // Match the scenery-card structure
  const borderRadius = isMobile ? '9.99px' : '24px';

  return (
    <div className={`scenery-card gallery-card-skeleton ${isMobile ? 'mobile' : ''}`}>
      {/* Image placeholder - fills entire card */}
      <Skeleton width="100%" height="100%" borderRadius={borderRadius} className="gallery-image-skeleton" />
    </div>
  );
};

export default GalleryCardSkeleton;
