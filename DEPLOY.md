# Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/organizations/keymashllc/repositories/new
   - Or navigate to: GitHub → keymashllc organization → New repository

2. Repository settings:
   - **Name**: `mine-trade`
   - **Description**: "A run-based roguelike mining game"
   - **Visibility**: Private or Public (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)

3. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in your terminal (from the project directory):

```bash
# Add the remote (replace with your actual repo URL if different)
git remote add origin https://github.com/keymashllc/mine-trade.git

# Or if using SSH:
# git remote add origin git@github.com:keymashllc/mine-trade.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If you get authentication errors, you may need to:
- Use a personal access token (Settings → Developer settings → Personal access tokens)
- Or set up SSH keys

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. **Important**: Select the **Keymash** team (not your personal account)
4. Import the `keymashllc/mine-trade` repository
5. Click "Import"

### 3.2 Configure Project Settings

**Framework Preset**: Next.js (should auto-detect)

**Build Settings**:
- **Root Directory**: `./` (default)
- **Build Command**: `pnpm build` (or `npm run build` if not using pnpm)
- **Output Directory**: `.next` (default)
- **Install Command**: `pnpm install` (or `npm install`)

**Environment Variables** - Add these:

1. `DATABASE_URL`
   - If using Vercel Postgres: Go to Storage tab → Create Postgres → Copy connection string
   - If using Neon: Create database at https://neon.tech → Copy connection string
   - Format: `postgresql://user:password@host:5432/database?sslmode=require`

2. `NEXTAUTH_URL`
   - Set to your Vercel deployment URL (e.g., `https://mine-trade.vercel.app`)
   - You can update this after first deployment

3. `NEXTAUTH_SECRET`
   - Generate with: `openssl rand -base64 32`
   - Or use any secure random string

4. `NODE_ENV`
   - Set to: `production`

### 3.3 Update Prisma Schema for Postgres

Before deploying, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Update Prisma schema for Postgres production"
git push
```

### 3.4 Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. The build will automatically:
   - Run `prisma generate`
   - Run `prisma migrate deploy` (applies migrations)
   - Build Next.js app

### 3.5 Run Initial Migration (if needed)

If migrations fail during build, run them manually:

1. Install Vercel CLI: `npm i -g vercel`
2. Pull environment: `vercel env pull .env.local`
3. Run migration: `pnpm db:migrate` (with production DATABASE_URL)
4. Or use Vercel's database dashboard to run SQL directly

### 3.6 Seed Database (Optional)

To seed initial data (sectors, market prices, relics):

```bash
# With production DATABASE_URL set
pnpm db:seed
```

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test user registration
3. Test login
4. Create a run and test gameplay
5. Verify database is working (check Vault, Journal, Market)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version is 20+ (set in Vercel project settings)

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled (`?sslmode=require`)

### Migration Errors
- Run migrations manually (see step 3.5)
- Check Prisma schema matches database
- Verify `prisma migrate deploy` runs in build

### Authentication Issues
- Verify `NEXTAUTH_URL` matches deployment URL
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

## Post-Deployment

- [ ] Update `NEXTAUTH_URL` to actual deployment URL
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Set up database backups
- [ ] Test all game features
- [ ] Verify CI/CD is working on GitHub

