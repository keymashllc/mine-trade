// Icon mapping for game resources
export const ICON_MAP = {
  // Metals
  metals: {
    SOL: 'metal_solvium_gem',
    AES: 'metal_aethersteel_ingot_a',
    VIR: 'metal_virelith_shard_a',
    LUN: 'metal_lunargent_shard_a',
    NOC: 'metal_noctyrium_orb_a',
    CRN: 'metal_crownlite_shard_a',
  },
  // Forms (badges)
  forms: {
    Ore: 'resource_cinder_ore_pile_a',
    Nugget: 'ore_brown_nuggets',
    Bar: 'metal_aethersteel_ingot_a',
    Coin: 'resource_mossy_orb_a',
  },
  // Biomes
  biomes: {
    Desert: 'ore_sandstone',
    Rift: 'ore_charcoal',
    Glacier: 'ore_ice_cluster',
  },
  // Hazards
  hazards: {
    cave_in: 'ore_gray_gold_speck',
    gas_pocket: 'resource_aether_ooze_a',
    equipment_jam: 'resource_verdant_plate_a',
    misfire: 'ore_crimson_lump',
  },
} as const;

export type MetalIconKey = keyof typeof ICON_MAP.metals;
export type FormIconKey = keyof typeof ICON_MAP.forms;
export type BiomeIconKey = keyof typeof ICON_MAP.biomes;
export type HazardIconKey = keyof typeof ICON_MAP.hazards;

export function getMetalIcon(metal: MetalIconKey): string {
  return ICON_MAP.metals[metal];
}

export function getFormIcon(form: FormIconKey): string {
  return ICON_MAP.forms[form];
}

export function getBiomeIcon(biome: BiomeIconKey): string {
  return ICON_MAP.biomes[biome];
}

export function getHazardIcon(hazard: HazardIconKey): string {
  return ICON_MAP.hazards[hazard];
}

export function getIconPath(iconName: string): string {
  // Images should be in public/images/ directory
  // User needs to move resource images there
  return `/images/${iconName}.png`;
}

// Re-export hazard types for convenience
export type { HazardType } from './depthTrack';
export { getHazardChoices } from './depthTrack';

