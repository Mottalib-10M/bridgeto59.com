import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('illinois');
const rate = st.rate.flat ?? 0; // 4.95 %
const fed = K.P.early.penalty;
// Worked case: $60,000 from a rollover IRA at 44, single, no other income.
const amt = 60000;
const w = K.early({ amount: amt, age: 44, account: 'ira', status: 'single' });
// Same amount from a private (non-governmental) 457(b): not subtracted in Illinois.
const priv = amt * rate;

export default defineState({
  slug: 'illinois',
  title: 'Illinois Retirement Income Subtraction 2026: Any Age at All',
  description: `Illinois retirement income subtraction 2026: 401(k), 403(b), IRA and government 457 payouts leave Illinois income at any age, even before 59½. Flat rate ${K.pct(rate, 2)}.`,
  intro: 'Illinois removes 401(k), IRA and governmental 457 payouts from state income at any age, early ones included, so a FIRE withdrawal at 44 owes the state nothing.',
  resume: `Among the states on this site that tax income, Illinois treats early retirees best: it lets residents subtract the federally taxed part of distributions from qualified employee benefit plans (Internal Revenue Code sections 402 to 408, 401(k) plans included), IRAs, SEPs and state or local governmental 457 plans, with no minimum age and no dollar cap. Publication 120 says it plainly: "You may include early distributions from qualified plans and IRAs." A withdrawal at 44 that the IRS penalizes is still subtracted on line 5 of Form IL-1040. The one gap is deferred compensation from an employer that is not a government, such as a private 457(b): it stays taxable at the flat ${K.pct(rate, 2)} rate. Federal tax and the federal ${K.pct(fed, 0)} additional tax are untouched by the subtraction. On ${K.usd(amt)} from an IRA at 44, Illinois takes nothing, while the same sum from a private 457(b) would cost ${K.usd(priv)}.`,
  body: (h) => `
<h2>No birthday to wait for</h2>
<p>Most state breaks for retirement income start at 55, 59½, 62 or 65. Illinois has no age floor. The subtraction follows the federal treatment: whatever part of a plan or IRA payout lands in your federal adjusted gross income comes back out on the Illinois return, in the year you receive it. Publication 120 (revised December 2025) lists qualified employee benefit plans "including 401(k) plans", IRAs and SEPs, and the IL-1040 instructions point to line 5 for the subtraction.</p>
<p>For a FIRE household that matters more than the rate suggests. Someone who stops work at 44 and lives on IRA withdrawals for fifteen years pays no Illinois income tax on any of them. Spread over the bridge years, that is a saving of ${K.pct(rate, 2)} on every dollar drawn.</p>
${h.mini('state', { t: 'Illinois on an IRA payout at 44', p: ['amt', 'age'], d: { sx: 'illinois', age: 44, amt: 60000 } })}
<h2>The penalty year still counts</h2>
<p>The subtraction does not ask whether the IRS charged its ${K.pct(fed, 0)}. A rollover IRA tapped at 44 with no exception owes the federal additional tax of ${K.usd(w.penalty)} on ${K.usd(amt)}, plus about ${K.usd(w.federal)} of federal income tax for a single filer with no other income in 2026. On the Illinois side, the full ${K.usd(amt)} is subtracted and the state bill on it is zero. The federal cost is the one to manage, through the ${h.a('rule-of-55', 'rule of 55')}, a ${h.a('72t-calculator', '72(t) series')} or Roth contributions.</p>
<h2>Where Illinois draws the line: private deferred compensation</h2>
<p>Publication 120 limits the 457 part of the subtraction to plans of a state or local government. Deferred compensation from a private employer, including a 457(b) offered by a hospital, a university foundation or another tax-exempt body that is not a government, does not qualify and is taxed at ${K.pct(rate, 2)}. On ${K.usd(amt)} that is ${K.usd(priv)} a year. Someone holding both kinds of account can draw the governmental plan or the IRA first and leave the private plan for later years, or simply plan for the state tax on it.</p>
<h2>Moving in or out during the bridge</h2>
<p>Because the break is so wide, the state you live in during the early years changes the bill more here than in most places. A resident of Illinois drawing ${K.usd(amt)} a year from an IRA pays no state tax; the same person in a state that taxes early payouts at a similar rate would pay roughly ${K.usd(priv)} a year. The ${h.a('state-tax-on-retirement-withdrawals', 'state-by-state page')} lines up the other rules, and the ${h.a('state:iowa', 'Iowa page')} shows a neighbor that waits until 55. Illinois residency rules for movers are not covered here.</p>
`,
  faqs: [
    { q: 'Can I subtract an early 401(k) withdrawal on my Illinois return?', a: `Yes. Illinois Publication 120 says you may include early distributions from qualified plans and IRAs in the retirement income subtraction. The federally taxed part of a 401(k), 403(b) or IRA payout is subtracted on line 5 of Form IL-1040 whatever your age, so it owes no tax at the ${K.pct(rate, 2)} Illinois rate.` },
    { q: 'Does Illinois tax a payout from a private 457(b) plan?', a: `Yes. Only state or local governmental 457 plans are covered by the Illinois subtraction. Deferred compensation from an employer that is not a government, such as a private 457(b), remains taxable at the flat ${K.pct(rate, 2)} rate. On ${K.usd(amt)} that comes to ${K.usd(priv)} of Illinois income tax.` },
    { q: 'Is there an age limit or a dollar cap on the Illinois retirement subtraction?', a: 'Neither appears in Publication 120 or the IL-1040 instructions. The subtraction covers the federally taxed portion of qualifying plan and IRA distributions at any age and with no ceiling, which is why a large IRA withdrawal at 40 or a full 401(k) cash-out can leave Illinois income entirely.' },
    { q: 'Does the Illinois subtraction remove the federal 10 % on an early IRA payout?', a: `No. Illinois only changes the state return. The IRS still charges its ${K.pct(fed, 0)} additional tax on a distribution before 59½ that fits no exception, and federal income tax applies as usual. On a ${K.usd(amt)} IRA withdrawal at 44 the federal penalty alone is ${K.usd(w.penalty)}.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'ira-early-withdrawal-penalty', '457b-early-withdrawal', 'retire-at-50', 'state:iowa'],
});
