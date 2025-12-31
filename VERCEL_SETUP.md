# Vercel Setup - Quick Reference

## Environment Variables to Set

In your Vercel project settings → Environment Variables, add these:

### 1. DATABASE_URL
- Go to your Vercel project → **Storage** tab
- Click on your `mine-trade` database
- Copy the **Connection String** (it looks like: `postgresql://...`)
- Paste it as the `DATABASE_URL` value

### 2. NEXTAUTH_SECRET
Use this generated secret:
```
owm3JjhoM/XNYIpN6z06EvejsuDg93+SkGfNjs34wYI=
```

To generate a new one, run: `openssl rand -base64 32`

### 3. NEXTAUTH_URL
- After first deployment, Vercel will give you a URL like: `https://mine-trade-xxx.vercel.app`
- Set `NEXTAUTH_URL` to that URL
- Or use your custom domain if you set one up

### 4. NODE_ENV
Set to: `production`

---

## Deployment Steps

1. **Import Project to Vercel**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - **Select "Keymash" team** (important!)
   - Import `keymashllc/mine-trade`
   - Click "Import"

2. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Build Command: `pnpm build` (or `npm run build`)
   - Install Command: `pnpm install` (or `npm install`)
   - Root Directory: `./` (default)

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all 4 variables listed above
   - **Important**: Make sure to add them for "Production", "Preview", and "Development" environments

4. **Deploy**
   - Click "Deploy"
   - The build will automatically:
     - Run `prisma generate`
     - Run `prisma migrate deploy` (creates all tables)
     - Build the Next.js app

5. **Seed Database (Optional)**
   After deployment, you can seed initial data:
   ```bash
   # Get your DATABASE_URL from Vercel
   export DATABASE_URL="your-postgres-connection-string"
   pnpm db:seed
   ```

---

## Verify Deployment

1. Visit your Vercel deployment URL
2. Test registration: Create a new account
3. Test login: Sign in with your account
4. Test run creation: Start a new mining run
5. Check database: Verify data is being saved

---

## Troubleshooting

**Build fails with Prisma errors:**
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel
- Ensure SSL is enabled in connection string

**Migration errors:**
- Check build logs in Vercel dashboard
- Verify Prisma schema is using `postgresql` provider
- Try running migrations manually via Vercel CLI

**Authentication not working:**
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

