/**
 * FIRE arithmetic in today's dollars (real returns): FIRE number, years to a target, Coast and Barista
 * FIRE, how long a portfolio lasts, savings rate, and the order of returns. Assumptions, not rules: the
 * visitor sets the return and the withdrawal rate.
 */

/** Portfolio that supports `spend` a year at a withdrawal rate. */
export const fireNumber = (spend: number, swr: number) => (swr > 0 ? spend / swr : Infinity);

/** Balance after n years of growth with an end-of-year contribution. */
export function grow(balance: number, contribution: number, r: number, years: number): number {
  let b = balance;
  for (let k = 0; k < years; k++) b = b * (1 + r) + contribution;
  return b;
}
/** Years (with one decimal) until `target` is reached; null beyond 80 years. */
export function yearsTo(target: number, balance: number, contribution: number, r: number): number | null {
  if (balance >= target) return 0;
  let b = balance;
  for (let k = 1; k <= 80; k++) {
    const nb = b * (1 + r) + contribution;
    if (nb >= target) return k - 1 + (target - b) / Math.max(1e-9, nb - b);
    b = nb;
  }
  return null;
}
/** Coast FIRE: amount that, untouched, grows to the FIRE number by the retirement age. */
export function coast(target: number, age: number, retireAge: number, r: number) {
  const years = Math.max(0, retireAge - age);
  return target / Math.pow(1 + r, years);
}
/** Age at which a saver reaches Coast FIRE for a given retirement age (null if never before it). */
export function coastAge(target: number, balance: number, contribution: number, age: number, retireAge: number, r: number): number | null {
  let b = balance;
  for (let a = age; a <= retireAge; a++) {
    if (b >= coast(target, a, retireAge, r)) return a;
    b = b * (1 + r) + contribution;
  }
  return null;
}
/** Barista FIRE: portfolio needed when part-time pay covers part of the spending. */
export const barista = (spend: number, partTime: number, swr: number) => fireNumber(Math.max(0, spend - partTime), swr);

/** Years a portfolio lasts with a fixed real withdrawal at the start of each year (null = 100 or more). */
export function lasts(portfolio: number, withdrawal: number, r: number): number | null {
  let b = portfolio;
  for (let k = 0; k < 100; k++) {
    if (b < withdrawal) return k + b / Math.max(1, withdrawal);
    b = (b - withdrawal) * (1 + r);
  }
  return null;
}
/** Years to FIRE from a savings rate alone (spending = income × (1 − rate)), starting from zero. */
export function yearsFromSavingsRate(rate: number, r: number, swr: number, start = 0, income = 100000): number | null {
  const save = income * rate, spend = income - save;
  return yearsTo(fireNumber(spend, swr), start, save, r);
}

export interface SeqRow { year: number; ret: number; start: number; end: number }
/** Path of a portfolio with a fixed real withdrawal and a given list of yearly returns (repeated). */
export function sequence(portfolio: number, withdrawal: number, returns: number[], years: number): SeqRow[] {
  const rows: SeqRow[] = [];
  let b = portfolio;
  for (let k = 0; k < years; k++) {
    const ret = returns[k % returns.length];
    const end = Math.max(0, (b - withdrawal) * (1 + ret));
    rows.push({ year: k + 1, ret, start: b, end });
    b = end;
  }
  return rows;
}
/** Two paths with the same returns in opposite order: a crash first, then the same crash last. */
export function crashFirstVsLast(portfolio: number, withdrawal: number, avg: number, crash: number, crashYears: number, years: number) {
  // The other years earn what keeps the arithmetic average equal to `avg` over the whole span.
  const other = (avg * years - crash * crashYears) / Math.max(1, years - crashYears);
  const seq = Array.from({ length: years }, (_, k) => (k < crashYears ? crash : other));
  const first = sequence(portfolio, withdrawal, seq, years);
  const last = sequence(portfolio, withdrawal, [...seq].reverse(), years);
  return { other, first, last, endFirst: first[first.length - 1].end, endLast: last[last.length - 1].end, depletedFirst: first.findIndex((x) => x.end <= 0), depletedLast: last.findIndex((x) => x.end <= 0) };
}
