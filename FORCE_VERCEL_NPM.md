# Force Vercel to Use npm - Step by Step

## The Problem
Vercel is still using pnpm and old commits, ignoring our vercel.json changes.

## Solution: Configure in Vercel Dashboard

### Step 1: Go to Project Settings
1. Open your Vercel project: https://vercel.com/[your-team]/mine-trade
2. Click **Settings** tab
3. Click **General** in the left sidebar

### Step 2: Override Build Settings
Scroll to **Build & Development Settings**:

1. **Framework Preset**: `Next.js` (should already be set)

2. **Root Directory**: Leave as `./` (default)

3. **Build Command**: 
   - **Clear any existing value**
   - Set to: `npm run build`
   - Or leave blank to use package.json script

4. **Output Directory**: Leave as `.next` (default)

5. **Install Command**: 
   - **Clear any existing value** 
   - Set to: `npm ci`
   - This forces npm and uses package-lock.json

6. **Development Command**: Leave as default

### Step 3: Clear Build Cache
1. Go to **Deployments** tab
2. Click the **...** menu on latest deployment
3. Click **Redeploy**
4. Check **"Use existing Build Cache"** = **OFF** (unchecked)
5. Click **Redeploy**

### Step 4: Verify
Watch the build logs. You should see:
- `Running "install" command: npm ci` (NOT pnpm)
- No ERR_INVALID_THIS errors
- Successful package installation

## Alternative: Delete and Re-import
If settings don't work:
1. Delete the project in Vercel
2. Re-import from GitHub
3. Configure settings fresh
4. Deploy

## Why This Happens
Vercel caches build settings at the project level. Dashboard settings override vercel.json, so we need to set them explicitly.

