import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('new-jersey');
const fed = K.P.early.penalty;
// Pension exclusion (2025 NJ-1040 instructions, research/states-facts.json): caps with NJ income of $100,000 or less,
// then a share of pension income up to $150,000, nothing above.
const capJoint = 100000, capSingle = st.exclusions[0].amount ?? 0, capSep = 50000;
const limit = 150000;
// Worked case: $52,000 from a 401(k) at 60.
const amt = 52000;
const r = K.stateTax('new-jersey', amt, 60, 0, false);

export default defineState({
  slug: 'new-jersey',
  title: 'New Jersey Pension Exclusion 2026: Age 62 and Income Caps',
  description: `New Jersey pension exclusion 2026: none before 62; from 62, up to ${K.usd(capSingle)} single or ${K.usd(capJoint)} joint, shrinking above $100,000 of NJ income. 401(k) fully taxed.`,
  intro: `New Jersey gives no retirement exclusion before 62, and after 62 it disappears once New Jersey income passes ${K.usd(limit)}; a 401(k) is taxed in full because its deferrals were never taxed there.`,
  resume: `New Jersey adds no state penalty to an early withdrawal, but it offers early retirees nothing either: the pension and retirement exclusion requires being 62 or older (or blind or disabled) on the last day of the tax year. From 62, with New Jersey income of $100,000 or less, the maximum is ${K.usd(capJoint)} for a joint return, ${K.usd(capSingle)} for single and head of household filers and ${K.usd(capSep)} for married filing separately. Between $100,001 and ${K.usd(limit)} the exclusion shrinks to a share of pension income, and above ${K.usd(limit)} it is gone. What you are taxed on also depends on the account. New Jersey never exempted 401(k) deferrals, so 401(k) payouts are generally fully taxable, while contributions to a 403(b), a 457 or an IRA were generally taxed going in and come back out tax free. The latest schedules are those for 2025, topping at ${K.pct(st.rate.topRate ?? 0, 2)} on income of $1 million and over, so the calculator asks for your rate. At 60, a ${K.usd(amt)} 401(k) payout is taxed in full: ${K.usd(r.taxed)}.`,
  body: (h) => `
<h2>A cliff at ${K.usd(limit)}, and a gate at 62</h2>
<p>New Jersey's exclusion has two conditions, and both are strict. The first is age: you, or your spouse on a joint return, must be 62 or older, or blind or disabled, on the last day of the tax year. The second is income: the instructions require New Jersey income on line 27 of ${K.usd(limit)} or less. A FIRE couple who retire at 50 wait twelve years for the age condition, and a large 401(k) withdrawal in a single year can break the income test even after 62.</p>
${h.table(['New Jersey income (line 27)', 'Married filing jointly', 'Single or head of household', 'Married filing separately'], [
  ['$100,000 or less', K.usd(capJoint), K.usd(capSingle), K.usd(capSep)],
  ['$100,001 to $125,000', '50 % of pension income', '37.5 % of pension income', '25 % of pension income'],
  ['$125,001 to $150,000', '25 % of pension income', '18.75 % of pension income', '12.5 % of pension income'],
  ['Over $150,000', 'none', 'none', 'none'],
], 'Source: 2025 Form NJ-1040 instructions, line 28a. Pension income is the amount on line 20a.', ['l', 'l', 'l', 'l'])}
<p>On a joint return, only the pension income of the spouse who is 62 or older can be excluded. A couple aged 63 and 59 can therefore exclude the older spouse's IRA withdrawals, while the younger spouse's stay taxable.</p>
<h2>Why the 401(k) is the expensive account</h2>
<p>New Jersey has its own rules on what was taxed going in. 401(k) deferrals were not taxed by the state when made, so a 401(k) distribution is "generally fully taxable." Employee contributions to a 403(b), a 457, a SEP, the federal Thrift Savings Plan or any plan other than a 401(k) were taxed by New Jersey when made, and they are recovered tax free. IRA contributions were generally taxed when made too; only the earnings and amounts rolled over tax free become taxable on withdrawal, worked out on Worksheet C of the instructions.</p>
<p>For someone retiring early in the state, that turns the usual order around. A 403(b) or IRA with a large New Jersey basis can fund the years before 62 at a lower state cost than a 401(k) of the same size. The calculator below does not know your basis and taxes the full amount, which matches a 401(k).</p>
${h.mini('state', { t: 'New Jersey at 60: a 401(k) payout', p: ['amt', 'age'], d: { sx: 'new-jersey', age: 60, amt: 52000 } })}
<h2>Contributory pensions: the Three-Year Rule</h2>
<p>For pension plans to which you contributed, the instructions describe a Three-Year Rule: if your own contributions will come back to you within 36 months, payments are not reported as income until those contributions have been recovered. It matters mostly for public employees with a contributory pension, less for 401(k) and IRA savers.</p>
<h2>The 2025 rates and what to type</h2>
<p>The New Jersey schedules we read are those for 2025; they end at ${K.pct(st.rate.topRate ?? 0, 2)} on income of $1 million and over, and we have not extracted the lower brackets. Type your marginal rate in the calculator. The federal ${K.pct(fed, 0)} on early money is a separate charge, explained on the ${h.a('401k-early-withdrawal-calculator', 'early 401(k) withdrawal calculator')}; the ${h.a('state:new-york', 'New York page')} shows a neighbor whose break starts at 59½.</p>
`,
  faqs: [
    { q: 'Can I use the New Jersey pension exclusion at 60?', a: 'No. You need to be 62 or older, or blind or disabled, on the last day of the tax year. Before that, IRA and plan withdrawals are reported on the New Jersey return without any exclusion, even when the IRS charges no penalty on them.' },
    { q: 'Why is my 401(k) fully taxable in New Jersey but my 403(b) is not?', a: 'New Jersey did not tax 401(k) deferrals when you made them, so a 401(k) payout is generally fully taxable. Employee contributions to a 403(b), a 457 or other plans were taxed by the state when made, and that basis is recovered tax free when you withdraw. Only the earnings above it are taxed.' },
    { q: 'What is left of the New Jersey exclusion with $130,000 of income on a joint return?', a: `Between $125,001 and ${K.usd(limit)} of New Jersey income, a joint return can exclude 25 % of the pension income on line 20a, instead of up to ${K.usd(capJoint)}. Single filers get 18.75 % and married filing separately 12.5 %. Above ${K.usd(limit)} the exclusion is lost entirely.` },
    { q: 'Does New Jersey tax money I put into a traditional IRA?', a: 'Generally not a second time. New Jersey usually taxed IRA contributions when you made them, so those amounts come back tax free. The earnings, and amounts rolled over tax free from another plan, are taxable when withdrawn. Worksheet C in the NJ-1040 instructions splits each withdrawal between the two.' },
  ],
  related: ['state-tax-on-retirement-withdrawals', '401k-early-withdrawal-calculator', 'ira-early-withdrawal-penalty', 'roth-conversion-ladder', 'state:new-york'],
});
