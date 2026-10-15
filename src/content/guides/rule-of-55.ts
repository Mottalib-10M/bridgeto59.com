import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
// Worked case: born 1971, leaves in 2026 (the year of the 55th birthday), takes $40,000, single, no other income.
const ok = K.early({ amount: 40000, age: 55, account: 'plan', exception: 'separation55', status: 'single' });
const ira = K.early({ amount: 40000, age: 55, account: 'ira', status: 'single' });

export default defineGuide({
  id: 'rule-of-55',
  group: 'access',
  order: 20,
  slug: 'rule-of-55',
  nav: 'Rule of 55',
  card: 'Leave at 55 or later and take your last 401(k) without the 10 %',
  title: 'Rule of 55 in 2026: Check Your 401(k) Exit Year in Seconds',
  description: `Rule of 55 in 2026: leave your job in or after the year you turn 55 (50 in public safety) and that 401(k) pays out with no ${pen} penalty. Check your year.`,
  h1: 'Rule of 55: does your exit year open your 401(k) without the 10 %?',
  intro: `Leave your employer in the calendar year you turn ${E.ruleOf55Age}, or later, and the 401(k) or 403(b) of that employer pays you with no ${pen} additional tax, even though you are not yet 59½.`,
  resume: `The rule of 55 is the exception in IRC section 72(t)(2)(A)(v): a distribution from an employer plan is free of the ${pen} additional tax when you separate from service during or after the calendar year in which you reach age ${E.ruleOf55Age}. The test is the year, not the birthday: someone born in December 1971 who leaves in January 2026 qualifies, although still 54 on the last day of work. Qualified public safety employees of a state or local government, federal law enforcement officers, firefighters and air traffic controllers use age ${E.publicSafetyAge}, or ${E.publicSafetyYearsOfService} years of service under the plan if that comes first (Publication 575). Only the plan of the employer you leave is covered: older 401(k)s and every IRA stay locked until 59½. Income tax is still due, and the plan withholds ${K.pct(E.planWithholding, 0)} of a cash payment. The checker above takes your birth year and exit year and shows what the rule saves on your withdrawal.`,
  body: (h) => `
<h2>The year test, in the words of the IRS</h2>
<p>The IRS table of exceptions puts it in one line: no additional tax when "the employee separates from service during or after the year the employee reaches age 55". ${h.src('irs_exceptions', 'Read it on irs.gov')}. Publication 575 adds the warning that trips people up: you cannot separate before that year and then wait. Its own example is a man who left at 49 and took money in the year he turned 55; the ${pen} applied, because the separation came first.</p>
<p>Three consequences follow from the wording. The reason you leave does not matter: a layoff, a resignation and a retirement all count. You do not need to stay retired: a new job elsewhere leaves the old plan open under the rule. And the date of the payment does not matter either: once you have separated in the right year, a withdrawal at 56 or at 58 is covered as well.</p>
${h.mini('rule55', { t: 'Born in December: does a January exit count?', p: ['by', 'ly'], d: { by: '1971', ly: '2026' } })}
<h2>Which money the rule reaches</h2>
${h.table(['Account', 'Rule of 55?', 'Before 59½ otherwise'], [
  ['401(k) or 403(b) of the employer you leave', 'yes', 'locked'],
  ['401(k) of an earlier employer', 'no, unless rolled into the current plan before you leave', 'locked, or 72(t)'],
  ['Traditional IRA, rollover IRA, SEP', 'never', 'locked, or 72(t)'],
  ['Governmental 457(b)', 'not needed', 'no 10 % at any age'],
  ['Roth IRA contributions', 'not needed', 'free at any age'],
], 'Sources: IRS exceptions table (updated December 11, 2025); Topic 558 for 457(b) plans.', ['l', 'l', 'l'])}
<p>The second line is where planning pays. An old 401(k) sitting with a former employer does not qualify, but many plans accept a rollover in while you still work there. Moved into the current plan before your exit, that money leaves under the rule of 55 together with the rest. The opposite move destroys the exception: roll the plan into an IRA after you leave and the money falls under IRA rules, where separation from service is not an exception at all. The checker treats an IRA withdrawal at 55 as penalized for that reason: on ${K.usd(40000)} it costs ${K.usd(ira.penalty)} that the plan payout does not.</p>
<h2>What it saves, and what it does not</h2>
<p>Take a single person born in 1971 who leaves in 2026 and takes ${K.usd(40000)} from that employer's 401(k), with no other income in the year. The ${pen} would have been ${K.usd(40000 * E.penalty)}; under the rule it is zero. Federal income tax stays: with the 2026 standard deduction of ${K.usd(K.P.tax.standardDeduction.single)} and the 10 % and 12 % brackets, the bill is about ${K.usd(ok.federal)}. The plan will still withhold ${K.usd(ok.withheld)} at payout, because ${K.pct(E.planWithholding, 0)} withholding applies to any eligible rollover distribution paid to you; the difference comes back as a refund when you file.</p>
<p>That gap between withholding and real tax is a cash-flow issue in the first year of early retirement. Asking the plan for two smaller payments in different tax years, or for the amount you need grossed up for the withholding, avoids running short. The ${h.a('how-to-withdraw-money-from-401k', 'withdrawal and withholding calculator')} shows both numbers.</p>
<h2>Plan rules can be stricter than the law</h2>
<p>The tax code allows the exception; it does not force the plan to pay on demand. Some 401(k) plans let a former employee take any amount at any time, others only a lump sum, others a fixed installment schedule. A plan that pays only a lump sum turns the rule of 55 into one large taxable year: the whole balance lands on one return and can climb to the 24 % or 32 % bracket. Read the summary plan description before you give notice, and ask the administrator in writing whether partial withdrawals are allowed after separation.</p>
<h2>Using it in a FIRE plan</h2>
<p>For someone who stops at 55, the rule turns the largest account into the bridge. Spending comes from the employer plan from 55 to 59½, filling the 0 % and low brackets each year, while the IRA and the Roth keep growing untouched. Retiring at 52 instead, the same 401(k) stays locked for three and a half more years, and the gap must come from taxable savings, Roth contributions, a ${h.a('roth-conversion-ladder', 'conversion ladder')} or a ${h.a('72t-calculator', '72(t) series')}. The ${h.a('early-retirement-calculator', 'early retirement calculator')} applies the rule automatically when the retirement age you test is 55 or more.</p>
${h.mini('penalty', { t: 'The same money from an IRA at 55', p: ['amt'], d: { age: 55, acc: 'ira', oi: 0, state: 0 } })}
<h2>Public safety: age 50, or 25 years of service</h2>
<p>For qualified public safety employees the age drops to ${E.publicSafetyAge}, and Publication 575 adds a second door: ${E.publicSafetyYearsOfService} years of service under the plan, whichever comes first. The details, and who counts, are on the ${h.a('rule-of-55-public-safety', 'public safety page')}.</p>
`,
  faqs: [
    { q: 'I turn 55 in November. Can I leave in March of that year and still use the rule of 55?', a: `Yes. The IRS test is separation from service during or after the calendar year in which you reach ${E.ruleOf55Age}. Leaving in March of the year you turn ${E.ruleOf55Age} qualifies, even though you are 54 on your last day. Leaving in December of the year before does not, and waiting until your birthday afterwards does not repair it.` },
    { q: 'Does the rule of 55 work for my IRA?', a: `No. The separation-from-service exception applies only to employer plans such as a 401(k) or 403(b). An IRA withdrawal before 59½ owes the ${pen} additional tax unless another exception applies, such as a 72(t) series. Rolling your 401(k) into an IRA after leaving gives up the rule of 55 on that money.` },
    { q: 'Can I take a new job after using the rule of 55?', a: 'Yes. The exception looks at the separation from the employer that sponsors the plan, in or after the year you turn 55. Working elsewhere afterwards does not reverse it, and withdrawals from that old plan stay free of the 10 % additional tax. Income tax applies as usual, and your new salary may push withdrawals into a higher bracket.' },
    { q: 'Do I still pay income tax on a rule of 55 withdrawal?', a: `Yes. Only the ${pen} additional tax disappears. A pre-tax 401(k) payout is ordinary income for the year, and the plan withholds ${K.pct(E.planWithholding, 0)} on a payment made to you. With no other income in 2026, a single filer pays nothing on the first ${K.usd(K.P.tax.standardDeduction.single)} thanks to the standard deduction.` },
    { q: 'What if my old 401(k) is still with a previous employer?', a: 'That plan does not qualify under the rule of 55 unless you left that employer in or after the year you turned 55. One route is to roll it into your current employer plan before you leave, if the plan accepts incoming rollovers; the money then counts as part of the plan you separate from.' },
  ],
  tool: 'rule55',
  related: ['rule-of-55-public-safety', 'retire-at-55', '72t-calculator', 'when-can-you-draw-401k', 'how-to-withdraw-money-from-401k'],
  sources: ['irs_exceptions', 'pub575', 'tc558', 'rp_2025_32'],
});
