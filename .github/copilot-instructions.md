# Copilot Instructions for eltyagi.xyz

## Project Overview
Personal portfolio/blog site deployed to GitHub Pages. React 19 + TypeScript SPA with three main sections: **Thoughts** (blog), **Meditations** (image gallery), and **Contact**.

## Architecture & File Organization

### Content Management
- **Blog posts**: Markdown files in `src/assets/posts/` with frontmatter (title, classification, excerpt, date)
- **Images**: `src/assets/meditations/` for gallery sceneries, `src/assets/icons/` for UI assets
- **Frontmatter format**:
  ```markdown
  ---
  title: Post Title
  classification: Poetry|Essay|Technical
  excerpt: Brief description
  date: YYYY-MM-DD
  ---
  ```

### Component Structure
- **Page components**: `src/components/{landing-page,thoughts,meditations,contact}/`
- **Shared UI**: `blog-card/`, `page-header/`, `navigation/`, `progress-bar/`, `loader/`
- **Custom hooks**: `src/hooks/` - `useScrollThreshold`, `useCardIntersection` for intersection-based UX
- **Constants**: `src/constants/layout.ts` - header heights and breakpoints (NEVER hardcode these values)

### Routing
- Uses React Router with slug-based blog routing: `/thoughts/:slug`
- Slugs generated via `src/utils/slug.ts` - strips special chars, lowercases, hyphenates
- Example: "The Observer Effect" → "the-observer-effect"

## Design System

### CSS Variables (defined in `src/index.css`)
```css
--color-bg: #F9F6EE       /* Cream background */
--color-accent: #FF6F61   /* Coral accent */
--color-text: #252525     /* Near-black text */
--mobile: 480px           /* Mobile breakpoint */
--tablet: 768px           /* Tablet/Desktop threshold */
```

### Typography
- **Krona One**: Headings and titles (`krona-one-regular` class)
- **Fira Code**: Body text (loaded via Google Fonts in App.tsx)

### Responsive Breakpoints
- Mobile: ≤480px (single-column, stacked navigation)
- Desktop: >768px (collapsing header, multi-column layouts)

## Key Patterns

### Collapsing Header
1. Import `useScrollThreshold` hook and `HEADER_HEIGHT_COLLAPSED/EXPANDED` constants
2. Header collapses when scrolling >120px on desktop (disabled on mobile)
3. Always use CSS variable `--header-height-current` for layout calculations:
   ```tsx
   const headerHeight = isHeaderCollapsed ? HEADER_HEIGHT_COLLAPSED : HEADER_HEIGHT_EXPANDED;
   const containerStyle = { '--header-height-current': `${headerHeight}px` } as CSSProperties;
   ```

### Card-Based Navigation
- `BlogCard` component used in both Thoughts and Meditations with different behaviors
- In Thoughts: Cards expand on click to show excerpt, then "View" button to full content
- In Meditations: Cards navigate to image details/gallery view
- Use `useCardIntersection` hook to track which card is in viewport center

### Image Optimization
- Meditations uses custom `LazyImage` component with IntersectionObserver
- Lazy loads images with 50px margin, 0.1 threshold
- Shows loading spinner, handles errors with fallback UI

### Content Parsing
- **Inconsistency**: Thoughts uses custom `parseFrontmatter()`, Meditations uses `gray-matter` library
- When adding new content features, prefer `gray-matter` for consistency

## Development Workflows

### Local Development
```bash
npm run dev              # Start Vite dev server (localhost:5173)
npm run build            # TypeScript check + Vite build
npm run preview          # Preview production build
```

### Testing
```bash
npm test                 # Run Playwright E2E tests
npm run test:ui          # Interactive UI mode
npm run test:headed      # Browser-visible mode
npm run test:debug       # Debug mode with breakpoints
npm run test:report      # View HTML report
```

- **Test structure**: `e2e/*.spec.ts` files test each section
- **Multi-browser**: Tests run on Chromium, Firefox, WebKit, Mobile Chrome/Safari
- **Visual regression**: Screenshots in `e2e/visual-regression.spec.ts-snapshots/`
- Dev server auto-starts before tests (configured in `playwright.config.ts`)

### Deployment
```bash
npm run deploy           # Builds and deploys to gh-pages branch
```
- Deployed to `eltyagi.xyz` via GitHub Pages
- Base URL: `/` (root deployment, not subdirectory)
- 404 handling: `public/404.html` redirects to index for SPA routing

## Common Tasks

### Adding a New Blog Post
1. Create `src/assets/posts/postN.md` with frontmatter
2. Content auto-discovered via Vite's `import.meta.glob('../../assets/posts/*.md')`
3. Slug auto-generated from title, no routing changes needed

### Adding UI Components
- Follow existing component structure: `ComponentName/ComponentName.tsx` + `ComponentName.css`
- Use forwardRef for components that need scroll/intersection refs
- Import layout constants instead of hardcoding dimensions

### Modifying Header Behavior
- Edit `src/components/page-header/PageHeader.tsx` for visual changes
- Edit `src/hooks/useScrollThreshold.ts` to adjust collapse threshold (currently 120px)
- Always test on both desktop and mobile viewports

## Known Quirks
- **Dual App div**: App.tsx has nested `<div className="App">` wrappers (legacy structure)
- **Font loading**: Google Fonts links in App.tsx JSX (not ideal, but working)
- **Buffer polyfill**: Vite config includes buffer shim for frontmatter parsing (required for gray-matter)
- **Inconsistent parsers**: Thoughts and Meditations use different frontmatter libraries

## Browser Compatibility
- Modern browsers (ES2020+)
- Mobile Safari and Chrome tested via Playwright
- No IE11 support (uses modern React 19 features)
