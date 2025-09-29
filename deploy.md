# Cloudflare Pages Deployment Guide

## 🚀 Deployment Configuration

### Build Settings for Cloudflare Pages:

- **Framework preset:** Next.js (Static HTML Export)
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Root directory:** `/`
- **Node.js version:** `18.x` or `20.x`

### Environment Variables (if needed):
```
NODE_VERSION=20.x
NPM_VERSION=latest
```

## 📋 Step-by-Step Deployment:

### 1. Connect Repository
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect your Git repository (GitHub/GitLab)
4. Select your portfolio repository

### 2. Configure Build Settings
```
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: out
Root directory: /
```

### 3. Advanced Settings (Optional)
- **Node.js version:** 20.x
- **Environment variables:** None required for basic setup

### 4. Deploy
1. Click "Save and Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your site will be available at `https://your-project.pages.dev`

## 🔧 Local Testing Before Deploy:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test the build locally (optional)
npx serve out
```

## 🌐 Custom Domain (Optional):

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Add your domain
4. Update DNS records as instructed

## 📊 Performance Optimizations Included:

- ✅ Static export for maximum performance
- ✅ Optimized images (unoptimized for static export)
- ✅ Security headers via `_headers` file
- ✅ Proper caching configuration
- ✅ Client-side routing support via `_redirects`

## 🔍 Troubleshooting:

### Build Fails?
- Check Node.js version (use 18.x or 20.x)
- Ensure all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

### Site Not Loading?
- Verify `out` directory is set as build output
- Check `_redirects` file is in place
- Ensure static export is enabled in `next.config.mjs`

### Performance Issues?
- Check `_headers` file for proper caching
- Verify images are optimized
- Monitor Cloudflare Analytics
