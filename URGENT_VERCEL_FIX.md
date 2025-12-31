# ⚠️ URGENT: Vercel Configuration Required

## The Problem
Vercel is ignoring our code changes and using old settings from the dashboard.

## You MUST Do This in Vercel Dashboard:

### Step 1: Go to Project Settings
1. Open: https://vercel.com/[your-team]/mine-trade/settings
2. Click **General** tab

### Step 2: Clear Install Command
1. Scroll to **Build & Development Settings**
2. Find **Install Command**
3. **DELETE/CLEAR the value** (make it empty)
   - This will make Vercel use `npm install` from vercel.json
   - OR manually set it to: `npm install`

### Step 3: Force Latest Commit
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. **UNCHECK** "Use existing Build Cache"
4. Click **Redeploy**

### Step 4: Verify
Watch the build logs. You should see:
- `Running "install" command: npm install` (NOT npm ci)
- Commit should be: `3431c8e` or newer

## Why This Happens
Vercel dashboard settings **OVERRIDE** vercel.json. If you set "npm ci" in the dashboard, it will always use that, ignoring our code changes.

## Alternative: Delete Install Command Setting
If you can't find where to clear it:
1. Go to Settings → General
2. Look for "Install Command" 
3. Delete the value completely
4. Save
5. Redeploy

The vercel.json file says `npm install`, but dashboard settings take priority!

