# Setup Checklist

Use this checklist when setting up the project for the first time or deploying to production.

## Local Development Setup

- [ ] Clone repository
- [ ] Run `pnpm install` (or `npm install`)
- [ ] Copy `.env.example` to `.env`
- [ ] Update `.env` with local values:
  - [ ] `DATABASE_URL="file:./prisma/dev.db"` (SQLite for local)
  - [ ] `NEXTAUTH_URL="http://localhost:3000"`
  - [ ] `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- [ ] Run `pnpm db:generate` to generate Prisma Client
- [ ] Run `pnpm db:migrate` to create initial migration
- [ ] Run `pnpm db:seed` to seed database
- [ ] Run `pnpm dev` to start development server
- [ ] Test registration and login
- [ ] Test creating a run
- [ ] Test mining and payment flow

## GitHub Repository Setup

- [ ] Create repository in `keymashllc` organization
- [ ] Push code to `main` branch
- [ ] Verify `.github/workflows/ci.yml` is present
- [ ] Test CI pipeline on a PR

## Vercel Deployment Setup

- [ ] Import repository to Vercel (Team: Keymash)
- [ ] Configure build settings:
  - [ ] Framework: Next.js
  - [ ] Build Command: `pnpm build` (or `npm run build`)
  - [ ] Install Command: `pnpm install` (or `npm install`)
- [ ] Set up Postgres database (Vercel Postgres or Neon)
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (Postgres connection string)
  - [ ] `NEXTAUTH_URL` (Vercel deployment URL)
  - [ ] `NEXTAUTH_SECRET` (secure random string)
  - [ ] `NODE_ENV="production"`
- [ ] Update `prisma/schema.prisma` to use Postgres (see PRISMA_SETUP.md)
- [ ] Run initial migration on production database
- [ ] Seed production database (optional, for initial data)
- [ ] Deploy and test

## Post-Deployment Verification

- [ ] Test user registration
- [ ] Test user login
- [ ] Test creating a run
- [ ] Test mining mechanics
- [ ] Test payment flow
- [ ] Test vault deposit (win a run)
- [ ] Test journal updates
- [ ] Test market functionality
- [ ] Verify CI/CD is working

## Common Issues

### Prisma Migration Issues

If migrations fail on Vercel:
1. Check `DATABASE_URL` is correct
2. Ensure schema is set to `postgresql` for production
3. Run migrations manually: `vercel env pull && pnpm db:migrate`

### Build Failures

If build fails:
1. Check Node.js version (should be 20+)
2. Verify all environment variables are set
3. Check build logs for specific errors

### Database Connection Issues

If database connection fails:
1. Verify `DATABASE_URL` format
2. Check database is accessible from Vercel
3. Ensure SSL is enabled if required

