/**
 * Roth IRA distributions before 59½ (Publication 590-B (2025), chapter 2): ordering rules (regular
 * contributions, then conversions first-in first-out, taxable part first, then earnings), the separate
 * 5-year period of each conversion (it starts on January 1 of the conversion year) and the conversion
 * ladder built on it.
 */
import P from '../../data/params-2026.json';
import { extraTax, type Status } from './tax';

export interface Conversion { year: number; amount: number }
export interface RothIn { contributions: number; conversions: Conversion[]; earnings: number; amount: number; year: number; age: number; firstRothYear: number }
export interface RothPiece { from: string; amount: number; taxable: boolean; penalty: boolean }
export interface RothOut { pieces: RothPiece[]; taxable: number; penalized: number; penalty: number; qualified: boolean }

/** First year in which a conversion made in `year` can come out without the 10 %. */
export const conversionFreeYear = (year: number) => year + 5;

/** Split a Roth IRA withdrawal under the ordering rules. */
export function rothWithdrawal({ contributions, conversions, earnings, amount, year, age, firstRothYear }: RothIn): RothOut {
  const qualified = age >= P.early.age && year >= firstRothYear + 5;
  let left = Math.max(0, amount);
  const pieces: RothPiece[] = [];
  const take = (cap: number) => { const x = Math.min(left, Math.max(0, cap)); left -= x; return x; };
  const c = take(contributions);
  if (c > 0) pieces.push({ from: 'Your contributions', amount: c, taxable: false, penalty: false });
  for (const cv of [...conversions].sort((a, b) => a.year - b.year)) {
    const x = take(cv.amount);
    if (x > 0) pieces.push({ from: `${cv.year} conversion`, amount: x, taxable: false, penalty: age < P.early.age && year < conversionFreeYear(cv.year) });
  }
  const e = take(earnings);
  if (e > 0) pieces.push({ from: 'Earnings', amount: e, taxable: !qualified, penalty: !qualified && age < P.early.age });
  const taxable = pieces.filter((p) => p.taxable).reduce((s, p) => s + p.amount, 0);
  const penalized = pieces.filter((p) => p.penalty).reduce((s, p) => s + p.amount, 0);
  return { pieces, taxable, penalized, penalty: penalized * P.early.penalty, qualified };
}

export interface LadderIn { startYear: number; amount: number; years: number; otherIncome: number; status: Status; spend: number; startAge: number }
export interface LadderRow { year: number; age: number; converted: number; tax: number; freeFrom: number; available: number; gap: number }
/** A conversion ladder: one conversion a year, each spendable five years later; the gap years need other money. */
export function ladder({ startYear, amount, years, otherIncome, status, spend, startAge }: LadderIn): LadderRow[] {
  const rows: LadderRow[] = [];
  for (let k = 0; k < years + 5; k++) {
    const y = startYear + k;
    const converted = k < years ? amount : 0;
    const tax = converted ? extraTax(otherIncome, converted, status) : 0;
    const available = k >= 5 && k - 5 < years ? amount : 0;
    rows.push({ year: y, age: startAge + k, converted, tax, freeFrom: converted ? conversionFreeYear(y) : 0, available, gap: Math.max(0, spend - available) });
  }
  return rows;
}
