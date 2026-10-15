/**
 * The site's FIRE calculator: the FIRE number with federal tax and health premiums before 65, and a
 * year-by-year bridge that only spends money the law lets you reach before 59½.
 *
 * Accounts: taxable brokerage, the 401(k)/403(b) of the employer you leave (rule of 55 when you leave in
 * or after the year you turn 55, or 50 for qualified public safety employees), traditional IRAs and old
 * plans, a governmental 457(b) (no 10 % additional tax), Roth contributions (free at any time) and Roth
 * conversions (free five tax years after the conversion year). Optional bridge: a Roth conversion ladder
 * or a 72(t) series on the IRA (fixed amortization at the current maximum rate).
 * All amounts in today's dollars: the return is a real return and the 2026 brackets are taken as indexed.
 */
import P from '../../data/params-2026.json';
import { federalTax, standardDeduction, type Status } from './tax';
import { payment, maxRate, CAP_MONTHS } from './sepp';
import { fireNumber } from './fire';

export type Strategy = 'none' | 'ladder' | 'sepp';
export interface PlanIn {
  age: number; spend: number;
  taxable: number; plan: number; ira: number; roth: number; rothBasis: number; gov457: number;
  savePlan: number; saveRoth: number; saveTaxable: number;
  r: number; swr: number; status: Status; stateRate: number; health: number;
  strategy: Strategy; convert: number; gainShare: number; publicSafety: boolean;
}
export interface Row { age: number; need: number; src: Record<string, number>; ordinary: number; tax: number; penalty: number; end: number; reachable: number }
export interface Bridge { retireAge: number; rows: Row[]; penalty: number; firstPenaltyAge: number | null; depletedAge: number | null; ok: boolean; rule55: boolean; seppPayment: number; seppRate: number; seppEnd: number }

export const HORIZON = 95;
export const SEPP_MONTH = CAP_MONTHS[CAP_MONTHS.length - 1];
const EARLY = P.early.age;
const MEDICARE = P.aca.medicareAge;

interface Bal { T: number; PL: number; I: number; G: number; RB: number; RE: number; conv: Array<{ age: number; amt: number }> }
const total = (b: Bal) => b.T + b.PL + b.I + b.G + b.RB + b.RE + b.conv.reduce((s, c) => s + c.amt, 0);

/** Balances at a future age, contributions at the end of each year. */
export function project(p: PlanIn, atAge: number): Bal {
  const b: Bal = { T: p.taxable, PL: p.plan, I: p.ira, G: p.gov457, RB: Math.min(p.rothBasis, p.roth), RE: Math.max(0, p.roth - p.rothBasis), conv: [] };
  for (let a = p.age; a < atAge; a++) {
    const g = 1 + p.r;
    const rothTot = (b.RB + b.RE) * g;
    b.T = b.T * g + p.saveTaxable; b.PL = b.PL * g + p.savePlan; b.I *= g; b.G *= g;
    b.RB += p.saveRoth; b.RE = rothTot - (b.RB - p.saveRoth);
  }
  return b;
}
export const projectedTotal = (p: PlanIn, atAge: number) => total(project(p, atAge));

/** Federal + state tax on a year of withdrawals. */
function yearTax(p: PlanIn, ordinary: number, gains: number) {
  return federalTax({ ordinary, ltcg: gains, status: p.status }).total + p.stateRate * (ordinary + gains);
}

/** Gross withdrawal that leaves `spend` after tax for the account mix at retirement (after 59½). */
export function taxAtMix(p: PlanIn, b: Bal): number {
  const t = total(b) || 1;
  const pre = (b.PL + b.I + b.G) / t, tx = b.T / t;
  let w = p.spend;
  for (let i = 0; i < 30; i++) {
    const tax = yearTax(p, pre * w, tx * w * p.gainShare);
    w = p.spend + tax;
  }
  return w - p.spend;
}
/** Today's value of the health premiums paid from the retirement age to 65. */
export function healthBridge(p: PlanIn, retireAge: number): number {
  let s = 0;
  for (let a = retireAge; a < MEDICARE; a++) s += p.health / Math.pow(1 + p.r, a - retireAge);
  return s;
}
export interface Number2 { classic: number; tax: number; health: number; full: number }
/** FIRE number the usual way (spending ÷ rate) and with tax and the health bridge added. */
export function fireNumbers(p: PlanIn, retireAge: number): Number2 {
  const b = project(p, retireAge);
  const classic = fireNumber(p.spend, p.swr);
  const tax = taxAtMix(p, b) / p.swr;
  const health = healthBridge(p, retireAge);
  return { classic, tax, health, full: classic + tax + health };
}

/** Year-by-year bridge from the retirement age to the horizon. */
export function bridge(p: PlanIn, retireAge: number): Bridge {
  const b = project(p, retireAge);
  const rule55 = retireAge >= (p.publicSafety ? P.early.publicSafetyAge : P.early.ruleOf55Age);
  const rows: Row[] = [];
  let penaltyTot = 0, firstPenaltyAge: number | null = null, depletedAge: number | null = null;
  const seppOn = p.strategy === 'sepp' && retireAge < EARLY && b.I > 0;
  const seppRate = seppOn ? maxRate(SEPP_MONTH).rate : 0;
  const seppPayment = seppOn ? payment('amortization', b.I, retireAge, seppRate) : 0;
  const seppEnd = seppOn ? Math.max(retireAge + 5, EARLY) : 0;
  for (let a = retireAge; a <= HORIZON; a++) {
    const early = a < EARLY;
    const need = p.spend + (a < MEDICARE ? p.health : 0);
    // Ladder conversion: only while it can be spent before 59½.
    const conv = p.strategy === 'ladder' && a + 5 < Math.ceil(EARLY) ? Math.min(p.convert, b.I) : 0;
    if (conv > 0) { b.I -= conv; b.conv.push({ age: a, amt: conv }); }
    const s = seppOn && a < seppEnd ? Math.min(seppPayment, b.I) : 0;
    b.I -= s;
    const seasoned = b.conv.filter((c) => a >= c.age + 5);
    const seasonedAmt = seasoned.reduce((x, c) => x + c.amt, 0);
    const plFree = !early || rule55;
    // An IRA carrying a 72(t) series cannot pay anything else until the lock ends (Notice 2022-6, modification).
    const iraLocked = seppOn && a < seppEnd;
    // Draw `want` dollars of cash in the order of the rules; returns the plan without touching balances.
    const draw = (want: number) => {
      const src: Record<string, number> = {};
      let left = want;
      const pools: Record<string, number> = { T: b.T, PL: b.PL, I: b.I, G: b.G, RB: b.RB, CV: early ? seasonedAmt : b.conv.reduce((x, c) => x + c.amt, 0), RE: b.RE };
      const take = (k: string, cap = Infinity) => { const x = Math.max(0, Math.min(left, pools[k], cap)); if (x > 0) { pools[k] -= x; left -= x; src[k] = (src[k] ?? 0) + x; } };
      const room = Math.max(0, standardDeduction(p.status) - conv - s);
      if (early) {
        take('G', room); if (plFree) take('PL', Math.max(0, room - (src.G ?? 0)));
        take('T'); take('RB'); take('CV'); take('G'); if (plFree) take('PL');
        if (!iraLocked) take('I'); if (!plFree) take('PL'); take('RE');
      } else {
        take('PL', room); if (!iraLocked) take('I', Math.max(0, room - (src.PL ?? 0))); take('G', Math.max(0, room - (src.PL ?? 0) - (src.I ?? 0)));
        take('T'); take('PL'); if (!iraLocked) take('I'); take('G'); take('RB'); take('CV'); take('RE');
      }
      const ordinary = conv + s + (src.PL ?? 0) + (src.I ?? 0) + (src.G ?? 0);
      const reTaxable = early ? (src.RE ?? 0) : 0;
      const penalized = early ? (src.I ?? 0) + (plFree ? 0 : src.PL ?? 0) + (src.RE ?? 0) : 0;
      const gains = (src.T ?? 0) * p.gainShare;
      const tax = yearTax(p, ordinary + reTaxable, gains);
      return { src, short: left, ordinary: ordinary + reTaxable, tax, penalty: penalized * P.early.penalty };
    };
    let want = Math.max(0, need - s), d = draw(want);
    for (let i = 0; i < 12; i++) { want = Math.max(0, need + d.tax + d.penalty - s); d = draw(want); }
    // Apply.
    for (const [k, x] of Object.entries(d.src)) {
      if (k === 'CV') { let r = x; for (const c of b.conv) { if (early && a < c.age + 5) continue; const y = Math.min(r, c.amt); c.amt -= y; r -= y; } }
      else (b as unknown as Record<string, number>)[k] -= x;
    }
    const surplus = s - (need + d.tax + d.penalty);
    if (surplus > 0 && Object.keys(d.src).length === 0) b.T += surplus;
    if (d.short > 1 && depletedAge === null) depletedAge = a;
    if (d.penalty > 0.5) { penaltyTot += d.penalty; if (firstPenaltyAge === null) firstPenaltyAge = a; }
    // Growth: Roth growth goes to earnings, conversions and contributions keep their basis.
    const g = 1 + p.r;
    const rothBasis = b.RB + b.conv.reduce((x, c) => x + c.amt, 0);
    const rothTot = (rothBasis + b.RE) * g;
    b.T *= g; b.PL *= g; b.I *= g; b.G *= g; b.RE = rothTot - rothBasis;
    const src: Record<string, number> = { ...d.src };
    if (s > 0) src.SEPP = s;
    if (conv > 0) src.CONV = conv;
    const reach = a + 1 >= EARLY ? total(b) : b.T + b.RB + b.G + (rule55 ? b.PL : 0) + b.conv.filter((c) => a + 1 >= c.age + 5).reduce((x, c) => x + c.amt, 0);
    rows.push({ age: a, need, src, ordinary: d.ordinary, tax: d.tax, penalty: d.penalty, end: total(b), reachable: reach });
  }
  return { retireAge, rows, penalty: penaltyTot, firstPenaltyAge, depletedAge, ok: penaltyTot < 1 && depletedAge === null, rule55, seppPayment, seppRate, seppEnd };
}

export interface PlanOut { classicAge: number | null; rulesAge: number | null; classicNumber: number; numbers: Number2 | null; bridge: Bridge | null; totalAt: number }
/** Earliest age for the usual FIRE number, and earliest age once tax, health and access rules are applied. */
export function plan(p: PlanIn, maxAge = 75): PlanOut {
  const classicNumber = fireNumber(p.spend, p.swr);
  let classicAge: number | null = null, rulesAge: number | null = null;
  let numbers: Number2 | null = null, br: Bridge | null = null;
  for (let a = Math.ceil(p.age); a <= maxAge; a++) {
    const t = projectedTotal(p, a);
    if (classicAge === null && t >= classicNumber) classicAge = a;
    if (classicAge !== null) {
      const n = fireNumbers(p, a);
      if (t >= n.full) { const bb = bridge(p, a); if (bb.ok) { rulesAge = a; numbers = n; br = bb; break; } }
    }
  }
  return { classicAge, rulesAge, classicNumber, numbers, bridge: br, totalAt: rulesAge === null ? 0 : projectedTotal(p, rulesAge) };
}

/** Labels of the cash sources of a bridge row. */
export const SOURCE_LABEL: Record<string, string> = {
  T: 'Taxable account', PL: '401(k) of last employer', I: 'IRA and old plans', G: '457(b)', RB: 'Roth contributions', CV: 'Seasoned Roth conversions', RE: 'Roth earnings', SEPP: '72(t) payment', CONV: 'Converted to Roth',
};

export interface QuickIn { spend: number; swr: number; status: Status; pretaxShare: number; taxableShare?: number; gainShare?: number; stateRate?: number; health?: number; healthYears?: number; r?: number }
/** FIRE number from a spending level and an account mix, without projecting balances. */
export function quickNumber({ spend, swr, status, pretaxShare, taxableShare = 0, gainShare = 0.4, stateRate = 0, health = 0, healthYears = 0, r = 0.05 }: QuickIn): Number2 & { gross: number; taxYear: number } {
  let w = spend;
  for (let i = 0; i < 30; i++) w = spend + federalTax({ ordinary: pretaxShare * w, ltcg: taxableShare * w * gainShare, status }).total + stateRate * (pretaxShare * w + taxableShare * w * gainShare);
  let h = 0;
  for (let k = 0; k < healthYears; k++) h += health / Math.pow(1 + r, k);
  const classic = fireNumber(spend, swr);
  const tax = (w - spend) / swr;
  return { classic, tax, health: h, full: classic + tax + h, gross: w, taxYear: w - spend };
}
