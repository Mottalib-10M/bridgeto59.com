import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('california');
const ca = st.earlyPenalty ?? 0; // FTB 3805P, 2.5 %
const fed = K.P.early.penalty;
const both = K.pct(ca + fed, 1);
// Worked case: $25,000 from an IRA at 47, no exception.
const amt = 25000;
const r = K.stateTax('california', amt, 47, 0, true);
// SIMPLE IRA in the first two years: federal 25 % (params) and California 6 % (states.json rules).
const simpleCa = 0.06;
const simpleFed = K.P.early.simpleIraFirst2Years;
const simpleAmt = 10000;

export default defineState({
  slug: 'california',
  title: 'California Early Withdrawal Tax 2026: 2.5 % on Top of 10 %',
  description: `California early withdrawal tax 2026: a 401(k) or IRA payout before 59½ owes ${K.pct(ca, 1)} on FTB 3805P plus the federal ${K.pct(fed, 0)}, then income tax at your California rate.`,
  intro: `Before 59½, California adds its own ${K.pct(ca, 1)} tax to every early dollar that the IRS already charges ${K.pct(fed, 0)}, and then taxes the payout as ordinary income.`,
  resume: `California is one of the rare states with its own penalty on early retirement money: the part of a 401(k), 403(b) or IRA distribution taken before 59½ and included in California income owes an additional ${K.pct(ca, 1)} tax, figured on form FTB 3805P. It comes on top of the federal ${K.pct(fed, 0)}, so a dollar that fits no exception carries ${both} of extra tax before income tax. California generally follows the federal exceptions but, in the words of the Franchise Tax Board, does not conform to all of them. A SIMPLE IRA emptied in the first two years of participation owes 6 % in California instead of ${K.pct(ca, 1)}. No age-based state exclusion exists for retirement payouts. Income tax follows the 2025 schedules (1 % to 12.3 %, plus 1 % on taxable income over $1 million, for a top rate of ${K.pct(st.rate.topRate ?? 0, 1)}); the 2026 schedules were not published when we read the FTB site, so the calculator asks for your rate. On ${K.usd(amt)} taken early, the state surcharge alone is ${K.usd(r.early)}.`,
  body: (h) => `
<h2>A second penalty, collected in Sacramento</h2>
<p>Most states treat an early 401(k) or IRA payout as plain income and stop there. California goes one step further and mirrors the federal early-distribution tax at a lower rate. The FTB instructions for form 3805P say that the portion of an early distribution included in income "is subject to an additional 2½% tax", and that California and federal law are generally the same "except for the rate of tax assessed." The federal ${K.pct(fed, 0)} on your Form 5329 does not replace it: you pay both.</p>
<p>Take a 47-year-old who pulls ${K.usd(amt)} from a traditional IRA to cover a gap year, with no exception available. The IRS penalty is ${K.usd(amt * fed)}; California adds ${K.usd(r.early)}. Neither figure includes the income tax on the same money, which comes on top at federal and state level.</p>
${h.mini('state', { t: 'California surcharge on an IRA payout at 47', p: ['amt', 'age'], d: { sx: 'california', age: 47, amt: 25000 } })}
<h2>Federal exceptions: close, not identical</h2>
<p>The same sentence of the FTB instructions carries a warning: "California does not conform to all of the federal exceptions to the additional tax on early distributions." The form lists its own exception codes, and we have not compared them one by one with the IRS list, so this page does not claim which exceptions differ. What can be said is that the common FIRE routes, the ${h.a('rule-of-55', 'rule of 55')} and a ${h.a('72t-calculator', '72(t) series of equal payments')}, are federal exceptions that California generally follows. Before relying on a less common one, check its code in the 3805P instructions for the year of the payout.</p>
<h2>SIMPLE IRA: the first two years cost more</h2>
<p>A SIMPLE IRA is the exception to the exception. Federal law raises the additional tax to ${K.pct(simpleFed, 0)} on money taken within the first two years of participation, and California raises its own charge to 6 % for the same withdrawals. On ${K.usd(simpleAmt)} that is ${K.usd(simpleAmt * (simpleFed + simpleCa))} of combined surcharges, before a cent of income tax. Waiting until the two-year window closes brings both back to their usual rates.</p>
<h2>Income tax: 2025 schedules until the FTB publishes 2026</h2>
<p>California has no exclusion for retirement payouts at any age, so the full taxable amount joins your other income. The latest schedules on the FTB site when we checked were those for 2025: rates from 1 % to 12.3 %, and the Behavioral Health Services Tax of 1 % on taxable income above $1 million. The 2026 tables were not out. The calculator therefore leaves the rate field for you: type the marginal rate from your last California return; left at zero, it counts the ${K.pct(ca, 1)} surcharge and nothing else.</p>
<h2>Building a pre-59½ budget in California</h2>
<p>For an early retiree living in the state, the cost gap between penalized and unpenalized money is wider than elsewhere: ${both} of surcharges on one side, zero on the other. That favors the sources no penalty touches in the bridge years: Roth contributions, a taxable brokerage account, a ${h.a('457b-early-withdrawal', 'governmental 457(b)')}, or the 401(k) of the employer you leave at 55. A ${h.a('roth-conversion-ladder', 'conversion ladder')} started early keeps the IRA out of the penalty zone altogether. The ${h.a('state-tax-on-retirement-withdrawals', 'state comparison page')} shows how far other states sit from this model.</p>
`,
  faqs: [
    { q: 'Does California charge its own penalty on a 401(k) withdrawal before 59½?', a: `Yes. The part of an early distribution included in California income owes an additional ${K.pct(ca, 1)} tax, computed on form FTB 3805P. It applies to qualified plans such as a 401(k) or 403(b) and to IRAs, and it is separate from the federal ${K.pct(fed, 0)}. Together they reach ${both} of the taxable amount when no exception applies.` },
    { q: 'If the IRS waives my 10 % under the rule of 55, does California waive its 2.5 % too?', a: 'Generally yes, because California follows the federal exceptions for early distributions in most cases. The Franchise Tax Board adds that it does not conform to every federal exception, so the safe step is to find the exception code you use in the FTB 3805P instructions for the tax year of the payout before you file.' },
    { q: 'What does an early SIMPLE IRA withdrawal cost in California during the first two years?', a: `California charges 6 % instead of ${K.pct(ca, 1)} on SIMPLE IRA money taken within the first two years of participation, and the federal additional tax rises to ${K.pct(simpleFed, 0)} in the same window. A ${K.usd(simpleAmt)} withdrawal therefore carries ${K.usd(simpleAmt * (simpleFed + simpleCa))} of surcharges before income tax.` },
    { q: 'Which California brackets apply to a retirement payout taxed in 2026?', a: 'The 2026 California schedules had not been published when we read the Franchise Tax Board site in October 2026. The 2025 schedules run from 1 % to 12.3 %, with an extra 1 % on taxable income above $1 million. Until the new tables appear, use the marginal rate shown on your latest California return.' },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'ira-early-withdrawal-penalty', 'early-withdrawal-penalty-exceptions', 'rule-of-55', '72t-calculator'],
});
