/**
 * Federal income tax 2026 on retirement withdrawals (Rev. Proc. 2025-32): ordinary brackets, standard
 * deduction, and the 0 % / 15 % / 20 % rates on long-term gains stacked on top of ordinary income.
 * Not modeled: credits, AMT, the 3.8 % net investment income tax, the extra deduction for age 65 and
 * the temporary senior deduction (the site's readers are under 65 in the bridge years).
 */
import P from '../../data/params-2026.json';

export type Status = 'single' | 'joint' | 'head';
export const STATUSES: Status[] = ['single', 'joint', 'head'];

const brackets = (s: Status) => P.tax.brackets[s] as Array<[number, number]>;
export const standardDeduction = (s: Status) => P.tax.standardDeduction[s];

/** Tax on taxable ordinary income (after the deduction). */
export function bracketTax(taxable: number, s: Status): number {
  const b = brackets(s);
  let tax = 0;
  for (let i = 0; i < b.length; i++) {
    const lo = b[i][0], hi = i + 1 < b.length ? b[i + 1][0] : Infinity;
    if (taxable <= lo) break;
    tax += (Math.min(taxable, hi) - lo) * b[i][1];
  }
  return tax;
}
/** Marginal rate at a level of taxable ordinary income. */
export function marginalRate(taxable: number, s: Status): number {
  const b = brackets(s);
  let r = b[0][1];
  for (const [lo, rate] of b) if (taxable >= lo) r = rate;
  return r;
}

export interface TaxIn { ordinary: number; ltcg?: number; status: Status }
export interface TaxOut { deduction: number; taxableOrdinary: number; taxableGains: number; ordinaryTax: number; gainsTax: number; total: number; marginal: number; zeroRoom: number }

/** Federal tax with long-term gains stacked on ordinary income. */
export function federalTax({ ordinary, ltcg = 0, status }: TaxIn): TaxOut {
  const ord = Math.max(0, ordinary), g = Math.max(0, ltcg);
  const ded = standardDeduction(status);
  const taxableOrdinary = Math.max(0, ord - ded);
  const leftDed = Math.max(0, ded - ord);
  const taxableGains = Math.max(0, g - leftDed);
  const z = P.tax.capitalGains.zeroMax[status], f = P.tax.capitalGains.fifteenMax[status];
  const start = taxableOrdinary, end = taxableOrdinary + taxableGains;
  const at0 = Math.max(0, Math.min(end, z) - start);
  const at15 = Math.max(0, Math.min(end, f) - Math.max(start, z));
  const at20 = Math.max(0, end - Math.max(start, f));
  const ordinaryTax = bracketTax(taxableOrdinary, status);
  const gainsTax = at15 * 0.15 + at20 * 0.2;
  return { deduction: ded, taxableOrdinary, taxableGains, ordinaryTax, gainsTax, total: ordinaryTax + gainsTax, marginal: marginalRate(taxableOrdinary, status), zeroRoom: Math.max(0, z - end) };
}

/** Extra federal tax caused by adding `extra` ordinary income on top of `base` ordinary income. */
export function extraTax(base: number, extra: number, status: Status, ltcg = 0): number {
  return federalTax({ ordinary: base + extra, ltcg, status }).total - federalTax({ ordinary: base, ltcg, status }).total;
}

/** Ordinary income that still fits under the top of a bracket (taxable income at its upper edge + deduction). */
export function roomToBracketTop(ordinary: number, rate: number, status: Status): number {
  const b = brackets(status);
  const i = b.findIndex((x) => x[1] === rate);
  if (i < 0 || i + 1 >= b.length) return Infinity;
  return Math.max(0, b[i + 1][0] + standardDeduction(status) - ordinary);
}
