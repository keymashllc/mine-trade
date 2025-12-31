# Environment Variables Check

## What You Have (from Vercel):
- ✅ PRISMA_DATABASE_URL (multiple versions)
- ✅ POSTGRES_URL

## What You Need:

### Required Variables:

1. **DATABASE_URL** ⚠️ (MISSING - This is what Prisma uses!)
   - Use your `POSTGRES_URL` value
   - Or use the first `PRISMA_DATABASE_URL` (the postgres:// one)
   - Value: `postgres://30f9b34c9adaf4e9f738d67526f69d2a3c240f3ccc6cd58bea97c5e9c0429116:sk_AuSg0EpKwSyY1Gk5iXbt4@db.prisma.io:5432/postgres?sslmode=require`

2. **NEXTAUTH_SECRET** ⚠️ (MISSING)
   - Value: `owm3JjhoM/XNYIpN6z06EvejsuDg93+SkGfNjs34wYI=`

3. **NEXTAUTH_URL** ⚠️ (MISSING - Set after first deploy)
   - Will be your Vercel URL: `https://mine-trade-xxx.vercel.app`
   - Or your custom domain if you have one

4. **NODE_ENV** ⚠️ (MISSING)
   - Value: `production`

### Optional (can remove if not using Prisma Accelerate):
- PRISMA_DATABASE_URL (the prisma+postgres:// one) - Only if using Prisma Accelerate
- POSTGRES_URL - Can keep for reference, but DATABASE_URL is what Prisma uses

## Action Items:

1. **Add DATABASE_URL** using your POSTGRES_URL value
2. **Add NEXTAUTH_SECRET** with the generated value
3. **Add NEXTAUTH_URL** (set to your deployment URL after first deploy)
4. **Add NODE_ENV** = `production`

## Quick Copy-Paste for Vercel:

```
DATABASE_URL=postgres://30f9b34c9adaf4e9f738d67526f69d2a3c240f3ccc6cd58bea97c5e9c0429116:sk_AuSg0EpKwSyY1Gk5iXbt4@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_SECRET=owm3JjhoM/XNYIpN6z06EvejsuDg93+SkGfNjs34wYI=
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
```

