import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const A = K.P.aca;
const cobraPct = K.pct(A.cobraMaxPremium, 0);
const DOL_FAQ = 'https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/cobra-continuation-health-coverage-workers';
const HC_COBRA = 'https://www.healthcare.gov/unemployed/cobra-coverage/';
// Case 1: work plan costing $1,900 a month in full; Marketplace plan at $600 after the credit; 18 months.
const c1 = K.tool('cobra', { full: 1900, m: A.cobraMonths, aca: 600 });
const perMonth = 1900 * A.cobraMaxPremium;
// Case 2: income above the 400 % line, the Marketplace plan costs its full $2,100; 6 months.
const c2 = K.tool('cobra', { full: 1900, m: 6, aca: 2100 });
// Case 3: couple at $70,000 of MAGI in 2026, benchmark $1,750: what the credit leaves to pay.
const p3 = K.ptc({ year: '2026', size: 2, magi: 70000, benchmarkMonthly: 1750 });
const months = [3, 6, 12, A.cobraMonths].map((m) => { const r = K.tool('cobra', { full: 1900, m, aca: 600 }); return [String(m), r.rows?.[0]?.[1] ?? '', r.rows?.[1]?.[1] ?? '', `${r.label}: ${r.value}`]; });

export default defineGuide({
  id: 'cobra-vs-marketplace',
  group: 'health',
  order: 42,
  slug: 'cobra-vs-marketplace',
  nav: 'COBRA vs Marketplace',
  card: 'Keep the work plan at full cost, or switch to a credited Marketplace plan',
  title: 'COBRA vs Marketplace 2026: Full Cost or the ACA Credit',
  description: `COBRA vs Marketplace in 2026: COBRA keeps your work plan, usually up to ${A.cobraMonths} months, at up to ${cobraPct} of its cost; a Marketplace plan costs what the credit leaves.`,
  h1: 'COBRA or a Marketplace plan after you leave your job',
  intro: `Leaving a job with health coverage opens two doors: keep the same plan through COBRA at its full price, or move to a Marketplace plan whose price depends on your income.`,
  resume: `COBRA lets you keep your employer's health plan after you leave, usually for up to ${A.cobraMonths} months, but you generally pay the whole premium, employer share included, and the plan may charge up to ${cobraPct} of its cost. A Marketplace plan bought on HealthCare.gov costs its premium minus the premium tax credit, which depends on your income for the year. For an early retiree with modest income the Marketplace usually wins by a wide margin: a work plan costing ${K.usd(1900)} a month in full becomes ${K.usd(perMonth)} under COBRA, ${c1.rows?.[0]?.[1]} over ${A.cobraMonths} months, against ${c1.rows?.[1]?.[1]} for a Marketplace plan at ${K.usd(600)} after the credit. COBRA wins when income is above the 400 % line, when the gap is short, or when the deductible is already met. Losing job coverage opens a 60-day window for the Marketplace; dropping COBRA early does not. The calculator above compares your two prices.`,
  body: (h) => `
<h2>What COBRA gives you, in the Labor Department's words</h2>
<p>The U.S. Department of Labor describes COBRA as temporary coverage for you and your dependents, "usually up to 18 months", which certain life events can extend to 36 months (${h.src('dol_cobra', 'Department of Labor, COBRA')}). You have 60 days to enroll, counted from the later of the day your job-based coverage ends and the day you receive the election notice. You usually pay the full premium, unless your employer agrees to cover some or all of it as part of your separation.</p>
<p>The DOL questions and answers for workers add who is covered and what the plan may charge: a private-sector employer or employee organization with 20 or more employees, as well as state and local governments, and a premium of up to ${cobraPct} of the cost of the plan (${h.ext(DOL_FAQ, 'DOL, COBRA FAQs for workers')}). The ceiling sits above the full cost of coverage, which is why the employee and employer shares together, not your old payroll deduction, are the right base for a comparison.</p>
<h2>What the Marketplace gives you</h2>
<p>A Marketplace plan has no time limit and its price depends on the premium tax credit, which is set by your modified adjusted gross income (MAGI) for the coverage year. A couple with ${K.usd(70000)} of MAGI in 2026 is at ${K.pct(p3.ratio, 0)} of the poverty line and is expected to pay ${K.pct(p3.pct ?? 0, 2)} of income for the benchmark silver plan: ${K.usd(p3.expected / 12)} a month whatever that plan's list price, if the benchmark were ${K.usd(1750)}. The ${h.a('health-insurance-before-medicare', 'health coverage page')} explains the computation for 2026 and 2027.</p>
<h2>The same 18 months, priced both ways</h2>
<p>Take a work plan whose total cost, your share plus the employer's, is ${K.usd(1900)} a month. Under COBRA at ${cobraPct} that becomes ${K.usd(perMonth)}. Against a Marketplace plan costing ${K.usd(600)} after the credit, the difference grows with every month:</p>
${h.table(['Months', 'COBRA', 'Marketplace after credit', 'Result'], months, `Full cost of the work plan ${K.usd(1900)} a month, COBRA at ${cobraPct}; Marketplace plan at ${K.usd(600)} a month after the credit. Example figures, not averages.`, ['r', 'r', 'r', 'l'])}
${h.mini('cobra', { t: 'Your work plan against your Marketplace price', p: ['full', 'aca'], d: { full: 1600, m: 12, aca: 450 } })}
<p>The full cost of your plan is on your pay stub or benefits statement as the employer contribution plus your deduction; the COBRA election notice states the exact monthly premium. The Marketplace price after credit comes from HealthCare.gov once you enter your expected income.</p>
<h2>When COBRA comes out ahead</h2>
<p>COBRA is not always the expensive choice. Four situations favor it.</p>
<p><strong>Income above the 400 % line.</strong> Without a credit, a Marketplace plan costs its full premium, which for an older household can be higher than the work plan. With a Marketplace plan at ${K.usd(2100)} a month and the same work plan, six months of COBRA cost ${c2.rows?.[0]?.[1]} against ${c2.rows?.[1]?.[1]}, so COBRA comes out ${c2.value} cheaper. The year you leave work often has a full salary for part of it, which is exactly when MAGI lands above the line; the ${h.a('aca-subsidy-cliff', 'subsidy cliff page')} gives the line for each household size.</p>
<p><strong>A deductible already met.</strong> Staying on the same plan keeps the year's deductible and out-of-pocket progress. A new Marketplace plan starts its own count.</p>
<p><strong>A short gap.</strong> Someone between jobs for a few months, or a few months from Medicare at ${A.medicareAge}, may value the same doctors and drug list more than the saving.</p>
<p><strong>An employer subsidy.</strong> The DOL notes that an employer may agree to pay some or all of the COBRA premium as part of a separation. That changes the comparison entirely, so ask before signing a separation agreement.</p>
<h2>Switching later: the rules that close the door</h2>
<p>The order of moves matters. HealthCare.gov sets out the rules (${h.ext(HC_COBRA, 'HealthCare.gov, COBRA coverage')}). Losing job-based coverage gives a Special Enrollment Period of 60 days to pick a Marketplace plan. When COBRA runs out, another 60-day window opens. During Open Enrollment, November 1 to January 15, you can move from COBRA to the Marketplace for any reason. Outside those windows, voluntarily dropping COBRA does not count as losing coverage: you would wait for the next Open Enrollment. The same page lists one more exception: if your former employer stops contributing and you must pay the full COBRA cost, you can switch.</p>
<p>In practice this gives a simple sequence for an early retiree. Within 60 days of losing work coverage, compare both prices with a realistic estimate of the year's MAGI. If COBRA is chosen for a short period, plan the switch for Open Enrollment or for the end of COBRA, not for a month in between.</p>
${h.mini('aca', { t: 'The Marketplace price at your income', p: ['magi'], d: { y: '2027', hh: 2, magi: 70000, b: 1750 } })}
`,
  faqs: [
    { q: 'How long does COBRA last after I retire early?', a: `Usually up to ${A.cobraMonths} months for a job loss or a reduction in hours, according to the Department of Labor; certain life events can extend it to 36 months. You have 60 days to elect it, counted from the later of the end of your job-based coverage and the election notice.` },
    { q: 'How much more does COBRA cost than my payroll deduction?', a: `COBRA can charge the whole premium, your share and the employer's, and the plan may go up to ${cobraPct} of the plan's cost. A plan costing ${K.usd(1900)} a month in total becomes ${K.usd(perMonth)} a month, however small your payroll deduction was.` },
    { q: 'Can I drop COBRA and switch to a Marketplace plan in the middle of the year?', a: 'Only in certain cases. Voluntarily ending COBRA outside Open Enrollment does not open a Special Enrollment Period, so you would wait until November 1. You can switch within 60 days of losing job coverage, when COBRA runs out, or if your former employer stops contributing.' },
    { q: 'When is COBRA cheaper than the Marketplace for an early retiree?', a: 'When your MAGI for the year is above 400 % of the poverty line, so that no premium credit applies and the Marketplace plan costs its full price; when your employer pays part of COBRA as part of the separation; or when only a few months are needed and the deductible is already met.' },
    { q: 'Does COBRA vs Marketplace change if I leave work in the middle of 2026?', a: `Yes, because the premium credit uses the MAGI of the whole year. Months of salary before you left count, and can push a couple above ${K.usd(K.fpl('2026', 2) * A.cap)}, the 2026 line for two. The following year, with no salary, the Marketplace credit often becomes much larger.` },
  ],
  tool: 'cobra',
  toolArg: { full: 1900, aca: 600 },
  related: ['health-insurance-before-medicare', 'aca-subsidy-cliff', 'early-retirement-bridge', 'retire-at-55'],
  sources: ['dol_cobra', 'hc_lower', 'hc_fpl', 'rp_2025_25'],
});
