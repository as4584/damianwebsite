# Customer Site — Vercel Deployment

Static site deployed via Vercel. Push to `main` to deploy.

## How to Swap Sites

1. Delete all files except `.git`, `.gitignore`, `vercel.json`, and this `README.md`
2. Copy new site files into the repo root
3. Commit and push — Vercel auto-deploys

```bash
# Quick swap command (run from repo root):
find . -maxdepth 1 ! -name '.git' ! -name '.gitignore' ! -name 'vercel.json' ! -name 'README.md' ! -name '.' -exec rm -rf {} +
cp -r /path/to/new-site/* .
git add -A && git commit -m "Deploy: [client-name]" && git push
```

## Current Site

**Client:** Innovation Development Solutions
**Type:** Static HTML/CSS/JS (no build step)
**Pages:** Home, About, Services, Who We Serve, Industries, Contact

## Stack

- Pure HTML5 + CSS3 + vanilla JS
- EB Garamond + Inter (Google Fonts)
- No framework dependencies
- Vercel static hosting (auto-deploy on push)
