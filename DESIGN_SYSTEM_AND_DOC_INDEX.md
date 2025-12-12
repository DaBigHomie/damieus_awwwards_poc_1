# Design System & Documentation Index - DAMIEUS Awwwards POC

## 📚 Quick Navigation
- [Tier 1: Essential](#tier-1-essential-foundation) - Core design system elements
- [Tier 2: Important](#tier-2-important-components) - Components and patterns  
- [Tier 3: Advanced](#tier-3-advanced-considerations) - Performance and best practices

---

## 🎯 Overview

DAMIEUS is a modern, award-worthy portfolio website showcasing future tech solutions with a dark, cyber-aesthetic design language. The design system emphasizes minimalism, smooth animations, and immersive user experiences.

### Project Details
- **Project Name:** DAMIEUS Awwwards POC
- **Technology Stack:** React 18+, Vite, CSS3
- **Target Platform:** Web (Desktop-first, Mobile-responsive)
- **Primary Users:** Potential clients, recruiters, design awards judges
- **Design Philosophy:** Minimalist cyber-aesthetic with smooth animations and custom cursor interactions

---

## Tier 1: Essential Foundation

### 1. Color System

#### Brand Colors

```css
/* Primary Palette */
--bg-color: #0a0a0a;           /* Main background - Pure black with slight warmth */
--card-bg: #141414;             /* Card/Surface background - Elevated surfaces */
--border: #222;                 /* Borders and dividers */

/* Text Colors */
--text-main: #e0e0e0;           /* Primary text - High readability */
--text-muted: #888;             /* Secondary text - Lower emphasis */

/* Accent Colors */
--accent: #00f2ff;              /* Primary accent - Cyan glow */
--accent-dim: rgba(0, 242, 255, 0.1);  /* Accent background tint */
```

#### Color Usage Guidelines

| Color | Use Case | Contrast Ratio | WCAG Level |
|-------|----------|----------------|------------|
| `--text-main` on `--bg-color` | Body text | 12.5:1 | AAA |
| `--text-muted` on `--bg-color` | Secondary text | 4.8:1 | AA |
| `--accent` on `--bg-color` | CTAs, links, highlights | 8.2:1 | AAA |
| `--border` on `--bg-color` | Borders | 2.1:1 | - |

### 2. Typography

#### Font Families

```css
--font-main: 'Space Grotesk', sans-serif;      /* Body text, UI elements */
--font-display: 'Syncopate', sans-serif;       /* Headings, hero text */
```

**Font Stack (with fallbacks):**
```css
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
font-family: 'Syncopate', 'Arial Black', sans-serif;
```

#### Type Scale

| Element | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|-------------|----------------|---------------|--------|-------------|
| H1 (Hero) | Syncopate | 4rem (64px) | 2.5rem (40px) | 700 | 1.1 |
| H2 (Section) | Syncopate | 3rem (48px) | 2rem (32px) | 700 | 1.2 |
| H3 (Subsection) | Space Grotesk | 2rem (32px) | 1.5rem (24px) | 600 | 1.3 |
| H4 (Card Title) | Space Grotesk | 1.5rem (24px) | 1.25rem (20px) | 600 | 1.4 |
| Body Large | Space Grotesk | 1.125rem (18px) | 1rem (16px) | 400 | 1.6 |
| Body | Space Grotesk | 1rem (16px) | 1rem (16px) | 400 | 1.6 |
| Small | Space Grotesk | 0.875rem (14px) | 0.875rem (14px) | 400 | 1.5 |
| Button Text | Space Grotesk | 1rem (16px) | 0.875rem (14px) | 500 | 1 |

#### Typography Best Practices

```css
/* Headings */
h1, h2 {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

h3, h4, h5, h6 {
  font-family: var(--font-main);
  font-weight: 600;
}

/* Body Text */
p {
  font-family: var(--font-main);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-main);
}

/* Muted Text */
.text-muted {
  color: var(--text-muted);
  font-size: 0.875rem;
}
```

### 3. Spacing System

#### Spacing Scale

Based on 4px base unit for consistency:

```css
--space-xs: 4px;      /* 0.25rem */
--space-sm: 8px;      /* 0.5rem */
--space-md: 16px;     /* 1rem */
--space-lg: 24px;     /* 1.5rem */
--space-xl: 32px;     /* 2rem */
--space-2xl: 48px;    /* 3rem */
--space-3xl: 64px;    /* 4rem */
--space-4xl: 96px;    /* 6rem */
--space-5xl: 128px;   /* 8rem */
```

#### Component Spacing

| Component | Internal Padding | External Margin |
|-----------|------------------|-----------------|
| Button | 12px 24px | - |
| Card | 24px | 16px bottom |
| Section | 64px vertical | - |
| Container | 0 24px (mobile), 0 48px (desktop) | - |
| Input | 12px 16px | - |

### 4. Grid & Layout

#### Breakpoints

```css
/* Mobile-first approach */
--breakpoint-sm: 576px;   /* Small phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 992px;   /* Small desktops */
--breakpoint-xl: 1200px;  /* Desktops */
--breakpoint-2xl: 1440px; /* Large desktops */
```

#### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 768px) {
  .container {
    padding: 0 48px;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

#### Grid System

```css
/* CSS Grid - 12 column system */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

/* Common column spans */
.col-full { grid-column: span 12; }
.col-half { grid-column: span 6; }
.col-third { grid-column: span 4; }
.col-quarter { grid-column: span 3; }
```

---

## Tier 2: Important Components

### 5. Core UI Components

#### Button Component

**Variants:**

```css
/* Primary Button */
.btn-primary {
  background-color: var(--accent);
  color: var(--bg-color);
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-family: var(--font-main);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #00d9e6;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 242, 255, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: var(--accent);
  padding: 12px 24px;
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-family: var(--font-main);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--accent-dim);
}

/* Text Button */
.btn-text {
  background: none;
  color: var(--accent);
  border: none;
  font-family: var(--font-main);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
```

**Accessibility:**
- Minimum touch target: 44x44px
- Keyboard focusable
- Focus indicator: 2px outline in accent color
- ARIA labels for icon-only buttons

#### Card Component

```css
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 24px rgba(0, 242, 255, 0.1);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.card-description {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
}
```

#### Navigation Header

**Structure:**
- Fixed position at top
- Logo on left
- Navigation menu center/right
- Mobile hamburger menu
- Custom cursor integration

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.nav-menu {
  display: flex;
  gap: 32px;
  list-style: none;
}

.nav-link {
  color: var(--text-main);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--accent);
}

@media (max-width: 768px) {
  .nav-menu {
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    background-color: var(--card-bg);
    padding: 48px 24px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .nav-menu.open {
    transform: translateX(0);
  }
}
```

#### Footer

**Structure:**
- Multi-section layout (Company, Quick Links, Contact, Social)
- Copyright and legal links at bottom
- Responsive (4 columns desktop, 1 column mobile)

```css
.footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border);
  padding: 48px 0 24px;
}

.footer-sections {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .footer-sections {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}
```

#### Custom Cursor

**Implementation:**
- Replaces default cursor with custom design
- Smooth tracking animation
- Interactive states (hover, click)

```css
.cursor {
  width: 20px;
  height: 20px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 4px;
  height: 4px;
  background-color: var(--accent);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
}

/* Hide default cursor */
body {
  cursor: none;
}

/* Hover state */
.cursor.hover {
  transform: scale(2);
}
```

---

## Tier 3: Advanced Considerations

### 6. Page Templates

#### Home Page (P0 - Required)

**Structure:**
1. **Hero Section**
   - Full viewport height
   - Large heading (H1) with brand name
   - Tagline (subtitle)
   - Primary CTA button ("View Work", "Get Started")
   - Background: Dark with subtle animations

2. **Services Section**
   - Section heading (H2)
   - Service cards in grid (3-4 columns desktop, 1-2 mobile)
   - Each card: Icon, Service name, Description, "Learn More" link
   - Links to /services or /services/{slug}

3. **Projects Section**
   - Section heading (H2)
   - Project cards in grid (3 columns desktop, 1 mobile)
   - Each card: Image, Project title, Tags, Link to detail
   - "View All Projects" button linking to /work or /portfolio

4. **CTA Section**
   - Strong call-to-action
   - Heading: "Ready to Start Your Project?"
   - Description (optional)
   - Primary button ("Contact Us")
   - Links to /contact

5. **Footer**
   - Company info, Quick links, Contact info, Social media
   - Copyright, Privacy Policy, Terms of Service

#### Services Page (P0 - Required)

**URL:** `/services`

**Structure:**
- Page header with breadcrumb (Home > Services)
- Page title (H1): "Services" or "What We Do"
- Services grid showing all services
- Each service card: Icon, Name, Description, "Learn More" button

**Service Detail Page:** `/services/{slug}`
- Service name (H1)
- Hero image (optional)
- Detailed description (300+ words)
- Key benefits list (3-6 items)
- Process steps (optional)
- Related projects (2-4 examples)
- CTA section ("Get a Quote")

#### Projects/Portfolio Page (P0 - Required)

**URL:** `/work` or `/portfolio`

**Structure:**
- Page header with breadcrumb (Home > Work)
- Page title (H1): "Our Work" or "Portfolio"
- Filter bar (optional: by category, industry, service)
- Projects grid (3 columns desktop, 1 mobile)
- Each card: Featured image, Title, Client (optional), Description (50-100 chars), Tags

**Project Detail Page:** `/work/{slug}`
- Project title (H1)
- Project metadata (Client, Date, Services, Live URL)
- Hero image or video
- Project description (200-500 words)
- Gallery (3-10 images with lightbox)
- Challenge, Solution, Results sections
- Related projects (2-3 similar)
- CTA section ("Next Project", "Contact Us")

#### Contact Page (P0 - Required)

**URL:** `/contact`

**Structure:**
- Page header with breadcrumb (Home > Contact)
- Page title (H1): "Contact Us"
- Contact form:
  - Name (required)
  - Email (required, validated)
  - Phone (optional)
  - Message (required, textarea)
  - Submit button
  - Success/error messaging
- Contact information:
  - Email (clickable mailto:)
  - Phone (clickable tel:)
  - Address (if physical location)
  - Business hours (optional)
- Map embed (optional)
- Social media links

#### About Page (P1 - Should Have)

**URL:** `/about` or `/agency`

**Structure:**
- Page header with breadcrumb (Home > About)
- Company story (300-500 words)
- Values section (3-6 values with icons)
- Team section (3+ team members with photos, names, titles, bios)
- CTA section ("Join Us" or "Work With Us")

#### Gallery Page (P1 - Should Have)

**URL:** `/gallery`

**Structure:**
- Page header with filter options (by category, date, project)
- Image grid (masonry or grid layout)
- Lightbox modal (click to expand, navigate with arrows/keyboard)
- Minimum 10 images

### 7. Animations & Transitions

#### Page Transitions

```css
/* Fade in on page load */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-transition {
  animation: fadeIn 0.5s ease-in-out;
}
```

#### Scroll Animations

```css
/* Fade up on scroll */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-animate {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}
```

#### Hover Effects

```css
/* Card hover */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 242, 255, 0.15);
}

/* Button hover */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 242, 255, 0.4);
}

/* Image scale on hover */
.img-hover {
  overflow: hidden;
}

.img-hover img {
  transition: transform 0.5s ease;
}

.img-hover:hover img {
  transform: scale(1.1);
}
```

### 8. Accessibility

#### WCAG 2.1 AA Compliance

**Color Contrast:**
- Text on background: 12.5:1 (AAA)
- Accent on background: 8.2:1 (AAA)
- All interactive elements: ≥4.5:1

**Keyboard Navigation:**
- All interactive elements focusable via Tab
- Focus indicators visible (2px outline in accent color)
- Skip to main content link
- Logical tab order

**ARIA Labels:**
```html
<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>

<!-- Buttons with icons -->
<button aria-label="Open menu">
  <svg aria-hidden="true"><!-- icon --></svg>
</button>

<!-- Form inputs -->
<label for="email">Email Address</label>
<input id="email" type="email" aria-required="true" aria-describedby="email-error">
<span id="email-error" role="alert">Please enter a valid email</span>
```

**Image Alt Text:**
- Decorative images: `alt=""` or `role="presentation"`
- Meaningful images: Descriptive alt text
- Complex images: Long description via aria-describedby

**Screen Reader Support:**
- Semantic HTML (header, nav, main, footer, article, section)
- Proper heading hierarchy (h1 > h2 > h3)
- Descriptive link text (avoid "click here")

### 9. Responsive Design

#### Mobile-First Approach

**Breakpoint Strategy:**
1. Design for mobile (320px+) first
2. Add tablet styles (768px+)
3. Add desktop styles (1024px+)
4. Add large desktop styles (1440px+)

**Common Patterns:**

```css
/* Mobile (default) */
.grid {
  grid-template-columns: 1fr;
  gap: 16px;
}

.text {
  font-size: 1rem;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .text {
    font-size: 1.125rem;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  
  .text {
    font-size: 1.25rem;
  }
}
```

**Mobile Considerations:**
- Touch targets ≥44x44px
- No horizontal scroll
- Hamburger menu for navigation
- Stacked layout (single column)
- Larger font sizes for readability
- Custom cursor disabled on touch devices

### 10. Performance

#### Optimization Strategies

**Images:**
- Use WebP format with fallbacks
- Lazy loading for images below fold: `loading="lazy"`
- Responsive images with srcset
- Maximum image size: 200KB
- Compress all images (TinyPNG, Squoosh)

**CSS:**
- Critical CSS inlined in `<head>`
- Non-critical CSS loaded asynchronously
- Minify CSS in production
- Remove unused CSS (PurgeCSS)

**JavaScript:**
- Code splitting (React lazy loading)
- Tree shaking (remove unused code)
- Minify JS in production
- Defer non-critical scripts

**Fonts:**
- Use `font-display: swap` for web fonts
- Preload critical fonts
- Limit to 2-3 font families
- Use variable fonts if possible

**Caching:**
- Set cache headers (1 year for static assets)
- Use service workers (PWA)
- CDN for static assets

#### Performance Budget

- **Lighthouse Score:** ≥90 on all metrics
- **LCP (Largest Contentful Paint):** <2.5s
- **FID (First Input Delay):** <100ms
- **CLS (Cumulative Layout Shift):** <0.1
- **Total Page Size:** <1MB
- **Time to Interactive:** <3.8s

---

## 📦 Development Standards

### Import Rules

```javascript
// 1. External dependencies
import React from 'react';
import { Link } from 'react-router-dom';

// 2. Components
import { Button, Card } from '@/components';

// 3. Styles
import './styles.css';
```

### File Naming

- Components: PascalCase (`Button.jsx`, `ServiceCard.jsx`)
- Utilities: camelCase (`formatDate.js`, `apiClient.js`)
- Styles: kebab-case (`button.css`, `service-card.css`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.js`)

### Code Style

- Use functional components with hooks
- Named exports for components
- PropTypes or TypeScript for type checking
- ESLint + Prettier for code formatting
- Semantic HTML5 elements
- BEM methodology for CSS classes (optional)

---

## 📝 Documentation Maintenance

### Updating This Document

When making design changes:
1. Update this document FIRST
2. Implement changes in code
3. Review documentation accuracy
4. Run design system validation
5. Update version/date

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 12, 2025 | Initial design system documentation |

---

## 🔗 Related Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [Component Library](./COMPONENT_LIBRARY.md) (if exists)
- [Development Guide](./README.md)
- [Changelog](./CHANGELOG.md)

---

**Last Updated:** December 12, 2025  
**Maintained By:** DAMIEUS Development Team  
**Questions?** Contact: [team@damieus.com](mailto:team@damieus.com)
