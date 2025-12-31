'use server';

import { prisma } from '@/lib/db';
import { fillJournalSlots, type SpecimenData } from '@/lib/game/journal';

export async function getVault(userId: string) {
  const vaultBalances = await prisma.vaultBalances.findUnique({
    where: { userId },
  });

  const vaultSpecimens = await prisma.vaultSpecimen.findMany({
    where: { userId },
    orderBy: { depositedAt: 'desc' },
  });

  return {
    balances: vaultBalances,
    specimens: vaultSpecimens,
  };
}

export async function getJournal(userId: string) {
  // Get all vault specimens
  const specimens = await prisma.vaultSpecimen.findMany({
    where: { userId },
  });

  // Convert to journal format
  const specimenData: SpecimenData[] = specimens.map((s) => ({
    id: s.id,
    metalType: s.metalType as any,
    form: s.form as any,
    grade: s.grade as any,
    biome: s.biome as any,
  }));

  // Create journal pages and fill slots
  const { createJournalPages } = await import('@/lib/game/journal');
  const pages = createJournalPages();
  const filledPages = fillJournalSlots(pages, specimenData);

  return filledPages;
}

