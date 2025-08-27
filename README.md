# Commonplace Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Vite.

## 🚀 Live Demo

Visit the live site: [https://eltyagi.github.io/eltyagi_commonplace/](https://eltyagi.github.io/eltyagi_commonplace/)

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: CSS3 with custom responsive design
- **Routing**: React Router DOM
- **Testing**: Playwright
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/eltyagi/eltyagi_commonplace.git

# Navigate to project directory
cd eltyagi_commonplace

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Build & Deployment

### Local Build
```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

#### Method 1: Manual Deployment
```bash
npm run deploy
```

#### Method 2: Automatic Deployment (Recommended)
Push to the `main` branch and GitHub Actions will automatically deploy:

```bash
git add .
git commit -m "Deploy updates"
git push origin main
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test reports
npm run test:report
```

## 📁 Project Structure

```
src/
├── components/
│   ├── about-me/          # About/Dock page
│   ├── blog-card/         # Reusable blog card component
│   ├── contact/           # Contact page
│   ├── landing-page/      # Home page
│   ├── meditations/       # Meditations page with gallery
│   ├── navigation/        # Navigation component
│   ├── page-header/       # Page header component
│   └── thoughts/          # Thoughts/Blog page
├── assets/
│   ├── posts/            # Markdown blog posts
│   ├── sceneries/        # Gallery images
│   └── *.png, *.svg      # Other assets
└── App.tsx               # Main app component
```

## ✨ Features

- **Responsive Design**: Mobile-first approach with desktop optimizations
- **Interactive Blog Cards**: Progressive disclosure pattern
- **Image Gallery**: Expandable sceneries gallery with modal view
- **Smooth Animations**: CSS transitions and hover effects
- **Modern Typography**: Fira Code and Krona One fonts
- **Cross-browser Testing**: Playwright end-to-end tests
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🎨 Design System

- **Colors**: 
  - Primary: #FF6F61 (coral)
  - Background: #F9F6EE (cream)
  - Text: #252525 (dark gray)
  - Borders: #ABB2BF (light gray)

- **Typography**:
  - Headings: Krona One
  - Body: Fira Code

- **Breakpoints**:
  - Mobile: ≤ 480px
  - Desktop: > 480px

## 🚀 Deployment Configuration

### GitHub Pages Setup

1. **Repository Settings**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

2. **Automatic Deployment**:
   - GitHub Actions workflow automatically builds and deploys on push to `main`
   - No manual intervention required

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Update the `base` property in `vite.config.ts` to `'/'`
3. Update the `basename` in `App.tsx` to `''`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For any questions or feedback, feel free to reach out through the contact page on the website.
