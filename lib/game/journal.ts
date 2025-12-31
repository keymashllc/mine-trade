import { METALS, BIOMES, SPECIMEN_FORMS, type MetalType, type Biome, type SpecimenForm, type Grade } from './constants';

export interface JournalSlot {
  id: string;
  pageId: string;
  slotIndex: number;
  filled: boolean;
  specimenId?: string;
}

export interface JournalPage {
  id: string;
  name: string;
  type: 'metal' | 'biome' | 'form' | 'grade';
  slots: JournalSlot[];
}

export interface SpecimenData {
  id: string;
  metalType: MetalType;
  form: SpecimenForm;
  grade: Grade;
  biome: Biome;
}

export function createJournalPages(): JournalPage[] {
  const pages: JournalPage[] = [];

  // 6 Metal Pages
  for (const metalType of Object.keys(METALS) as MetalType[]) {
    const slots: JournalSlot[] = [];
    for (let i = 0; i < 6; i++) {
      slots.push({
        id: `metal-${metalType}-${i}`,
        pageId: `metal-${metalType}`,
        slotIndex: i,
        filled: false,
      });
    }
    pages.push({
      id: `metal-${metalType}`,
      name: `${METALS[metalType].name} Collection`,
      type: 'metal',
      slots,
    });
  }

  // 3 Biome Pages
  for (const biome of BIOMES) {
    const slots: JournalSlot[] = [];
    for (let i = 0; i < 6; i++) {
      slots.push({
        id: `biome-${biome}-${i}`,
        pageId: `biome-${biome}`,
        slotIndex: i,
        filled: false,
      });
    }
    pages.push({
      id: `biome-${biome}`,
      name: `${biome} Collection`,
      type: 'biome',
      slots,
    });
  }

  // 3 Form/Grade Pages
  const formPages = [
    { id: 'coins', name: 'Coins Collection', type: 'form' as const, form: 'Coin' as SpecimenForm },
    { id: 'bars', name: 'Bars Collection', type: 'form' as const, form: 'Bar' as SpecimenForm },
    { id: 'ultra', name: 'Ultra Grade Collection', type: 'grade' as const },
  ];

  for (const pageDef of formPages) {
    const slots: JournalSlot[] = [];
    for (let i = 0; i < 6; i++) {
      slots.push({
        id: `${pageDef.id}-${i}`,
        pageId: pageDef.id,
        slotIndex: i,
        filled: false,
      });
    }
    pages.push({
      id: pageDef.id,
      name: pageDef.name,
      type: pageDef.type,
      slots,
    });
  }

  return pages;
}

export function fillJournalSlots(
  pages: JournalPage[],
  specimens: SpecimenData[]
): JournalPage[] {
  const updatedPages = pages.map((page) => ({
    ...page,
    slots: [...page.slots],
  }));

  for (const specimen of specimens) {
    // A specimen can fill multiple slots (more rewarding)
    
    // Metal page
    const metalPage = updatedPages.find((p) => p.id === `metal-${specimen.metalType}`);
    if (metalPage) {
      const emptySlot = metalPage.slots.find((s) => !s.filled);
      if (emptySlot) {
        emptySlot.filled = true;
        emptySlot.specimenId = specimen.id;
      }
    }

    // Biome page
    const biomePage = updatedPages.find((p) => p.id === `biome-${specimen.biome}`);
    if (biomePage) {
      const emptySlot = biomePage.slots.find((s) => !s.filled);
      if (emptySlot) {
        emptySlot.filled = true;
        emptySlot.specimenId = specimen.id;
      }
    }

    // Form pages (Coins, Bars)
    if (specimen.form === 'Coin') {
      const coinsPage = updatedPages.find((p) => p.id === 'coins');
      if (coinsPage) {
        const emptySlot = coinsPage.slots.find((s) => !s.filled);
        if (emptySlot) {
          emptySlot.filled = true;
          emptySlot.specimenId = specimen.id;
        }
      }
    }
    if (specimen.form === 'Bar') {
      const barsPage = updatedPages.find((p) => p.id === 'bars');
      if (barsPage) {
        const emptySlot = barsPage.slots.find((s) => !s.filled);
        if (emptySlot) {
          emptySlot.filled = true;
          emptySlot.specimenId = specimen.id;
        }
      }
    }

    // Ultra grade page
    if (specimen.grade === 'Ultra') {
      const ultraPage = updatedPages.find((p) => p.id === 'ultra');
      if (ultraPage) {
        const emptySlot = ultraPage.slots.find((s) => !s.filled);
        if (emptySlot) {
          emptySlot.filled = true;
          emptySlot.specimenId = specimen.id;
        }
      }
    }
  }

  return updatedPages;
}

