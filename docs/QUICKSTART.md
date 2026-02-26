# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
/root/damaian/
├── app/                    # Next.js pages (App Router)
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── services/page.tsx  # Services page
│   ├── contact/page.tsx   # Contact page
│   ├── privacy/page.tsx   # Privacy policy
│   ├── terms/page.tsx     # Terms of service
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── layout/
│   │   ├── Header.tsx    # Navigation header
│   │   └── Footer.tsx    # Footer
│   ├── StickyScrollCards.tsx  # Main feature
│   ├── Hero.tsx
│   ├── ServicesOverview.tsx
│   └── CTASection.tsx
│
├── public/               # Static assets
│   └── assets/brand/     # Brand images
│
└── Configuration files
```

---

## 🎯 Key Features

### ✅ Sticky Scroll Cards
The signature feature - smooth card stacking on scroll
- Location: Home page, middle section
- Component: `components/StickyScrollCards.tsx`
- 5 cards with professional transitions

### ✅ Full Navigation
- Home, Services, About, Contact
- Mobile-responsive menu
- Smooth scroll behavior

### ✅ Contact Form
- Professional consultation form
- Validation and success states
- Ready for backend integration

### ✅ Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interactions

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Create production build
npm start            # Run production server

# Linting
npm run lint         # Check code quality
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* your colors */ },
  neutral: { /* your colors */ },
}
```

### Update Content
All content is in the page files:
- Home: `app/page.tsx`
- Services: `app/services/page.tsx`
- About: `app/about/page.tsx`
- Contact: `app/contact/page.tsx`

### Modify Sticky Cards
Edit `components/StickyScrollCards.tsx`:
```typescript
const cards = [
  { id: 1, title: '...', text: '...' },
  // Add/edit cards here
]
```

---

## 📚 Documentation

- **Full README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Project Summary**: `PROJECT_SUMMARY.md`
- **Sticky Scroll Docs**: `STICKY_SCROLL_DOCS.md`

---

## 🌐 Deployment

### Fastest: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

That's it! Your site is live.

See `DEPLOYMENT.md` for other deployment options.

---

## 🔧 Common Tasks

### Add a New Page

1. Create `app/your-page/page.tsx`
2. Add link in `components/layout/Header.tsx`
3. Add link in `components/layout/Footer.tsx`

### Change Brand Images

Replace files in `/public/assets/brand/` with your images.
Images are used as background textures on:
- Hero section
- CTA sections

### Update Contact Information

Edit `components/layout/Footer.tsx` and `app/contact/page.tsx`

---

## ✅ Pre-Deployment Checklist

- [ ] Update contact email/phone in Footer and Contact page
- [ ] Replace placeholder content with real information
- [ ] Add your logo (if you have one)
- [ ] Test contact form
- [ ] Check all links work
- [ ] Test on mobile device
- [ ] Run `npm run build` successfully

---

## 🆘 Need Help?

### Documentation
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

### Build Issues
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🎉 You're All Set!

The website is **production-ready** and includes:
- ✅ Modern Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Framer Motion for animations
- ✅ Mobile-responsive design
- ✅ Professional sticky scroll feature
- ✅ Complete page structure
- ✅ Contact form ready
- ✅ SEO-friendly setup

**Current Status**: Development server ready at http://localhost:3000

Run `npm run dev` to start coding! 🚀
