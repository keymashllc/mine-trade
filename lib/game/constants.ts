// Game constants

export const METALS = {
  SOL: { name: 'Solvium', basePrice: 20 },
  AES: { name: 'Aethersteel', basePrice: 28 },
  VIR: { name: 'Virelith', basePrice: 26 },
  LUN: { name: 'Lunargent', basePrice: 32 },
  NOC: { name: 'Noctyrium', basePrice: 55 },
  CRN: { name: 'Crownlite', basePrice: 180 },
} as const;

export type MetalType = keyof typeof METALS;

export const BIOMES = ['Desert', 'Rift', 'Glacier'] as const;
export type Biome = typeof BIOMES[number];

export const BIOME_METAL_WEIGHTS: Record<Biome, Record<MetalType, number>> = {
  Desert: { SOL: 50, LUN: 30, AES: 15, VIR: 5, NOC: 0, CRN: 0 },
  Rift: { VIR: 40, AES: 30, NOC: 20, LUN: 10, SOL: 0, CRN: 0 },
  Glacier: { SOL: 40, LUN: 35, AES: 15, VIR: 9, NOC: 0, CRN: 1 },
};

export const DEPTHS = [1, 2, 3] as const;
export type Depth = typeof DEPTHS[number];

export const DEPTH_SPECIMEN_CHANCES: Record<Depth, number> = {
  1: 0.08,
  2: 0.14,
  3: 0.22,
};

export const DEPTH_EV: Record<Depth, { drill: number; blast: number }> = {
  1: { drill: 190, blast: 230 },
  2: { drill: 270, blast: 330 },
  3: { drill: 360, blast: 450 },
};

export const SPECIMEN_FORMS = ['Ore', 'Nugget', 'Coin', 'Bar'] as const;
export type SpecimenForm = typeof SPECIMEN_FORMS[number];

export const FORM_BASE_UNITS: Record<SpecimenForm, number> = {
  Ore: 4,
  Nugget: 6,
  Coin: 7,
  Bar: 8,
};

export const GRADES = ['Low', 'High', 'Ultra'] as const;
export type Grade = typeof GRADES[number];

export const GRADE_MULTIPLIERS: Record<Grade, number> = {
  Low: 1.0,
  High: 1.5,
  Ultra: 2.3,
};

export const DEPTH_GRADE_DISTRIBUTION: Record<Depth, Record<Grade, number>> = {
  1: { Low: 0.78, High: 0.20, Ultra: 0.02 },
  2: { Low: 0.70, High: 0.25, Ultra: 0.05 },
  3: { Low: 0.62, High: 0.30, Ultra: 0.08 },
};

export const DUE_CURVE = [
  250, 330, 430, 560, 730, 950, 1240, 1620, 2120, 2770, 3620, 4740,
];

export const MAX_DAYS = 12;
export const MAX_HP = 10;
export const REPAIR_COST_PER_HP = 180;
export const SHIFTS_PER_DAY = 2; // Deprecated - using depth track now
export const VEINS_PER_SHIFT = 3; // Deprecated - using depth track now

// Depth Track System (5 nodes per day)
export const DEPTH_TRACK_NODES = 5;
export const DEPTH_TRACK_REWARD_MULTIPLIERS = [1.0, 1.15, 1.35, 1.6, 2.0];
export const DEPTH_TRACK_HAZARD_CHANCES = [0.05, 0.10, 0.18, 0.28, 0.40];

// Mode modifiers for depth track
export const DRILL_HAZARD_MODIFIER = -0.06; // -6% hazard
export const DRILL_REWARD_MODIFIER = -0.10; // -10% reward
export const BLAST_HAZARD_MODIFIER = 0.08; // +8% hazard
export const BLAST_REWARD_MODIFIER = 0.15; // +15% reward

// Inventory
export const STASH_MAX_SLOTS = 12;
export const STASH_SLOT_UPGRADE_COST = 500; // Credits to buy +4 slots (once per run)
export const STASH_SLOT_UPGRADE_AMOUNT = 4;

export const MINING_MODES = ['Drill', 'Blast'] as const;
export type MiningMode = typeof MINING_MODES[number];

export const DRILL_DAMAGE_CHANCE: Record<Depth, number> = {
  1: 0.15,
  2: 0.15,
  3: 0.20,
};

export const BLAST_DAMAGE_CHANCE = {
  first: 0.35,
  second: 0.15,
};

export const RELIC_CACHE_CHANCE = 0.10;
export const COMMODITY_SPREAD = 0.02; // 2% total
export const BID_MULTIPLIER = 0.99; // Sell at 99% of base price
export const ASK_MULTIPLIER = 1.01; // Buy at 101% of base price

export const MARKET_UPDATE_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

export const SPECIMEN_LISTING_FEE = 0.03; // 3% fee on sale
export const MAX_ACTIVE_LISTINGS = 2;
export const LISTING_COOLDOWN_MS = 60 * 60 * 1000; // 60 minutes

export const LOAN_VOUCHER_DUE_INCREASE = 0.35; // +35% next day due

// Market Anomalies
export const MARKET_ANOMALY_INTERVAL_MIN = 90; // seconds
export const MARKET_ANOMALY_INTERVAL_MAX = 150; // seconds
export const MARKET_ANOMALY_DURATION = 30; // seconds
export const MARKET_ANOMALY_SURGE_MULTIPLIER = 1.25; // +25% sell price

// Market Anti-Dump
export const MARKET_DUMP_THRESHOLD_1 = 100; // units sold per day
export const MARKET_DUMP_THRESHOLD_2 = 200; // units sold per day
export const MARKET_DUMP_PENALTY_1 = -0.01; // -1% bid after threshold 1
export const MARKET_DUMP_PENALTY_2 = -0.02; // -2% bid after threshold 2 (total -3%)

