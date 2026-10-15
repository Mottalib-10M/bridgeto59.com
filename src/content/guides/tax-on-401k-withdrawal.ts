import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.tax;
const sd = T.standardDeduction;
const fed = (x: number, s: 'single' | 'joint' = 'single') => K.tax({ ordinary: x, status: s });
const amounts = [20000, 40000, 60000, 80000, 120000];
const at50 = K.early({ amount: 50000, age: 61, account: 'oldPlan', status: 'single' });
const early50 = K.early({ amount: 50000, age: 52, account: 'oldPlan', status: 'single' });
const onTop = K.early({ amount: 30000, age: 60, account: 'oldPlan', status: 'single', otherIncome: 90000 });

export default defineGuide({
  id: 'tax-on-401k-withdrawal',
  group: 'tax',
  order: 50,
  slug: 'tax-on-401k-withdrawal',
  nav: 'Tax on a 401(k) withdrawal',
  card: '2026 brackets on your payout, marginal and average rate',
  title: '401(k) Withdrawal Tax 2026: Federal Brackets on Your Payout',
  description: `401(k) withdrawal tax in 2026: ${K.usd(Math.round(at50.federal))} of federal tax on ${K.usd(50000)} for a single retiree with no other income, after the ${K.usd(sd.single)} deduction. Your own figure here.`,
  h1: 'How much federal tax a 401(k) withdrawal costs in 2026',
  intro: `A pre-tax 401(k) or IRA payout is ordinary income: the 2026 standard deduction comes off first, then the brackets start at ${K.pct(T.brackets.single[0][1], 0)}.`,
  resume: `Money taken from a traditional 401(k), 403(b), 457(b) or IRA is taxed as ordinary income in the year you receive it, at the same brackets as a salary. For 2026, Rev. Proc. 2025-32 sets the standard deduction at ${K.usd(sd.single)} for a single filer and ${K.usd(sd.joint)} for a married couple filing jointly, then ${K.pct(0.10, 0)} on the first ${K.usd(T.brackets.single[1][0])} of taxable income for a single filer (${K.usd(T.brackets.joint[1][0])} joint), ${K.pct(0.12, 0)} up to ${K.usd(T.brackets.single[2][0])} (${K.usd(T.brackets.joint[2][0])} joint), then ${K.pct(0.22, 0)}. A retiree with no other income who takes ${K.usd(50000)} pays ${K.usd(at50.federal)} of federal tax, an average of ${K.pct(at50.federal / 50000, 1)} although the top dollar is taxed at ${K.pct(at50.marginal, 0)}. Before 59½, unless an exception applies, the ${K.pct(K.P.early.penalty, 0)} additional tax comes on top: the same ${K.usd(50000)} at 52 costs ${K.usd(early50.federal + early50.penalty)}. The calculator above adds your other income and shows the bracket the withdrawal reaches.`,
  body: (h) => `
<h2>The same withdrawal, different bills</h2>
<p>What a withdrawal costs depends less on its size than on what else lands on the same return. In early retirement there is often no salary, so the first dollars fall into the standard deduction and the 10 % bracket. In the last year of work, the same withdrawal sits on top of a full salary and is taxed at the marginal rate of that salary. The table compares the federal tax on withdrawals of several sizes for a single filer and a married couple with no other income in 2026.</p>
${h.table(['Withdrawal', 'Single: tax', 'Single: average', 'Joint: tax', 'Joint: average'], amounts.map((a) => [K.usd(a), K.usd(fed(a).total), K.pct(fed(a).total / a, 1), K.usd(fed(a, 'joint').total), K.pct(fed(a, 'joint').total / a, 1)]), 'Federal income tax only, 2026 brackets and standard deduction (Rev. Proc. 2025-32), no other income, no credits.', ['r', 'r', 'r', 'r', 'r'])}
<p>For a couple, ${K.usd(80000)} of withdrawals costs ${K.usd(fed(80000, 'joint').total)}: the joint deduction and the wider 10 % and 12 % brackets keep the average rate low. That is the arithmetic behind the advice, common in early retirement circles, to draw pre-tax money every year in modest amounts rather than in a few large ones.</p>
${h.mini('tax', { t: 'Your withdrawal on top of other income', p: ['amt', 'oi'], d: { amt: 30000, oi: 90000, age: 60 } })}
<h2>Marginal rate, average rate</h2>
<p>The marginal rate is what the next dollar costs; the average rate is the whole bill divided by the withdrawal. They answer different questions. To decide whether to take an extra ${K.usd(10000)} this year or next, look at the marginal rate. To budget a year of spending, look at the average. Someone already earning ${K.usd(90000)} who takes ${K.usd(30000)} at 60 pays ${K.usd(onTop.federal)} on it, ${K.pct(onTop.federal / 30000, 1)}, because the whole amount falls in the ${K.pct(onTop.marginal, 0)} bracket.</p>
<h2>One big year or several small ones</h2>
<p>Because the deduction and the low brackets come back every January, the timing of withdrawals changes the total bill. A single retiree who needs ${K.usd(120000)} over two years pays ${K.usd(fed(120000).total)} by taking it all in one year, and ${K.usd(2 * fed(60000).total)} by taking ${K.usd(60000)} in each year: the second plan uses the deduction and the 10 % and 12 % brackets twice. The gap grows with the amount. The same logic explains why people who stop working at 50 often draw or convert a little pre-tax money every year from the start, instead of letting the 401(k) grow untouched until required distributions force large withdrawals in their seventies.</p>
<p>A lump-sum payout is the extreme case. Some plans pay a former employee only the whole balance; the full amount then lands on one return. Rolling it to an IRA by direct rollover keeps it untaxed until you withdraw it, at the cost, before 59½, of the rule of 55 on that money.</p>
<h2>The brackets for 2026</h2>
${h.table(['Rate', 'Single, taxable income over', 'Joint, taxable income over', 'Head of household, over'], T.brackets.single.map(([lo, r], i) => [K.pct(r, 0), K.usd(lo), K.usd(T.brackets.joint[i][0]), K.usd(T.brackets.head[i][0])]), `Rev. Proc. 2025-32, section 4.01. Add the standard deduction to read them as gross withdrawals: ${K.usd(sd.single)} single, ${K.usd(sd.joint)} joint, ${K.usd(sd.head)} head of household.`, ['l', 'r', 'r', 'r'])}
<h2>What is withheld is not what is owed</h2>
<p>A 401(k) payout made to you rather than rolled over has ${K.pct(K.P.early.planWithholding, 0)} withheld for federal tax (Publication 575). For a retiree with no salary the real bill is often well below that, and the difference comes back as a refund; for someone with a high salary it can be above, and the balance is due in April. The ${h.a('how-to-withdraw-money-from-401k', 'withholding calculator')} compares the two.</p>
<h2>Before 59½: the 10 % comes on top</h2>
<p>The additional tax is ${K.pct(K.P.early.penalty, 0)} of the taxable amount and is not affected by the brackets. At 52, with no exception, ${K.usd(50000)} costs ${K.usd(early50.federal)} of income tax plus ${K.usd(early50.penalty)} of additional tax. The exceptions that remove it (${h.a('rule-of-55', 'rule of 55')}, ${h.a('72t-calculator', '72(t) payments')}, a governmental 457(b)) leave the income tax unchanged.</p>
<h2>State tax, the other line</h2>
<p>Most states tax the withdrawal again, a few exclude it by age, Illinois at any age, and California adds 2.5 % before 59½. The ${h.a('state-tax-on-retirement-withdrawals', 'state comparison')} applies each rule we have read. The state that counts is the one where you live when you receive the money, which is why some early retirees move before their withdrawal years begin.</p>
<h2>What this page leaves out</h2>
<p>Credits, the alternative minimum tax and the 3.8 % net investment income tax are not modeled. Roth money withdrawn under the rules is not taxed at all, and long-term gains from a brokerage account follow their own 0 % and 15 % rates, explained on the ${h.a('zero-percent-capital-gains', '0 % capital gains page')}.</p>
`,
  faqs: [
    { q: 'Is a 401(k) withdrawal taxed at a flat rate?', a: `No. It is added to your other income and taxed through the same brackets as wages: in 2026, ${K.pct(0.10, 0)}, ${K.pct(0.12, 0)}, ${K.pct(0.22, 0)} and up. The ${K.pct(K.P.early.planWithholding, 0)} the plan withholds is only a prepayment; the real tax is settled on your return and can be lower or higher.` },
    { q: 'How much tax on a $50,000 401(k) withdrawal in 2026 with no other income?', a: `For a single filer, ${K.usd(at50.federal)} of federal income tax after the ${K.usd(sd.single)} standard deduction, about ${K.pct(at50.federal / 50000, 1)} on average. For a married couple filing jointly with no other income, ${K.usd(fed(50000, 'joint').total)}, thanks to the larger deduction. Before 59½ without an exception, add ${K.usd(5000)} of additional tax, and state income tax where you live.` },
    { q: 'Does taking money from my 401(k) push my salary into a higher bracket?', a: 'Only the dollars above each threshold are taxed at the higher rate. A withdrawal can move part of your income into the next bracket, but your salary keeps the rates it already had. The calculator shows the top bracket the withdrawal reaches with your other income.' },
    { q: 'Do I pay tax on 401(k) withdrawals after 59½?', a: `Yes. Age 59½ removes only the ${K.pct(K.P.early.penalty, 0)} additional tax. A traditional 401(k) payout remains ordinary income at any age and goes through the same brackets; only qualified Roth distributions come out tax-free. Many retirees pay less after 59½ simply because their salary has stopped, not because the withdrawal is treated differently.` },
  ],
  tool: 'tax',
  related: ['401k-withdrawal-penalty', 'zero-percent-capital-gains', 'how-to-withdraw-money-from-401k', 'state-tax-on-retirement-withdrawals', 'roth-conversion-ladder'],
  sources: ['rp_2025_32', 'pub575', 'irs_exceptions'],
});
