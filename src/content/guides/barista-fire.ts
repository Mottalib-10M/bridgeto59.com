import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MED = K.P.aca.medicareAge;
const CAP = K.P.aca.cap;
// Default case of the calculator: $55,000 a year, $24,000 of part-time pay after tax, $350,000 invested, $20,000 saved a year.
const d = K.tool('barista');
const full = Number(d.rows[0][2]), bar = Number(d.rows[1][2]);
const yb = String(d.rows[2][1]), yf = String(d.rows[3][1]);
const pays = [12000, 18000, 24000, 30000, 36000];
// Couple on the Marketplace in 2026: what share of income they are expected to pay toward the benchmark plan.
const two = (magi: number) => K.ptc({ year: '2026', size: 2, magi, benchmarkMonthly: 0 });
const lo = two(40000), hi = two(80000);
const cap2 = K.fpl('2026', 2) * CAP;
// A barista exit at 45: the portfolio pays $31,000 a year until 59½ from reachable accounts.
const br45 = String(K.tool('bridgeYears', { age: 45, sp: 31000, t: 0, rb: 0, g: 0, r: 5 }).rows[1][1]);

export default defineGuide({
  id: 'barista-fire',
  group: 'fire',
  order: 3,
  slug: 'barista-fire',
  nav: 'Barista FIRE',
  card: 'Part-time pay covers part of the budget: a smaller number, and a health question',
  title: 'Barista FIRE 2026: Part-Time Pay, a Smaller Number, Health',
  description: `Barista FIRE in 2026: part-time pay covers part of spending, so the portfolio is smaller. ${K.usd(24000)} of pay on a ${K.usd(55000)} budget cuts the target to ${K.usd(bar)}.`,
  h1: 'Barista FIRE: how much part-time pay shrinks the number, and what it does to health coverage',
  intro: 'Barista FIRE means leaving full-time work once the portfolio covers the part of your spending that a part-time job does not.',
  resume: `Barista FIRE replaces part of the portfolio with a part-time paycheck. If you spend ${K.usd(55000)} a year and a part-time job brings in ${K.usd(24000)} after tax, the portfolio only has to pay the other ${K.usd(55000 - 24000)}; at a 4 % withdrawal rate that is ${K.usd(bar)} instead of the ${K.usd(full)} a full FIRE number would require. Starting from ${K.usd(350000)} and saving ${K.usd(20000)} a year at a 5 % real return, the barista target arrives in ${yb}, against ${yf} for full independence. The job does a second thing that matters as much in the United States: it decides your health coverage until Medicare at ${MED}. Some part-time roles include a group plan; without one you buy on the Marketplace, where the premium tax credit depends on household income, part-time wages included. Each extra dollar of pay lowers the credit a little, and above ${K.pct(CAP, 0)} of the poverty line in 2026 there is none at all.`,
  body: (h) => `
<h2>How part-time pay changes the target</h2>
<p>The formula is the FIRE number with a smaller numerator: spending minus part-time income, divided by the withdrawal rate. The pay enters at its after-tax value, because that is what reaches your budget. Every ${K.usd(1000)} of steady yearly pay removes ${K.usd(K.fireNumber(1000, 0.04))} from the portfolio you need at 4 %. That is why even a modest job has such leverage on the timeline.</p>
${h.table(['Part-time pay after tax', 'Barista FIRE number', 'Years to reach it', 'Years to full FIRE'],
  pays.map((p) => { const t = K.tool('barista', { pt: p }); return [K.usd(p), String(t.rows[1][1]), String(t.rows[2][1]), String(t.rows[3][1])]; }),
  `${K.usd(55000)} of spending, 4 % withdrawal rate, ${K.usd(350000)} invested today, ${K.usd(20000)} saved a year, 5 % real return. Computed by the site's engine.`, ['l', 'r', 'r', 'r'])}
<p>The last column does not move: full independence is the same distance away whatever you plan to earn later. The third column is where barista FIRE earns its name. At ${K.usd(36000)} of pay the target is ${String(K.tool('barista', { pt: 36000 }).rows[2][1])} of saving away; at ${K.usd(12000)} it still takes most of the time a full exit would.</p>
${h.mini('barista', { t: 'Your part-time pay against a leaner budget', p: ['pt'], d: { spend: 48000, pt: 20000, bal: 280000, c: 16000 } })}
<h2>A job with benefits or the Marketplace</h2>
<p>The choice of job has a cost that the number above leaves out. A part-time role that offers group health coverage takes premiums off your budget and keeps you off the Marketplace entirely. Some employers extend benefits to staff below full time and many do not; plan rules decide who qualifies, usually through a minimum number of hours, so the job description is worth reading before the resignation letter is written.</p>
<p>Without employer coverage, you buy a plan on HealthCare.gov or your state's exchange. The premium tax credit then pays the gap between the benchmark silver plan and a share of your income that rises with that income. Here is how the expected share moves for a couple in 2026:</p>
${h.table(['Household income (MAGI)', 'Share of the poverty line', 'Expected share of income', 'Paid toward the benchmark plan'],
  [30000, 40000, 50000, 60000, 70000, 80000].map((m) => { const r = two(m); return [K.usd(m), K.pct(r.ratio, 0), r.pct === null ? 'no credit' : K.pct(r.pct, 2), r.pct === null ? 'full premium' : K.usd(r.expected)]; }),
  `Two people, 2026 coverage, poverty line ${K.usd(K.fpl('2026', 2))} (2025 guidelines used for 2026 plans). Applicable percentages: Rev. Proc. 2025-25.`, ['l', 'r', 'r', 'r'])}
<p>At ${K.usd(40000)} of modified adjusted gross income (MAGI, roughly your adjusted gross income plus tax-exempt interest), the couple is expected to put ${K.usd(lo.expected)} a year toward the benchmark plan and the credit pays the rest of its premium. At ${K.usd(80000)} the expected share is ${K.usd(hi.expected)}. Past ${K.usd(cap2)}, the ${K.pct(CAP, 0)} line for two people, the credit disappears in 2026 coverage, however expensive the plan is.</p>
<h2>Wages and withdrawals share the same income line</h2>
<p>For the credit, part-time wages and the taxable part of portfolio withdrawals are added together. A barista plan that draws from a traditional 401(k) stacks ordinary income on top of the paycheck; one that draws from taxable savings counts only the realized gain, and Roth contributions come back without adding to MAGI at all. Two households with the same spending can land in very different places on the table above just from the order in which they tap accounts. The ${h.a('health-insurance-before-medicare', 'health insurance before Medicare guide')} works through the credit in detail, and the ${h.a('aca-subsidy-cliff', 'subsidy cliff page')} shows what one dollar over the line costs.</p>
${h.mini('aca', { t: 'Wages plus withdrawals: your expected premium share', p: ['magi'], d: { hh: 2, magi: 46000, b: 1500, pl: 1500 } })}
<h2>A barista exit before 59½ still needs reachable money</h2>
<p>Part-time pay shrinks the portfolio, but it does not change when retirement accounts open. Someone who goes part time at 45 and draws ${K.usd(31000)} a year from investments needs that sum every year until 59½ from accounts without a lock, or from an exception. Fifteen yearly withdrawals of that size, discounted at a 5 % real return, are worth ${br45} today. If most of the ${K.usd(bar)} sits in a 401(k), that bridge is the binding constraint, not the barista number.</p>
<p>The usual sources are the same as for any early exit: a taxable brokerage account, Roth IRA contributions, a governmental 457(b), the ${h.a('rule-of-55', 'rule of 55')} if the part-time job starts after leaving the main employer in or after the year you turn ${K.P.early.ruleOf55Age}, or a ${h.a('72t-calculator', '72(t) series')} on an IRA. Note one trap with the rule of 55: it applies to the plan of the employer you separate from, so taking a part-time role with the same employer does not count as leaving.</p>
<h2>Earned income keeps other doors open</h2>
<p>A paycheck, even a small one, is compensation for IRA purposes. That allows a Roth IRA contribution of up to ${K.usd(K.P.limits.ira)} in 2026 (or your earned income, if lower), which a fully retired person without wages cannot make. If the part-time employer offers a 401(k), deferrals of up to ${K.usd(K.P.limits.deferral)} are possible, and a deferral lowers the MAGI used for the premium credit. Work also delays the first withdrawals, which shortens the period exposed to a bad run of markets in the first years. The two numbers to watch are simple: the portfolio target in the first table, and where your total income lands in the second.</p>
<p>The weak point of barista FIRE is that it depends on a job you do not control. Hours get cut, roles disappear, and health reasons can end the plan earlier than expected. Running the calculator with the pay set to zero shows how far the plan is from standing on the portfolio alone.</p>
`,
  faqs: [
    { q: 'How much do I need for barista FIRE on $55,000 a year?', a: `If part-time work brings in ${K.usd(24000)} after tax, the portfolio only has to cover the remaining ${K.usd(31000)} of the budget. At a 4 % withdrawal rate that is ${K.usd(bar)}, against ${K.usd(full)} for full FIRE. Each ${K.usd(1000)} of steady yearly pay lowers the target by ${K.usd(K.fireNumber(1000, 0.04))}.` },
    { q: 'Does barista FIRE income reduce my ACA premium tax credit?', a: `Yes. Wages are part of the modified adjusted gross income the Marketplace uses. For two people in 2026, ${K.usd(40000)} of MAGI means an expected contribution of ${K.usd(lo.expected)} a year toward the benchmark plan; ${K.usd(80000)} means ${K.usd(hi.expected)}. Above ${K.usd(cap2)} there is no credit for 2026 coverage.` },
    { q: 'Is a part-time job with health insurance worth more for barista FIRE?', a: 'Often, because group coverage removes the largest cost before Medicare and its premium does not depend on your income. Compare the employee share of the premium with the Marketplace premium after credit at your expected income. Hours rules vary by employer, so eligibility needs checking in the plan documents.' },
    { q: 'Can I contribute to a Roth IRA while doing barista FIRE?', a: `Yes, if you have earned income. Part-time wages count as compensation, so you can contribute up to ${K.usd(K.P.limits.ira)} in 2026, or your earned income if lower, subject to the Roth income limits. Portfolio withdrawals and dividends do not count as compensation.` },
    { q: 'What happens to barista FIRE if the part-time job ends?', a: `The portfolio then has to carry the full budget. In the example of this page, ${K.usd(bar)} supports ${K.usd(31000)} a year at 4 %; losing ${K.usd(24000)} of pay would push the withdrawal rate to about ${K.pct(55000 / bar, 1)}. That is the scenario to test before leaving full-time work.` },
  ],
  tool: 'barista',
  related: ['health-insurance-before-medicare', 'aca-subsidy-cliff', 'coast-fire-calculator', 'fire-number-calculator', 'cobra-vs-marketplace'],
  sources: ['rp_2025_25', 'hc_fpl', 'hc_lower', 'limits_2026'],
});
