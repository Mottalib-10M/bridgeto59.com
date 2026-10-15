import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SD = K.P.tax.standardDeduction;
const ZERO = K.P.tax.capitalGains.zeroMax;
const CAP = K.P.aca.cap;
// Same assumptions as the calculator: single filer, 4 %, 60 % pre-tax, 20 % taxable (40 % of each sale is gain), 20 % Roth.
const q = (spend: number) => K.quick({ spend, swr: 0.04, status: 'single', pretaxShare: 0.6, taxableShare: 0.2 });
const magi = (spend: number) => { const x = q(spend); return x.gross * 0.6 + x.gross * 0.2 * 0.4; };
const lean = q(40000), mid = q(70000), fat = q(130000);
const leanMagi = magi(40000), fatMagi = magi(130000);
const leanPtc = K.ptc({ year: '2026', size: 1, magi: leanMagi, benchmarkMonthly: 0 });
const cap1 = K.fpl('2026', 1) * CAP;
const budgets = [30000, 40000, 55000, 70000, 100000, 130000, 180000];

export default defineGuide({
  id: 'lean-fire-vs-fat-fire',
  group: 'fire',
  order: 4,
  slug: 'lean-fire-vs-fat-fire',
  nav: 'Lean vs fat FIRE',
  card: 'Lean, comfortable and fat budgets side by side, with the tax each one really pays',
  title: 'Lean FIRE vs Fat FIRE 2026: Tax Grows Faster Than Spending',
  description: `Lean FIRE vs fat FIRE in 2026: tripling a budget more than triples the target, as tax climbs the brackets. ${K.usd(40000)} needs ${K.usd(lean.full)}; ${K.usd(130000)} needs ${K.usd(fat.full)}.`,
  h1: 'Lean FIRE vs fat FIRE: why a bigger budget costs more than its size',
  intro: 'Lean FIRE and fat FIRE are labels for a small and a large retirement budget; the 2026 tax brackets make the gap between their targets wider than the gap between the budgets.',
  resume: `Lean FIRE and fat FIRE have no official thresholds: they are conventions of the FIRE community for a frugal budget and a generous one, and each person draws the line where it suits. What the labels hide is that the target does not scale in proportion. For a single filer with 60 % of savings in pre-tax accounts, a lean ${K.usd(40000)} a year needs ${K.usd(lean.full)} at a 4 % withdrawal rate, of which only ${K.usd(lean.tax)} is for federal tax. A fat ${K.usd(130000)} needs ${K.usd(fat.full)}, and ${K.usd(fat.tax)} of it pays tax, because larger withdrawals climb from the 10 % and 12 % brackets into the 22 % and 24 % ones. The budget is 3.25 times larger; the tax part is ${K.dec(fat.tax / lean.tax, 0)} times larger. Lean FIRE has a second advantage before Medicare: a low income qualifies for a large premium tax credit on the Marketplace, while a fat budget usually sits above the ${K.pct(CAP, 0)} line where no credit is paid in 2026.`,
  body: (h) => `
<h2>Labels, not rules</h2>
<p>No agency defines lean FIRE or fat FIRE. Forums use the words loosely: lean for a budget near the minimum that still feels livable, fat for one that keeps travel, a larger home and a cushion. Some people pick a fixed dollar line, others a multiple of a typical household budget, and the lines drift with prices and location. This page does not set any threshold either. It takes three example budgets, ${K.usd(40000)}, ${K.usd(70000)} and ${K.usd(130000)} a year, and asks what each one costs once federal tax is counted. Change them in the calculator to your own.</p>
<h2>The tax part rises faster than the budget</h2>
<p>The 25× rule treats a dollar of spending the same at every level. Tax does not. A single filer's first ${K.usd(SD.single)} of ordinary income in 2026 is covered by the standard deduction, the next slices are taxed at 10 % and 12 %, and only above that do the 22 % and 24 % brackets start. Long-term gains get a 0 % rate while taxable income stays under ${K.usd(ZERO.single)}. A small withdrawal fits almost entirely in the cheap layers; a large one spills into the expensive ones.</p>
${h.table(['Yearly budget', 'Federal tax a year', 'Tax as share of budget', 'FIRE number with tax'],
  budgets.map((b) => { const x = q(b); return [K.usd(b), K.usd(x.taxYear), K.pct(x.taxYear / b, 1), K.usd(x.full)]; }),
  'Single filer, 4 % withdrawal rate, 60 % pre-tax, 20 % taxable, 20 % Roth. 2026 brackets and standard deduction, Rev. Proc. 2025-32. Health costs not included.', ['l', 'r', 'r', 'r'])}
<p>Read the third column from top to bottom. At ${K.usd(30000)} the tax barely registers; at ${K.usd(180000)} it takes a double-digit share of the budget. That is the progressive system doing what it is built to do, and it means the jump from comfortable to fat FIRE costs more than the extra spending alone suggests. A couple filing jointly has twice the deduction and wider brackets, so the same budgets cost less tax for them; the status field in the calculator shows by how much.</p>
${h.mini('tiers', { t: 'Your three budgets, filed jointly', p: ['mid', 'fat'], d: { lean: 36000, mid: 64000, fat: 110000, st: 'joint' } })}
<p>The middle budget shows where the curve bends. At ${K.usd(70000)} a year the tax part is ${K.usd(mid.tax)}, already more than three times the lean figure for less than twice the spending. Most of the difference comes from the slice of pre-tax withdrawals that now lands in the 22 % bracket rather than the 12 % one. Holding more of the savings in Roth or taxable accounts flattens the curve, which is one reason people aiming for a large budget often care more about Roth conversions than lean savers do.</p>
<h2>Lean FIRE and the premium tax credit</h2>
<p>Before 65, health coverage usually comes from the Marketplace, and the premium tax credit is set by income. A lean budget produces a low modified adjusted gross income (MAGI): in the mix above, withdrawing for ${K.usd(40000)} of spending generates about ${K.usd(leanMagi)} of MAGI, since only the pre-tax withdrawals and the realized gains count. That is ${K.pct(leanPtc.ratio, 0)} of the 2026 poverty line for one person, where the expected contribution toward the benchmark silver plan is ${K.pct(leanPtc.pct ?? 0, 2)} of income, or ${K.usd(leanPtc.expected)} a year. The credit pays the rest of the benchmark premium.</p>
<p>The fat budget lands elsewhere. Withdrawing for ${K.usd(130000)} produces roughly ${K.usd(fatMagi)} of MAGI, above the ${K.usd(cap1)} line (${K.pct(CAP, 0)} of the poverty line for one person). For 2026 coverage there is no credit above that line, so the full premium is part of the budget. The gap between lean and fat FIRE is therefore wider than the tax table shows: one plan pays a capped share of its income for coverage, the other pays the list price. The ${h.a('aca-subsidy-cliff', 'subsidy cliff page')} shows what crossing the line costs in dollars.</p>
${h.mini('cliff', { t: 'A lean single budget against the 400 % line', p: ['magi'], d: { hh: 1, magi: 34000, b: 750 } })}
<h2>Where each budget meets the 59½ question</h2>
<p>A lean plan reaches its number sooner for the same saving effort, which makes the years before 59½ longer. More of the money must come from accounts that open early: a taxable brokerage account, Roth IRA contributions, or pre-tax money reached through the ${h.a('rule-of-55', 'rule of 55')}, a ${h.a('72t-calculator', '72(t) series')} or a ${h.a('roth-conversion-ladder', 'conversion ladder')}. Low income helps here too: a conversion ladder fills the 10 % and 12 % brackets at little cost when there is no salary on top.</p>
<p>A fat plan tends to arrive later and with larger pre-tax balances, so the bridge is shorter but each withdrawal is taxed at a higher rate. Converting pre-tax money to Roth in the first low-income years after work stops can spread that tax out, at the price of a larger MAGI in those years and so a smaller premium credit. The ${h.a('fire-number-calculator', 'FIRE number calculator')} adds health premiums to the target, which the tier comparison above leaves aside.</p>
`,
  faqs: [
    { q: 'What is the lean FIRE number for $40,000 a year?', a: `At a 4 % withdrawal rate, ${K.usd(40000)} gives ${K.usd(K.fireNumber(40000, 0.04))} before tax. With 60 % of savings in pre-tax accounts, a single filer in 2026 adds about ${K.usd(lean.tax)} for federal tax, for ${K.usd(lean.full)} in all. Health premiums before 65 come on top; the FIRE number calculator includes them.` },
    { q: 'Is there an official dollar amount that defines fat FIRE?', a: `No. Fat FIRE is a community label for a generous budget, not a term defined by the IRS or any agency. This page uses ${K.usd(130000)} a year as an example. For a single filer with a typical account mix, that budget needs ${K.usd(fat.full)} once 2026 federal tax is counted, before health premiums.` },
    { q: 'Why does fat FIRE pay more tax per dollar than lean FIRE?', a: `Federal tax is progressive. A small withdrawal fits under the ${K.usd(SD.single)} standard deduction and the 10 % and 12 % brackets; a large one reaches the 22 % and 24 % brackets. In this page's mix, tax is ${K.pct(lean.taxYear / 40000, 1)} of a ${K.usd(40000)} budget and ${K.pct(fat.taxYear / 130000, 1)} of a ${K.usd(130000)} one.` },
    { q: 'Does lean FIRE qualify for ACA subsidies?', a: `Often, because the premium tax credit depends on income, not wealth. A single person whose withdrawals produce about ${K.usd(leanMagi)} of MAGI is at ${K.pct(leanPtc.ratio, 0)} of the poverty line and is expected to pay ${K.usd(leanPtc.expected)} a year toward the benchmark plan in 2026. Above ${K.usd(cap1)} there is no credit.` },
    { q: 'How much of a comfortable FIRE number goes to tax?', a: `With the same mix, ${K.usd(70000)} a year needs ${K.usd(mid.full)}, of which ${K.usd(mid.tax)} covers federal tax, about ${K.pct(mid.tax / mid.full, 0)} of the target. For the lean ${K.usd(40000)} budget the tax part is ${K.pct(lean.tax / lean.full, 0)} of the number; for the fat ${K.usd(130000)} budget it reaches ${K.pct(fat.tax / fat.full, 0)}.` },
  ],
  tool: 'tiers',
  related: ['fire-number-calculator', 'health-insurance-before-medicare', 'aca-subsidy-cliff', 'zero-percent-capital-gains', 'how-much-do-i-need-to-retire'],
  sources: ['rp_2025_32', 'rp_2025_25', 'hc_fpl'],
});
