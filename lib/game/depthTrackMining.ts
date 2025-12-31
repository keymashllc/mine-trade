import {
  getDepthTrackNode,
  checkHazard,
  type DepthTrackNode,
  type HazardType,
} from './depthTrack';
import { 
  selectMetalForBiome, 
  selectGradeForDepth,
} from './mining';
import { 
  DEPTH_EV, 
  DEPTH_SPECIMEN_CHANCES, 
  FORM_BASE_UNITS, 
  GRADE_MULTIPLIERS,
  METALS,
  type MetalType,
  type SpecimenForm,
  type Grade,
} from './constants';
import { random } from './rng';
import type { Biome, MiningMode, MetalType, SpecimenForm, Grade } from './constants';

export interface DepthTrackReward {
  type: 'units' | 'specimen';
  metalType: MetalType;
  units?: number;
  specimen?: {
    form: SpecimenForm;
    grade: Grade;
    biome: Biome;
    meltUnits: number;
  };
}

export interface DepthTrackMiningResult {
  node: DepthTrackNode;
  reward: DepthTrackReward | null;
  damage: number;
  hazardTriggered: HazardType | null;
}

export function mineDepthTrackNode(
  nodeIndex: number,
  biome: Biome,
  mode: MiningMode,
  noSpecimenChance: boolean = false // From equipment jam hazard
): DepthTrackMiningResult {
  const node = getDepthTrackNode(nodeIndex, mode, biome);
  
  // Check for hazard
  const hazard = checkHazard(node);
  if (hazard) {
    node.hazardTriggered = hazard;
  }

  // Calculate damage (simplified - can be enhanced)
  let damage = 0;
  if (mode === 'Drill') {
    if (random() < 0.15) damage = 1;
  } else {
    // Blast
    if (random() < 0.35) {
      damage = 1;
      if (random() < 0.15) damage = 2;
    }
  }

  // Generate reward
  let reward: DepthTrackReward | null = null;
  
  // Check if specimen (unless blocked by equipment jam)
  const isSpecimen = !noSpecimenChance && random() < DEPTH_SPECIMEN_CHANCES[Math.min(3, nodeIndex + 1) as 1 | 2 | 3];
  
  if (isSpecimen) {
    const metalType = selectMetalForBiome(biome);
    const form = ['Ore', 'Nugget', 'Coin', 'Bar'][Math.floor(random() * 4)] as SpecimenForm;
    const grade = selectGradeForDepth(Math.min(3, nodeIndex + 1) as 1 | 2 | 3);
    const baseUnits = FORM_BASE_UNITS[form];
    const meltUnits = Math.round(baseUnits * GRADE_MULTIPLIERS[grade]);
    
    reward = {
      type: 'specimen',
      metalType,
      specimen: {
        form,
        grade,
        biome,
        meltUnits,
      },
    };
  } else {
    // Generate units
    const metalType = selectMetalForBiome(biome);
    const depth = Math.min(3, nodeIndex + 1) as 1 | 2 | 3;
    const ev = DEPTH_EV[depth][mode.toLowerCase() as 'drill' | 'blast'];
    
    // Apply reward multiplier
    const adjustedEV = ev * node.rewardMultiplier;
    
    // Generate value around EV
    const variance = adjustedEV * 0.3;
    const value = Math.max(0, adjustedEV + (random() - 0.5) * 2 * variance);
    
    const basePrice = METALS[metalType].basePrice;
    const units = Math.max(1, Math.round(value / basePrice));
    
    reward = {
      type: 'units',
      metalType,
      units,
    };
  }

  node.completed = true;

  return {
    node,
    reward,
    damage,
    hazardTriggered: hazard || null,
  };
}


