import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0), wh = K.pct(E.planWithholding, 0);
const sd = K.P.tax.standardDeduction.single;
type Acc = 'plan' | 'oldPlan';
const cases: Array<{ who: string; age: number; amt: number; oi: number; acc: Acc; ex?: string }> = [
  { who: 'Job change, cash-out', age: 35, amt: 20000, oi: 70000, acc: 'plan' },
  { who: 'Mid-career, large withdrawal', age: 42, amt: 50000, oi: 90000, acc: 'plan' },
  { who: 'Laid off, no other income', age: 48, amt: 30000, oi: 0, acc: 'oldPlan' },
  { who: 'Retired at 53', age: 53, amt: 60000, oi: 40000, acc: 'plan' },
  { who: 'Left in the year of 55', age: 56, amt: 60000, oi: 40000, acc: 'plan', ex: 'separation55' },
];
const rows = cases.map((c) => ({ ...c, r: K.early({ amount: c.amt, age: c.age, account: c.acc, exception: c.ex ?? 'none', status: 'single', otherIncome: c.oi }) }));
const settle = (r: ReturnType<typeof K.early>) => r.withheld - r.federal - r.penalty;
const settleTxt = (x: number) => (x >= 0 ? `${K.usd(x)} refund` : `${K.usd(-x)} due`);
const [r35, r42, r48, r53, r56] = rows;
const ca = K.stateTax('california', 40000, 45), ga = K.stateTax('georgia', 40000, 45), il = K.stateTax('illinois', 40000, 45);
const caPen = K.S('california').earlyPenalty ?? 0;
const birthCap = K.P.exceptions.find((x) => x.id === 'birth')?.cap ?? 0;

export default defineGuide({
  id: '401k-withdrawal-penalty',
  group: 'access',
  order: 25,
  slug: '401k-withdrawal-penalty',
  nav: '401(k) withdrawal penalty',
  card: `The ${pen} on top of income tax, the ${wh} withheld and the bill at filing`,
  title: '401(k) Withdrawal Penalty 2026: The Real Cost at Every Age',
  description: `401(k) withdrawal penalty in 2026: ${pen} of the taxable amount before 59½, plus federal and state income tax, with ${wh} withheld at payout. Five cases shown.`,
  h1: '401(k) withdrawal penalty: what an early payout really costs in 2026',
  intro: `Before 59½, a 401(k) payout owes a ${pen} additional tax on top of income tax, and the ${wh} the plan withholds is rarely the amount you end up owing.`,
  resume: `The 401(k) withdrawal penalty is an additional tax of ${pen} on the taxable part of any distribution received before age 59½, set by section 72(t) of the tax code and reported on Form 5329 unless an exception applies. It comes on top of federal income tax at your 2026 bracket and of any state tax; California adds its own ${K.pct(caPen, 1)} early tax. The plan withholds ${wh} of any eligible rollover distribution paid to you, which settles nothing: the real bill is computed on your return. A single 42-year-old earning ${K.usd(90000)} who takes ${K.usd(50000)} pays ${K.usd(r42.r.penalty)} of penalty and about ${K.usd(r42.r.federal)} of federal tax, keeps ${K.usd(r42.r.net)} before state tax, and still owes ${K.usd(-settle(r42.r))} at filing after the ${K.usd(r42.r.withheld)} withheld. Leaving the employer in or after the year you turn ${E.ruleOf55Age} removes the ${pen} on that plan, and a dozen other exceptions exist.`,
  body: (h) => `
<h2>Three charges, one withdrawal</h2>
<p>Every dollar taken from a pre-tax 401(k) before 59½ meets three separate charges. Federal income tax treats it as ordinary income for the year, stacked on wages or any other income. The ${pen} additional tax of section 72(t) applies to the part of the distribution that is includible in gross income, so after-tax contributions coming back to you are not penalized (${h.src('irs_sepp', 'IRS SEPP FAQ, Q&A 1')}). State income tax, where there is one, comes last. The IRS calls the ${pen} an additional tax rather than a penalty, but it lands on the same return and works the same way: no deduction, no bracket, a flat ${pen}.</p>
<p>Because the income tax is progressive, the same withdrawal costs very different amounts depending on what else you earn that year. That is the whole difference between the five cases below.</p>
${h.table(['Situation', 'Age', 'Withdrawal', 'Other income', `${pen} tax`, 'Federal tax', `${wh} withheld`, 'Kept (federal)', 'At filing'],
  rows.map((c) => [c.who, String(c.age), K.usd(c.amt), K.usd(c.oi), K.usd(c.r.penalty), K.usd(c.r.federal), K.usd(c.r.withheld), K.usd(c.r.net), settleTxt(settle(c.r))]),
  `Single filer, 2026 brackets and standard deduction (${K.usd(sd)}), no state tax. "At filing" compares the ${wh} withheld with the federal tax and the ${pen} on the withdrawal; wages are assumed to have their own withholding.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<h2>Why the 35-year-old and the 48-year-old pay such different rates</h2>
<p>The cash-out at 35 sits on ${K.usd(r35.oi)} of salary, so every dollar is taxed at the ${K.pct(r35.r.marginal, 0)} bracket: ${K.usd(r35.r.federal)} of federal tax plus ${K.usd(r35.r.penalty)} of additional tax on ${K.usd(r35.amt)}, which leaves ${K.usd(r35.r.net)}. The laid-off 48-year-old has no other income. The first ${K.usd(sd)} of the withdrawal falls under the standard deduction, the rest in the 10 % and 12 % brackets, so the federal tax is only ${K.usd(r48.r.federal)} on ${K.usd(r48.amt)}; the ${pen} still applies in full, ${K.usd(r48.r.penalty)}, because the penalty ignores brackets. For a year with no paycheck, the penalty is often the larger of the two charges.</p>
${h.mini('penalty', { t: 'The same withdrawal at a different age', p: ['age'], d: { amt: 50000, age: 42, acc: 'plan', oi: 90000, state: 0 } })}
<h2>The ${wh} withheld is a deposit, not the bill</h2>
<p>An early payout from a 401(k) is usually an eligible rollover distribution, and Publication 575 requires the payer to withhold ${wh} when it is paid to you rather than rolled over (${h.src('pub575', 'IRS Publication 575')}). That ${wh} counts as a payment toward your tax for the year. It is not tuned to your situation. In the table, the 48-year-old gets a ${settleTxt(settle(r48.r))} when filing, because ${wh} was more than the tax and penalty together; the 42-year-old with a ${K.usd(90000)} salary owes another ${K.usd(-settle(r42.r))}, because the withdrawal ran into the 22 % and 24 % brackets and the ${pen} came on top.</p>
<p>Publication 575 adds a detail that matters for anyone who changes their mind. The full amount counts as distributed even though only ${K.pct(1 - E.planWithholding, 0)} reaches you. If you roll the money into an IRA or another plan within 60 days, you must replace the withheld ${wh} from other funds to roll over the whole amount; any part you do not roll over, withheld tax included, is taxable and, before 59½, owes the ${pen}. A direct rollover avoids the withholding altogether.</p>
<h2>State tax: from zero to a second penalty</h2>
<p>The state line moves the total more than most people expect. On a ${K.usd(40000)} early withdrawal at 45, Illinois taxes nothing, because it subtracts 401(k) payouts at any age (${K.usd(il.total)}). Georgia taxes it in full at its flat rate, ${K.usd(ga.total)}. California treats it as income at its own brackets and adds a ${K.pct(caPen, 1)} early distribution tax of its own, ${K.usd(ca.early)} on that amount before any income tax. The ${h.a('state-tax-on-retirement-withdrawals', 'state comparison')} covers the eleven states on file.</p>
<h2>Where the ${pen} does not apply</h2>
<p>The rule of 55 is the exception most relevant to early retirement: leave the employer in or after the calendar year you turn ${E.ruleOf55Age} (${E.publicSafetyAge} for qualified public safety employees) and that employer's plan pays without the ${pen}. The 56-year-old in the table shows the effect: same withdrawal and same income as the 53-year-old, but no additional tax, ${K.usd(r53.r.penalty)} saved. Other exceptions cover a 72(t) series of equal payments, disability, a birth or adoption up to ${K.usd(birthCap)} per child, unreimbursed medical bills above the 7.5 % of adjusted gross income floor, an ex-spouse paid under a court order and several more, each with its own limits; the ${h.a('early-withdrawal-penalty-exceptions', 'full list of exceptions')} sets them side by side.</p>
<p>When a distribution meets an exception but box 7 of Form 1099-R does not show it, the IRS asks you to claim it on Form 5329 (${h.src('irs_exceptions', 'IRS exceptions table')}). Plans code what they know; a reason they do not know about, such as qualifying medical expenses, is yours to report.</p>
<h2>Before taking the money</h2>
<p>Two checks change the numbers more than any other. First, which plan: an old 401(k) from a previous job is not covered by the rule of 55 even if you are 56, while the plan of the employer you leave is. Second, which year: a withdrawal in a year with no salary can fall largely in the 0 %, 10 % and 12 % zone, while the same amount in a working year is taxed at the top of your bracket. Splitting a payout across December and January puts it on two returns. The ${h.a('401k-early-withdrawal-calculator', 'early withdrawal calculator')} works backwards from the cash you need, and the ${h.a('tax-on-401k-withdrawal', 'withdrawal tax page')} details the brackets.</p>
${h.mini('penalty', { t: 'Laid off: what other income changes', p: ['oi'], d: { amt: 30000, age: 48, acc: 'oldPlan', oi: 0, state: 0 } })}
`,
  faqs: [
    { q: 'Is the 401(k) withdrawal penalty 10 % of the whole amount or only the taxable part?', a: `Only the taxable part. Section 72(t) applies the ${pen} to the portion of the distribution includible in gross income. After-tax contributions that come back to you are not penalized. On a fully pre-tax 401(k), the taxable part is the whole withdrawal, so ${K.usd(50000)} before 59½ means ${K.usd(50000 * E.penalty)} of additional tax.` },
    { q: 'Does the 20 % withheld from my early 401(k) withdrawal cover the penalty?', a: `Sometimes, sometimes not. The ${wh} is a prepayment. A single 48-year-old with no other income taking ${K.usd(r48.amt)} owes ${K.usd(r48.r.federal + r48.r.penalty)} of federal tax and penalty against ${K.usd(r48.r.withheld)} withheld, a refund. A 42-year-old with a ${K.usd(90000)} salary taking ${K.usd(r42.amt)} owes ${K.usd(-settle(r42.r))} more at filing.` },
    { q: 'How do I report the 401(k) early withdrawal penalty on my tax return?', a: `The IRS exceptions page points to Form 5329 for distributions subject to the ${pen} additional tax on early distributions, including those from a 401(k). The same form is where you claim an exception when box 7 of your Form 1099-R does not show one, for example a medical expense the plan could not know about.` },
    { q: 'Do I pay the 401(k) withdrawal penalty if I left my job at 56?', a: `Not on the plan of the employer you left, if you left in or after the calendar year you turned ${E.ruleOf55Age}. In the example on this page, a ${K.usd(60000)} withdrawal at 56 with ${K.usd(40000)} of other income owes no additional tax, against ${K.usd(r53.r.penalty)} for someone who left at 53. Income tax is the same in both cases.` },
    { q: 'Does California charge its own penalty on an early 401(k) withdrawal?', a: `Yes. California adds an early distribution tax of ${K.pct(caPen, 1)} before 59½, reported on form FTB 3805P, on top of its income tax and the federal ${pen}. On ${K.usd(40000)}, that is ${K.usd(ca.early)} before California income tax. Most other states simply tax the payout as income, and a few exclude it.` },
  ],
  tool: 'penalty',
  related: ['401k-early-withdrawal-calculator', 'early-withdrawal-penalty-exceptions', 'rule-of-55', 'tax-on-401k-withdrawal', 'state-tax-on-retirement-withdrawals', 'ira-early-withdrawal-penalty'],
  sources: ['irs_exceptions', 'pub575', 'tc558', 'rp_2025_32', 'irs_sepp'],
});
