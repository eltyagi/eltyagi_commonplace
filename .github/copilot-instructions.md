# Commonplace Project Guide for AI Assistants

## Project Overview

Commonplace is a personal portfolio website built with React, TypeScript, and Vite. It showcases the author's thoughts, visual meditations, technical skills, and philosophical principles through a clean, responsive interface with consistent design language.

### Core Architecture

- **Single Page Application** using React Router for navigation
- **Component Structure** organized by page/feature
- **Responsive Design** with custom hooks for mobile detection
- **Content Management** using markdown with gray-matter for frontmatter parsing

## Key Components & Patterns

### Page Structure Pattern
Each page follows this component hierarchy:
1. `PageHeader` - Dynamically shows section title based on current route
2. Main content area - Unique to each page
3. `Navigation` - Shared navigation component with active state tracking

```tsx
// Example page structure from src/components/thoughts/Thoughts.tsx
<div className="thoughts">
  <div className="header-overlay"></div>
  <div className="footer-overlay"></div>
  <div className="pg-title-container">
    <PageHeader/>
  </div>
  {/* Main content area */}
  <div className="nav">
    <Navigation />
  </div>
</div>
```

### Responsive Patterns
The project uses a custom `useIsMobile` hook for conditional rendering:

```tsx
// From src/components/thoughts/Thoughts.tsx
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  return isMobile;
};
```

### Content Display Patterns
Content is displayed with:
- Card previews in a grid layout
- Expandable/collapsible card components
- Content view that changes based on device type
- Special handling for image galleries in the Meditations section

## Design Language

- **Typography**: 'Krona One' for headings, 'Fira Code' for body text
- **Color Palette**: Light cream background, dark gray text, coral accent color
- **Visual Elements**: Music-themed logo and consistent header styling
- **CSS Patterns**: BEM naming convention (e.g., `blog-card`, `blog-card__title`)

## Development Workflow

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Testing

The project uses Playwright for end-to-end testing:

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with browser visible
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Deployment

The site is deployed to GitHub Pages using:

```bash
# Build and deploy
npm run deploy
```

## Common Tasks & Patterns

### Adding a new blog post
1. Create a markdown file in `/src/assets/posts/`
2. Include frontmatter with title, classification, and excerpt
3. Posts will automatically load in the Thoughts component

Example blog post:
```md
---
title: New Thought
classification: Philosophy
excerpt: A short preview of the content
date: 2025-09-01
---
Content goes here...
```

### Adding a new image to gallery
1. Add image to `/src/assets/sceneries/`
2. Update `sceneryImages` array in `Meditations.tsx` with new image reference and caption

## Project Structure

```
src/
├── App.tsx             # Main application component with routes
├── components/
│   ├── about-me/       # About page components
│   ├── blog-card/      # Reusable blog/content card component
│   ├── contact/        # Contact page components
│   ├── landing-page/   # Homepage components
│   ├── meditations/    # Meditations page with visual gallery
│   ├── navigation/     # Shared navigation component
│   ├── page-header/    # Dynamic header component
│   └── thoughts/       # Blog/thoughts page components
└── assets/
    ├── posts/          # Markdown blog content
    └── sceneries/      # Images for the meditations gallery
```

## Troubleshooting

- If working on responsive layouts, use the custom `useIsMobile` hook to toggle between mobile/desktop views
- Image loading issues? Check import paths and make sure images are in the correct format
- Test failures? Run tests in headed mode (`npm run test:headed`) to visually inspect