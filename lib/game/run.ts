import { DUE_CURVE, MAX_DAYS, MAX_HP, REPAIR_COST_PER_HP, SHIFTS_PER_DAY } from './constants';
import { applyLoanVoucher } from './relics';

export interface RunState {
  id: string;
  status: 'active' | 'won' | 'lost';
  currentDay: number;
  rigHP: number;
  credits: number;
  due: number;
  dayPaid: boolean;
  shiftsUsed: number;
  loanVoucherUsed: boolean;
}

export function getDueForDay(day: number, loanVoucherUsed: boolean): number {
  if (day < 1 || day > MAX_DAYS) {
    throw new Error(`Invalid day: ${day}`);
  }
  const baseDue = DUE_CURVE[day - 1];
  // If loan voucher was used, increase next day's due by 35%
  if (loanVoucherUsed && day > 1) {
    return Math.floor(baseDue * 1.35);
  }
  return baseDue;
}

export function canPayDue(credits: number, due: number): boolean {
  return credits >= due;
}

export function calculateRepairCost(damage: number): number {
  return damage * REPAIR_COST_PER_HP;
}

export function canRepair(credits: number, currentHP: number, damage: number): boolean {
  if (currentHP >= MAX_HP) return false;
  const cost = calculateRepairCost(damage);
  return credits >= cost;
}

export function isRunComplete(run: RunState): boolean {
  return run.status !== 'active';
}

export function checkRunEndConditions(run: RunState): 'active' | 'won' | 'lost' {
  if (run.status !== 'active') {
    return run.status;
  }

  // Check HP
  if (run.rigHP <= 0) {
    return 'lost';
  }

  // Check if won (survived day 12 and paid)
  if (run.currentDay > MAX_DAYS && run.dayPaid) {
    return 'won';
  }

  return 'active';
}

