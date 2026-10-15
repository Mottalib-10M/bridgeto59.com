/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                 params-2026.json (penalty, ages, brackets, limits, AFR, ACA tables)
 *   K.S(slug)           a state of data/states.json
 *   K.tool(kind, args)  runs a calculator of tool-specs.ts and returns its result card
 *   engine functions    K.tax, K.extraTax, K.early, K.rule55, K.sepp, K.maxRate, K.lockEnd, K.roth, K.ladder,
 *                       K.ptc, K.fpl, K.fireNumber, K.yearsTo, K.coast, K.lasts, K.quick, K.plan, K.bridge, K.stateTax
 *   formats             K.usd, K.pct, K.num, K.dec, K.day, K.month
 */
import P from '../data/params-2026.json';
import { STATES, NO_TAX, stateTax } from './engine/states';
import { usd, getTool, pct } from './tool-specs';
import { formatNumber, formatDecimal, displayDate } from './format';
import { federalTax, extraTax, bracketTax } from './engine/tax';
import { earlyWithdrawal, grossForNet, ruleOf55 } from './engine/early';
import { payment, maxRate, lockEnd, lifeExpectancy, annuityFactor, CAP_MONTHS } from './engine/sepp';
import { rothWithdrawal, ladder } from './engine/roth';
import { premiumCredit, povertyLine, applicablePct } from './engine/aca';
import { fireNumber, yearsTo, coast, coastAge, barista, lasts, crashFirstVsLast, yearsFromSavingsRate, grow } from './engine/fire';
import { quickNumber, plan, bridge, fireNumbers } from './engine/plan';
import type { V } from './tool-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
export const KIT = {
  P, S: (slug: string) => { const s = STATES[slug]; if (!s) throw new Error(`Unknown state ${slug}`); return s; }, NO_TAX, tool,
  tax: federalTax, extraTax, bracketTax, early: earlyWithdrawal, grossForNet, rule55: ruleOf55,
  sepp: payment, maxRate, lockEnd, life: lifeExpectancy, annuityFactor, CAP_MONTHS, roth: rothWithdrawal, ladder,
  ptc: premiumCredit, fpl: povertyLine, applicablePct, fireNumber, yearsTo, coast, coastAge, barista, lasts, crash: crashFirstVsLast,
  yearsFromRate: yearsFromSavingsRate, grow, quick: quickNumber, plan, bridge, fireNumbers, stateTax,
  usd, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: (iso: string) => displayDate(iso, 'en-US'),
  month: (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`,
};
export type Kit = typeof KIT;
