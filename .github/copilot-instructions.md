# Commonplace - AI Assistant Guide

## General Instructions
- When asked a question, always provide clear, concise and accurate answers, in a manner that is good for someone who is trying to learn or understand the topic.
- Use examples and analogies where appropriate to illustrate complex concepts.
- Discuss approaches, explore why one might be better than another, and consider edge cases.

## Architecture Overview

React + TypeScript + Vite SPA portfolio site. Routes: `/` (landing), `/thoughts` (blog), `/meditations` (gallery), `/contact`.

### Key Patterns

**Page Layout**: Every page uses `PageHeader` (route-aware title) + main content + `Navigation` (shared tabs). Header has collapsible behavior controlled by `useScrollThreshold` hook.

**Responsive Strategy**: Mobile breakpoint is `480px`. Use inline `useIsMobile` hook pattern (defined per-component, not shared). Mobile shows expandable cards; desktop shows side-by-side list + content.

**Content Loading**: Blog posts use Vite's `import.meta.glob('../../assets/posts/post*.md')` with custom frontmatter parser (not gray-matter in Thoughts). Posts are numbered `post1.md`, `post2.md`, etc. and auto-sorted descending.

### Important Files

- [src/constants/layout.ts](src/constants/layout.ts) - Header height values used across components
- [src/hooks/useScrollThreshold.ts](src/hooks/useScrollThreshold.ts) - Scroll-based header collapse logic
- [src/components/blog-card/BlogCard.tsx](src/components/blog-card/BlogCard.tsx) - Reusable expandable card with `forwardRef`

## Commands

```bash
npm run dev          # Start dev server
npm test             # Playwright e2e tests (all browsers)
npm run test:headed  # Debug tests with visible browser
npm run deploy       # Build + deploy to GitHub Pages (https://eltyagi.xyz)
```

## Adding Content

**New blog post**: Create `src/assets/posts/post{N}.md` with frontmatter:
```md
---
title: Post Title
classification: Philosophy|Poetry|Tech
excerpt: Short preview text
date: 2025-01-15
---
```

**New gallery image**: Add to `src/assets/sceneries/`, then update `sceneryImages` array in [Meditations.tsx](src/components/meditations/Meditations.tsx).

## Conventions

- CSS: BEM-style naming (`blog-card`, `blog-card-title`, `blog-card-expandable`)
- Typography: `krona-one-regular` class for headings, Fira Code for body
- Tests: Playwright specs in `e2e/`, test selectors use CSS classes (`.blog-card`, `.nav-tab`)
- Mobile views: Always test both viewports - desktop (1920x1080) and mobile (375x667)

## Gotchas

- `useIsMobile` hook is duplicated in Thoughts.tsx and Meditations.tsx (not extracted to hooks/)
- Meditations uses `gray-matter` library; Thoughts uses custom `parseFrontmatter` function
- Header heights are CSS variables set dynamically: `--header-height-current`
- GitHub Pages deployment requires `base: '/'` in vite.config.ts and `homepage` in package.json
