# Deployment Guide

## Deploying to Vercel

This application is configured to deploy to Vercel with the included `vercel.json` configuration file.

### Quick Deploy

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Custom Domain Configuration (kyliigabriella.xyz)

To use the custom domain `kyliigabriella.xyz`, follow these steps:

#### Step 1: Add Domain in Vercel Dashboard

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Domains**
3. Add `kyliigabriella.xyz` as a custom domain
4. Vercel will provide you with DNS records to configure

#### Step 2: Configure DNS Records

Add the following DNS records in your domain registrar's DNS settings:

**For root domain (kyliigabriella.xyz):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

**Alternative: Using ALIAS/ANAME record (if supported by your DNS provider):**
- Type: `ALIAS` or `ANAME`
- Name: `@`
- Value: `cname.vercel-dns.com`

#### Step 3: Verify Domain

1. After configuring DNS records, return to Vercel Dashboard
2. Click **Verify** next to your domain
3. Vercel will automatically issue an SSL certificate
4. Your site will be live at `https://kyliigabriella.xyz`

### DNS Propagation

- DNS changes can take up to 48 hours to propagate globally
- Use [DNS Checker](https://dnschecker.org) to verify propagation status

### Environment Variables

If you need to add environment variables (API keys, etc.):

1. Go to **Settings** → **Environment Variables** in Vercel Dashboard
2. Add your variables
3. Redeploy the project to apply changes

### Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch triggers a production deployment
- Pull requests get preview deployments automatically

## Current Deployment

- Production URL: `https://gab-pc4x-1xspiics9-bosskyleelmomorata.vercel.app`
- Custom Domain: `https://kyliigabriella.xyz` (to be configured)

## Support

For deployment issues:
- Vercel Documentation: https://vercel.com/docs
- DNS Configuration Help: https://vercel.com/docs/concepts/projects/custom-domains
