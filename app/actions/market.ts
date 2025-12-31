'use server';

import { prisma } from '@/lib/db';
import { METALS, type MetalType, MARKET_UPDATE_INTERVAL_MS, ASK_MULTIPLIER, BID_MULTIPLIER, SPECIMEN_LISTING_FEE, MAX_ACTIVE_LISTINGS, LISTING_COOLDOWN_MS } from '@/lib/game/constants';
import { updateMarketPrice } from '@/lib/game/market';

export async function getMarketPrices(sector: string) {
  // Get latest prices for each metal in this sector
  const prices: Record<MetalType, number> = {} as Record<MetalType, number>;

  for (const metalType of Object.keys(METALS) as MetalType[]) {
    const latest = await prisma.marketPriceSnapshot.findFirst({
      where: {
        sector,
        metalType,
      },
      orderBy: { timestamp: 'desc' },
    });

    if (latest) {
      prices[metalType] = latest.price;
    } else {
      // Use base price if no snapshot exists
      prices[metalType] = METALS[metalType].basePrice;
    }
  }

  return prices;
}

export async function updateMarketPricesForSector(sector: string) {
  const updates: Array<{ metalType: MetalType; price: number }> = [];

  for (const metalType of Object.keys(METALS) as MetalType[]) {
    const latest = await prisma.marketPriceSnapshot.findFirst({
      where: {
        sector,
        metalType,
      },
      orderBy: { timestamp: 'desc' },
    });

    const currentPrice = latest?.price || METALS[metalType].basePrice;
    const newPrice = updateMarketPrice(currentPrice, 0.05); // 5% volatility

    await prisma.marketPriceSnapshot.create({
      data: {
        sector,
        metalType,
        price: newPrice,
      },
    });

    updates.push({ metalType, price: newPrice });
  }

  return updates;
}

export async function buyCommodityUnits(
  userId: string,
  metalType: MetalType,
  units: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vaultBalances: true },
  });

  if (!user || !user.vaultBalances) {
    throw new Error('User not found');
  }

  const prices = await getMarketPrices(user.sector);
  const askPrice = prices[metalType] * ASK_MULTIPLIER;
  const cost = Math.ceil(units * askPrice);

  if (user.vaultBalances.credits < cost) {
    throw new Error('Not enough credits');
  }

  const fieldMap: Record<MetalType, 'solUnits' | 'aesUnits' | 'virUnits' | 'lunUnits' | 'nocUnits' | 'crnUnits'> = {
    SOL: 'solUnits',
    AES: 'aesUnits',
    VIR: 'virUnits',
    LUN: 'lunUnits',
    NOC: 'nocUnits',
    CRN: 'crnUnits',
  };
  const field = fieldMap[metalType];
  const currentUnits = (user.vaultBalances[field] as number) || 0;

  await prisma.vaultBalances.update({
    where: { userId },
    data: {
      credits: user.vaultBalances.credits - cost,
      [field]: currentUnits + units,
    },
  });

  return { success: true, cost };
}

export async function sellCommodityUnits(
  userId: string,
  metalType: MetalType,
  units: number
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vaultBalances: true },
  });

  if (!user || !user.vaultBalances) {
    throw new Error('User not found');
  }

  const fieldMap: Record<MetalType, 'solUnits' | 'aesUnits' | 'virUnits' | 'lunUnits' | 'nocUnits' | 'crnUnits'> = {
    SOL: 'solUnits',
    AES: 'aesUnits',
    VIR: 'virUnits',
    LUN: 'lunUnits',
    NOC: 'nocUnits',
    CRN: 'crnUnits',
  };
  const field = fieldMap[metalType];
  const currentUnits = (user.vaultBalances[field] as number) || 0;

  if (currentUnits < units) {
    throw new Error('Not enough units');
  }

  const prices = await getMarketPrices(user.sector);
  const bidPrice = prices[metalType] * BID_MULTIPLIER;
  const credits = Math.floor(units * bidPrice);

  await prisma.vaultBalances.update({
    where: { userId },
    data: {
      credits: user.vaultBalances.credits + credits,
      [field]: currentUnits - units,
    },
  });

  return { success: true, credits };
}

export async function listSpecimen(
  userId: string,
  vaultSpecimenId: string,
  price: number
) {
  // Check active listings
  const activeListings = await prisma.specimenListing.count({
    where: {
      userId,
      status: 'active',
    },
  });

  if (activeListings >= MAX_ACTIVE_LISTINGS) {
    throw new Error(`Maximum ${MAX_ACTIVE_LISTINGS} active listings allowed`);
  }

  // Check cooldown
  const lastListing = await prisma.specimenListing.findFirst({
    where: {
      userId,
      status: { in: ['sold', 'cancelled'] },
    },
    orderBy: { lastRelistAt: 'desc' },
  });

  if (lastListing?.lastRelistAt) {
    const cooldownEnd = new Date(lastListing.lastRelistAt.getTime() + LISTING_COOLDOWN_MS);
    if (new Date() < cooldownEnd) {
      throw new Error('Listing cooldown active');
    }
  }

  // Verify specimen ownership
  const specimen = await prisma.vaultSpecimen.findUnique({
    where: { id: vaultSpecimenId },
  });

  if (!specimen || specimen.userId !== userId) {
    throw new Error('Specimen not found');
  }

  // Create listing
  const listing = await prisma.specimenListing.create({
    data: {
      userId,
      vaultSpecimenId,
      price,
      status: 'active',
    },
  });

  return listing;
}

export async function buySpecimenListing(
  userId: string,
  listingId: string
) {
  const listing = await prisma.specimenListing.findUnique({
    where: { id: listingId },
    include: {
      user: {
        include: { vaultBalances: true },
      },
    },
  });

  if (!listing || listing.status !== 'active') {
    throw new Error('Listing not available');
  }

  if (listing.userId === userId) {
    throw new Error('Cannot buy your own listing');
  }

  const buyer = await prisma.user.findUnique({
    where: { id: userId },
    include: { vaultBalances: true },
  });

  if (!buyer || !buyer.vaultBalances) {
    throw new Error('Buyer not found');
  }

  if (buyer.vaultBalances.credits < listing.price) {
    throw new Error('Not enough credits');
  }

  // Calculate fee
  const fee = Math.floor(listing.price * SPECIMEN_LISTING_FEE);
  const sellerCredits = listing.price - fee;

  // Transfer specimen
  await prisma.vaultSpecimen.update({
    where: { id: listing.vaultSpecimenId },
    data: { userId },
  });

  // Transfer credits
  await prisma.vaultBalances.update({
    where: { userId: listing.userId },
    data: {
      credits: (listing.user.vaultBalances?.credits || 0) + sellerCredits,
    },
  });

  await prisma.vaultBalances.update({
    where: { userId },
    data: {
      credits: buyer.vaultBalances.credits - listing.price,
    },
  });

  // Mark listing as sold
  await prisma.specimenListing.update({
    where: { id: listingId },
    data: {
      status: 'sold',
      soldAt: new Date(),
    },
  });

  return { success: true };
}

export async function getSpecimenListings(limit: number = 50) {
  return prisma.specimenListing.findMany({
    where: { status: 'active' },
    include: {
      user: {
        select: { username: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

