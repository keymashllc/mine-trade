import { mineVein } from '../mining';
import { setSeed } from '../rng';

describe('Mining logic', () => {
  beforeEach(() => {
    setSeed(12345); // Set seed for deterministic tests
  });

  it('should mine a vein and return damage and drop', () => {
    const result = mineVein('Desert', 1, 'Drill');
    expect(result).toHaveProperty('damage');
    expect(result).toHaveProperty('drop');
    expect(result.damage).toBeGreaterThanOrEqual(0);
    expect(result.drop).toHaveProperty('type');
  });

  it('should return units or specimen drop', () => {
    const result = mineVein('Desert', 1, 'Drill');
    expect(['units', 'specimen']).toContain(result.drop.type);
  });
});

