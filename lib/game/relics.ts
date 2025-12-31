import { LOAN_VOUCHER_DUE_INCREASE } from './constants';

export interface RelicDefinition {
  id: string;
  name: string;
  description: string;
  rarity: number; // Weight for random selection
}

export const RELIC_DEFINITIONS: RelicDefinition[] = [
  {
    id: 'loan_voucher',
    name: 'Loan Voucher',
    description: 'Covers payment shortfall once. Next day due increases by +35%.',
    rarity: 8, // 8% weight
  },
  {
    id: 'lucky_pick',
    name: 'Lucky Pick',
    description: '+5% chance to find specimens.',
    rarity: 12,
  },
  {
    id: 'reinforced_drill',
    name: 'Reinforced Drill',
    description: '-25% damage chance when drilling.',
    rarity: 10,
  },
  // Add more relics as needed
];

export function selectRandomRelics(count: number = 2): RelicDefinition[] {
  const totalRarity = RELIC_DEFINITIONS.reduce((sum, r) => sum + r.rarity, 100);
  const selected: RelicDefinition[] = [];
  const available = [...RELIC_DEFINITIONS];

  for (let i = 0; i < count && available.length > 0; i++) {
    const random = Math.random() * totalRarity;
    let cumulative = 0;
    
    for (let j = 0; j < available.length; j++) {
      cumulative += available[j].rarity;
      if (random <= cumulative) {
        selected.push(available[j]);
        totalRarity -= available[j].rarity;
        available.splice(j, 1);
        break;
      }
    }
  }

  return selected;
}

export function applyLoanVoucher(due: number): number {
  return Math.floor(due * (1 + LOAN_VOUCHER_DUE_INCREASE));
}

