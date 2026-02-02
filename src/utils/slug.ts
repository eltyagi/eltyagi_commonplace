/**
 * Generate a URL-friendly slug from a title
 * e.g., "The Observer Effect" -> "the-observer-effect"
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Find a post by its slug from a list of posts
 */
export const findPostBySlug = <T extends { title: string }>(
  posts: T[],
  slug: string
): { post: T; index: number } | null => {
  const index = posts.findIndex(
    (post) => generateSlug(post.title) === slug
  );
  
  if (index === -1) return null;
  return { post: posts[index], index };
};
