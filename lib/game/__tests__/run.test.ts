import { getDueForDay, canPayDue, calculateRepairCost } from '../run';
import { DUE_CURVE, REPAIR_COST_PER_HP } from '../constants';

describe('Run logic', () => {
  describe('getDueForDay', () => {
    it('should return correct due for day 1', () => {
      expect(getDueForDay(1, false)).toBe(DUE_CURVE[0]);
    });

    it('should return correct due for day 12', () => {
      expect(getDueForDay(12, false)).toBe(DUE_CURVE[11]);
    });

    it('should increase due if loan voucher was used', () => {
      const normalDue = getDueForDay(2, false);
      const increasedDue = getDueForDay(2, true);
      expect(increasedDue).toBeGreaterThan(normalDue);
      expect(increasedDue).toBe(Math.floor(normalDue * 1.35));
    });
  });

  describe('canPayDue', () => {
    it('should return true if credits >= due', () => {
      expect(canPayDue(1000, 500)).toBe(true);
      expect(canPayDue(500, 500)).toBe(true);
    });

    it('should return false if credits < due', () => {
      expect(canPayDue(400, 500)).toBe(false);
    });
  });

  describe('calculateRepairCost', () => {
    it('should calculate correct repair cost', () => {
      expect(calculateRepairCost(1)).toBe(REPAIR_COST_PER_HP);
      expect(calculateRepairCost(5)).toBe(5 * REPAIR_COST_PER_HP);
    });
  });
});

