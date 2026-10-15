import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const A = K.P.aca;
const capPct = K.pct(A.cap, 0);
const band = (y: '2026' | '2027') => (A.applicable[y] as number[][]);
const bandLabel = (lo: number, hi: number) => (lo === 0 ? `up to ${K.pct(hi, 0)}` : `${K.pct(lo, 0)} to ${K.pct(hi, 0)}`);
const pctRange = (a: number, b: number) => (a === b ? K.pct(a, 2) : `${K.pct(a, 2)} to ${K.pct(b, 2)}`);
const bands = band('2026').map((r, i) => { const s = band('2027')[i]; return [bandLabel(r[0], r[1]), pctRange(r[2], r[3]), pctRange(s[2], s[3])]; });
// Expected yearly contribution toward the benchmark plan, couple, at several MAGI levels (independent of the premium).
const share = (y: '2026' | '2027', magi: number) => K.ptc({ year: y, size: 2, magi, benchmarkMonthly: 1 });
const levels = [30000, 45000, 60000, 75000, K.fpl('2026', 2) * A.cap];
const exp = levels.map((m) => { const a = share('2026', m), b = share('2027', m); return [K.usd(m), K.pct(a.ratio, 0), a.pct === null ? 'none' : K.usd(a.expected / 12), b.pct === null ? 'none' : K.usd(b.expected / 12)]; });
// A single person of 58 expecting $40,000 of MAGI in 2027.
const s27 = K.ptc({ year: '2027', size: 1, magi: 40000, benchmarkMonthly: 1 });
const one26 = K.fpl('2026', 1), one27 = K.fpl('2027', 1), two26 = K.fpl('2026', 2), two27 = K.fpl('2027', 2);

export default defineGuide({
  id: 'health-insurance-before-medicare',
  group: 'health',
  order: 40,
  slug: 'health-insurance-before-medicare',
  nav: 'Health insurance before Medicare',
  card: 'Marketplace coverage and the premium credit until 65',
  title: 'Health Insurance Before Medicare 2026: ACA Credit to 65',
  description: `Health insurance before Medicare in 2026 and 2027: the ACA premium credit, the share of income you pay (${K.pct(band('2026')[0][2], 2)} to ${K.pct(band('2026')[5][2], 2)} in 2026) and the ${capPct} income limit.`,
  h1: 'Health insurance before Medicare: the premium credit from your last job to 65',
  intro: `Medicare starts at ${A.medicareAge}, so an early retiree buys coverage for every year in between, and the Marketplace premium credit decides most of what it costs.`,
  resume: `Health insurance before Medicare usually means a Marketplace plan bought on HealthCare.gov, because Medicare only starts at ${A.medicareAge} and employer coverage ends with the job. The premium tax credit caps what you pay for the benchmark silver plan at a share of your modified adjusted gross income (MAGI): from ${K.pct(band('2026')[0][2], 2)} at the lowest incomes to ${K.pct(band('2026')[5][2], 2)} between 300 % and 400 % of the poverty line in 2026 (Rev. Proc. 2025-25), and from ${K.pct(band('2027')[0][2], 2)} to ${K.pct(band('2027')[5][2], 2)} in 2027 (Rev. Proc. 2026-26). Coverage for 2026 uses the 2025 poverty guidelines, ${K.usd(one26)} for one person and ${K.usd(two26)} for two; 2027 coverage uses ${K.usd(one27)} and ${K.usd(two27)}. Above ${capPct} of the line there is no credit at all. The benchmark premium depends on age and county, so read it on HealthCare.gov. The calculator above gives your monthly cost.`,
  body: (h) => `
<h2>Why the bridge to ${A.medicareAge} is longer than the bridge to 59½</h2>
<p>Medicare eligibility at ${A.medicareAge} is set by law, and coverage starts on a date that depends on when you sign up (${h.src('medicare_start', 'Medicare.gov')}). Someone who stops at 50 has nine and a half years to cover before every retirement account opens, but fifteen years before Medicare. Health coverage is often the largest single line in an early retirement budget, and it moves with income in a way that rent and groceries do not.</p>
<p>The common route is the Marketplace. Employer coverage can be continued through COBRA for a limited time at full cost; the ${h.a('cobra-vs-marketplace', 'COBRA comparison')} prices that option. After it, or instead of it, Marketplace coverage with the premium tax credit is what most early retirees buy.</p>
<h2>How the premium tax credit is computed</h2>
<p>Three numbers decide the credit. Your MAGI, the income figure for the coverage year that starts from adjusted gross income. The poverty line for your household size, which HealthCare.gov takes from the guidelines of the previous year (${h.src('hc_fpl', 'HealthCare.gov poverty level page')}). And the premium of the benchmark plan, the second-lowest-cost silver plan where you live. Your MAGI divided by the poverty line gives a percentage; that percentage gives the share of income you are expected to pay; the credit is the benchmark premium minus that share.</p>
${h.table(['MAGI as % of poverty line', '2026 share of income', '2027 share of income'], bands, 'Applicable percentages: Rev. Proc. 2025-25 (2026) and Rev. Proc. 2026-26 (2027). Inside a band the share rises in a straight line. No credit above 400 %.', ['l', 'r', 'r'])}
<p>The share does not depend on the premium. A couple at the same MAGI pays the same amount for the benchmark plan in a cheap county or an expensive one; the credit absorbs the difference. That is why the table below can be computed without any premium at all.</p>
${h.table(['Couple, MAGI', '% of poverty line (2026)', 'Benchmark cost per month, 2026', 'Same, 2027'], exp, `Household of two. 2026 uses the ${K.usd(two26)} line, 2027 the ${K.usd(two27)} line. "none": above 400 %, no credit, you pay the full premium.`, ['r', 'r', 'r', 'r'])}
<p>A plan cheaper than the benchmark costs you less than the figure in the table, a richer plan more. If the credit is larger than the premium of the plan you choose, the plan costs nothing and the unused part is lost.</p>
${h.mini('aca', { t: 'Your monthly premium after the credit', p: ['magi', 'b'], d: { y: '2027', hh: 1, magi: 40000, b: 900 } })}
<h2>2026 against 2027: what changes, and when to look</h2>
<p>Both years keep the ${capPct} ceiling: the tables published for 2026 and 2027 stop there. The shares move up slightly in 2027, so a single person at ${K.usd(40000)} of MAGI, ${K.pct(s27.ratio, 0)} of the 2027 line, is expected to pay ${K.pct(s27.pct ?? 0, 2)} of income, ${K.usd(s27.expected / 12)} a month, toward the benchmark plan. The poverty line rises too, which lowers your percentage for the same income.</p>
<p>The dates matter this autumn. HealthCare.gov states that before November 1 you can estimate 2027 savings using 2026 amounts, and that savings are "based on your income estimate for the year you want coverage, not last year" (${h.src('hc_lower', 'HealthCare.gov, lower costs')}). Open Enrollment runs from November 1 to January 15 (${h.ext('https://www.healthcare.gov/unemployed/cobra-coverage/', 'HealthCare.gov, COBRA and the Marketplace')}). The 2027 benchmark premium for your county is therefore something to read on HealthCare.gov from November 1, not a figure to guess from an average. This page publishes no average premium for that reason.</p>
<h2>The income you report is the income you choose</h2>
<p>For an early retiree, MAGI is mostly a decision. A sale from a brokerage account adds only its gain. A withdrawal of Roth IRA contributions adds nothing. A Roth conversion, a 401(k) payment or a 457(b) payment adds every dollar. Two retirees spending the same ${K.usd(60000)} can show very different MAGI depending on where the money comes from, and pay very different premiums.</p>
<p>The floor matters as well as the ceiling. Below 100 % of the poverty line, HealthCare.gov says you probably will not qualify for Marketplace savings but may qualify for Medicaid; in states that expanded Medicaid, the limit is ${K.pct(A.medicaidExpansion, 0)} of the line. An early retiree living on Roth contributions and cash can land there by accident. A small conversion or a taxable sale can lift MAGI back into the credit range, which is often cheaper than it looks.</p>
<h2>Planning the years until ${A.medicareAge}</h2>
<p>Treat the premium as a yearly line in the bridge budget, with the expected share of income from the table above plus any difference between your plan and the benchmark. Each autumn, estimate the coming year's MAGI before choosing how much to convert or sell, and update the estimate on HealthCare.gov when it changes during the year. The ${h.a('aca-subsidy-cliff', '400 % cliff page')} shows what one dollar too many costs, and the ${h.a('early-retirement-bridge', 'bridge page')} folds the premium into the money needed before 59½.</p>
`,
  faqs: [
    { q: 'How much does health insurance before Medicare cost a couple with $60,000 of income in 2026?', a: `For the benchmark silver plan, about ${K.usd(share('2026', 60000).expected / 12)} a month after the premium tax credit. At ${K.usd(60000)} of MAGI a couple is at ${K.pct(share('2026', 60000).ratio, 0)} of the ${K.usd(two26)} poverty line and is expected to pay ${K.pct(share('2026', 60000).pct ?? 0, 2)} of income. A cheaper plan costs less.` },
    { q: 'Which poverty line applies to Marketplace coverage in 2027?', a: `The 2026 guidelines: ${K.usd(one27)} for one person and ${K.usd(two27)} for two, plus ${K.usd(A.fpl['2027'].extra)} per extra person. HealthCare.gov uses the previous year's guidelines for Marketplace savings, so 2026 coverage is based on ${K.usd(one26)} and ${K.usd(two26)}. Multiply by four for the income above which no credit is paid.` },
    { q: 'Is there an ACA premium credit above 400 % of the poverty line before Medicare?', a: `Not in 2026 or 2027. The applicable percentage tables of Rev. Proc. 2025-25 and Rev. Proc. 2026-26 stop at ${capPct}. Above that MAGI, ${K.usd(K.fpl('2026', 2) * A.cap)} for two people in 2026, you pay the full premium of the plan you pick, however old you are and however expensive your county.` },
    { q: 'When can I see 2027 Marketplace premiums for coverage before Medicare?', a: 'From November 1, 2026, when Open Enrollment for 2027 coverage starts; it runs to January 15. Until then HealthCare.gov says you can estimate 2027 savings with 2026 amounts. The benchmark premium depends on your age and county, so read it there for your own household rather than relying on a national average.' },
    { q: 'Does a Roth IRA withdrawal raise my income for the premium credit?', a: `Not when it is a return of your contributions or a qualified distribution, since neither is included in income. A Roth conversion is different: the converted amount is income for the year and raises MAGI dollar for dollar, which can shrink the credit or end it above ${capPct}.` },
  ],
  tool: 'aca',
  related: ['aca-subsidy-cliff', 'cobra-vs-marketplace', 'early-retirement-bridge', 'roth-conversion-ladder', 'retire-at-55'],
  sources: ['hc_fpl', 'hc_lower', 'rp_2025_25', 'rp_2026_26', 'medicare_start'],
});
