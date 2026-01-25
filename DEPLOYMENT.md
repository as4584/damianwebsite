# Deployment Guide - Innovation Business Services

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the recommended deployment platform for Next.js applications.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Innovation Business Services website"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Done!**
   - Site is live in ~2 minutes
   - Auto-deployments on every push
   - Free SSL certificate included
   - Custom domain setup available

#### Vercel Features:
- ✅ Zero configuration needed
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant rollbacks
- ✅ Preview deployments for branches
- ✅ Analytics included

### Option 2: Netlify

Similar to Vercel, great for static sites.

#### Steps:

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect to GitHub and select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy"

3. **Configure Next.js**
   - Install Netlify plugin:
     ```bash
     npm install -D @netlify/plugin-nextjs
     ```
   - Create `netlify.toml`:
     ```toml
     [[plugins]]
       package = "@netlify/plugin-nextjs"
     ```

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

For full control over the server environment.

#### Requirements:
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx for reverse proxy
- SSL certificate (Let's Encrypt)

#### Steps:

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Transfer Files**
   ```bash
   # Via SCP or Git
   scp -r .next package.json user@server:/var/www/innovation-business
   ```

3. **Install Dependencies on Server**
   ```bash
   ssh user@server
   cd /var/www/innovation-business
   npm install --production
   ```

4. **Start with PM2**
   ```bash
   pm2 start npm --name "innovation-business" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Setup SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Option 4: Docker Deployment

Containerized deployment for consistency across environments.

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Update next.config.mjs:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable for Docker
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
```

#### Build and Run:
```bash
# Build image
docker build -t innovation-business .

# Run container
docker run -p 3000:3000 innovation-business
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env.production` for production-specific settings:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Innovation Business Services

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Contact Form (If using API)
CONTACT_FORM_API_URL=https://api.yourdomain.com/contact
CONTACT_FORM_API_KEY=your-api-key

# Email Service (Optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### Vercel Environment Variables

Add these in Vercel dashboard under:
Settings → Environment Variables

### Security Considerations

1. **Never commit `.env` files**
   - Already in `.gitignore`
   - Use platform environment variables

2. **API Keys**
   - Store in environment variables
   - Never expose in client code
   - Use `NEXT_PUBLIC_` prefix only for public data

3. **Headers**
   Add security headers in `next.config.mjs`:
   ```javascript
   async headers() {
     return [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-XSS-Protection',
             value: '1; mode=block',
           },
         ],
       },
     ]
   },
   ```

## 🌐 Custom Domain Setup

### Vercel:
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL automatically provisioned

### Netlify:
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records
4. SSL automatically provisioned

### Manual Setup:
```
Type: A Record
Name: @
Value: [Your Server IP]

Type: CNAME
Name: www
Value: yourdomain.com
```

## 📊 Performance Optimization

### Before Deployment:

1. **Optimize Images**
   - Use Next.js Image component
   - Compress brand images
   - Use WebP format when possible

2. **Bundle Analysis**
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ```
   
   Update `next.config.mjs`:
   ```javascript
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   
   module.exports = withBundleAnalyzer({
     // ... other config
   })
   ```
   
   Run analysis:
   ```bash
   ANALYZE=true npm run build
   ```

3. **Lighthouse Audit**
   - Run before deployment
   - Aim for 90+ scores in all categories
   - Fix any accessibility issues

### After Deployment:

1. **Monitor Performance**
   - Use Vercel Analytics (free)
   - Google PageSpeed Insights
   - Core Web Vitals

2. **Enable Caching**
   - Next.js handles automatically
   - CDN caching via Vercel/Netlify

3. **Optimize Fonts**
   - Already using `next/font/google`
   - Fonts are automatically optimized

## 🔍 SEO Checklist

### Pre-Deployment:

- [x] Meta descriptions on all pages
- [x] Page titles are descriptive
- [ ] robots.txt file (add if needed)
- [ ] sitemap.xml (generate)
- [ ] Google Search Console setup
- [ ] Google Analytics setup

### Add robots.txt:

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

### Generate Sitemap:

Install sitemap generator:
```bash
npm install next-sitemap
```

Create `next-sitemap.config.js`:
```javascript
module.exports = {
  siteUrl: 'https://yourdomain.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
```

Add to `package.json`:
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

## 📧 Contact Form Integration

### Option 1: Formspree (Easiest)

```tsx
// Update form action
<form 
  action="https://formspree.io/f/YOUR_FORM_ID"
  method="POST"
>
  {/* form fields */}
</form>
```

### Option 2: EmailJS

```bash
npm install @emailjs/browser
```

```typescript
import emailjs from '@emailjs/browser'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    formData,
    'YOUR_PUBLIC_KEY'
  )
}
```

### Option 3: API Route (Custom)

Create `app/api/contact/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Send email using nodemailer or SendGrid
  // Store in database if needed
  
  return NextResponse.json({ success: true })
}
```

## 🔒 SSL Certificate

### Automatic (Vercel/Netlify):
- SSL automatically provisioned
- Certificates auto-renew
- No configuration needed

### Manual (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📱 PWA Setup (Optional)

Make it installable as a Progressive Web App:

```bash
npm install next-pwa
```

Update `next.config.mjs`:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // ... other config
})
```

Create `public/manifest.json`:
```json
{
  "name": "Innovation Business Services",
  "short_name": "IBS",
  "description": "Professional business formation services",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🐛 Troubleshooting Deployment

### Build Fails:

1. **TypeScript Errors**
   ```bash
   npm run build
   # Fix any type errors
   ```

2. **Missing Dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **Memory Issues**
   - Increase Node memory limit
   ```json
   {
     "scripts": {
       "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
     }
   }
   ```

### Runtime Issues:

1. **Images Not Loading**
   - Check Next.js Image domains config
   - Verify image paths are correct

2. **API Routes Failing**
   - Check environment variables
   - Verify API endpoint URLs

3. **Slow Performance**
   - Enable caching headers
   - Optimize images
   - Check bundle size

## ✅ Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Contact form submits successfully
- [ ] Mobile responsive on all devices
- [ ] SSL certificate is active (https://)
- [ ] Custom domain is working
- [ ] Analytics are tracking
- [ ] All images load properly
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Social media previews look good
- [ ] 404 page works
- [ ] Footer links are correct

## 🎯 Monitoring & Maintenance

### Set Up Monitoring:

1. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

2. **Error Tracking**
   - Sentry
   - LogRocket
   - Bugsnag

3. **Analytics**
   - Google Analytics 4
   - Plausible (privacy-focused)
   - Vercel Analytics

### Regular Maintenance:

- Update dependencies monthly
- Check for security vulnerabilities
- Review analytics monthly
- Backup database (if using one)
- Test contact form monthly
- Review and update content quarterly

## 🆘 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Deployment Status**: Ready to deploy! 🚀

Choose your preferred deployment method and follow the steps above. The website is fully production-ready and tested.
