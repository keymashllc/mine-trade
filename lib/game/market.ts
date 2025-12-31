import { METALS, type MetalType, COMMODITY_SPREAD, BID_MULTIPLIER, ASK_MULTIPLIER } from './constants';

export interface MarketPrice {
  metalType: MetalType;
  basePrice: number;
  bidPrice: number; // Sell price (99% of base)
  askPrice: number; // Buy price (101% of base)
}

// Simple random walk for price updates
export function updateMarketPrice(
  currentPrice: number,
  volatility: number = 0.05
): number {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return Math.max(0.1, currentPrice * (1 + change));
}

export function getMarketPrices(basePrices: Record<MetalType, number>): MarketPrice[] {
  return Object.entries(basePrices).map(([metalType, basePrice]) => ({
    metalType: metalType as MetalType,
    basePrice,
    bidPrice: basePrice * BID_MULTIPLIER,
    askPrice: basePrice * ASK_MULTIPLIER,
  }));
}

export function calculateSaleValue(units: number, bidPrice: number): number {
  return Math.floor(units * bidPrice);
}

export function calculateBuyCost(units: number, askPrice: number): number {
  return Math.ceil(units * askPrice);
}

