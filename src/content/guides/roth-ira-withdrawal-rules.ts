import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
// Worked case: Roth IRA opened in 2012; $30,000 of contributions, conversions of $25,000 (2022) and $20,000 (2024),
// $18,000 of earnings. The owner is 51 in 2026.
const base = { contributions: 30000, conversions: [{ year: 2022, amount: 25000 }, { year: 2024, amount: 20000 }], earnings: 18000, firstRothYear: 2012 };
const big = K.roth({ ...base, amount: 60000, year: 2026, age: 51 });
const small = K.roth({ ...base, amount: 30000, year: 2026, age: 51 });
const wait = K.roth({ ...base, amount: 55000, year: 2027, age: 52 });
const all = K.roth({ ...base, amount: 93000, year: 2026, age: 51 });
const homeCap = K.P.exceptions.find((e) => e.id === 'homebuyer')?.cap ?? 0;
const earnTax = K.extraTax(0, 18000, 'single');
const piecesRow = (r: typeof big) => r.pieces.map((p) => [p.from, K.usd(p.amount), p.taxable ? 'yes' : 'no', p.penalty ? 'yes' : 'no']);

export default defineGuide({
  id: 'roth-ira-withdrawal-rules',
  group: 'access',
  order: 32,
  slug: 'roth-ira-withdrawal-rules',
  nav: 'Roth IRA withdrawal rules',
  card: 'Contributions, then conversions oldest first, then earnings',
  title: 'Roth IRA Withdrawal Rules 2026: Contributions, Conversions',
  description: `Roth IRA withdrawal rules for 2026: contributions come out first at any age, each conversion after five tax years, earnings at 59½. The ${pen} hits the rest.`,
  h1: 'Roth IRA withdrawal rules: when each dollar can come out',
  intro: `Every dollar in a Roth IRA belongs to one of three layers, and the IRS takes them out in a fixed order that decides whether you owe tax or the ${pen}.`,
  resume: `You can withdraw from a Roth IRA at any age, and how much it costs depends on which layer the money comes from. Publication 590-B sets the order: regular contributions first, then conversions and rollovers oldest first (the taxable part of each before the rest), then earnings. Contributions were never deducted, so they come back with no tax and no ${pen}. Each conversion is free of the ${pen} five tax years after January 1 of the year it was made. Earnings are taxable and penalized before 59½ unless the distribution is qualified, which takes both age 59½ and five years since your first Roth contribution. Take someone of 51 with ${K.usd(30000)} of contributions, a 2022 and a 2024 conversion and ${K.usd(18000)} of earnings: ${K.usd(30000)} comes out free in 2026, a ${K.usd(60000)} withdrawal costs ${K.usd(big.penalty)} of additional tax, and the 2022 layer opens in 2027. The calculator above splits any withdrawal.`,
  body: (h) => `
<h2>The ordering rules, layer by layer</h2>
<p>When a Roth IRA payment is not a qualified distribution, the IRS does not let you pick which dollars leave. Publication 590-B fixes the order (${h.src('pub590b', 'Publication 590-B, chapter 2')}): first your regular contributions; then conversion and rollover contributions on a first-in, first-out basis, starting with the earliest year and, within each, the part that was taxed at conversion before any non-taxable part; then earnings. All your Roth IRAs count as one for this purpose: distributions of the year are added together, and so are contributions.</p>
<p>That order is generous to early retirees. The layers that cost nothing come out first, and the earnings layer, the only one that can owe income tax as well, comes out last. Someone who never touches more than the sum of contributions and five-year-old conversions pays neither tax nor additional tax before 59½.</p>
<h2>A withdrawal at 51, split by the engine</h2>
<p>Take a Roth IRA opened in 2012. Over the years the owner contributed ${K.usd(30000)}, converted ${K.usd(25000)} in 2022 and ${K.usd(20000)} in 2024, and the account earned ${K.usd(18000)}. In 2026, at 51, the owner takes ${K.usd(60000)}.</p>
${h.table(['Layer taken', 'Amount', 'Income tax', `${pen} additional tax`], piecesRow(big), `Withdrawal of ${K.usd(60000)} in 2026 at age 51. Engine of this site, ordering rules of Publication 590-B (2025).`, ['l', 'r', 'l', 'l'])}
<p>The first ${K.usd(30000)} is contributions. The next ${K.usd(25000)} is the 2022 conversion, whose five years run from January 1, 2022 to the end of 2026, so it is still inside its period. The last ${K.usd(5000)} reaches the 2024 conversion. Nothing is taxable as income, since conversions were taxed when made, but ${K.usd(big.penalized)} is caught by the ${pen}: ${K.usd(big.penalty)}.</p>
<p>Two changes remove that cost. Taking ${K.usd(30000)} instead uses contributions only and costs ${K.usd(small.penalty)}. Waiting until 2027 opens the 2022 layer: ${K.usd(55000)} that year costs ${K.usd(wait.penalty)}. Emptying the account at 51, ${K.usd(93000)}, reaches the earnings as well, and the result changes character: ${K.usd(all.taxable)} becomes taxable income on top of ${K.usd(all.penalty)} of additional tax. For a single filer with no other income, ${K.usd(18000)} of taxable earnings alone would cost about ${K.usd(earnTax)} of federal tax.</p>
${h.mini('roth', { t: 'Split your own withdrawal', p: ['amt', 'cy'], d: { c: 30000, cv: 25000, cy: '2022', e: 18000, age: 51, fy: '2012' } })}
<h2>Two different five-year periods</h2>
<p>The Roth chapter warns that the five-year period for a conversion "isn't necessarily the same" as the one for a qualified distribution. The conversion clock, one per conversion, only decides whether the ${pen} applies to that conversion. The qualified-distribution clock is single: it starts on January 1 of the first tax year for which you made a contribution to any Roth IRA. A distribution is qualified when that period has passed and you are 59½, disabled, a beneficiary after the owner's death, or a first-time homebuyer within a lifetime limit of ${K.usd(homeCap)}. A qualified distribution is tax free in full, earnings included.</p>
<p>The IRS's own illustration of the conversion clock is a February 2025 conversion made on the same day as a contribution for 2024: the conversion counts from January 1, 2025, the contribution from January 1, 2024. A contribution made before the filing deadline for that year therefore starts its clock a year earlier than a conversion made the same morning.</p>
<h2>Exceptions that still reach the earnings layer</h2>
<p>When a withdrawal before 59½ does reach earnings, the ${pen} can still be avoided with an exception from the Roth chapter's list: disability, terminal illness, a first home, a 72(t) series of equal payments, medical expenses above 7.5 % of adjusted gross income, health insurance while unemployed, higher education, and the newer ones such as birth or adoption. Income tax on the earnings remains in those cases. Check the details on the ${h.a('early-withdrawal-penalty-exceptions', 'exceptions page')}.</p>
${h.mini('penalty', { t: 'Roth earnings at 51: the cost', p: ['amt'], d: { amt: 18000, age: 51, acc: 'rothEarnings', ex: 'none', oi: 0, state: 0 } })}
<h2>Reporting and record keeping</h2>
<p>The taxable part of a non-qualified distribution is worked out on Form 8606, Part III, and an early distribution goes on Form 5329, line 1, after the recapture allocation chart of Publication 590-B has matched the withdrawal against past conversions. That chart needs the amount you converted each year, so keep every Form 8606 and every Form 1099-R that shows a conversion. Without them, proving that a withdrawal came from contributions rather than earnings becomes hard.</p>
<p>Roth IRAs have no minimum distributions while the owner is alive, so the money can wait. A Roth 401(k), known as a designated Roth account, is not a Roth IRA and follows the rules of its plan. For a plan that uses Roth layers as part of the years before 59½, the ${h.a('roth-conversion-ladder', 'conversion ladder page')} sizes the conversions and the ${h.a('early-retirement-bridge', 'bridge page')} counts what is reachable.</p>
`,
  faqs: [
    { q: 'Can I withdraw my Roth IRA contributions before 59½ without penalty?', a: `Yes. Regular contributions are the first layer to leave a Roth IRA, and since they were never deducted they come out with no income tax and no ${pen} additional tax, at any age. Only after all contributions are out do withdrawals reach conversions and then earnings.` },
    { q: 'When can I withdraw from my Roth IRA a conversion I made in 2022?', a: `From January 1, 2027 without the ${pen}. Each conversion has its own five-year period starting January 1 of its year. In 2026 the 2022 conversion is still inside that period, so before 59½ a withdrawal reaching it owes the ${pen} on the part that was taxable at conversion.` },
    { q: 'Do Roth IRA withdrawal rules treat my two Roth IRAs separately?', a: 'No. For the ordering rules the IRS adds together all distributions from all your Roth IRAs in the year, and all contributions and conversions. Taking money from the account that holds only conversions does not let you skip the contributions held in the other.' },
    { q: 'What makes a Roth IRA withdrawal qualified?', a: 'Two conditions together. Five years must have passed since January 1 of the first tax year for which you contributed to any Roth IRA, and the payment must be made at 59½ or later, because of disability, to a beneficiary after death, or for a first home up to the lifetime limit. A qualified distribution is fully tax free.' },
    { q: 'Is a Roth 401(k) covered by the same Roth IRA withdrawal rules?', a: 'No. Publication 590-B says designated Roth accounts in 401(k), 403(b) or 457(b) plans are not IRAs and should not be confused with Roth IRAs. The ordering of contributions first applies to Roth IRAs; a Roth 401(k) payment follows the rules of the plan and Publication 575.' },
  ],
  tool: 'roth',
  toolArg: { amt: 60000, c: 30000, cv: 25000, cy: '2022', e: 18000, age: 51, fy: '2012' },
  related: ['roth-conversion-ladder', 'when-can-you-draw-401k', 'early-retirement-bridge', 'early-withdrawal-penalty-exceptions', 'ira-early-withdrawal-penalty'],
  sources: ['pub590b', 'roth_iras', 'irs_exceptions'],
});
