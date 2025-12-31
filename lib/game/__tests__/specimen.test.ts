import { FORM_BASE_UNITS, GRADE_MULTIPLIERS } from '../constants';

describe('Specimen melt calculation', () => {
  it('should calculate melt units correctly for Low grade Ore', () => {
    const baseUnits = FORM_BASE_UNITS.Ore;
    const multiplier = GRADE_MULTIPLIERS.Low;
    const meltUnits = Math.round(baseUnits * multiplier);
    expect(meltUnits).toBe(4);
  });

  it('should calculate melt units correctly for High grade Coin', () => {
    const baseUnits = FORM_BASE_UNITS.Coin;
    const multiplier = GRADE_MULTIPLIERS.High;
    const meltUnits = Math.round(baseUnits * multiplier);
    expect(meltUnits).toBe(10); // 7 * 1.5 = 10.5 -> 10
  });

  it('should calculate melt units correctly for Ultra grade Bar', () => {
    const baseUnits = FORM_BASE_UNITS.Bar;
    const multiplier = GRADE_MULTIPLIERS.Ultra;
    const meltUnits = Math.round(baseUnits * multiplier);
    expect(meltUnits).toBe(18); // 8 * 2.3 = 18.4 -> 18
  });
});

