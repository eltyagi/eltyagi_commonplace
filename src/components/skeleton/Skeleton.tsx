import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton = ({
  width = "100%",
  height = "1rem",
  borderRadius = "4px",
  className = ""
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
