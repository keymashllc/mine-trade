import { PrismaClient } from '@prisma/client';
import { METALS } from '../lib/game/constants';
import { RELIC_DEFINITIONS } from '../lib/game/relics';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sectors
  for (const sectorId of ['A', 'B', 'C']) {
    await prisma.sector.upsert({
      where: { id: sectorId },
      update: {},
      create: { id: sectorId },
    });
  }

  // Create initial market prices for each sector
  for (const sectorId of ['A', 'B', 'C']) {
    for (const [metalType, metal] of Object.entries(METALS)) {
      await prisma.marketPriceSnapshot.create({
        data: {
          sector: sectorId,
          metalType,
          price: metal.basePrice,
        },
      });
    }
  }

  // Create relics
  for (const relicDef of RELIC_DEFINITIONS) {
    await prisma.relic.upsert({
      where: { name: relicDef.name },
      update: {
        description: relicDef.description,
        rarity: relicDef.rarity,
      },
      create: {
        name: relicDef.name,
        description: relicDef.description,
        rarity: relicDef.rarity,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

