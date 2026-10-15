/**
 * State income tax on a retirement-plan withdrawal, for the states where the answer changes with age or
 * with the type of withdrawal (src/data/states.json, each rule read on the state's revenue department
 * site; dates and URLs in the file). A state without a flat rate on file asks the visitor for a rate.
 */
import S from '../../data/states.json';
import P from '../../data/params-2026.json';

export interface Exclusion { minAge: number; maxAge?: number | null; amount?: number | null; covers: string; noPenaltyOnly?: boolean }
export interface StateRule {
  name: string; code: string; taxYear: number;
  rate: { kind: 'flat' | 'progressive' | 'none'; flat?: number | null; topRate?: number | null; note?: string };
  earlyPenalty?: number | null; exclusions: Exclusion[]; earlyTaxable?: boolean; summary: string;
  rules: string[]; sources: Array<{ url: string; title: string }>;
}
export const STATES = S.states as unknown as Record<string, StateRule>;
export const NO_TAX = S.noIncomeTax as unknown as { list: Array<{ name: string; code: string; note?: string }>; sources: Array<{ url: string; title: string }> };
export const STATE_OPTIONS = Object.entries(STATES).map(([k, v]) => ({ value: k, label: v.name })).sort((a, b) => a.label.localeCompare(b.label));

export interface StateTaxOut { name: string; excluded: number; taxed: number; rate: number | null; early: number; total: number; note: string; exclusion: Exclusion | null }
export function stateTax(slug: string, amount: number, age: number, userRate = 0, fedPenalty = age < P.early.age): StateTaxOut {
  const st = STATES[slug];
  if (!st) throw new Error(`Unknown state ${slug}`);
  const a = Math.max(0, amount);
  if (st.rate.kind === 'none') return { name: st.name, excluded: a, taxed: 0, rate: 0, early: 0, total: 0, note: st.summary, exclusion: null };
  const ex = st.exclusions.find((e) => age >= e.minAge && (e.maxAge === undefined || e.maxAge === null || age <= e.maxAge) && !(e.noPenaltyOnly && fedPenalty)) ?? null;
  const excluded = ex ? Math.min(a, ex.amount ?? Infinity) : 0;
  const taxed = a - excluded;
  const rate = userRate > 0 ? userRate : st.rate.kind === 'flat' ? st.rate.flat ?? null : null;
  const early = fedPenalty && age < P.early.age && st.earlyPenalty ? a * st.earlyPenalty : 0;
  return { name: st.name, excluded, taxed, rate, early, total: taxed * (rate ?? 0) + early, note: st.summary, exclusion: ex };
}
