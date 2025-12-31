# Quick Start - Push to GitHub & Deploy

## 🚀 Push to GitHub (2 minutes)

### Step 1: Create GitHub Repo
1. Go to: https://github.com/organizations/keymashllc/repositories/new
2. Name: `mine-trade`
3. **Don't** check any boxes (no README, .gitignore, license)
4. Click "Create repository"

### Step 2: Run These Commands

```bash
cd /Users/adam/Dropbox/Projects/Keymash/games/mine-trade

# Add GitHub remote
git remote add origin https://github.com/keymashllc/mine-trade.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Or use the script:**
```bash
./push-to-github.sh
```

---

## 🎯 Deploy to Vercel (5 minutes)

### Step 1: Import to Vercel
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. **Select "Keymash" team** (important!)
4. Import `keymashllc/mine-trade`
5. Click "Import"

### Step 2: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

**Required:**
- `DATABASE_URL` - Get from Vercel Postgres (Storage tab) or Neon
- `NEXTAUTH_URL` - Your Vercel URL (update after deploy)
- `NEXTAUTH_SECRET` - Run: `openssl rand -base64 32`
- `NODE_ENV` - Set to: `production`

### Step 3: Update Prisma for Postgres

Before first deploy, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Update schema for Postgres"
git push
```

### Step 4: Deploy
1. Click "Deploy" in Vercel
2. Wait for build (includes Prisma migrations)
3. Visit your deployment URL

### Step 5: Seed Database (Optional)
```bash
# Set DATABASE_URL to production
export DATABASE_URL="your-postgres-url"
pnpm db:seed
```

---

## ✅ Verify

- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Can register/login
- [ ] Can create a run
- [ ] Database working

**Need help?** See `DEPLOY.md` for detailed instructions.

