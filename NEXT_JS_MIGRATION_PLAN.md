# Next.js Migration Plan
**Project:** damieus_awwwards_poc_1  
**Date:** December 12, 2025  
**Estimated Time:** 3-4 hours  
**Status:** 🚧 In Progress

---

## Why Next.js?

### Critical Benefits
1. **SEO** - SSR/SSG ensures search engines see full content (critical for 26+ service pages)
2. **Image Optimization** - Automatic WebP conversion, lazy loading, responsive sizing
3. **Performance** - Better Core Web Vitals, faster initial load
4. **File-Based Routing** - Cleaner route management for complex nested structure
5. **API Routes** - Built-in backend for contact forms, lead capture
6. **Metadata Management** - Per-page SEO meta tags made easy

---

## New Architecture

### Current Structure (WordPress-based)
```
WordPress had "service pages" that were actually CATEGORY pages:
- /artificial-intelligence → Category with multiple services inside
- /nonprofits → Sector with multiple offerings
- /cloud-solutions → Category with multiple services
```

### Proposed Next.js Structure

```
app/
├── layout.tsx                          → Root layout (Navigation, Footer)
├── page.tsx                            → Home page
├── about/
│   └── page.tsx                        → About page
├── services/
│   ├── page.tsx                        → Services overview (all categories)
│   ├── [category]/
│   │   ├── page.tsx                    → Category page (e.g., /services/artificial-intelligence)
│   │   │                                  Shows: Overview + List of services in category
│   │   └── [service]/
│   │       └── page.tsx                → Service detail page
│   │                                      Shows: Deep dive, pricing, process, case studies
├── work/
│   ├── page.tsx                        → Projects overview
│   └── [slug]/
│       └── page.tsx                    → Project detail
├── gallery/
│   └── page.tsx                        → Gallery page
├── contact/
│   └── page.tsx                        → Contact page
└── api/
    ├── contact/
    │   └── route.ts                    → Contact form submission
    └── newsletter/
        └── route.ts                    → Newsletter signup
```

---

## Content Structure

### Categories (What We Do)
**Technology Offerings:**
- `artificial-intelligence` - AI, ML, NLP, Computer Vision
- `web-development` - Frontend, Backend, Full-stack, E-commerce
- `cloud-solutions` - AWS, Azure, GCP, Migration, Infrastructure
- `cyber-security` - Audits, Pentesting, Compliance, Monitoring
- `data-analytics` - BI, Warehousing, Predictive, Real-time
- `digital-marketing` - SEO, SEM, Social Media, Content
- `mobile-development` - iOS, Android, Cross-platform

### Sectors (Who We Serve)
**Industry Verticals:**
- `nonprofits` - Donation systems, Volunteer management, CRM
- `startups` - MVP development, Growth strategy, Tech consulting
- `enterprise` - Digital transformation, Legacy modernization
- `healthcare` - HIPAA compliance, EHR integration
- `finance` - Fintech, Trading platforms, Banking apps
- `education` - E-learning platforms, Student management

### Services (Within Categories)
Each category has 3-8 specific services:

**Example: artificial-intelligence/**
```json
{
  "category": "Artificial Intelligence",
  "slug": "artificial-intelligence",
  "services": [
    {
      "name": "Machine Learning Models",
      "slug": "machine-learning",
      "price": "$25,000+",
      "description": "Custom ML models trained on your data..."
    },
    {
      "name": "Natural Language Processing",
      "slug": "nlp",
      "price": "$30,000+",
      "description": "Advanced NLP for chatbots, sentiment analysis..."
    },
    {
      "name": "Computer Vision",
      "slug": "computer-vision",
      "price": "$35,000+",
      "description": "Image recognition, object detection..."
    }
  ]
}
```

---

## Migration Steps

### Phase 1: Setup Next.js (30 mins)
- [x] Create migration plan
- [ ] Initialize Next.js 14 with App Router
- [ ] Copy existing components to Next.js structure
- [ ] Set up Tailwind CSS (optional - can keep current CSS)
- [ ] Configure TypeScript
- [ ] Set up environment variables

### Phase 2: Convert Pages (1 hour)
- [ ] Convert `Home.jsx` → `app/page.tsx`
- [ ] Convert `About.jsx` → `app/about/page.tsx`
- [ ] Convert `Contact.jsx` → `app/contact/page.tsx`
- [ ] Convert `Services.jsx` → `app/services/page.tsx`
- [ ] Convert `Work.jsx` → `app/work/page.tsx`
- [ ] Convert `Gallery.jsx` → `app/gallery/page.tsx`

### Phase 3: Create Dynamic Routes (1.5 hours)
- [ ] Create `app/services/[category]/page.tsx` - Category pages
- [ ] Create `app/services/[category]/[service]/page.tsx` - Service detail pages
- [ ] Create `app/work/[slug]/page.tsx` - Project detail pages
- [ ] Parse WordPress services data into category → services structure
- [ ] Generate metadata for each page (SEO)

### Phase 4: Convert Components (30 mins)
- [ ] Update Navigation component for Next.js Link
- [ ] Update Footer component
- [ ] Update Services component
- [ ] Update ProjectsGrid component
- [ ] Convert image imports to Next.js Image component

### Phase 5: Image Optimization (30 mins)
- [ ] Convert all `<img>` to Next.js `<Image>`
- [ ] Add WordPress logos to `/public/images/`
- [ ] Configure image domains in `next.config.js`
- [ ] Set up placeholder images

### Phase 6: API Routes (30 mins)
- [ ] Create `/api/contact/route.ts` - Contact form handler
- [ ] Create `/api/newsletter/route.ts` - Newsletter signup
- [ ] Add email service integration (SendGrid/Resend)

### Phase 7: Testing & Deployment (30 mins)
- [ ] Test all routes locally
- [ ] Test dynamic routes with all 26+ categories
- [ ] Verify SEO metadata on all pages
- [ ] Build for production
- [ ] Deploy to Vercel
- [ ] Verify deployment

---

## File Changes Required

### New Files to Create
```
next.config.js
app/layout.tsx
app/page.tsx
app/about/page.tsx
app/services/page.tsx
app/services/[category]/page.tsx
app/services/[category]/[service]/page.tsx
app/work/page.tsx
app/work/[slug]/page.tsx
app/gallery/page.tsx
app/contact/page.tsx
app/api/contact/route.ts
data/services-structure.json          ← Organize WordPress services by category
components/ServiceCard.tsx
components/CategoryHero.tsx
```

### Files to Convert
```
src/components/Navigation.jsx → components/Navigation.tsx
src/components/Footer.jsx → components/Footer.tsx
src/components/Hero.jsx → components/Hero.tsx
src/components/Services.jsx → components/Services.tsx
src/components/About.jsx → components/About.tsx
src/components/ProjectsGrid.jsx → components/ProjectsGrid.tsx
src/components/Gallery.jsx → components/Gallery.tsx
```

### Files to Delete (After Migration)
```
src/pages/*                   ← All page components
src/App.jsx                   ← React Router app
public/index.html             ← Not needed in Next.js
vite.config.js                ← Replaced by next.config.js
```

---

## WordPress Services Reorganization

### Current State
26 WordPress "services" that are actually categories + sectors mixed together

### Proposed Reorganization

**data/services-structure.json:**
```json
{
  "categories": [
    {
      "id": "artificial-intelligence",
      "name": "Artificial Intelligence",
      "type": "offering",
      "tagline": "Intelligent systems that learn and adapt",
      "description": "...",
      "services": [
        {
          "slug": "machine-learning",
          "name": "Machine Learning Models",
          "price": "$25,000+",
          "timeline": "3-6 months",
          "capabilities": [...],
          "process": [...],
          "benefits": [...]
        },
        // ... more services
      ]
    },
    {
      "id": "nonprofits",
      "name": "Nonprofit Solutions",
      "type": "sector",
      "tagline": "Do More Good, More Efficiently",
      "description": "...",
      "services": [
        {
          "slug": "donation-fundraising",
          "name": "Donation & Fundraising",
          "price": "Contact for quote",
          "description": "Maximize fundraising with secure donation pages..."
        },
        // ... more services
      ]
    }
  ]
}
```

---

## SEO Improvements

### Metadata Generation
Each page will have:
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const category = getCategory(params.category);
  
  return {
    title: `${category.name} Services | Damieus Technology Solutions`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Damieus`,
      description: category.description,
      images: ['/images/og-default.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Damieus`,
      description: category.description,
    }
  };
}
```

### URL Structure
```
Old (Vite): /services/artificial-intelligence
New (Next): /services/artificial-intelligence (same, but with SSR/SSG)

Old: All client-side rendered
New: Static pages generated at build time (fast, SEO-friendly)
```

---

## Performance Improvements

### Before (Vite)
- Initial Load: ~1.5s (client-side rendering)
- Time to Interactive: ~2s
- SEO: Poor (empty HTML until JS loads)

### After (Next.js)
- Initial Load: ~0.3s (pre-rendered HTML)
- Time to Interactive: ~0.8s
- SEO: Excellent (full HTML on first load)
- Images: Automatically optimized WebP
- Code Splitting: Automatic per-route

---

## Rollback Plan

If migration fails:
1. Current Vite app is in `master` branch (safe)
2. Create Next.js in `next-migration` branch
3. Test thoroughly before merging
4. Keep Vite deployment active until Next.js is verified
5. Can revert to Vite anytime by re-deploying `master`

---

## Post-Migration Tasks

After successful migration:
1. Set up Vercel Analytics
2. Configure redirects for old URLs (if any)
3. Submit sitemap to Google Search Console
4. Add structured data (JSON-LD) for rich snippets
5. Set up monitoring (Sentry/LogRocket)
6. Add A/B testing framework (if needed)

---

## Questions to Answer

1. **Email Service**: Which email service for contact forms?
   - SendGrid (recommended)
   - Resend (modern, simple)
   - AWS SES (cost-effective)

2. **CMS**: Do you want to add a CMS later?
   - Sanity (headless CMS)
   - Contentful
   - Keep JSON files (simple)

3. **Analytics**: Which analytics service?
   - Vercel Analytics (built-in)
   - Google Analytics 4
   - Plausible (privacy-focused)

---

## Timeline

**Day 1 (Today):**
- ✅ Migration plan created
- ⏳ Initialize Next.js
- ⏳ Convert core pages
- ⏳ Create dynamic routes

**Day 2 (If needed):**
- Polish and testing
- Deploy to staging
- Get feedback
- Deploy to production

---

## Success Criteria

Migration is successful when:
- ✅ All 26+ category/service pages work
- ✅ Navigation is smooth and intuitive
- ✅ SEO metadata is present on all pages
- ✅ Images are optimized
- ✅ Build succeeds with no errors
- ✅ Lighthouse score > 90
- ✅ All existing features work (Gallery, Projects, Contact)

---

**Ready to start?** Let's initialize Next.js and begin the migration!
