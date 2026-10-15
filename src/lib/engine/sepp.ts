/**
 * 72(t) substantially equal periodic payments under IRS Notice 2022-6: the RMD, fixed amortization and
 * fixed annuitization methods, the interest-rate cap (greater of 5 % and 120 % of the federal mid-term
 * rate for either of the two months before the first payment) and the lock period (later of 5 years and
 * age 59½). The three worked examples of the IRS SEPP FAQ are reproduced to the dollar in the tests.
 */
import P from '../../data/params-2026.json';
import T from '../../data/life-tables.json';
import { date59half } from './early';

export type Method = 'rmd' | 'amortization' | 'annuitization';
export type Table = 'single' | 'uniform';
export const METHOD_LABEL: Record<Method, string> = { rmd: 'Required minimum distribution', amortization: 'Fixed amortization', annuitization: 'Fixed annuitization' };

export function lifeExpectancy(age: number, table: Table = 'single'): number {
  const t = (table === 'single' ? T.single : T.uniform) as Record<string, number>;
  const a = Math.max(table === 'uniform' ? 10 : 0, Math.min(Math.round(age), table === 'uniform' ? 120 : 119));
  return t[String(a)];
}
/** Present value of $1 a year at the end of each year for n (possibly fractional) years. */
export const annuityCertain = (n: number, i: number) => (i === 0 ? n : (1 - Math.pow(1 + i, -n)) / i);
/** Present value of $1 a year paid at the end of each year while alive, 1.401(a)(9)-9(e) mortality. */
export function annuityFactor(age: number, i: number): number {
  const q = T.mortality as Record<string, number>;
  let p = 1, f = 0;
  for (let t = 1; age + t - 1 <= 120; t++) {
    p *= 1 - q[String(age + t - 1)];
    f += Math.pow(1 + i, -t) * p;
  }
  return f;
}
export function payment(method: Method, balance: number, age: number, rate: number, table: Table = 'single'): number {
  if (method === 'rmd') return balance / lifeExpectancy(age, table);
  if (method === 'amortization') return balance / annuityCertain(lifeExpectancy(age, table), rate);
  return balance / annuityFactor(age, rate);
}

const AFR = P.sepp.afr as Record<string, { rr: string; file: string; mid120: number }>;
export const AFR_MONTHS = Object.keys(AFR).sort();
const prev = (ym: string, k: number) => { const [y, m] = ym.split('-').map(Number); const d = new Date(Date.UTC(y, m - 1 - k, 1)); return d.toISOString().slice(0, 7); };
export interface RateCap { month: string; rate: number; from: 'floor' | string; months: Array<{ month: string; rr: string; mid120: number; file: string } | { month: string; missing: true }> }
/** Highest interest rate allowed for a series whose first payment is in `month` (YYYY-MM). */
export function maxRate(month: string): RateCap {
  const months = [prev(month, 1), prev(month, 2)].map((m) => (AFR[m] ? { month: m, ...AFR[m] } : { month: m, missing: true as const }));
  let rate = P.sepp.floor, from: string = 'floor';
  for (const m of months) if (!('missing' in m) && m.mid120 > rate) { rate = m.mid120; from = m.month; }
  return { month, rate, from, months };
}
/** Months for which the cap can be computed from published rulings (both prior months known). */
export const CAP_MONTHS = AFR_MONTHS.map((m) => prev(m, -1)).filter((m) => AFR[prev(m, 1)] && AFR[prev(m, 2)]);

/** Lock end: later of the 5th anniversary of the first payment and the day the owner reaches 59½. */
export function lockEnd(firstPayment: string, birth: string): { date: string; by: 'five-years' | 'age' } {
  const [y, m, d] = firstPayment.split('-').map(Number);
  const five = new Date(Date.UTC(y + 5, m - 1, d)).toISOString().slice(0, 10);
  const half = date59half(birth);
  return five >= half ? { date: five, by: 'five-years' } : { date: half, by: 'age' };
}

export interface SeppRow { year: number; age: number; start: number; payment: number; end: number }
/** Year-by-year schedule at an assumed growth rate (the fixed methods keep the first payment). */
export function schedule(method: Method, balance: number, age: number, rate: number, years: number, growth: number, table: Table = 'single'): SeppRow[] {
  const rows: SeppRow[] = [];
  const fixed = payment(method, balance, age, rate, table);
  let b = balance;
  for (let k = 0; k < years && b > 0.5; k++) {
    const pay = Math.min(b, method === 'rmd' ? b / lifeExpectancy(age + k, table) : fixed);
    const end = (b - pay) * (1 + growth);
    rows.push({ year: k + 1, age: age + k, start: b, payment: pay, end });
    b = end;
  }
  return rows;
}
/** Recapture if the series is broken: 10 % of every earlier payment (interest not included). */
export const recapture = (paidBefore: number) => paidBefore * P.early.penalty;
