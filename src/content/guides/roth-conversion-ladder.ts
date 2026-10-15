import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const T = K.P.tax;
const pen = K.pct(E.penalty, 0);
// Worked ladder: married couple, first conversion at 46 in 2026, $36,000 a year for five years, $50,000 of spending.
const L = K.ladder({ startYear: 2026, amount: 36000, years: 5, otherIncome: 0, status: 'joint', spend: 50000, startAge: 46 });
const gap5 = L.slice(0, 5).reduce((x, r) => x + r.gap, 0);
const taxAll = L.reduce((x, r) => x + r.tax, 0);
// Bracket filling: top of the 12 % bracket in ordinary income (deduction + bracket edge).
const top12 = (s: 'single' | 'joint') => T.standardDeduction[s] + T.brackets[s][2][0];
const fill = (s: 'single' | 'joint') => (s === 'single' ? [T.standardDeduction[s], 30000, 50000, top12(s), 100000] : [T.standardDeduction[s], 60000, 100000, top12(s), 160000]).sort((x, y) => x - y).map((x) => [K.usd(x), K.usd(K.extraTax(0, x, s)), K.pct(K.extraTax(0, x, s) / x, 1)]);
// ACA: a couple converting $36,000 with no other income, 2026 poverty line for two.
const fpl2 = K.fpl('2026', 2);
const p36 = K.ptc({ year: '2026', size: 2, magi: 36000, benchmarkMonthly: 1500 });
const capTwo = fpl2 * K.P.aca.cap;

export default defineGuide({
  id: 'roth-conversion-ladder',
  group: 'access',
  order: 31,
  slug: 'roth-conversion-ladder',
  nav: 'Roth conversion ladder',
  card: 'One conversion a year, each free five tax years later',
  title: 'Roth Conversion Ladder 2026: Five-Year Rungs and Tax Cost',
  description: `Roth conversion ladder for 2026: each rung is free of the ${pen} five tax years after January 1 of its year, and ${K.usd(T.standardDeduction.joint)} per couple converts at zero tax.`,
  h1: 'Roth conversion ladder: five-year rungs, the tax on each, the gap to fund',
  intro: `Convert part of a traditional IRA to a Roth IRA each year, wait five tax years, and that converted amount comes out with no tax and no ${pen}, years before 59½.`,
  resume: `A Roth conversion ladder moves money from a traditional IRA or old 401(k) into a Roth IRA one slice a year. Each slice is taxed as income in the year you convert, and Publication 590-B gives every conversion its own five-year period starting on January 1 of that year: a conversion made in December 2026 counts from January 1, 2026, and can be withdrawn without the ${pen} additional tax from January 1, 2031. Converted in early retirement, the slices fill the low brackets: a married couple with no other income pays nothing on the first ${K.usd(T.standardDeduction.joint)} thanks to the 2026 standard deduction, and ${K.usd(K.extraTax(0, 36000, 'joint'))} on a ${K.usd(36000)} conversion. The catch is the wait. The first five years of spending must come from other money, ${K.usd(gap5)} for a couple living on ${K.usd(50000)}. Conversions also raise the income that sets the Marketplace premium credit. The calculator above lays out each rung.`,
  body: (h) => `
<h2>The five-year clock, read from Publication 590-B</h2>
<p>The ladder rests on one passage of the Roth chapter (${h.src('pub590b', 'Publication 590-B, chapter 2')}). If you take money from a Roth IRA within the five-year period "starting with the first day of your tax year in which you convert", you may owe the ${pen} additional tax on the part of the conversion you had to include in income. A separate period runs for each conversion. The IRS example converts on February 25, 2025, and the period starts on January 1, 2025.</p>
<p>Two practical results follow. A conversion late in the year buys almost a full year of the clock for free: December 2026 and January 2026 open on the same date, January 1, 2031. And the period for conversions is not the one that makes a distribution qualified, which runs from your first Roth contribution and also needs age 59½. A rung that has passed its five years leaves without the ${pen} but still follows the ordering rules, after your regular contributions. The ${h.a('roth-ira-withdrawal-rules', 'Roth withdrawal rules page')} shows that order on an example.</p>
<h2>A five-rung ladder for a couple who stop at 46</h2>
<p>A married couple stops working in 2026 at 46 and converts ${K.usd(36000)} each year for five years, with no other taxable income. Each conversion costs ${K.usd(L[0].tax)} of federal tax: the first ${K.usd(T.standardDeduction.joint)} is covered by the standard deduction and the rest falls in the 10 % bracket. Over five years that is ${K.usd(taxAll)}. From 2031 each rung pays ${K.usd(36000)} a year, short of their ${K.usd(50000)} budget by ${K.usd(L[5].gap)}.</p>
${h.table(['Year', 'Age', 'Converted', 'Federal tax', 'Spendable from the ladder'], L.map((r) => [String(r.year), String(r.age), K.usd(r.converted), K.usd(r.tax), K.usd(r.available)]), 'Joint filers, no other income, 2026 brackets and deduction kept for every year (Rev. Proc. 2025-32). Conversion amounts only; growth inside the Roth is ignored.', ['l', 'r', 'r', 'r', 'r'])}
<p>The five empty years at the top of the table are the hard part. ${K.usd(gap5)} of spending has to come from somewhere other than the ladder: a taxable brokerage account, Roth contributions already in the account, a governmental 457(b), or a 401(k) left in the year you turned ${E.ruleOf55Age}. Without such a reserve the ladder cannot start at 46. Building the ladder while still employed is possible, though the conversions then stack on a salary and cost far more per dollar.</p>
${h.mini('ladder', { t: 'Size your own rungs', p: ['amt', 'k'], d: { age: 46, sp: 50000, oi: 0, st: 'joint' } })}
<h2>How much to convert each year: filling the low brackets</h2>
<p>The tax cost of a conversion depends on what else is on the return. With no salary, the first slice is free up to the standard deduction (${K.usd(T.standardDeduction.single)} single, ${K.usd(T.standardDeduction.joint)} joint in 2026), then taxed at 10 % and 12 %. The 12 % bracket ends at ${K.usd(T.brackets.single[2][0])} of taxable income for a single filer and ${K.usd(T.brackets.joint[2][0])} for a couple, so the ordinary income that still fits under 22 % is ${K.usd(top12('single'))} and ${K.usd(top12('joint'))}.</p>
${h.table(['Converted (single)', 'Federal tax', 'Average rate'], fill('single'), 'Single filer, no other income, 2026.', ['r', 'r', 'r'])}
${h.table(['Converted (joint)', 'Federal tax', 'Average rate'], fill('joint'), 'Married filing jointly, no other income, 2026.', ['r', 'r', 'r'])}
<p>Converting up to the top of the 12 % band costs ${K.usd(K.extraTax(0, top12('joint'), 'joint'))} for a couple, an average of ${K.pct(K.extraTax(0, top12('joint'), 'joint') / top12('joint'), 1)}. Whether that beats waiting depends on the bracket you expect later, a guess this page does not make for you. Long-term gains sold in the same year sit on top of the conversion, so a larger conversion can push gains out of the 0 % band; the ${h.a('zero-percent-capital-gains', '0 % capital gains page')} shows the interplay.</p>
<h2>Conversions and the Marketplace premium credit</h2>
<p>A conversion is income on your return, so it enters the modified adjusted gross income (MAGI) that sets the premium tax credit for coverage bought on HealthCare.gov. For a household of two in 2026, the poverty line used is ${K.usd(fpl2)} and the credit stops above ${K.usd(capTwo)}, which is 400 % of it. At ${K.usd(36000)} of MAGI the couple sits at ${K.pct(p36.ratio, 0)} of the poverty line and is expected to pay ${K.pct(p36.pct ?? 0, 2)} of income toward the benchmark plan, ${K.usd(p36.expected / 12)} a month.</p>
${h.mini('aca', { t: 'What a conversion does to your premium', p: ['magi'], d: { y: '2026', hh: 2, magi: 36000, b: 1500 } })}
<p>The line works in both directions. Converting too much past ${K.usd(capTwo)} wipes out the whole credit; converting too little can leave income under the poverty line, where HealthCare.gov says you will probably not qualify for Marketplace savings and may qualify for Medicaid instead (${h.src('hc_fpl', 'HealthCare.gov')}). A rung sized inside that window first, and checked against the brackets second, keeps both the credit and the low tax. The ${h.a('aca-subsidy-cliff', 'subsidy cliff page')} gives the line for every household size.</p>
<h2>What can break the plan</h2>
<p>Withdrawing a rung before its January 1 brings back the ${pen} on the taxable part, in the year you take it, even though the income tax was paid at conversion. After 59½ the clock no longer matters for the additional tax. And the conversion figures above are fixed dollars: if the market falls, the rung you can draw is the amount converted, while any loss sits on the earnings layer that waits for 59½ anyway.</p>
`,
  faqs: [
    { q: 'When can I spend a Roth conversion made in December 2026?', a: `From January 1, 2031. Publication 590-B starts the five-year period of each conversion on the first day of the tax year in which you convert, so a December 2026 conversion counts from January 1, 2026. Before that date the taxable part owes the ${pen} additional tax if you are under 59½.` },
    { q: 'How much tax does a $36,000 Roth conversion cost a retired couple in 2026?', a: `${K.usd(K.extraTax(0, 36000, 'joint'))} of federal tax with no other income. The first ${K.usd(T.standardDeduction.joint)} is covered by the 2026 standard deduction for joint filers and the remaining ${K.usd(36000 - T.standardDeduction.joint)} falls in the 10 % bracket. State income tax, if your state taxes conversions, comes on top.` },
    { q: 'Does each rung of a Roth conversion ladder have its own five years?', a: `Yes. The IRS applies a separate five-year period to each conversion, starting January 1 of its year. A 2026 rung opens in 2031, a 2027 rung in 2032. Taking more than the open rungs before 59½ reaches newer conversions and costs the ${pen} on their taxable part.` },
    { q: 'Do Roth conversions reduce my ACA premium credit?', a: `They can. A conversion adds to the MAGI that sets the credit. For two people in 2026 the credit ends above ${K.usd(capTwo)} of MAGI, 400 % of the ${K.usd(fpl2)} poverty line. Below that line each extra dollar raises your expected share of the benchmark premium.` },
    { q: 'What pays the bills during the first five years of a conversion ladder?', a: `Money outside the ladder: taxable savings, Roth contributions you already made, a governmental 457(b) or a 401(k) left in the year you turned ${E.ruleOf55Age}. For a couple spending ${K.usd(50000)} a year, those five years cost ${K.usd(gap5)} before the first rung opens.` },
  ],
  tool: 'ladder',
  toolArg: { age: 46, amt: 36000, sp: 50000, st: 'joint', k: 5 },
  related: ['roth-ira-withdrawal-rules', 'early-retirement-bridge', 'aca-subsidy-cliff', 'zero-percent-capital-gains', '72t-calculator'],
  sources: ['pub590b', 'roth_iras', 'rp_2025_32', 'hc_fpl', 'rp_2025_25'],
});
