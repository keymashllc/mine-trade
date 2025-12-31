import {
  DEPTH_TRACK_NODES,
  DEPTH_TRACK_REWARD_MULTIPLIERS,
  DEPTH_TRACK_HAZARD_CHANCES,
  DRILL_HAZARD_MODIFIER,
  DRILL_REWARD_MODIFIER,
  BLAST_HAZARD_MODIFIER,
  BLAST_REWARD_MODIFIER,
  type MiningMode,
  type Biome,
} from './constants';
import { random } from './rng';

export type HazardType = 'cave_in' | 'gas_pocket' | 'equipment_jam' | 'misfire';

export interface DepthTrackNode {
  nodeIndex: number; // 0-4
  rewardMultiplier: number;
  hazardChance: number;
  completed: boolean;
  hazardTriggered?: HazardType;
}

export interface DepthTrackResult {
  node: DepthTrackNode;
  reward?: {
    type: 'units' | 'specimen';
    metalType: string;
    units?: number;
    specimen?: {
      form: string;
      grade: string;
      biome: Biome;
      meltUnits: number;
    };
  };
  damage: number;
}

export function getDepthTrackNode(
  nodeIndex: number,
  mode: MiningMode,
  biome: Biome
): DepthTrackNode {
  if (nodeIndex < 0 || nodeIndex >= DEPTH_TRACK_NODES) {
    throw new Error(`Invalid node index: ${nodeIndex}`);
  }

  let baseRewardMultiplier = DEPTH_TRACK_REWARD_MULTIPLIERS[nodeIndex];
  let baseHazardChance = DEPTH_TRACK_HAZARD_CHANCES[nodeIndex];

  // Apply mode modifiers
  if (mode === 'Drill') {
    baseHazardChance = Math.max(0, baseHazardChance + DRILL_HAZARD_MODIFIER);
    baseRewardMultiplier = Math.max(0.1, baseRewardMultiplier * (1 + DRILL_REWARD_MODIFIER));
  } else {
    // Blast
    baseHazardChance = Math.min(1, baseHazardChance + BLAST_HAZARD_MODIFIER);
    baseRewardMultiplier = baseRewardMultiplier * (1 + BLAST_REWARD_MODIFIER);
  }

  return {
    nodeIndex,
    rewardMultiplier: baseRewardMultiplier,
    hazardChance: baseHazardChance,
    completed: false,
  };
}

export function checkHazard(node: DepthTrackNode): HazardType | null {
  if (random() < node.hazardChance) {
    // Randomly select a hazard type
    const hazards: HazardType[] = ['cave_in', 'gas_pocket', 'equipment_jam', 'misfire'];
    return hazards[Math.floor(random() * hazards.length)];
  }
  return null;
}

export function getHazardChoices(hazard: HazardType): {
  option1: { label: string; consequence: string };
  option2: { label: string; consequence: string };
} {
  switch (hazard) {
    case 'cave_in':
      return {
        option1: {
          label: 'Lose Random Stash Item',
          consequence: 'Remove 1 random item from stash',
        },
        option2: {
          label: 'Pay to Reinforce',
          consequence: 'Pay credits to prevent loss',
        },
      };
    case 'gas_pocket':
      return {
        option1: {
          label: 'Take 1 Damage',
          consequence: 'Lose 1 HP',
        },
        option2: {
          label: 'Extract Immediately',
          consequence: 'End depth track now, keep rewards',
        },
      };
    case 'equipment_jam':
      return {
        option1: {
          label: 'Next Node No Specimens',
          consequence: 'Next node cannot drop specimens',
        },
        option2: {
          label: 'Melt 1 Specimen',
          consequence: 'Convert 1 specimen to units',
        },
      };
    case 'misfire':
      return {
        option1: {
          label: 'Take 2 Damage',
          consequence: 'Lose 2 HP',
        },
        option2: {
          label: 'Downgrade Best Item',
          consequence: 'Best item today becomes scrap value',
        },
      };
  }
}

