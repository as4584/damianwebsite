# Innovation Business Services Website

A modern, production-ready website for Innovation Business Services - a professional business services company specializing in LLC formation, business setup, compliance, and entrepreneurial guidance.

## 📚 Documentation Governance

- **Canonical docs location:** `docs/`
- **Backup registry:** `docs/BACKUP_REGISTRY.md`
- **Agent context handoff:** `docs/AGENT_HANDOFF.md`
- **Latest backup version:** `docs-v2026.02.26-01`

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Design**: Mobile-first, responsive
- **Testing**: Jest (112 passing tests)
- **Routing**: Subdomain-aware middleware

## ✨ Features

- **Sticky Scroll Cards**: Smooth card stacking interaction on the homepage
- **Leads Dashboard**: Production-ready subdomain at `dashboard.innovationdevelopmentsolutions.com`
- **Subdomain Routing**: Host header detection with automatic URL rewriting
- **Professional Design**: Trust-first, authority-driven aesthetic
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized with Next.js Image component and lazy loading
- **SEO Ready**: Meta tags and structured content
- **AI-Powered**: Intelligent lead scoring and action suggestions

## 📁 Project Structure

```
├── app/
│   ├── about/page.tsx        # About page
│   ├── contact/page.tsx      # Contact page with form
│   ├── services/page.tsx     # Services page
│   ├── dashboard/            # 🆕 Leads Dashboard (subdomain)
│   │   ├── page.tsx          # Dashboard home
│   │   ├── layout.tsx        # Dashboard layout
│   │   ├── leads/[leadId]/   # Lead detail view
│   │   ├── components/       # Dashboard UI components
│   │   ├── services/         # Lead & scoring services
│   │   ├── utils/            # Intent extraction, actions
│   │   ├── middleware/       # 🆕 Subdomain routing logic
│   │   │   ├── hostRouter.ts       # Host header detection
│   │   │   └── hostRouter.test.ts  # 14 routing tests
│   │   ├── api/              # Dashboard API routes
│   │   └── tests/            # 98 dashboard tests
│   ├── privacy/page.tsx      # Privacy policy
│   ├── terms/page.tsx        # Terms of service
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── middleware.ts             # 🆕 Root middleware (subdomain routing)
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Navigation header
│   │   └── Footer.tsx        # Footer
│   ├── StickyScrollCards.tsx # Sticky scroll interaction
│   ├── Hero.tsx              # Hero section
│   ├── ServicesOverview.tsx  # Services grid
│   └── CTASection.tsx        # Call-to-action section
├── public/
│   └── assets/
│       └── brand/            # Brand images (used as textures)
├── docs/                     # Centralized documentation
│   ├── BACKUP_REGISTRY.md    # Versioned docs backups tracked on GitHub
│   └── AGENT_HANDOFF.md      # Future-agent context and backup instructions
├── testing/
│   └── e2e/                  # Compartmentalized end-to-end tests by website area
└── Configuration files
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**

```bash
npm install
```

2. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**

```bash
npm run build
npm start
```

## 🎨 Design Philosophy

- **Trust-First**: Professional, calm design that builds authority
- **No Distractions**: Motion improves clarity without being playful
- **Clear Hierarchy**: Easy-to-scan content structure
- **Accessible**: WCAG compliant with semantic HTML

## 📄 Pages

- **Home** (`/`): Hero, sticky scroll cards, services overview, CTA
- **Services** (`/services`): Detailed service offerings with pricing
- **About** (`/about`): Company story, values, team info
- **Contact** (`/contact`): Consultation form with contact details
- **Privacy** (`/privacy`): Privacy policy
- **Terms** (`/terms`): Terms of service

## 🎯 Key Components

### Sticky Scroll Cards

The signature feature - cards stack vertically with smooth transitions as you scroll. Each card scales and fades in/out based on scroll position.

### Hero Section

Engaging hero with clear value proposition, CTA buttons, and social proof metrics.

### Contact Form

Professional consultation booking form with validation and success states.

## 🔧 Customization

### Colors

Edit `tailwind.config.ts` to customize the color palette. Current scheme uses neutral grays with black accents.

### Content

All content is stored directly in the page components for easy editing. Update text in:
- `app/page.tsx` - Home page content
- `app/services/page.tsx` - Services content
- `app/about/page.tsx` - About content

### Brand Images

Place images in `/public/assets/brand/` and they'll automatically be used as subtle background textures with blur and low opacity.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Dashboard Subdomain Deployment (Production)

**📘 For complete subdomain deployment instructions, see [SUBDOMAIN_DEPLOYMENT.md](./SUBDOMAIN_DEPLOYMENT.md)**

The dashboard is deployed at `dashboard.innovationdevelopmentsolutions.com` using subdomain routing:

**Quick Start:**
1. Configure DNS CNAME: `dashboard` → hosting provider
2. Add domain to Vercel/hosting provider
3. Deploy: `vercel --prod`
4. Verify: Visit `https://dashboard.innovationdevelopmentsolutions.com`

**Verification:**
```bash
# Check DNS
dig dashboard.innovationdevelopmentsolutions.com

# Check subdomain serves dashboard
curl -s https://dashboard.innovationdevelopmentsolutions.com | grep -o "<title>[^<]*</title>"
# Expected: <title>Leads Dashboard</title>

# Run all tests
npm test -- --watchAll=false
# Expected: 112 tests passing
```

**Key Features:**
- ✅ Host header detection (no /dashboard in URL)
- ✅ Automatic URL rewriting (dashboard.* → /dashboard internally)
- ✅ 4-case routing logic (subdomain protection)
- ✅ 112 passing tests (14 subdomain + 98 dashboard)
- ✅ Local testing with dashboard.localhost

**See [SUBDOMAIN_DEPLOYMENT.md](./SUBDOMAIN_DEPLOYMENT.md) for:**
- Exact DNS records by provider (Vercel, Netlify, Custom)
- Hosting configuration steps
- SSL certificate setup
- Local subdomain testing
- Production verification checklist
- Troubleshooting guide
- Rollback procedure

### Main Site Deployment (Vercel Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Deploy automatically

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Deploy the `.next` folder to any Node.js hosting platform.

## 📝 Environment Variables

For production, create a `.env.local` file:

```env
# Add any API keys or configuration here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🔒 Security

- Form validation on client and server
- No sensitive data in client bundle
- Environment variables for secrets
- HTTPS enforced in production

## 📧 Contact

For questions or support:
- Email: info@innovationbusinessservices.com
- Phone: (123) 456-7890

## 📄 License

© 2026 Innovation Business Services. All rights reserved.
