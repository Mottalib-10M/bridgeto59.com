/**
 * The 10 % additional tax on early distributions (IRC 72(t)), its exceptions and the rule of 55.
 * Sources: IRS "Retirement topics: exceptions to tax on early distributions", Publication 575 (2025),
 * Topic 558 (governmental 457(b)), Publication 590-B (2025) for Roth IRAs.
 */
import P from '../../data/params-2026.json';
import { federalTax, type Status } from './tax';

export type Account = 'plan' | 'oldPlan' | 'ira' | 'gov457' | 'rothBasis' | 'rothEarnings';
export const ACCOUNT_LABEL: Record<Account, string> = {
  plan: '401(k) or 403(b) of the employer you are leaving',
  oldPlan: '401(k) of an earlier employer',
  ira: 'Traditional IRA, SEP or rollover IRA',
  gov457: 'Governmental 457(b)',
  rothBasis: 'Roth IRA: your own contributions',
  rothEarnings: 'Roth IRA: earnings',
};
export const EARLY_AGE = P.early.age;
export const PENALTY = P.early.penalty;
export type ExceptionId = (typeof P.exceptions)[number]['id'] | 'none';
export const EXCEPTIONS = P.exceptions as Array<{ id: string; label: string; plan: boolean; ira: boolean; code: string; cap?: number }>;

export interface Rule55In { birthYear: number; separationYear: number; publicSafety?: boolean; serviceYears?: number }
export interface Rule55Out { eligible: boolean; qualifyingAge: number; yearTurning: number; reason: string }
/** Rule of 55: separation from service in or after the calendar year of the 55th birthday (50, or 25 years
 *  of service under the plan, for qualified public safety employees and private-sector firefighters). */
export function ruleOf55({ birthYear, separationYear, publicSafety = false, serviceYears = 0 }: Rule55In): Rule55Out {
  const qualifyingAge = publicSafety ? P.early.publicSafetyAge : P.early.ruleOf55Age;
  const yearTurning = birthYear + qualifyingAge;
  if (separationYear >= yearTurning) return { eligible: true, qualifyingAge, yearTurning, reason: `you left in or after ${yearTurning}, the year you turn ${qualifyingAge}` };
  if (publicSafety && serviceYears >= P.early.publicSafetyYearsOfService) return { eligible: true, qualifyingAge, yearTurning, reason: `${P.early.publicSafetyYearsOfService} years of service under the plan` };
  return { eligible: false, qualifyingAge, yearTurning, reason: `you left before ${yearTurning}, the year you turn ${qualifyingAge}` };
}

/** Does an exception remove the 10 % for this account? Returns the capped amount it covers. */
export function exceptionCovers(id: string, account: Account, amount: number): number {
  if (id === 'none') return 0;
  const e = EXCEPTIONS.find((x) => x.id === id);
  if (!e) return 0;
  const isPlan = account === 'plan' || account === 'oldPlan';
  const isIra = account === 'ira' || account === 'rothEarnings';
  if (id === 'separation55' && account !== 'plan') return 0;
  if ((isPlan && !e.plan) || (isIra && !e.ira)) return 0;
  return Math.min(amount, e.cap ?? Infinity);
}

export interface EarlyIn { amount: number; age: number; account: Account; exception?: string; status: Status; otherIncome?: number; stateRate?: number }
export interface EarlyOut { taxable: number; penalized: number; penalty: number; federal: number; state: number; net: number; withheld: number; marginal: number; rule: string }

/** One early withdrawal: what goes to the IRS, the state and you. */
export function earlyWithdrawal({ amount, age, account, exception = 'none', status, otherIncome = 0, stateRate = 0 }: EarlyIn): EarlyOut {
  const a = Math.max(0, amount);
  const taxable = account === 'rothBasis' ? 0 : a;
  let penalized = 0, rule = '';
  if (account === 'rothBasis') rule = 'Roth contributions come out first, free of tax and of the 10 %';
  else if (account === 'gov457') rule = 'governmental 457(b): no 10 % additional tax (except on money rolled in from another plan)';
  else if (age >= EARLY_AGE) rule = 'age 59½ or older: no 10 %';
  else {
    const covered = exceptionCovers(exception, account, a);
    penalized = a - covered;
    rule = covered >= a ? 'exception applies: no 10 %' : covered > 0 ? 'exception covers part of the amount; 10 % on the rest' : '10 % additional tax on the taxable amount';
  }
  const base = federalTax({ ordinary: otherIncome, status });
  const withW = federalTax({ ordinary: otherIncome + taxable, status });
  const federal = withW.total - base.total;
  const penalty = penalized * PENALTY;
  const state = taxable * stateRate;
  const withheld = account === 'plan' || account === 'oldPlan' ? a * P.early.planWithholding : 0;
  return { taxable, penalized, penalty, federal, state, net: a - penalty - federal - state, withheld, marginal: withW.marginal, rule };
}

/** Gross withdrawal needed to put `net` dollars in hand. */
export function grossForNet(net: number, p: Omit<EarlyIn, 'amount'>): EarlyOut & { gross: number } {
  let g = net;
  for (let i = 0; i < 40; i++) { const r = earlyWithdrawal({ ...p, amount: g }); const diff = net - r.net; if (Math.abs(diff) < 0.01) break; g += diff; }
  return { ...earlyWithdrawal({ ...p, amount: g }), gross: g };
}

/** ISO date when a person born on `birth` (YYYY-MM-DD) reaches 59½. */
export function date59half(birth: string): string {
  const [y, m, d] = birth.split('-').map(Number);
  const dt = new Date(Date.UTC(y + 59, m - 1 + 6, d));
  return dt.toISOString().slice(0, 10);
}
