import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('iowa');
const rate = st.rate.flat ?? 0; // 3.8 % in 2026
const age55 = st.exclusions[0].minAge; // 55 on December 31
const fed = K.P.early.penalty;
// Worked case: $32,000 a year drawn from age 54.
const amt = 32000;
const at54 = K.stateTax('iowa', amt, 54, 0, true);
const ira55 = K.early({ amount: amt, age: 55, account: 'ira', status: 'joint' });

export default defineState({
  slug: 'iowa',
  title: 'Iowa Retirement Income Exclusion 2026: Tax Free From 55',
  description: `Iowa retirement income exclusion 2026: be ${age55} on December 31 and 401(k), 403(b), 457(b) and IRA payouts leave Iowa income; younger, they pay a flat ${K.pct(rate, 1)}.`,
  intro: `From the tax year in which you are ${age55} on December 31, Iowa excludes 401(k), 403(b), 457(b) and IRA payouts in full; before that year they are taxed at ${K.pct(rate, 1)}.`,
  resume: `Since tax year 2023 Iowa excludes retirement income for anyone who is ${age55} or older on December 31 of the tax year, and for disabled taxpayers and qualifying survivors. The list is broad: 401(k), 403(b) and 457(b) plans, traditional and Roth IRAs, SEP and SIMPLE IRAs, pensions, annuities, Keogh and ESOP payouts. Nonqualified deferred compensation and nonqualified annuities are left out. The guidance we read gives no dollar limit. Under ${age55}, the same payouts are taxed at Iowa's flat 2026 rate of ${K.pct(rate, 1)}: ${K.usd(at54.total)} on ${K.usd(amt)} at 54. The year test matches the federal rule of 55, which also looks at the calendar year you turn ${age55}, so leaving a job in that year can free the employer plan from the federal ${K.pct(fed, 0)} and from Iowa tax at the same time. An IRA at ${age55} escapes Iowa tax but still owes the federal ${K.pct(fed, 0)} until 59½, unless another exception applies.`,
  body: (h) => `
<h2>December 31 decides the whole year</h2>
<p>Iowa does not look at the date of each payment. Its test, in the words of the Department of Revenue, is being "55 years of age or older on December 31 of the tax year." Someone born on December 20, 1971 is 54 for almost all of 2026, yet every qualifying payout received in 2026, from January onward, falls under the exclusion. The year before, nothing does: payouts at 53 or 54 are taxed at ${K.pct(rate, 1)}, the single rate Iowa applies to all levels of income in 2026.</p>
${h.mini('state', { t: 'Iowa tax on a 401(k) payout at 54', p: ['amt', 'age'], d: { sx: 'iowa', age: 54, amt: 32000 } })}
<h2>Two calendar tests that line up</h2>
<p>The federal ${h.a('rule-of-55', 'rule of 55')} works on the same calendar logic: no ${K.pct(fed, 0)} additional tax on the plan of an employer you leave during or after the year you reach ${age55}. An Iowan who quits in that year can therefore draw that 401(k) or 403(b) with neither the federal penalty nor Iowa income tax. Only federal income tax remains.</p>
${h.table(['Situation in 2026', 'Federal 10 %', 'Iowa tax'], [
  [`Age 54 on December 31, any 401(k) or IRA`, 'yes, unless an exception applies', K.pct(rate, 1)],
  [`${age55} on December 31, 401(k) of the employer left that year`, 'no (rule of 55)', 'excluded'],
  [`${age55} on December 31, traditional IRA`, 'yes, until 59½', 'excluded'],
  ['Any age, disabled', 'exception may apply', 'excluded'],
], 'Sources: Iowa Department of Revenue retirement income guidance; IRS exceptions table.', ['l', 'l', 'l'])}
<p>The third line is the trap. Iowa forgives the state tax on an IRA at ${age55}, but the IRS does not forgive its penalty: on ${K.usd(amt)} the federal additional tax is still ${K.usd(ira55.penalty)}. Keeping old 401(k) money in an employer plan, or rolling it into the plan you will leave at ${age55}, protects it from both.</p>
<h2>Which accounts the exclusion reaches</h2>
<p>The guidance names distributions from ERISA plans "including a 401(k), 403(b), and 457(b) plan", traditional and Roth IRAs, SEP and SIMPLE IRAs, defined benefit pensions, Keogh plans and ESOPs. It leaves out nonqualified deferred compensation under section 409A and nonqualified annuities bought outside a plan. The pages we read state no dollar ceiling on the exclusion since 2023; we have not found a cap, but we have not read a sentence that rules one out either.</p>
<h2>Planning the years before ${age55}</h2>
<p>For someone who stops at 50, the four years before the Iowa threshold carry the state tax. Two habits help. Draw taxable brokerage money first in those years, since long-term gains in the low federal brackets can be cheap, and push pre-tax withdrawals into the year you turn ${age55}. If a ${h.a('72t-calculator', '72(t) series')} has to start earlier, its payments before that year are taxed at ${K.pct(rate, 1)}, then fall out of Iowa income once the age test is met. The ${h.a('retire-at-55', 'retire at 55 page')} lays out the federal side of that timing.</p>
`,
  faqs: [
    { q: 'I turn 55 in December. Does Iowa exclude my retirement payouts from January of that year?', a: `Yes. Iowa's test is being ${age55} or older on December 31 of the tax year, not the date of each payment. If you reach ${age55} during the year, qualifying 401(k), 403(b), 457(b) and IRA distributions received at any point in that tax year fall under the exclusion, including those received while you were still 54.` },
    { q: 'Does the Iowa retirement exclusion cover a Roth IRA or a SIMPLE IRA?', a: 'Yes. The Iowa Department of Revenue lists traditional and Roth IRAs, SEP and SIMPLE IRAs among the covered sources, together with 401(k), 403(b) and 457(b) plans, pensions, Keogh plans and ESOPs. Nonqualified deferred compensation under section 409A and nonqualified annuities are not covered by the exclusion.' },
    { q: 'What does Iowa charge a 52-year-old on a 401(k) withdrawal in 2026?', a: `In 2026 Iowa taxes all levels of income at a flat ${K.pct(rate, 1)}. A 52-year-old who is not disabled does not meet the age test, so a 401(k) payout is taxed at that rate. On ${K.usd(amt)} the Iowa tax is ${K.usd(at54.total)}, on top of federal income tax and any federal ${K.pct(fed, 0)} penalty.` },
    { q: 'Does Iowa’s exclusion at 55 also cancel the federal penalty on my IRA?', a: `No. The Iowa exclusion only affects the Iowa return. A traditional IRA withdrawal at ${age55} still owes the federal ${K.pct(fed, 0)} additional tax unless an exception applies, because the rule of 55 covers employer plans, not IRAs. On ${K.usd(amt)} that federal charge is ${K.usd(ira55.penalty)}.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'rule-of-55', 'retire-at-55', '72t-calculator', 'state:illinois'],
});
