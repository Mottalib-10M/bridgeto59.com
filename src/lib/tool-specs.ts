/**
 * The calculators of the topic pages, one entry per subject. Every figure comes from the engine
 * (src/lib/engine/*), which reads params-2026.json. A spec lists its inputs (visible first, `adv` ones
 * folded) and a pure `run` that turns them into a result card.
 */
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input } from './tool-types';
import { formatMoney, formatPercent, formatDecimal } from './format';
import { federalTax, extraTax, marginalRate, type Status } from './engine/tax';
import { ruleOf55, earlyWithdrawal, grossForNet, EXCEPTIONS, ACCOUNT_LABEL, type Account } from './engine/early';
import { payment, maxRate, lockEnd, CAP_MONTHS, METHOD_LABEL, lifeExpectancy, recapture, schedule, type Method, type Table } from './engine/sepp';
import { rothWithdrawal, ladder } from './engine/roth';
import { premiumCredit, povertyLine, type CoverageYear } from './engine/aca';
import { fireNumber, yearsTo, coast, coastAge, barista, lasts, crashFirstVsLast, yearsFromSavingsRate, grow } from './engine/fire';
import { quickNumber } from './engine/plan';
import { stateTax, STATE_OPTIONS } from './engine/states';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const yrs = (x: number | null) => (x === null ? 'more than 80 years' : `${formatDecimal(Math.round(x * 10) / 10, 1)} years`);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthName = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
const EARLY = P.early.age;

const STATUS: Input = { kind: 'choice', id: 'st', label: 'Filing status', def: 'single', options: [{ value: 'single', label: 'Single' }, { value: 'joint', label: 'Joint' }, { value: 'head', label: 'Head' }] };
const status = (v: V) => s(v, 'st') as Status;
const swrIn = (def = 4): Input => ({ id: 'swr', label: 'Withdrawal rate', def, unit: '%', max: 10, decimals: 2, help: 'Share of the portfolio spent in year one' });
const rIn = (def = 5, adv = true): Input => ({ id: 'r', label: 'Return after inflation', def, unit: '%', max: 15, decimals: 1, help: 'An assumption, not a forecast', adv });
const ACCOUNTS = (Object.keys(ACCOUNT_LABEL) as Account[]).map((k) => ({ value: k, label: ACCOUNT_LABEL[k] }));
const EXC = [{ value: 'none', label: 'No exception' }, ...EXCEPTIONS.map((e) => ({ value: e.id, label: e.label }))];
const YEARS_BIRTH = Array.from({ length: 36 }, (_, i) => ({ value: String(1960 + i), label: String(1960 + i) }));

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* FIRE number with the tax on withdrawals and the health premiums until 65 */
  firenum: () => ({
    inputs: [
      { id: 'spend', label: 'Yearly spending in retirement', def: 60000, unit: '$', max: 5000000, help: 'Today’s dollars, health insurance apart', wide: true },
      swrIn(), { id: 'age', label: 'Age you stop working', def: 45, unit: 'yrs', max: 80 },
      { id: 'pre', label: 'Share in 401(k) and IRAs', def: 60, unit: '%', max: 100, help: 'Pre-tax money is taxed when withdrawn' },
      { id: 'health', label: 'Health premiums per year until 65', def: 7200, unit: '$', max: 200000, help: 'After any premium tax credit' },
      STATUS, { id: 'state', label: 'State income tax rate', def: 0, unit: '%', max: 15, decimals: 2, adv: true }, rIn(),
    ],
    run: (v) => {
      const q = quickNumber({ spend: n(v, 'spend'), swr: n(v, 'swr') / 100, status: status(v), pretaxShare: n(v, 'pre') / 100, taxableShare: (100 - n(v, 'pre')) / 200, stateRate: n(v, 'state') / 100, health: n(v, 'health'), healthYears: Math.max(0, P.aca.medicareAge - n(v, 'age')), r: n(v, 'r') / 100 });
      return { label: 'Your FIRE number, tax and health included', value: usd(q.full), sub: `The plain 25× rule would say ${usd(q.classic)}: ${usd(q.full - q.classic)} short.`,
        rows: [['Spending ÷ withdrawal rate', usd(q.classic), q.classic], ['Federal and state tax on withdrawals', usd(q.tax), q.tax], [`Health premiums from ${n(v, 'age')} to 65`, usd(q.health), q.health], ['Tax in a typical year', usd(q.taxYear)]],
        note: 'Tax: 2026 brackets and standard deduction (Rev. Proc. 2025-32), half of the non-401(k) money assumed taxable with 40 % gains.' };
    },
  }),
  /* Same with a monthly budget */
  need: () => ({
    inputs: [
      { id: 'm', label: 'Monthly spending you want', def: 5000, unit: '$', max: 500000, wide: true },
      swrIn(), { id: 'pre', label: 'Share in 401(k) and IRAs', def: 70, unit: '%', max: 100 }, STATUS,
      { id: 'age', label: 'Age you stop working', def: 55, unit: 'yrs', max: 80 },
      { id: 'health', label: 'Health premiums per year until 65', def: 8400, unit: '$', max: 200000, adv: true }, rIn(),
    ],
    run: (v) => {
      const spend = n(v, 'm') * 12;
      const q = quickNumber({ spend, swr: n(v, 'swr') / 100, status: status(v), pretaxShare: n(v, 'pre') / 100, taxableShare: (100 - n(v, 'pre')) / 200, health: n(v, 'health'), healthYears: Math.max(0, P.aca.medicareAge - n(v, 'age')), r: n(v, 'r') / 100 });
      const at = (rate: number) => quickNumber({ spend, swr: rate, status: status(v), pretaxShare: n(v, 'pre') / 100, taxableShare: (100 - n(v, 'pre')) / 200, health: n(v, 'health'), healthYears: Math.max(0, P.aca.medicareAge - n(v, 'age')), r: n(v, 'r') / 100 }).full;
      return { label: 'Savings you need to retire', value: usd(q.full), sub: `${usd(spend)} a year to spend, ${usd(q.taxYear)} more withdrawn for tax.`,
        rows: [['At 3.5 %', usd(at(0.035))], ['At 4 %', usd(at(0.04))], ['At 4.5 %', usd(at(0.045))], ['Health bridge to 65 included', usd(q.health)]] };
    },
  }),
  /* Coast FIRE */
  coast: () => ({
    inputs: [
      { id: 'age', label: 'Your age', def: 32, unit: 'yrs', max: 90 }, { id: 'ret', label: 'Age you want to retire', def: 60, unit: 'yrs', max: 90 },
      { id: 'spend', label: 'Yearly spending in retirement', def: 50000, unit: '$', max: 5000000 }, { id: 'bal', label: 'Invested today', def: 120000, unit: '$', max: 100000000 },
      { id: 'c', label: 'You add each year until coasting', def: 15000, unit: '$', max: 5000000 }, swrIn(), rIn(5, false),
    ],
    run: (v) => {
      const r = n(v, 'r') / 100, target = fireNumber(n(v, 'spend'), n(v, 'swr') / 100);
      const need = coast(target, n(v, 'age'), n(v, 'ret'), r);
      const at = coastAge(target, n(v, 'bal'), n(v, 'c'), n(v, 'age'), n(v, 'ret'), r);
      const ok = n(v, 'bal') >= need;
      return { label: ok ? 'You have reached Coast FIRE' : 'Coast FIRE number today', value: usd(need), sub: ok ? `${usd(n(v, 'bal') - need)} above it: saving can stop and the money still grows to ${usd(target)} by ${n(v, 'ret')}.` : `${usd(need - n(v, 'bal'))} to go. At your saving pace you coast from age ${at ?? 'never before ' + n(v, 'ret')}.`,
        rows: [['FIRE number at retirement', usd(target)], ['Needed today to coast', usd(need)], ['Age you can stop saving', at === null ? 'not before retiring' : String(at)], [n(v, 'ret') < EARLY ? 'Retiring before 59½: plan the access' : 'Retiring after 59½', n(v, 'ret') < EARLY ? 'see the bridge' : 'no 10 %']] };
    },
  }),
  /* Barista FIRE */
  barista: () => ({
    inputs: [
      { id: 'spend', label: 'Yearly spending', def: 55000, unit: '$', max: 5000000 }, { id: 'pt', label: 'Part-time pay after tax', def: 24000, unit: '$', max: 5000000 },
      { id: 'bal', label: 'Invested today', def: 350000, unit: '$', max: 100000000 }, { id: 'c', label: 'You add each year', def: 20000, unit: '$', max: 5000000 },
      swrIn(), rIn(),
    ],
    run: (v) => {
      const r = n(v, 'r') / 100, w = n(v, 'swr') / 100;
      const b = barista(n(v, 'spend'), n(v, 'pt'), w), full = fireNumber(n(v, 'spend'), w);
      const yb = yearsTo(b, n(v, 'bal'), n(v, 'c'), r), yf = yearsTo(full, n(v, 'bal'), n(v, 'c'), r);
      return { label: 'Barista FIRE number', value: usd(b), sub: `Part-time pay covers ${pct(Math.min(1, n(v, 'pt') / Math.max(1, n(v, 'spend'))), 0)} of spending.`,
        rows: [['Full FIRE number', usd(full), full], ['Barista FIRE number', usd(b), b], ['Years to Barista FIRE', yrs(yb)], ['Years to full FIRE', yrs(yf)]] };
    },
  }),
  /* Lean, regular, fat */
  tiers: () => ({
    inputs: [
      { id: 'lean', label: 'Lean budget per year', def: 40000, unit: '$', max: 5000000 }, { id: 'mid', label: 'Comfortable budget', def: 70000, unit: '$', max: 5000000 },
      { id: 'fat', label: 'Fat budget', def: 130000, unit: '$', max: 5000000 }, swrIn(), STATUS,
      { id: 'pre', label: 'Share in 401(k) and IRAs', def: 60, unit: '%', max: 100, adv: true },
    ],
    run: (v) => {
      const q = (spend: number) => quickNumber({ spend, swr: n(v, 'swr') / 100, status: status(v), pretaxShare: n(v, 'pre') / 100, taxableShare: (100 - n(v, 'pre')) / 200 });
      const L = q(n(v, 'lean')), M = q(n(v, 'mid')), F = q(n(v, 'fat'));
      return { label: 'Fat FIRE costs this much more than lean', value: usd(F.full - L.full), sub: 'Tax grows faster than spending: the fat budget climbs into higher brackets.',
        rows: [['Lean FIRE', usd(L.full), L.full], ['Comfortable FIRE', usd(M.full), M.full], ['Fat FIRE', usd(F.full), F.full], ['Tax share of the fat number', pct(F.tax / F.full, 0)]] };
    },
  }),
  /* 4 % rule */
  swr: () => ({
    inputs: [
      { id: 'p', label: 'Portfolio at retirement', def: 1250000, unit: '$', max: 100000000, wide: true }, { id: 'w', label: 'Yearly withdrawal', def: 50000, unit: '$', max: 10000000 },
      rIn(4, false),
    ],
    run: (v) => {
      const p = n(v, 'p'), w = n(v, 'w'), r = n(v, 'r') / 100;
      const L = lasts(p, w, r);
      return { label: 'Withdrawal rate', value: pct(w / Math.max(1, p), 2), sub: L === null ? `At ${pct(r)} after inflation the money lasts 100 years or more.` : `At ${pct(r)} after inflation the money lasts about ${formatDecimal(Math.round(L))} years.`,
        rows: [['At 3 %', usd(p * 0.03)], ['At 3.5 %', usd(p * 0.035)], ['At 4 %', usd(p * 0.04)], ['At 4.5 %', usd(p * 0.045)], ['Lasts at 0 % real return', yrs(lasts(p, w, 0))]] };
    },
  }),
  /* Sequence of returns */
  sequence: () => ({
    inputs: [
      { id: 'p', label: 'Portfolio at retirement', def: 1000000, unit: '$', max: 100000000 }, { id: 'w', label: 'Yearly withdrawal', def: 45000, unit: '$', max: 10000000 },
      { id: 'avg', label: 'Average return after inflation', def: 5, unit: '%', max: 15, decimals: 1 }, { id: 'c', label: 'Return in each bad year', def: -20, unit: '%', max: 0, decimals: 1, help: 'A negative number' },
      { id: 'k', label: 'Number of bad years', def: 2, unit: 'yrs', max: 10 }, { id: 'h', label: 'Years in retirement', def: 35, unit: 'yrs', max: 60, adv: true },
    ],
    run: (v) => {
      const c = crashFirstVsLast(n(v, 'p'), n(v, 'w'), n(v, 'avg') / 100, -Math.abs(n(v, 'c')) / 100, Math.max(1, n(v, 'k')), Math.max(n(v, 'k') + 1, n(v, 'h')));
      return { label: 'Same average return, bad years first: money left', value: usd(c.endFirst), sub: `Bad years last instead: ${usd(c.endLast)}.`,
        rows: [['Bad years first, end balance', usd(c.endFirst), c.endFirst], ['Bad years last, end balance', usd(c.endLast), c.endLast], ['Return in the other years', pct(c.other)], ['Runs out (bad years first)', c.depletedFirst < 0 ? 'never' : `year ${c.depletedFirst + 1}`]] };
    },
  }),
  /* When can I retire */
  when: () => ({
    inputs: [
      { id: 'age', label: 'Your age', def: 35, unit: 'yrs', max: 90 }, { id: 'bal', label: 'Invested today', def: 200000, unit: '$', max: 100000000 },
      { id: 'c', label: 'You save each year', def: 30000, unit: '$', max: 5000000 }, { id: 'spend', label: 'Yearly spending in retirement', def: 60000, unit: '$', max: 5000000 },
      swrIn(), rIn(),
    ],
    run: (v) => {
      const target = fireNumber(n(v, 'spend'), n(v, 'swr') / 100);
      const y = yearsTo(target, n(v, 'bal'), n(v, 'c'), n(v, 'r') / 100);
      const at = y === null ? null : n(v, 'age') + y;
      return { label: 'You can retire at about', value: at === null ? 'not before 80 years' : `age ${Math.ceil(at)}`, sub: `${yrs(y)} to reach ${usd(target)}.`,
        rows: [['Target (spending ÷ rate)', usd(target)], ['Saving $10,000 more a year', yrs(yearsTo(target, n(v, 'bal'), n(v, 'c') + 10000, n(v, 'r') / 100))], ['Spending $10,000 less', yrs(yearsTo(fireNumber(Math.max(0, n(v, 'spend') - 10000), n(v, 'swr') / 100), n(v, 'bal'), n(v, 'c'), n(v, 'r') / 100))], [at !== null && at < EARLY ? 'Before 59½: plan the bridge' : 'Penalty age', at !== null && at < EARLY ? `${formatDecimal(Math.round((EARLY - at) * 10) / 10, 1)} years to cover` : 'past']] };
    },
  }),
  /* Savings rate */
  rate: () => ({
    inputs: [
      { id: 'sr', label: 'Savings rate (share of take-home pay)', def: 40, unit: '%', max: 95, wide: true }, { id: 'bal', label: 'Already invested, in years of spending', def: 0, unit: 'yrs', max: 50, decimals: 1 },
      swrIn(), rIn(),
    ],
    run: (v) => {
      const sr = n(v, 'sr') / 100, r = n(v, 'r') / 100, w = n(v, 'swr') / 100;
      const start = n(v, 'bal') * (100000 * (1 - sr));
      const y = yearsFromSavingsRate(sr, r, w, start);
      const row = (x: number) => [`At ${pct(x, 0)}`, yrs(yearsFromSavingsRate(x, r, w, n(v, 'bal') * (100000 * (1 - x))))] as [string, string];
      return { label: 'Years until financial independence', value: yrs(y), sub: 'Income does not matter here: the rate sets both what you save and what you must replace.',
        rows: [row(0.2), row(0.35), row(0.5), row(0.65)] };
    },
  }),
  /* Savings by age */
  byAge: () => ({
    inputs: [
      { id: 'age', label: 'Your age', def: 40, unit: 'yrs', max: 90 }, { id: 'ret', label: 'Retirement age', def: 60, unit: 'yrs', max: 90 },
      { id: 'spend', label: 'Yearly spending in retirement', def: 60000, unit: '$', max: 5000000 }, { id: 'c', label: 'You save each year from now', def: 20000, unit: '$', max: 5000000 },
      swrIn(), rIn(),
    ],
    run: (v) => {
      const r = n(v, 'r') / 100, target = fireNumber(n(v, 'spend'), n(v, 'swr') / 100);
      const need = (age: number) => { const k = Math.max(0, n(v, 'ret') - age); const fv = grow(0, n(v, 'c'), r, k); return Math.max(0, (target - fv) / Math.pow(1 + r, k)); };
      const ages = [30, 35, 40, 45, 50, 55].filter((a) => a < n(v, 'ret'));
      return { label: `On track at ${n(v, 'age')} with`, value: usd(need(n(v, 'age'))), sub: `Grows to ${usd(target)} by ${n(v, 'ret')} with ${usd(n(v, 'c'))} added each year.`,
        rows: ages.map((a) => [`At ${a}`, usd(need(a))] as [string, string]) };
    },
  }),
  /* How long will my money last */
  lasts: () => ({
    inputs: [
      { id: 'p', label: 'Savings', def: 800000, unit: '$', max: 100000000, wide: true }, { id: 'w', label: 'Yearly withdrawal', def: 48000, unit: '$', max: 10000000 }, rIn(4, false),
    ],
    run: (v) => {
      const p = n(v, 'p'), w = n(v, 'w'), r = n(v, 'r') / 100;
      const show = (x: number | null) => (x === null ? '100 years or more' : `${formatDecimal(Math.round(x * 10) / 10, 1)} years`);
      return { label: 'Your money lasts', value: show(lasts(p, w, r)), sub: `Withdrawal rate ${pct(w / Math.max(1, p), 1)}.`,
        rows: [['With 2 points less return', show(lasts(p, w, r - 0.02))], ['With 2 points more', show(lasts(p, w, r + 0.02))], ['With no return at all', show(lasts(p, w, 0))]] };
    },
  }),
  /* Rule of 55 */
  rule55: (arg) => ({
    inputs: [
      { kind: 'select', id: 'by', label: 'Year you were born', def: String(arg?.by ?? 1971), options: YEARS_BIRTH }, { kind: 'select', id: 'ly', label: 'Year you leave the job', def: '2026', options: Array.from({ length: 15 }, (_, i) => ({ value: String(2024 + i), label: String(2024 + i) })) },
      { kind: 'choice', id: 'ps', label: 'Qualified public safety job', def: String(arg?.ps ?? 'no'), options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] },
      { id: 'sy', label: 'Years of service under the plan', def: Number(arg?.sy ?? 20), unit: 'yrs', max: 60 },
      { id: 'amt', label: 'Withdrawal from that 401(k)', def: 40000, unit: '$', max: 10000000 }, STATUS,
      { id: 'oi', label: 'Other taxable income that year', def: 0, unit: '$', max: 10000000, adv: true },
    ],
    run: (v) => {
      const r = ruleOf55({ birthYear: Number(s(v, 'by')), separationYear: Number(s(v, 'ly')), publicSafety: s(v, 'ps') === 'yes', serviceYears: n(v, 'sy') });
      const ageNow = Number(s(v, 'ly')) - Number(s(v, 'by'));
      const w = earlyWithdrawal({ amount: n(v, 'amt'), age: ageNow, account: 'plan', exception: r.eligible ? 'separation55' : 'none', status: status(v), otherIncome: n(v, 'oi') });
      return { label: r.eligible ? 'Rule of 55 applies: no 10 %' : 'Rule of 55 does not apply', value: r.eligible ? usd(n(v, 'amt') * P.early.penalty) + ' saved' : usd(w.penalty) + ' penalty', sub: `Because ${r.reason}.`,
        rows: [['Federal income tax on it', usd(w.federal)], ['10 % additional tax', usd(w.penalty)], ['20 % withheld by the plan', usd(w.withheld)], ['You keep (federal only)', usd(w.net)]], note: 'Only the plan of the employer you leave. An IRA, or a rollover into one, loses the rule.' };
    },
  }),
  /* 72(t) payment */
  sepp: () => ({
    inputs: [
      { id: 'b', label: 'IRA balance used for the series', def: 500000, unit: '$', max: 100000000, wide: true },
      { kind: 'select', id: 'by', label: 'Year you were born', def: '1976', options: YEARS_BIRTH }, { kind: 'select', id: 'bm', label: 'Birth month', def: '6', options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) },
      { kind: 'select', id: 'm', label: 'Month of the first payment', def: CAP_MONTHS[CAP_MONTHS.length - 1], options: CAP_MONTHS.map((x) => ({ value: x, label: monthName(x) })) },
      { kind: 'select', id: 'me', label: 'Method', def: 'amortization', options: (['amortization', 'annuitization', 'rmd'] as Method[]).map((x) => ({ value: x, label: METHOD_LABEL[x] })) },
      { kind: 'select', id: 'tb', label: 'Life expectancy table', def: 'single', options: [{ value: 'single', label: 'Single Life Table' }, { value: 'uniform', label: 'Uniform Lifetime Table' }], adv: true },
      { id: 'rate', label: 'Interest rate (0 = highest allowed)', def: 0, unit: '%', max: 10, decimals: 2, adv: true },
    ],
    run: (v) => {
      const cap = maxRate(s(v, 'm'));
      const rate = n(v, 'rate') > 0 ? Math.min(n(v, 'rate') / 100, cap.rate) : cap.rate;
      const year = Number(s(v, 'm').slice(0, 4)), age = year - Number(s(v, 'by'));
      const tb = s(v, 'tb') as Table, me = s(v, 'me') as Method;
      const pay = payment(me, n(v, 'b'), age, rate, tb);
      const birth = `${s(v, 'by')}-${String(s(v, 'bm')).padStart(2, '0')}-01`;
      const lock = lockEnd(`${s(v, 'm')}-01`, birth);
      const all = (['amortization', 'annuitization', 'rmd'] as Method[]).map((x) => [METHOD_LABEL[x], usd(payment(x, n(v, 'b'), age, rate, tb)), payment(x, n(v, 'b'), age, rate, tb)] as [string, string, number]);
      return { label: `${METHOD_LABEL[me]}: payment per year`, value: usd(pay), sub: `${usd(pay / 12)} a month · age ${age} · rate ${pct(rate, 2)} · locked until ${longDate(lock.date)}`,
        rows: [...all, ['Life expectancy used', `${formatDecimal(lifeExpectancy(age, tb), 1)} years`], ['Lock ends because of', lock.by === 'age' ? 'age 59½' : 'the five-year minimum']],
        note: `Highest rate for ${monthName(s(v, 'm'))}: ${cap.from === 'floor' ? 'the 5 % floor' : `120 % of the mid-term AFR of ${monthName(cap.from)}`} (Notice 2022-6).` };
    },
  }),
  /* 72(t) highest rate by month */
  seppRate: () => ({
    inputs: [{ kind: 'select', id: 'm', label: 'Month of the first payment', def: CAP_MONTHS[CAP_MONTHS.length - 1], options: CAP_MONTHS.map((x) => ({ value: x, label: monthName(x) })), wide: true },
      { id: 'b', label: 'Account balance', def: 400000, unit: '$', max: 100000000 }, { id: 'age', label: 'Your age that year', def: 50, unit: 'yrs', max: 59 }],
    run: (v) => {
      const cap = maxRate(s(v, 'm'));
      const rows = cap.months.map((m) => ('missing' in m ? [`120 % mid-term, ${monthName(m.month)}`, 'not published'] : [`120 % mid-term, ${monthName(m.month)} (${m.rr})`, pct(m.mid120, 2)]) as [string, string]);
      return { label: 'Highest interest rate you may use', value: pct(cap.rate, 2), sub: cap.from === 'floor' ? 'The 5 % floor is higher than both monthly rates.' : `From ${monthName(cap.from)}, above the 5 % floor.`,
        rows: [...rows, ['Floor in Notice 2022-6', pct(P.sepp.floor, 0)], ['Amortization payment at this rate', usd(payment('amortization', n(v, 'b'), n(v, 'age'), cap.rate))], ['Same at the 5 % floor', usd(payment('amortization', n(v, 'b'), n(v, 'age'), P.sepp.floor))]] };
    },
  }),
  /* Breaking a 72(t) */
  recapture: () => ({
    inputs: [{ id: 'p', label: 'Yearly 72(t) payment', def: 24000, unit: '$', max: 5000000 }, { id: 'k', label: 'Payments already taken before the change', def: 3, unit: 'yrs', max: 30 },
      { id: 'x', label: 'Total taken in the year of the change', def: 40000, unit: '$', max: 10000000 }],
    run: (v) => {
      const back = recapture(n(v, 'p') * n(v, 'k')), now = n(v, 'x') * P.early.penalty;
      return { label: 'Extra tax for modifying the series', value: usd(back + now), sub: 'Plus interest on the earlier years, which the IRS computes from the deferral period.',
        rows: [['Recapture on earlier payments (10 %)', usd(back), back], ['10 % on this year’s withdrawals', usd(now), now]] };
    },
  }),
  /* 10 % penalty */
  penalty: (arg) => ({
    inputs: [
      { id: 'amt', label: 'Amount you withdraw', def: 25000, unit: '$', max: 10000000, wide: true }, { id: 'age', label: 'Your age', def: 45, unit: 'yrs', max: 99, decimals: 1 },
      { kind: 'select', id: 'acc', label: 'Account', def: String(arg?.acc ?? 'oldPlan'), options: ACCOUNTS }, { kind: 'select', id: 'ex', label: 'Exception', def: 'none', options: EXC },
      STATUS, { id: 'oi', label: 'Other taxable income this year', def: 60000, unit: '$', max: 10000000 },
      { id: 'state', label: 'State income tax rate', def: 5, unit: '%', max: 15, decimals: 2, adv: true },
    ],
    run: (v) => {
      const w = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: s(v, 'acc') as Account, exception: s(v, 'ex'), status: status(v), otherIncome: n(v, 'oi'), stateRate: n(v, 'state') / 100 });
      const lost = n(v, 'amt') - w.net;
      return { label: 'You keep', value: usd(w.net), sub: `${usd(lost)} goes to tax and penalty (${pct(lost / Math.max(1, n(v, 'amt')), 0)}): ${w.rule}.`,
        rows: [['10 % additional tax', usd(w.penalty), w.penalty], ['Federal income tax', usd(w.federal), w.federal], ['State income tax', usd(w.state), w.state], ['Withheld at payout', usd(w.withheld)]] };
    },
  }),
  /* Gross for net */
  net: () => ({
    inputs: [
      { id: 'net', label: 'Cash you need in hand', def: 30000, unit: '$', max: 10000000, wide: true }, { id: 'age', label: 'Your age', def: 48, unit: 'yrs', max: 99, decimals: 1 },
      { kind: 'select', id: 'acc', label: 'Account', def: 'oldPlan', options: ACCOUNTS }, STATUS,
      { id: 'oi', label: 'Other taxable income this year', def: 45000, unit: '$', max: 10000000 }, { id: 'state', label: 'State income tax rate', def: 5, unit: '%', max: 15, decimals: 2 },
    ],
    run: (v) => {
      const g = grossForNet(n(v, 'net'), { age: n(v, 'age'), account: s(v, 'acc') as Account, status: status(v), otherIncome: n(v, 'oi'), stateRate: n(v, 'state') / 100 });
      return { label: 'Withdraw this much', value: usd(g.gross), sub: `To keep ${usd(n(v, 'net'))} after the 10 % and income tax.`,
        rows: [['10 % additional tax', usd(g.penalty), g.penalty], ['Federal income tax', usd(g.federal), g.federal], ['State income tax', usd(g.state), g.state], ['Marginal federal rate reached', pct(g.marginal, 0)]] };
    },
  }),
  /* Exceptions */
  exceptions: () => ({
    inputs: [{ kind: 'select', id: 'ex', label: 'Your situation', def: 'medical', options: EXC.filter((e) => e.value !== 'none'), wide: true },
      { kind: 'select', id: 'acc', label: 'Account', def: 'ira', options: ACCOUNTS.filter((a) => !a.value.startsWith('roth') && a.value !== 'gov457') }, { id: 'amt', label: 'Amount', def: 12000, unit: '$', max: 10000000 }, { id: 'age', label: 'Your age', def: 45, unit: 'yrs', max: 59, decimals: 1 }],
    run: (v) => {
      const w = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: s(v, 'acc') as Account, exception: s(v, 'ex'), status: 'single' });
      const e = EXCEPTIONS.find((x) => x.id === s(v, 'ex'))!;
      const covered = n(v, 'amt') - w.penalized;
      return { label: covered >= n(v, 'amt') ? 'No 10 % on this withdrawal' : covered > 0 ? 'Partly covered' : 'This exception does not reach that account', value: usd(w.penalty), sub: `Covered: ${usd(covered)} of ${usd(n(v, 'amt'))}${e.code ? ` · IRC ${e.code}` : ''}.`,
        rows: [['Applies to 401(k) and 403(b)', e.plan ? 'yes' : 'no'], ['Applies to IRAs', e.ira ? 'yes' : 'no'], ['Cap', e.cap ? usd(e.cap) : 'none'], ['Income tax still due', 'yes']] };
    },
  }),
  /* When can you draw each account */
  draw: () => ({
    inputs: [{ kind: 'select', id: 'by', label: 'Year you were born', def: '1980', options: YEARS_BIRTH }, { kind: 'select', id: 'bm', label: 'Birth month', def: '6', options: MONTHS.map((m, i) => ({ value: String(i + 1), label: m })) },
      { id: 'leave', label: 'Age you leave your job', def: 52, unit: 'yrs', max: 75 }, { kind: 'choice', id: 'ps', label: 'Public safety job', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] }],
    run: (v) => {
      const by = Number(s(v, 'by')), bm = Number(s(v, 'bm'));
      const half = new Date(Date.UTC(by + 59, bm - 1 + 6, 1));
      const halfTxt = `${MONTHS[half.getUTCMonth()]} ${half.getUTCFullYear()}`;
      const leaveYear = by + n(v, 'leave');
      const r = ruleOf55({ birthYear: by, separationYear: leaveYear, publicSafety: s(v, 'ps') === 'yes' });
      return { label: 'Your 401(k) and IRAs open without the 10 % in', value: halfTxt, sub: r.eligible ? `The 401(k) of the job you leave opens in ${leaveYear} (rule of ${r.qualifyingAge}).` : `Leaving in ${leaveYear} is too early for the rule of ${r.qualifyingAge}: that 401(k) waits for 59½ too.`,
        rows: [['401(k) of the job you leave', r.eligible ? String(leaveYear) : halfTxt], ['Older 401(k)s and IRAs', `${halfTxt}, or now with 72(t)`], ['Governmental 457(b)', `${leaveYear}, after leaving`], ['Roth IRA contributions', 'any time'], ['Roth conversions', 'five tax years after each one']] };
    },
  }),
  /* 20 % withholding */
  withholding: () => ({
    inputs: [{ id: 'amt', label: 'Cash-out from your 401(k)', def: 30000, unit: '$', max: 10000000, wide: true }, { id: 'age', label: 'Your age', def: 44, unit: 'yrs', max: 99, decimals: 1 }, STATUS,
      { id: 'oi', label: 'Other taxable income this year', def: 70000, unit: '$', max: 10000000 }],
    run: (v) => {
      const w = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: 'oldPlan', status: status(v), otherIncome: n(v, 'oi') });
      const owed = w.federal + w.penalty, diff = owed - w.withheld;
      return { label: diff > 0 ? 'Still to pay at tax time' : 'Refund at tax time', value: usd(Math.abs(diff)), sub: `${usd(w.withheld)} withheld (20 %), ${usd(owed)} really owed in federal tax and penalty.`,
        rows: [['Check you receive', usd(n(v, 'amt') - w.withheld)], ['Federal income tax', usd(w.federal)], ['10 % additional tax', usd(w.penalty)], ['Marginal rate reached', pct(w.marginal, 0)]] };
    },
  }),
  /* Roth conversion ladder */
  ladder: () => ({
    inputs: [{ id: 'amt', label: 'Converted each year', def: 40000, unit: '$', max: 5000000, wide: true }, { id: 'k', label: 'Years of conversions', def: 6, unit: 'yrs', max: 20 },
      { id: 'age', label: 'Your age at the first conversion', def: 45, unit: 'yrs', max: 70 }, { id: 'oi', label: 'Other taxable income each year', def: 0, unit: '$', max: 10000000 },
      { id: 'sp', label: 'Yearly spending', def: 45000, unit: '$', max: 5000000 }, STATUS],
    run: (v) => {
      const rows = ladder({ startYear: P.year, amount: n(v, 'amt'), years: Math.max(1, n(v, 'k')), otherIncome: n(v, 'oi'), status: status(v), spend: n(v, 'sp'), startAge: n(v, 'age') });
      const tax = rows.reduce((x, r) => x + r.tax, 0), gap = rows.slice(0, 5).reduce((x, r) => x + r.gap, 0);
      return { label: 'Spending to cover before the first rung', value: usd(gap), sub: `Five years from other money. Conversions cost ${usd(tax)} of federal tax in all (${usd(tax / Math.max(1, n(v, 'k')))} a year).`,
        rows: [['First rung free on', `January 1, ${P.year + 5}`], ['Tax on one conversion', usd(rows[0].tax)], ['Effective rate on it', pct(rows[0].tax / Math.max(1, n(v, 'amt')), 1)]],
        table: { headers: ['Year', 'Age', 'Converted', 'Tax', 'Spendable'], rows: rows.map((r) => [String(r.year), String(r.age), usd(r.converted), usd(r.tax), usd(r.available)]), align: ['l', 'r', 'r', 'r', 'r'] } };
    },
  }),
  /* Roth withdrawal ordering */
  roth: () => ({
    inputs: [{ id: 'amt', label: 'Amount you take out', def: 30000, unit: '$', max: 10000000, wide: true }, { id: 'c', label: 'Your total contributions', def: 25000, unit: '$', max: 10000000 },
      { id: 'cv', label: 'Converted amount', def: 20000, unit: '$', max: 10000000 }, { kind: 'select', id: 'cy', label: 'Year of that conversion', def: '2023', options: Array.from({ length: 12 }, (_, i) => ({ value: String(2016 + i), label: String(2016 + i) })) },
      { id: 'e', label: 'Earnings in the account', def: 15000, unit: '$', max: 10000000 }, { id: 'age', label: 'Your age', def: 47, unit: 'yrs', max: 99, decimals: 1 },
      { kind: 'select', id: 'fy', label: 'Year of your first Roth IRA contribution', def: '2015', options: Array.from({ length: 20 }, (_, i) => ({ value: String(2008 + i), label: String(2008 + i) })), adv: true }],
    run: (v) => {
      const r = rothWithdrawal({ contributions: n(v, 'c'), conversions: [{ year: Number(s(v, 'cy')), amount: n(v, 'cv') }], earnings: n(v, 'e'), amount: n(v, 'amt'), year: P.year, age: n(v, 'age'), firstRothYear: Number(s(v, 'fy')) });
      return { label: r.penalty > 0 ? '10 % additional tax' : 'Tax and penalty on this withdrawal', value: usd(r.penalty + (r.taxable > 0 ? 0 : 0)), sub: `${usd(r.taxable)} is taxable income${r.qualified ? ' (qualified distribution: nothing is)' : ''}.`,
        rows: r.pieces.map((p) => [p.from, `${usd(p.amount)}${p.penalty ? ' · 10 %' : ''}${p.taxable ? ' · taxed' : ''}`, p.amount] as [string, string, number]) };
    },
  }),
  /* 457(b) */
  gov457: () => ({
    inputs: [{ id: 'amt', label: 'Withdrawal', def: 40000, unit: '$', max: 10000000, wide: true }, { id: 'age', label: 'Your age', def: 50, unit: 'yrs', max: 99, decimals: 1 }, STATUS, { id: 'oi', label: 'Other taxable income', def: 0, unit: '$', max: 10000000 }],
    run: (v) => {
      const g = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: 'gov457', status: status(v), otherIncome: n(v, 'oi') });
      const k = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: 'oldPlan', status: status(v), otherIncome: n(v, 'oi') });
      return { label: 'Kept from a governmental 457(b)', value: usd(g.net), sub: `The same money from a 401(k) before 55 or an IRA keeps ${usd(k.net)}.`,
        rows: [['457(b): federal tax', usd(g.federal)], ['457(b): 10 %', usd(g.penalty)], ['401(k) or IRA: 10 %', usd(k.penalty)], ['Difference', usd(g.net - k.net)]] };
    },
  }),
  /* Bridge years to 59½ */
  bridgeYears: () => ({
    inputs: [{ id: 'age', label: 'Age you stop working', def: 48, unit: 'yrs', max: 59 }, { id: 'sp', label: 'Yearly spending with health', def: 55000, unit: '$', max: 5000000 },
      { id: 't', label: 'Taxable brokerage and cash', def: 250000, unit: '$', max: 100000000 }, { id: 'rb', label: 'Roth IRA contributions', def: 60000, unit: '$', max: 100000000 },
      { id: 'g', label: 'Governmental 457(b)', def: 0, unit: '$', max: 100000000 }, rIn(4)],
    run: (v) => {
      const need = Math.max(0, EARLY - n(v, 'age')), r = n(v, 'r') / 100;
      const have = n(v, 't') + n(v, 'rb') + n(v, 'g');
      const covered = lasts(have, n(v, 'sp'), r);
      const cov = covered === null ? 100 : covered;
      let pv = 0; for (let k = 0; k < Math.ceil(need); k++) pv += n(v, 'sp') / Math.pow(1 + r, k);
      return { label: cov >= need ? 'Your reachable money covers the bridge' : 'Bridge shortfall', value: cov >= need ? `${formatDecimal(Math.round(cov * 10) / 10, 1)} years` : usd(pv - have), sub: `${formatDecimal(need, 1)} years from ${n(v, 'age')} to 59½.`,
        rows: [['Money you can reach', usd(have)], ['Bridge cost (today’s value)', usd(pv)], ['Years it covers', covered === null ? '100 or more' : formatDecimal(Math.round(covered * 10) / 10, 1)]] };
    },
  }),
  /* ACA premium tax credit */
  aca: () => ({
    inputs: [{ kind: 'choice', id: 'y', label: 'Coverage year', def: '2026', options: [{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }] }, { id: 'hh', label: 'People in the tax household', def: 2, max: 12 },
      { id: 'magi', label: 'Expected MAGI for the year', def: 55000, unit: '$', max: 10000000, help: 'AGI + tax-exempt interest + untaxed Social Security' }, { id: 'b', label: 'Benchmark silver premium per month', def: 1600, unit: '$', max: 50000, help: 'Second-lowest silver plan, HealthCare.gov' },
      { id: 'pl', label: 'Premium of the plan you pick', def: 1600, unit: '$', max: 50000, adv: true }],
    run: (v) => {
      const r = premiumCredit({ year: s(v, 'y') as CoverageYear, size: n(v, 'hh'), magi: n(v, 'magi'), benchmarkMonthly: n(v, 'b'), planMonthly: n(v, 'pl') });
      return { label: 'You pay per month', value: usd(r.netPlan / 12), sub: r.overCap ? `Above 400 % of the poverty line (${usd(r.capIncome)}): no credit in ${s(v, 'y')}.` : r.underFloor ? 'Below the poverty line: Medicaid or no credit, depending on the state.' : `Credit ${usd(r.credit / 12)} a month; you are at ${pct(r.ratio, 0)} of the poverty line.`,
        rows: [['Poverty line used', usd(r.fpl)], ['Your required share of income', r.pct === null ? 'n/a' : pct(r.pct, 2)], ['Credit per year', usd(r.credit)], ['Income ceiling for any credit', usd(r.capIncome)]] };
    },
  }),
  /* The 400 % cliff */
  cliff: () => ({
    inputs: [{ kind: 'choice', id: 'y', label: 'Coverage year', def: '2026', options: [{ value: '2026', label: '2026' }, { value: '2027', label: '2027' }] }, { id: 'hh', label: 'People in the household', def: 2, max: 12 },
      { id: 'magi', label: 'Expected MAGI', def: 80000, unit: '$', max: 10000000 }, { id: 'b', label: 'Benchmark silver premium per month', def: 1700, unit: '$', max: 50000 }],
    run: (v) => {
      const y = s(v, 'y') as CoverageYear, hh = n(v, 'hh'), b = n(v, 'b');
      const cap = povertyLine(y, hh) * P.aca.cap;
      const at = premiumCredit({ year: y, size: hh, magi: n(v, 'magi'), benchmarkMonthly: b });
      const atCap = premiumCredit({ year: y, size: hh, magi: cap, benchmarkMonthly: b });
      return { label: n(v, 'magi') > cap ? 'Credit lost by being over the line' : 'Room before the 400 % line', value: n(v, 'magi') > cap ? usd(atCap.credit) : usd(cap - n(v, 'magi')), sub: `The line for ${hh} ${hh === 1 ? 'person' : 'people'} in ${y}: ${usd(cap)} of MAGI.`,
        rows: [['Credit at your income', usd(at.credit)], ['Credit at exactly 400 %', usd(atCap.credit)], ['Roth conversion room before the line', usd(Math.max(0, cap - n(v, 'magi')))]] };
    },
  }),
  /* COBRA vs Marketplace */
  cobra: () => ({
    inputs: [{ id: 'full', label: 'Full monthly cost of your work plan', def: 2100, unit: '$', max: 50000, help: 'Your share + the employer share' }, { id: 'm', label: 'Months you need it', def: P.aca.cobraMonths, unit: 'mo', max: 36 },
      { id: 'aca', label: 'Marketplace plan after credit, per month', def: 650, unit: '$', max: 50000 }],
    run: (v) => {
      const c = n(v, 'full') * P.aca.cobraMaxPremium * n(v, 'm'), a = n(v, 'aca') * n(v, 'm');
      return { label: c > a ? 'The Marketplace saves' : 'COBRA saves', value: usd(Math.abs(c - a)), sub: `Over ${n(v, 'm')} months.`,
        rows: [['COBRA at 102 %', usd(c), c], ['Marketplace after credit', usd(a), a], ['COBRA per month', usd(n(v, 'full') * P.aca.cobraMaxPremium)]] };
    },
  }),
  /* Tax on a 401(k) withdrawal */
  tax: () => ({
    inputs: [{ id: 'amt', label: 'Withdrawal', def: 50000, unit: '$', max: 10000000, wide: true }, { id: 'oi', label: 'Other taxable income', def: 0, unit: '$', max: 10000000 }, STATUS,
      { id: 'age', label: 'Your age', def: 60, unit: 'yrs', max: 99, decimals: 1 }],
    run: (v) => {
      const w = earlyWithdrawal({ amount: n(v, 'amt'), age: n(v, 'age'), account: 'oldPlan', status: status(v), otherIncome: n(v, 'oi') });
      return { label: 'Federal tax on this withdrawal', value: usd(w.federal + w.penalty), sub: `${pct((w.federal + w.penalty) / Math.max(1, n(v, 'amt')), 1)} of it${w.penalty ? ', 10 % penalty included' : ''}.`,
        rows: [['Income tax', usd(w.federal), w.federal], ['10 % additional tax', usd(w.penalty), w.penalty], ['Top bracket reached', pct(w.marginal, 0)], ['Withheld at payout (20 %)', usd(w.withheld)]] };
    },
  }),
  /* 0 % long-term gains */
  ltcg: () => ({
    inputs: [STATUS, { id: 'oi', label: 'Ordinary income (401(k), wages, conversions)', def: 20000, unit: '$', max: 10000000 }, { id: 'g', label: 'Long-term gains you sell', def: 50000, unit: '$', max: 10000000 }],
    run: (v) => {
      const t = federalTax({ ordinary: n(v, 'oi'), ltcg: n(v, 'g'), status: status(v) });
      return { label: 'Tax on your gains', value: usd(t.gainsTax), sub: t.zeroRoom > 0 ? `${usd(t.zeroRoom)} more gains would still be taxed at 0 %.` : 'Part of the gains is above the 0 % threshold.',
        rows: [['Taxable ordinary income', usd(t.taxableOrdinary)], ['Taxable gains', usd(t.taxableGains)], ['Tax on ordinary income', usd(t.ordinaryTax)], ['Top of the 0 % band (taxable income)', usd(P.tax.capitalGains.zeroMax[status(v)])]] };
    },
  }),
  /* State tax on a withdrawal */
  state: (arg) => ({
    inputs: [{ kind: 'select', id: 'sx', label: 'State', def: String(arg?.state ?? 'california'), options: STATE_OPTIONS, wide: true }, { id: 'amt', label: 'Withdrawal', def: 40000, unit: '$', max: 10000000 },
      { id: 'age', label: 'Your age', def: 52, unit: 'yrs', max: 99, decimals: 1 }, { kind: 'choice', id: 'fp', label: 'Federal 10 % applies', def: 'yes', options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] }, { id: 'rate', label: 'Your state rate (0 = rate on file)', def: 0, unit: '%', max: 15, decimals: 2, adv: true }],
    run: (v) => {
      const t = stateTax(s(v, 'sx'), n(v, 'amt'), n(v, 'age'), n(v, 'rate') / 100, s(v, 'fp') === 'yes' && n(v, 'age') < EARLY);
      return { label: `${t.name}: state tax on this withdrawal`, value: usd(t.total), sub: t.note,
        rows: [['Excluded by the state', usd(t.excluded)], ['Taxed by the state', usd(t.taxed)], ['Rate used', t.rate === null ? 'type your rate' : pct(t.rate, 2)], ['State early-distribution tax', usd(t.early)]] };
    },
  }),
  /* 2026 contribution limits */
  limits: () => ({
    inputs: [{ id: 'age', label: 'Your age at the end of 2026', def: 52, unit: 'yrs', max: 99 }, { kind: 'choice', id: 'hsa', label: 'HSA coverage', def: 'self', options: [{ value: 'none', label: 'None' }, { value: 'self', label: 'Self' }, { value: 'family', label: 'Family' }] }],
    run: (v) => {
      const a = n(v, 'age'), L = P.limits;
      const catchUp = a >= 60 && a <= 63 ? L.catchUp60to63 : a >= 50 ? L.catchUp50 : 0;
      const ira = L.ira + (a >= 50 ? L.iraCatchUp : 0);
      const hsa = s(v, 'hsa') === 'self' ? L.hsaSelf : s(v, 'hsa') === 'family' ? L.hsaFamily : 0;
      const tot = L.deferral + catchUp + ira + hsa;
      return { label: 'You can put away in 2026', value: usd(tot), sub: 'Employee deferrals, IRA and HSA; employer money comes on top, up to the annual additions limit.',
        rows: [['401(k), 403(b) or 457(b) deferral', usd(L.deferral), L.deferral], ['Catch-up for your age', usd(catchUp), catchUp], ['IRA (Roth or traditional)', usd(ira), ira], ['HSA', usd(hsa), hsa], ['Annual additions limit (all sources)', usd(L.annualAdditions)]] };
    },
  }),
};
/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: arg[i.id] } as typeof i))) };
}
export const TOOL_KINDS = Object.keys(SPECS);
export { extraTax, marginalRate };
