import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('south-carolina');
const [under65, from65] = st.exclusions;
const ded = under65.amount ?? 0, ded65 = from65.amount ?? 0; // $3,000 before 65, $10,000 from 65
const fed = K.P.early.penalty;
// 2026 rates (H. 4216, states.json rate note): 1.99 % under $30,000; 5.21 % minus $966 from $30,000.
const low = 0.0199, high = 0.0521, minus = 966, step = 30000;
const sc = (x: number) => (x < step ? x * low : x * high - minus);
// Worked case: $18,000 at 56, as the only South Carolina taxable income.
const amt = 18000;
const clean = K.stateTax('south-carolina', amt, 56, 0, false);
const hit = K.stateTax('south-carolina', amt, 56, 0, true);
const big = 45000;

export default defineState({
  slug: 'south-carolina',
  title: 'South Carolina Retirement Deduction 2026: $3,000 Before 65',
  description: `South Carolina retirement deduction 2026: ${K.usd(ded)} a year before 65 and ${K.usd(ded65)} from 65 on 401(k) and IRA income, never on the part the IRS penalized as early.`,
  intro: `South Carolina is one of the few states with a retirement deduction at any age: ${K.usd(ded)} a year before 65, as long as the money did not trigger the federal early-withdrawal penalty.`,
  resume: `South Carolina lets a taxpayer under 65 deduct up to ${K.usd(ded)} a year of qualified retirement income from their own plan, and up to ${K.usd(ded65)} from 65. Qualified income comes from plans defined in Internal Revenue Code sections 401, 403, 408 and 457, so 401(k), 403(b), IRA and 457 payouts all count. There is no minimum age, which is rare, but there is a federal condition: "any portion of qualified retirement income received this tax year that resulted in a federal premature withdrawal penalty does not qualify." A rule of 55 payout or a 72(t) series keeps the deduction; a penalized IRA withdrawal loses it. These amounts come from the 2025 SC1040 instructions. For 2026, H. 4216 (Act No. 110, signed March 30, 2026) sets a rate of 1.99 % on income under $30,000 and 5.21 % minus $966 from $30,000 up, replacing a 2025 schedule that topped at 6 %. On ${K.usd(amt)} at 56 with no federal penalty, ${K.usd(clean.taxed)} remains after the deduction.`,
  body: (h) => `
<h2>A small deduction with no age floor</h2>
<p>Most states wait until 55, 59½ or 62 before offering anything on retirement income. South Carolina starts at any age: the 2025 instructions say "an individual who is under age 65 may claim a retirement deduction up to $3,000 on qualified retirement income from their own plan." For a FIRE retiree at 48 living on a 401(k) under a federal exception, that is ${K.usd(ded)} a year off the state return from the first year of withdrawals.</p>
<p>The deduction stops at the federal penalty. Any portion that "resulted in a federal premature withdrawal penalty does not qualify." The test is the money, not the person: if part of a payout is covered by a federal exception and part is not, the covered part can be deducted.</p>
${h.mini('state', { t: 'South Carolina at 56, no federal penalty', p: ['amt', 'age'], d: { sx: 'south-carolina', age: 56, amt: 18000, fp: 'no' } })}
<h2>The 2026 rate under H. 4216</h2>
<p>The legislature rewrote the rate schedule for tax year 2026. The Department of Revenue's summary of H. 4216 gives two lines: 1.99 % on income under $30,000, and "the tax rate for income from $30,000 and above is 5.21%, minus $966." The two formulas meet at $30,000, where both give ${K.usd(sc(step))}, so there is no jump at the threshold. For 2025 the top rate was 6 %.</p>
${h.table(['Payout at 56', 'Federal 10 %', 'SC deduction', 'SC taxable', 'SC tax 2026'], [
  [`${K.usd(amt)}, rule of 55 or 72(t)`, 'no', K.usd(clean.excluded), K.usd(clean.taxed), K.usd(sc(clean.taxed))],
  [`${K.usd(amt)}, IRA with no exception`, 'yes', K.usd(hit.excluded), K.usd(hit.taxed), K.usd(sc(hit.taxed))],
  [`${K.usd(big)}, rule of 55 or 72(t)`, 'no', K.usd(ded), K.usd(big - ded), K.usd(sc(big - ded))],
], 'Assumes the payout is the only South Carolina taxable income. Deduction from the 2025 SC1040 instructions; 2026 rates from H. 4216.', ['l', 'l', 'r', 'r', 'r'])}
<p>The deduction is small next to the federal penalty. On the IRA line, the IRS takes ${K.usd(amt * fed)} while the lost South Carolina deduction costs ${K.usd(sc(hit.taxed) - sc(clean.taxed))}. The order of priorities is clear: keep the federal label clean through the ${h.a('rule-of-55', 'rule of 55')} or a ${h.a('72t-calculator', '72(t) series')}, and the state deduction follows.</p>
<h2>From 65: ${K.usd(ded65)}, and a separate age deduction</h2>
<p>At 65 the retirement deduction rises to ${K.usd(ded65)}. The 2025 instructions also describe a separate $15,000 deduction for taxpayers 65 and older, reduced by any retirement deduction claimed. We have not read how the 2026 law treats that age deduction, nor the full text of H. 4216 on the retirement deduction itself; the Department's summary does not mention a change to either.</p>
<h2>Couples</h2>
<p>The deduction applies to income from your own plan, so each spouse claims it on their own retirement income. A couple both under 65, each drawing from their own 401(k) or IRA without a federal penalty, can deduct up to ${K.usd(ded * 2)} together. The ${h.a('state-tax-on-retirement-withdrawals', 'state comparison')} shows how small this is next to Georgia or Colorado, and how early it starts.</p>
`,
  faqs: [
    { q: 'Can I claim South Carolina’s $3,000 retirement deduction at 50?', a: `Yes, if the money is qualified retirement income from your own plan and it did not trigger the federal premature withdrawal penalty. South Carolina sets no minimum age for the ${K.usd(ded)} deduction. A 401(k) payout under the rule of 55 or a 72(t) series qualifies; an IRA withdrawal that owes the federal ${K.pct(fed, 0)} does not.` },
    { q: 'What are South Carolina’s income tax rates for 2026 under H. 4216?', a: `From tax year 2026, H. 4216 (Act No. 110) taxes income under $30,000 at 1.99 % and income from $30,000 up at 5.21 % minus $966. On ${K.usd(big - ded)} of South Carolina taxable income the tax is ${K.usd(sc(big - ded))}. The 2025 schedule reached a top rate of 6 %.` },
    { q: 'Does a penalized IRA withdrawal get the South Carolina retirement deduction?', a: `No. The SC1040 instructions exclude any portion of qualified retirement income that resulted in a federal premature withdrawal penalty. On ${K.usd(amt)} taken from an IRA at 56 with no exception, the full amount stays in South Carolina income and the IRS adds ${K.usd(amt * fed)} of penalty.` },
    { q: 'Is the South Carolina retirement deduction $10,000 at 65?', a: `Yes. From 65 the retirement deduction is up to ${K.usd(ded65)} a year on qualified retirement income from your own plan, according to the 2025 SC1040 instructions. A separate $15,000 deduction for those 65 and older is reduced by the retirement deduction claimed. The 2026 treatment of that age deduction was not confirmed.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'rule-of-55', '72t-calculator', 'ira-early-withdrawal-penalty', 'state:georgia'],
});
