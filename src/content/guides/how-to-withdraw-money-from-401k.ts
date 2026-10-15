import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const wh = K.pct(E.planWithholding, 0);
// Case A: still working at 44, $70,000 salary, cashes out $30,000 from an old plan.
const a = K.tool('withholding', { amt: 30000, age: 44, st: 'single', oi: 70000 });
const aw = K.early({ amount: 30000, age: 44, account: 'oldPlan', status: 'single', otherIncome: 70000 });
// Case B: retired at 52, no other income, same $30,000.
const b = K.early({ amount: 30000, age: 52, account: 'oldPlan', status: 'single' });
// Case C: rule of 55 at 56, joint, no other income.
const c = K.early({ amount: 30000, age: 56, account: 'plan', exception: 'separation55', status: 'joint' });
// Gross-up: $20,000 in hand at 47 with $60,000 of other income.
const g = K.grossForNet(20000, { age: 47, account: 'oldPlan', status: 'single', otherIncome: 60000 });
const rows = [10000, 25000, 50000, 100000].map((x) => { const r = K.early({ amount: x, age: 50, account: 'oldPlan', status: 'single' }); const owed = r.federal + r.penalty; return [K.usd(x), K.usd(r.withheld), K.usd(r.federal), K.usd(r.penalty), owed > r.withheld ? `${K.usd(owed - r.withheld)} due` : `${K.usd(r.withheld - owed)} back`]; });

export default defineGuide({
  id: 'how-to-withdraw-money-from-401k',
  group: 'access',
  order: 30,
  slug: 'how-to-withdraw-money-from-401k',
  nav: 'How to withdraw from a 401(k)',
  card: 'The request, the 20 % withheld, the 1099-R and the gap at tax time',
  title: 'Withdraw Money From a 401(k) in 2026: Steps, 20 % and Forms',
  description: `Withdraw money from a 401(k) in 2026: the request, the ${wh} the plan must withhold, Form 1099-R, Form 5329, and the gap between withholding and real tax.`,
  h1: 'How to withdraw money from a 401(k), step by step',
  intro: `A cash payment from a 401(k) arrives with ${wh} already taken for federal income tax, and that ${wh} is almost never the tax you really owe.`,
  resume: `To withdraw money from a 401(k) you ask the plan administrator for a distribution, choose between a payment to yourself and a direct rollover, and settle the tax on your return the next spring. If the payment comes to you and is an eligible rollover distribution, the plan must withhold ${wh} for federal income tax, even when you plan to roll it over later; a direct rollover to an IRA or another plan has no withholding. The plan then sends Form 1099-R, whose box 7 code tells the IRS whether the ${pen} additional tax applies. The withholding rarely matches the bill: a 44-year-old earning ${K.usd(70000)} who cashes out ${K.usd(30000)} has ${K.usd(aw.withheld)} withheld but owes ${K.usd(aw.federal + aw.penalty)}, while a 52-year-old with no other income owes ${K.usd(b.federal + b.penalty)} on the same check. Some plans also refuse partial withdrawals, so read the plan rules first. The calculator above shows the gap for your income.`,
  body: (h) => `
<h2>Step one: find out what your plan allows</h2>
<p>The law sets the taxes; the plan document sets the menu. Before asking for money, get the summary plan description and look for three answers: whether a former employee can take any amount at any time or only the whole balance, whether installments are offered, and how long processing takes. A plan that only pays lump sums can push a large balance onto one tax return. Active employees face tighter limits still, often loans and hardship withdrawals only.</p>
<h2>Step two: choose who receives the money</h2>
<p>Publication 575 describes two routes for an eligible rollover distribution (${h.src('pub575', 'Publication 575')}). The direct rollover sends the money straight to an IRA or to another plan that accepts it: no tax is withheld and nothing is taxed. The payment-to-you option sends a check or a transfer to your bank, and "the payer must withhold ${wh} of it", even if you intend to put the money into an IRA within the 60 days the law allows.</p>
<p>That last case catches people. The full amount counts as distributed although you received only 80 % of it. To roll over the whole ${K.usd(30000)} within 60 days, you must find the ${K.usd(30000 * E.planWithholding)} withheld from other savings; whatever you do not put back is taxed, and if you are under 59½ the ${pen} applies to it too, withheld part included. Withholding is not required on payments under $200 in the year from the same plan, and a direct rollover avoids it entirely.</p>
<p>One more route exists without your asking. A small balance paid out without your consent before age 62 or normal retirement age is a mandatory distribution; above $1,000, the plan must roll it automatically into an IRA unless you choose otherwise.</p>
<h2>Step three: the check, and what really comes due</h2>
<p>The ${wh} is a flat deposit toward your tax. It ignores your bracket, your other income and the ${pen}. Three people asking for ${K.usd(30000)} in 2026 show how far it can miss.</p>
<p>Still working at 44 with ${K.usd(70000)} of salary, the withdrawal lands in the 22 % bracket: ${K.usd(aw.federal)} of income tax and ${K.usd(aw.penalty)} of additional tax against ${K.usd(aw.withheld)} withheld. ${a.label}: ${a.value}. Retired at 52 with nothing else coming in, the standard deduction of ${K.usd(K.P.tax.standardDeduction.single)} shelters part of it: ${K.usd(b.federal)} of tax plus ${K.usd(b.penalty)} for the early payment, so ${K.usd(b.withheld - b.federal - b.penalty)} comes back as a refund. A married couple using the rule of 55 at 56 owes ${K.usd(c.federal)} in federal tax on it, yet the plan still keeps ${K.usd(c.withheld)} until they file.</p>
${h.table(['Paid to you at 50', 'Withheld (20 %)', 'Income tax', '10 % additional tax', 'At filing'], rows, 'Single filer, no other income in 2026, old 401(k), no exception. Engine of this site, Rev. Proc. 2025-32 brackets.', ['r', 'r', 'r', 'r', 'r'])}
${h.mini('withholding', { t: 'Your check against your real bill', p: ['amt', 'oi'], d: { amt: 18000, age: 53, st: 'single', oi: 0 } })}
<p>When the withholding falls short, Topic 558 warns that you may have to make estimated tax payments, since a penalized payment often needs more than ${wh} (${h.src('tc558', 'Topic 558')}).</p>
<h2>Asking for the right gross amount</h2>
<p>If the goal is a fixed sum in hand after every tax, ask for more. Someone of 47 with ${K.usd(60000)} of other income who needs ${K.usd(20000)} net has to take about ${K.usd(g.gross)}: ${K.usd(g.federal)} of federal tax and ${K.usd(g.penalty)} of additional tax come out of it. The ${h.a('401k-early-withdrawal-calculator', 'early withdrawal calculator')} works that figure for any state.</p>
<h2>Step four: Form 1099-R and Form 5329</h2>
<p>In January the plan mails Form 1099-R. Box 7 carries the distribution code, and the IRS reads it to decide whether the ${pen} is owed. Code 1 means an early payment with no known exception. If the tax is owed and code 1 is printed, you report the ${pen} directly on Schedule 2 of Form 1040, line 8, without Form 5329. If an exception does apply, such as the rule of 55, a 72(t) series or medical expenses above 7.5 % of adjusted gross income, and the code does not show it, you file Form 5329 and enter the exception number yourself (${h.src('irs_exceptions', 'IRS exceptions table')}). A rule of 55 payment printed with code 1 is the usual case for that correction.</p>
<h2>What a withdrawal does to the rest of your year</h2>
<p>Every pre-tax dollar taken adds to adjusted gross income. For someone buying health coverage on the Marketplace, that income also sets the premium credit, and a large cash-out can cross the line where the credit stops; the ${h.a('aca-subsidy-cliff', 'subsidy cliff page')} shows where it sits. Before 59½, the ${h.a('when-can-you-draw-401k', 'draw-age page')} tells you which accounts would avoid the ${pen} altogether.</p>
`,
  faqs: [
    { q: 'Why did my 401(k) withdrawal check come with 20 % missing?', a: `Because a payment of an eligible rollover distribution made to you requires the plan to withhold ${wh} for federal income tax. It is a prepayment, not the final tax. On ${K.usd(30000)} the plan keeps ${K.usd(30000 * E.planWithholding)}; at filing you either pay the difference or get a refund. A direct rollover to an IRA avoids the withholding.` },
    { q: 'Can I withdraw money from my 401(k) and put it back within 60 days?', a: `Yes, as a rollover to an IRA or another plan within 60 days. The catch is the ${wh} withheld: to roll over the whole amount you replace it from other money. Any part not rolled over is taxable, and under 59½ it also owes the ${pen} additional tax, withheld part included.` },
    { q: 'Do I need Form 5329 when I withdraw from my 401(k) under the rule of 55?', a: 'Only if box 7 of your Form 1099-R does not show the exception. If it carries code 1, which means an early distribution with no known exception, the IRS needs your correction. In that case you file Form 5329 with your return and enter the exception number for separation from service in or after the year you turned 55.' },
    { q: 'How much should I withdraw from my 401(k) to keep $20,000 after tax?', a: `It depends on your income and age. At 47, single, with ${K.usd(60000)} of other income and no exception, the engine of this site gives about ${K.usd(g.gross)}: ${K.usd(g.federal)} of federal income tax and ${K.usd(g.penalty)} of additional tax come out of it, before any state tax.` },
    { q: 'Can my 401(k) plan refuse a partial withdrawal after I leave?', a: 'Yes. The tax code allows withdrawals but the plan document decides the forms of payment. Some plans pay former employees any amount at any time, others only the full balance or fixed installments. Ask the administrator in writing and read the summary plan description before you count on partial payments.' },
  ],
  tool: 'withholding',
  related: ['when-can-you-draw-401k', '401k-early-withdrawal-calculator', 'tax-on-401k-withdrawal', 'rule-of-55', '401k-withdrawal-penalty'],
  sources: ['pub575', 'tc558', 'irs_exceptions', 'rp_2025_32'],
});
