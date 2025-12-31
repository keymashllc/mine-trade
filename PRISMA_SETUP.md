# Prisma Database Setup

## Local Development (SQLite)

By default, the schema uses SQLite for local development. The `DATABASE_URL` in `.env` should be:

```env
DATABASE_URL="file:./prisma/dev.db"
```

## Production (Postgres)

For production on Vercel, you need to switch to Postgres. You have two options:

### Option 1: Environment-based Schema (Recommended)

Create a script that generates the correct schema based on environment, or use Prisma's ability to have multiple schema files.

### Option 2: Manual Switch Before Deploy

Before deploying to Vercel:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Commit and push the change

3. Vercel will use the Postgres `DATABASE_URL` from environment variables

### Option 3: Use Separate Schema Files

Create `prisma/schema.sqlite.prisma` and `prisma/schema.postgres.prisma`, then switch between them as needed.

## Migration Strategy

1. **Local Development**: Use `prisma migrate dev` to create and apply migrations
2. **Production**: Use `prisma migrate deploy` (runs automatically in build script)

## Vercel Build

The build script in `package.json` includes:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

This ensures:
- Prisma Client is generated
- Migrations are applied
- Next.js builds successfully

Make sure your `DATABASE_URL` in Vercel points to a Postgres database.

