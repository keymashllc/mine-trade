// Seeded RNG for deterministic testing
// Simple LCG (Linear Congruential Generator)

export class SeededRNG {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  next(): number {
    // LCG parameters (from Numerical Recipes)
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32;
    return this.seed / 2 ** 32;
  }

  random(): number {
    return this.next();
  }

  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  randomFloat(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.randomInt(0, array.length - 1)];
  }

  weightedChoice<T>(items: Array<{ item: T; weight: number }>): T {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = this.random() * totalWeight;
    
    for (const { item, weight } of items) {
      random -= weight;
      if (random <= 0) {
        return item;
      }
    }
    
    return items[items.length - 1].item;
  }
}

// Global RNG instance (can be seeded for testing)
let globalRNG = new SeededRNG();

export function setSeed(seed: number) {
  globalRNG = new SeededRNG(seed);
}

export function random(): number {
  return globalRNG.random();
}

export function randomInt(min: number, max: number): number {
  return globalRNG.randomInt(min, max);
}

export function randomFloat(min: number, max: number): number {
  return globalRNG.randomFloat(min, max);
}

export function choice<T>(array: T[]): T {
  return globalRNG.choice(array);
}

export function weightedChoice<T>(items: Array<{ item: T; weight: number }>): T {
  return globalRNG.weightedChoice(items);
}

