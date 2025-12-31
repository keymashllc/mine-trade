# Mine Trade

A run-based roguelike mining game with hardcore daily payments, fictional metals, persistent Vault + Journal, and always-on markets.

## Features

- **12-Day Runs**: Each run lasts 12 in-game days with escalating payment requirements
- **Hardcore Mechanics**: Fail to pay your due and lose everything - nothing deposits to Vault
- **Mining System**: Choose between Drill and Blast modes, each with different risk/reward profiles
- **Specimens**: Collectible items with forms (Ore, Nugget, Coin, Bar) and grades (Low, High, Ultra)
- **Vault**: Persistent storage for credits, units, and specimens from winning runs
- **Journal**: Track your collections across 12 pages (6 metal pages, 3 biome pages, 3 form/grade pages)
- **Markets**: Always-on commodity markets with sector-based pricing and specimen listings
- **Relics**: Special items including Loan Voucher to help survive payment shortfalls

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS** for styling
- **Prisma ORM** with SQLite (dev) / Postgres (prod)
- **Custom Auth** with bcrypt password hashing
- **Zustand** for client state management

## Setup Instructions

### Prerequisites

- Node.js 20+
- pnpm (or npm)
- For production: Vercel account with Postgres database

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/keymashllc/mine-trade.git
   cd mine-trade
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your values:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   pnpm db:generate

   # Create and run initial migration
   pnpm db:migrate
   # When prompted, name it "init" or "initial"

   # Seed the database
   pnpm db:seed
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Navigate to the `keymashllc` organization
3. Click "New repository"
4. Name it `mine-trade`
5. **Do not** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/keymashllc/mine-trade.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 3: Import to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Select the **Keymash** team
4. Import the `keymashllc/mine-trade` repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install` (or `npm install`)

### Step 4: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

- `DATABASE_URL`: Your Postgres connection string (from Vercel Postgres or Neon)
- `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://mine-trade.vercel.app`)
- `NEXTAUTH_SECRET`: Generate a secure random string (e.g., `openssl rand -base64 32`)
- `NODE_ENV`: `production`

### Step 5: Set Up Database

#### Option A: Vercel Postgres

1. In Vercel project, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Add it to Environment Variables

#### Option B: Neon Postgres

1. Go to [Neon](https://neon.tech) and create a database
2. Copy the connection string
3. Add it to Vercel Environment Variables as `DATABASE_URL`

### Step 6: Configure Prisma for Production

Update `prisma/schema.prisma` to use Postgres in production:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Or use environment-based configuration (see Prisma docs).

### Step 7: Run Migrations on Vercel

The build script includes `prisma migrate deploy`, which will run migrations automatically during build. Alternatively, you can run migrations manually:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel env pull` to get environment variables
3. Run: `pnpm db:migrate` locally with production `DATABASE_URL`
4. Or use Vercel's database dashboard to run SQL directly

### Step 8: Deploy

1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Visit your deployment URL

## Database Migrations

### Local Development

```bash
# Create a new migration
pnpm db:migrate

# Apply migrations
pnpm db:migrate
```

### Production (Vercel)

Migrations run automatically during build via `prisma migrate deploy` in the build script. Ensure `DATABASE_URL` is set correctly in Vercel environment variables.

## Testing

```bash
# Run tests
pnpm test

# Run typecheck
pnpm typecheck

# Run lint
pnpm lint
```

## Project Structure

```
mine-trade/
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── run/               # Run gameplay page
│   ├── vault/             # Vault page
│   ├── journal/           # Journal page
│   └── market/            # Market page
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # Authentication utilities
│   └── game/              # Game logic
│       ├── constants.ts   # Game constants
│       ├── mining.ts      # Mining logic
│       ├── market.ts      # Market logic
│       ├── relics.ts      # Relics system
│       └── journal.ts     # Journal logic
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
└── .github/
    └── workflows/
        └── ci.yml         # GitHub Actions CI
```

## Game Rules

### Run Mechanics

- Each run lasts 12 days
- Daily payment due increases each day (see `DUE_CURVE` in constants)
- Fail to pay → run ends, everything confiscated
- Survive day 12 → win, stash deposits to Vault

### Mining

- 2 shifts per day, 3 veins per shift
- Choose Drill (15-20% damage chance) or Blast (35% + 15% damage chance)
- 10 HP rig, repair costs 180 credits per HP
- HP reaches 0 → run ends

### Specimens

- Forms: Ore (4), Nugget (6), Coin (7), Bar (8) base units
- Grades: Low (1.0x), High (1.5x), Ultra (2.3x) multipliers
- Melt specimens to units, sell units for credits

### Markets

- Commodity prices update every 15 minutes per sector
- 2% spread: Sell at 99% (bid), Buy at 101% (ask)
- Specimen listings: Max 2 active, 60min cooldown, 3% fee

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

