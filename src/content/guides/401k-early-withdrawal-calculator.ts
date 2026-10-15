import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0), wh = K.pct(E.planWithholding, 0);
const keep = 1 - E.planWithholding;
// Main table: married couple filing jointly, one spouse 46 takes money from an old 401(k), $55,000 of other income, no state tax.
const base = { age: 46, account: 'oldPlan' as const, status: 'joint' as const, otherIncome: 55000, stateRate: 0 };
const nets = [10000, 25000, 50000, 80000];
const grid = nets.map((n) => ({ n, g: K.grossForNet(n, base) }));
const [g10, g25, g50, g80] = grid;
// The same $25,000 in hand in five situations.
const gaRate = K.S('georgia').rate.flat ?? 0;
const sit = [
  { who: 'Single, 51, laid off, no other income', p: { age: 51, account: 'oldPlan' as const, status: 'single' as const, otherIncome: 0 } },
  { who: 'Joint, 46, $55,000 of other income', p: base },
  { who: 'Single, 44, $120,000 salary', p: { age: 44, account: 'oldPlan' as const, status: 'single' as const, otherIncome: 120000 } },
  { who: `Same, living in Georgia (${K.pct(gaRate, 2)})`, p: { age: 44, account: 'oldPlan' as const, status: 'single' as const, otherIncome: 120000, stateRate: gaRate } },
  { who: 'Single, 57, left the employer at 55', p: { age: 57, account: 'plan' as const, exception: 'separation55', status: 'single' as const, otherIncome: 0 } },
].map((x) => ({ ...x, g: K.grossForNet(25000, x.p) }));
const [sLaid, sJoint, sHigh, sGa, s55] = sit;
const quick = 25000 / (1 - E.penalty - sHigh.g.marginal);

export default defineGuide({
  id: '401k-early-withdrawal-calculator',
  group: 'access',
  order: 26,
  slug: '401k-early-withdrawal-calculator',
  nav: '401(k) early withdrawal calculator',
  card: `How much to take out to keep the cash you need, after the ${pen} and tax`,
  title: '401(k) Early Withdrawal Calculator 2026: Gross Up for Cash',
  description: `401(k) early withdrawal calculator for 2026: enter the cash you need and get the gross after the ${pen} penalty, federal and state tax and the ${wh} withheld.`,
  h1: '401(k) early withdrawal calculator: how much to take out for the cash you need',
  intro: `Start from the amount you need to keep, and the calculator works backwards through the ${pen} additional tax and the 2026 brackets to the gross withdrawal.`,
  resume: `To keep a given amount from a 401(k) before 59½, you have to withdraw more than that amount, because the ${pen} additional tax, federal income tax and any state tax all come out of the same payout. This calculator starts from the net you need and searches the gross withdrawal that leaves exactly that after taxes, using the 2026 brackets of Rev. Proc. 2025-32. A married couple with ${K.usd(55000)} of other income who need ${K.usd(25000)} must take about ${K.usd(g25.g.gross)} from an old 401(k): ${K.usd(g25.g.penalty)} of penalty and ${K.usd(g25.g.federal)} of federal tax. A single earner on ${K.usd(120000)} needs ${K.usd(sHigh.g.gross)} for the same ${K.usd(25000)}, and someone covered by the rule of 55 with no other income needs only ${K.usd(s55.g.gross)}. The plan then withholds ${wh} of the gross, so the cash on the day of payout differs from what you keep once the return is filed.`,
  body: (h) => `
<h2>Why a quick division misses the real gross</h2>
<p>The quick rule people use is to divide the cash they need by one minus the ${pen} and their tax bracket. For the single earner on ${K.usd(120000)}, whose withdrawal is taxed at ${K.pct(sHigh.g.marginal, 0)}, that gives ${K.usd(quick)} for ${K.usd(25000)} in hand. The calculator lands at ${K.usd(sHigh.g.gross)}. The gap is small there because the whole withdrawal sits in one bracket. It grows when the payout crosses a bracket line or starts under the standard deduction, which is the usual case in the first year of early retirement: with no other income, the first dollars are taxed at zero, then at 10 %, then at 12 %, and the ${pen} applies to all of them. The engine solves for the gross by repeating the full 2026 tax calculation until the net matches to the cent.</p>
${h.table(['Cash you need', 'Withdraw', `${pen} tax`, 'Federal tax', 'Top bracket reached', `Paid out after ${wh} withheld`, 'At filing'],
  grid.map(({ n, g }) => [K.usd(n), K.usd(g.gross), K.usd(g.penalty), K.usd(g.federal), K.pct(g.marginal, 0), K.usd(g.gross * keep), g.withheld - g.penalty - g.federal >= 0 ? `${K.usd(g.withheld - g.penalty - g.federal)} refund` : `${K.usd(g.penalty + g.federal - g.withheld)} due`]),
  `Married filing jointly, age 46, old 401(k), ${K.usd(55000)} of other income, no state tax. 2026 brackets and standard deduction (Rev. Proc. 2025-32).`, ['r', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Read the rows from top to bottom and the cost per dollar climbs. Keeping ${K.usd(10000)} costs ${K.usd(g10.g.gross - g10.n)} in tax and penalty; keeping ${K.usd(80000)} costs ${K.usd(g80.g.gross - g80.n)}, because the larger withdrawal pushes part of the couple's income from the ${K.pct(g10.g.marginal, 0)} bracket into the ${K.pct(g80.g.marginal, 0)} bracket. Two smaller withdrawals in two tax years often cost less than one large one.</p>
${h.mini('net', { t: 'Laid off at 51, nothing else coming in', p: ['net'], d: { net: 18000, age: 51, acc: 'oldPlan', st: 'single', oi: 0, state: 0 } })}
<h2>The same ${K.usd(25000)} in five lives</h2>
<p>The net you need is one input; your year is the other. The table below holds the target at ${K.usd(25000)} and changes the person.</p>
${h.table(['Situation', 'Withdraw', `${pen} tax`, 'Federal tax', 'State tax', 'Cost per dollar kept'],
  sit.map((x) => [x.who, K.usd(x.g.gross), K.usd(x.g.penalty), K.usd(x.g.federal), K.usd(x.g.state), K.pct((x.g.gross - 25000) / 25000, 0)]),
  'Rule of 55 row: plan of the employer left in or after the year of the 55th birthday, so no additional tax. Georgia row: flat rate on file, no exclusion before 62.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The laid-off 51-year-old is the cheapest of the penalized cases, ${K.usd(sLaid.g.gross)} for ${K.usd(25000)}, because the standard deduction and the low brackets absorb most of the income tax; the ${pen} is then the largest single cost. The high earner pays the most, and moving to a state with a flat income tax adds another ${K.usd(sGa.g.gross - sHigh.g.gross)} to the gross. The rule of 55 case shows what an exception is worth: with the ${pen} gone, ${K.usd(s55.g.gross)} is enough. The ${h.a('401k-withdrawal-penalty', '401(k) withdrawal penalty page')} breaks down each charge.</p>
<h2>Cash on payout day versus cash after filing</h2>
<p>The calculator answers what you keep for the year. On the day of the payout you receive something else: the gross minus the ${wh} the plan must withhold from an eligible rollover distribution paid to you (${h.src('pub575', 'IRS Publication 575')}). For the couple needing ${K.usd(50000)}, the plan pays ${K.usd(g50.g.gross * keep)} on a gross of ${K.usd(g50.g.gross)}: more than they need on payout day, but the extra ${K.usd(g50.g.gross * keep - g50.n)} is owed back when the return is filed, so it should stay set aside. The laid-off 51-year-old is in the opposite position. The gross of ${K.usd(sLaid.g.gross)} pays only ${K.usd(sLaid.g.gross * keep)} on the day, short of the ${K.usd(25000)} needed, and the difference comes back as a refund the following spring. If the full amount is needed right away, either ask for a larger gross, about ${K.usd(25000 / keep)} to receive ${K.usd(25000)} after withholding, or keep a cash buffer until filing. A larger gross raises the tax a little, so run the number again with the new amount.</p>
<h2>From a monthly budget to one yearly figure</h2>
<p>Most people arrive with a monthly number: ${K.usd(3500)} a month to cover a mortgage and groceries until a new job or until the next account opens. The tax year is what matters, so enter the twelve months together, ${K.usd(3500 * 12)}, rather than one month at a time; the brackets and the standard deduction apply to the year, and a monthly calculation would show a lower rate than you will actually pay. If the need covers only part of the year, enter the months that fall in this calendar year and run the rest again in January with next year's other income.</p>
<p>The order of withdrawals across accounts can matter as much as the amount. Money from an IRA has no mandatory ${wh} withholding, money from a governmental 457(b) carries no ${pen} additional tax at any age apart from amounts rolled in from another plan or an IRA, and Roth IRA contributions come out free of both. Choosing a different account in the calculator shows how much each source costs for the same cash.</p>
<h2>Before you type a number</h2>
<ul>
<li>Pick the right account in the calculator. An old 401(k) from a former employer never qualifies for the rule of 55; the plan of the employer you leave can.</li>
<li>Count all other taxable income for the year, including a spouse's wages on a joint return, unemployment pay and Roth conversions.</li>
<li>Use your state's real rate. Some states exclude retirement payouts, others add a tax; the ${h.a('state-tax-on-retirement-withdrawals', 'state page')} lists eleven.</li>
<li>Roth IRA contributions come out first and owe neither tax nor penalty. Choosing "Roth IRA: your own contributions" in the account list shows the effect.</li>
</ul>
<h2>What the calculator leaves out</h2>
<p>It assumes the whole withdrawal is pre-tax money. If part of your 401(k) is after-tax contributions, that part is neither taxed nor penalized, so the gross you need is lower. It does not apply credits, itemized deductions or the net investment income tax. It does not model a payout that changes your marketplace health premium: a larger withdrawal raises the modified adjusted gross income (MAGI) used for the premium tax credit, which the ${h.a('aca-subsidy-cliff', 'ACA subsidy page')} measures. And it uses the federal rules for 2026 only.</p>
${h.mini('net', { t: 'A working spouse changes the answer', p: ['oi'], d: { net: 25000, age: 49, acc: 'oldPlan', st: 'joint', oi: 85000, state: 0 } })}
`,
  faqs: [
    { q: 'How much do I need to withdraw from my 401(k) early to get $25,000 in hand?', a: `It depends on your other income. With no other income, single, at 51, about ${K.usd(sLaid.g.gross)}. Married with ${K.usd(55000)} of other income, about ${K.usd(sJoint.g.gross)}. Single on a ${K.usd(120000)} salary, ${K.usd(sHigh.g.gross)}, before state tax. Each figure includes the ${pen} additional tax and 2026 federal income tax.` },
    { q: `Does a 401(k) early withdrawal calculator include the ${wh} withholding?`, a: `This one shows it separately. The ${wh} withheld is a prepayment of tax, not an extra cost, so the net you keep for the year does not depend on it. It does change the cash on payout day: on a gross of ${K.usd(g50.g.gross)} the plan pays ${K.usd(g50.g.gross * keep)}, and the difference is settled on your return.` },
    { q: 'Why does a bigger 401(k) early withdrawal cost more per dollar?', a: `Because federal income tax is progressive and the ${pen} is not. A larger withdrawal climbs into higher brackets. For a couple with ${K.usd(55000)} of other income, keeping ${K.usd(10000)} reaches the ${K.pct(g10.g.marginal, 0)} bracket, while keeping ${K.usd(80000)} reaches ${K.pct(g80.g.marginal, 0)}. Spreading withdrawals over two tax years lowers the average cost.` },
    { q: 'Can a 401(k) withdrawal penalty calculator show the rule of 55?', a: `Yes, if you choose the plan of the employer you are leaving and your age is 55 or more in the year of separation. In this site's example, a single 57-year-old with no other income who left at 55 needs ${K.usd(s55.g.gross)} to keep ${K.usd(25000)}, with no additional tax, against ${K.usd(sLaid.g.gross)} for a laid-off 51-year-old.` },
  ],
  tool: 'net',
  related: ['401k-withdrawal-penalty', 'how-to-withdraw-money-from-401k', 'tax-on-401k-withdrawal', 'rule-of-55', 'aca-subsidy-cliff'],
  sources: ['rp_2025_32', 'pub575', 'irs_exceptions', 'tc558'],
});
