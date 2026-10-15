/**
 * The FIRE calculator with the access rules (src/lib/engine/plan.ts): earliest retirement age by the plain
 * 25× rule and once federal tax, health premiums to 65 and the 59½ wall are applied, with the bridge
 * year by year. First render = build defaults (RECETTE §17.5); shared links are read after mount.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from './parts';
import { readParams, updateURL } from '../../lib/url-state';
import { plan, bridge, fireNumbers, projectedTotal, SOURCE_LABEL, type PlanIn, type Strategy } from '../../lib/engine/plan';
import { usd, pct } from '../../lib/tool-specs';
import P from '../../data/params-2026.json';
import type { Status } from '../../lib/engine/tax';

interface Props { methodHref?: string; idPrefix?: string; ret?: number; strategy?: Strategy }
type S = { age: number; spend: number; taxable: number; plan: number; ira: number; roth: number; save: number; strat: Strategy; basis: number; g457: number; st: Status; state: number; health: number; r: number; swr: number; conv: number; ps: 'no' | 'yes'; ret: number };

export default function FireTool({ methodHref, idPrefix = 'fire', ret = 0, strategy = 'none' }: Props) {
  const D: S = { age: 38, spend: 60000, taxable: 150000, plan: 300000, ira: 60000, roth: 60000, save: 45000, strat: strategy, basis: 40000, g457: 0, st: 'single', state: 0, health: 7200, r: 5, swr: 4, conv: 40000, ps: 'no', ret };
  const [s, setS] = useState<S>(D);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    const next = { ...D } as Record<string, unknown>;
    for (const k of Object.keys(D)) { const x = u.get(k); if (x === null) continue; next[k] = typeof (D as Record<string, unknown>)[k] === 'number' ? (parseFloat(x) || 0) : x; }
    setS(next as S);
  }, []);
  useEffect(() => updateURL(s as unknown as Record<string, string | number>), [s]);
  const set = <K extends keyof S>(k: K) => (x: S[K]) => setS((o) => ({ ...o, [k]: x }));
  const p: PlanIn = useMemo(() => {
    const savePlan = Math.min(s.save, P.limits.deferral), saveRoth = Math.min(Math.max(0, s.save - savePlan), P.limits.ira);
    return { age: s.age, spend: s.spend, taxable: s.taxable, plan: s.plan, ira: s.ira, roth: s.roth, rothBasis: Math.min(s.basis, s.roth), gov457: s.g457, savePlan, saveRoth, saveTaxable: Math.max(0, s.save - savePlan - saveRoth),
      r: s.r / 100, swr: s.swr / 100, status: s.st, stateRate: s.state / 100, health: s.health, strategy: s.strat, convert: s.conv, gainShare: 0.4, publicSafety: s.ps === 'yes' };
  }, [s]);
  const out = useMemo(() => plan(p), [p]);
  const test = s.ret > 0 ? Math.max(Math.ceil(s.age), Math.round(s.ret)) : null;
  const br = useMemo(() => (test ? bridge(p, test) : out.bridge), [p, test, out]);
  const nums = useMemo(() => (test ? fireNumbers(p, test) : out.numbers), [p, test, out]);
  const atAge = test ?? out.rulesAge;
  const have = atAge ? projectedTotal(p, atAge) : 0;
  const rows = (br?.rows ?? []).filter((r) => r.age < Math.max(P.aca.medicareAge, (br?.retireAge ?? 0) + 1));
  const label = test ? `Retiring at ${test}` : 'You can retire at';
  const value = test ? (br && br.ok && nums && have >= nums.full ? 'it works' : br && br.depletedAge !== null ? `runs out at ${br.depletedAge}` : br && br.penalty > 0 ? `${usd(br.penalty)} of 10 %` : 'not enough yet') : out.rulesAge === null ? 'not before 75' : `age ${out.rulesAge}`;
  const sub = test
    ? `Savings then: ${usd(have)}, against ${nums ? usd(nums.full) : 'n/a'} needed with tax and health.`
    : `The plain 25× rule says ${out.classicAge === null ? 'not before 75' : `age ${out.classicAge}`}. The difference is tax, health insurance to 65 and money you cannot reach before 59½.`;
  const NF = (k: keyof S, label: string, o: { unit?: string; max?: number; help?: string; decimals?: number; wide?: boolean } = {}) =>
    <NumberField id={`${idPrefix}-${k}`} label={label} value={s[k] as number} onChange={set(k) as (x: number) => void} unit={o.unit} max={o.max} help={o.help} decimals={o.decimals} className={o.wide ? 'sm:col-span-2' : ''} />;
  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          {NF('age', 'Your age', { unit: 'yrs', max: 80 })}
          {NF('spend', 'Yearly spending in retirement', { unit: '$', max: 5000000, help: 'Today’s dollars, health premiums apart' })}
          {NF('taxable', 'Taxable brokerage and cash', { unit: '$', max: 100000000 })}
          {NF('plan', '401(k) or 403(b) at your current job', { unit: '$', max: 100000000, help: 'Rule of 55 if you leave at 55 or later' })}
          {NF('ira', 'IRAs and old employers’ 401(k)s', { unit: '$', max: 100000000 })}
          {NF('roth', 'Roth IRA, total', { unit: '$', max: 100000000 })}
          {NF('save', 'You save each year', { unit: '$', max: 5000000, help: '401(k) first, then Roth IRA, then taxable' })}
          <Choice id={`${idPrefix}-strat`} label="Bridge before 59½" value={s.strat} onChange={set('strat')} options={[{ value: 'none', label: 'None' }, { value: 'ladder', label: 'Roth ladder' }, { value: 'sepp', label: '72(t)' }]} />
          <details className="sm:col-span-2 rounded-lg border border-navy-200 px-3 py-2">
            <summary className="cursor-pointer text-sm font-medium text-navy-700">More options: tax, health, returns</summary>
            <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {NF('ret', 'Test one retirement age (0 = earliest)', { unit: 'yrs', max: 80 })}
              {NF('health', 'Health premiums per year until 65', { unit: '$', max: 200000, help: 'After any premium tax credit' })}
              {NF('basis', 'Roth contributions inside that total', { unit: '$', max: 100000000, help: 'Free to withdraw at any age' })}
              {NF('g457', 'Governmental 457(b)', { unit: '$', max: 100000000 })}
              {NF('conv', 'Roth ladder: converted each year', { unit: '$', max: 5000000 })}
              <SelectField id={`${idPrefix}-st`} label="Filing status" value={s.st} onChange={(x) => set('st')(x as Status)} options={[{ value: 'single', label: 'Single' }, { value: 'joint', label: 'Married filing jointly' }, { value: 'head', label: 'Head of household' }]} />
              {NF('state', 'State income tax rate', { unit: '%', max: 15, decimals: 2 })}
              {NF('r', 'Return after inflation', { unit: '%', max: 15, decimals: 1, help: 'An assumption, not a forecast' })}
              {NF('swr', 'Withdrawal rate', { unit: '%', max: 10, decimals: 2 })}
              <Choice id={`${idPrefix}-ps`} label="Public safety employee" value={s.ps} onChange={set('ps')} options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes (age 50)' }]} />
            </div>
          </details>
        </form>
        <ResultCard label={label} value={value} sub={sub}>
          <Rows rows={[
            ['FIRE number, tax and health included', nums ? usd(nums.full) : 'n/a', nums?.full ?? 0],
            ['Plain 25× number', usd(out.classicNumber), out.classicNumber],
            ['Savings at that age', atAge ? usd(have) : 'n/a', have],
            ['10 % penalties in the bridge', br ? usd(br.penalty) : 'n/a'],
            ...(br && br.seppPayment > 0 ? [['72(t) payment per year', `${usd(br.seppPayment)} at ${pct(br.seppRate, 2)}`] as [string, string]] : []),
            ...(br ? [['Rule of 55 on the last 401(k)', br.rule55 ? 'yes' : 'no'] as [string, string]] : []),
          ]} />
          <p className="mt-2 text-xs text-navy-600">Social Security is left out: count it as a margin, not as income. Not personal financial advice.</p>
          <ShareRow methodHref={methodHref} />
        </ResultCard>
      </div>
      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="mb-2 text-left text-sm text-navy-700">Where each year’s money comes from, until Medicare at 65 (today’s dollars)</caption>
            <thead><tr>{['Age', 'Spending + health', 'Taken from', 'Tax', '10 %', 'Left in total'].map((h, i) => <th key={h} scope="col" className={`border-b border-navy-200 px-2 py-1.5 font-semibold text-navy-900 ${i === 2 ? 'text-left' : i === 0 ? 'text-left' : 'text-right'}`}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.age}>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{r.age}</td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-800">{usd(r.need)}</td>
                <td className="border-b border-navy-100 px-2 py-1.5 text-navy-800">{Object.entries(r.src).filter(([, x]) => x > 0.5).map(([k, x]) => `${SOURCE_LABEL[k]} ${usd(x)}`).join(' · ')}</td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-800">{usd(r.tax)}</td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-800">{usd(r.penalty)}</td>
                <td className="tabular-nums border-b border-navy-100 px-2 py-1.5 text-right text-navy-800">{usd(r.end)}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
