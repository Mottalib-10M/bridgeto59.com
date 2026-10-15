/**
 * Premium tax credit for Marketplace coverage before Medicare (IRC 36B). Applicable percentages: Rev. Proc.
 * 2025-25 (2026) and Rev. Proc. 2026-26 (2027); poverty guidelines as listed on HealthCare.gov (2025
 * amounts for 2026 coverage, 2026 amounts for 2027 coverage, 48 states and DC). The tables stop at 400 %
 * of the poverty line: above it there is no credit. The benchmark premium (second-lowest-cost silver plan)
 * depends on age and county, so the visitor types it from HealthCare.gov.
 */
import P from '../../data/params-2026.json';

export type CoverageYear = '2026' | '2027';
export const ACA_YEARS: CoverageYear[] = ['2026', '2027'];

export function povertyLine(year: CoverageYear, size: number): number {
  const f = P.aca.fpl[year];
  const n = Math.max(1, Math.round(size));
  return n === 1 ? f.one : f.two + (n - 2) * f.extra;
}
/** Applicable percentage: linear from the initial to the final percentage inside each band. */
export function applicablePct(year: CoverageYear, ratio: number): number | null {
  const t = P.aca.applicable[year] as Array<[number, number, number, number]>;
  if (ratio > P.aca.cap) return null;
  for (const [lo, hi, a, b] of t) {
    if (ratio < hi || (hi === P.aca.cap && ratio <= hi)) {
      if (lo === 0) return a;
      return a + ((b - a) * (ratio - lo)) / (hi - lo);
    }
  }
  return null;
}
export interface PtcIn { year: CoverageYear; size: number; magi: number; benchmarkMonthly: number; planMonthly?: number }
export interface PtcOut { fpl: number; ratio: number; pct: number | null; expected: number; credit: number; netPlan: number; overCap: boolean; underFloor: boolean; capIncome: number; floorIncome: number }
export function premiumCredit({ year, size, magi, benchmarkMonthly, planMonthly }: PtcIn): PtcOut {
  const fpl = povertyLine(year, size);
  const ratio = magi / fpl;
  const underFloor = ratio < 1;
  const pct = underFloor ? null : applicablePct(year, ratio);
  const overCap = pct === null && !underFloor;
  const expected = pct === null ? 0 : magi * pct;
  const bench = benchmarkMonthly * 12;
  const credit = pct === null ? 0 : Math.max(0, bench - expected);
  const plan = (planMonthly ?? benchmarkMonthly) * 12;
  return { fpl, ratio, pct, expected, credit: Math.min(credit, plan), netPlan: Math.max(0, plan - credit), overCap, underFloor, capIncome: fpl * P.aca.cap, floorIncome: fpl };
}
/** Cost of crossing the 400 % line by `over` dollars of income. */
export function cliff(year: CoverageYear, size: number, benchmarkMonthly: number) {
  const cap = povertyLine(year, size) * P.aca.cap;
  const below = premiumCredit({ year, size, magi: cap, benchmarkMonthly });
  return { capIncome: cap, creditAtCap: below.credit };
}
