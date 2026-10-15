import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { PlanIn } from '../../lib/engine/plan';

const E = K.P.early;
// Worked case: 33 years old, $150,000 invested, $36,000 saved a year, $55,000 of yearly spending wanted.
const age = 33, bal = 150000, save = 36000, spend = 55000, r = 0.05, swr = 0.04;
const target = K.fireNumber(spend, swr);
const yrs = K.yearsTo(target, bal, save, r) ?? 0;
const yMore = K.yearsTo(target, bal, save + 10000, r) ?? 0;
const yLess = K.yearsTo(K.fireNumber(spend - 10000, swr), bal, save, r) ?? 0;
const yBoth = K.yearsTo(K.fireNumber(spend - 10000, swr), bal, save + 10000, r) ?? 0;
const at = age + yrs;
const gap = E.age - at;
const y = (x: number | null) => (x === null ? 'more than 80' : K.dec(x, 1));
const byReturn = [0.03, 0.04, 0.05, 0.06, 0.07].map((x) => [K.pct(x, 0), y(K.yearsTo(target, bal, save, x)), `about ${Math.ceil(age + (K.yearsTo(target, bal, save, x) ?? 80))}`]);
const bySave = [26000, 36000, 46000, 56000].map((c) => [K.usd(c), y(K.yearsTo(target, bal, c, r)), y(K.yearsTo(K.fireNumber(spend - 10000, swr), bal, c, r))]);
// Same person with the money split across accounts, run through the full plan (tax, health to 65, access rules).
const D: PlanIn = { age, spend, taxable: 20000, plan: 100000, ira: 0, roth: 30000, rothBasis: 25000, gov457: 0, savePlan: 24500, saveRoth: 7500, saveTaxable: 4000,
  r, swr, status: 'single', stateRate: 0, health: 7200, strategy: 'none', convert: 40000, gainShare: 0.4, publicSafety: false };
const pD = K.plan(D);
const D2: PlanIn = { ...D, savePlan: 14500, saveTaxable: 14000 };
const pD2 = K.plan(D2);
const early = K.bridge(D, pD.classicAge ?? 52);
const year = (x: number | null) => (x === null ? 'after 75' : String(x));

export default defineGuide({
  id: 'when-can-i-retire-calculator',
  group: 'fire',
  order: 8,
  slug: 'when-can-i-retire-calculator',
  nav: 'When can I retire?',
  card: 'Years to financial independence, and what moves the date',
  title: 'Retirement Date Calculator 2026: When Can I Retire Early?',
  description: `When can you retire? A 2026 calculator: years until savings reach ${K.usd(target)} for ${K.usd(spend)} a year, what ${K.usd(10000)} more saved changes, then the 59½ wall to cross.`,
  h1: 'When can I retire? Years to independence, then the 59½ test',
  intro: `Type what you have, what you add each year and what you plan to spend: the calculator counts the years until your savings cover that spending, then flags how many of those years fall before 59½.`,
  resume: `A saver of ${age} with ${K.usd(bal)} invested, who adds ${K.usd(save)} a year and wants ${K.usd(spend)} of yearly spending, needs ${K.usd(target)} under a ${K.pct(swr, 0)} withdrawal rate and gets there in ${K.dec(yrs, 1)} years, around age ${Math.ceil(at)}, with a ${K.pct(r, 0)} return after inflation. Saving ${K.usd(10000)} more a year cuts the wait to ${K.dec(yMore, 1)} years; spending ${K.usd(10000)} less, with the same savings, cuts it to ${K.dec(yLess, 1)}, because the target itself shrinks by ${K.usd(10000 / swr)}. Doing both brings it to ${K.dec(yBoth, 1)} years. The date the arithmetic gives is not yet a date you can stop working: about ${K.dec(gap, 1)} years would sit before 59½, when most 401(k) and IRA money still owes the ${K.pct(E.penalty, 0)} additional tax. Run through the full plan, with federal tax, health premiums until Medicare and the access rules, the same person moves from age ${year(pD.classicAge)} to age ${year(pD.rulesAge)}.`,
  body: (h) => `
<h2>The count the calculator makes</h2>
<p>The answer to "when can I retire" is a race between two numbers. One is the target: yearly spending divided by the withdrawal rate you accept, ${K.usd(target)} for ${K.usd(spend)} at ${K.pct(swr, 0)}. The other is your balance, which grows each year by the return and by what you add. The calculator advances year by year, adds the contribution at the end of each year and stops at the first year the balance crosses the target, with a fraction for the part of the last year needed. Everything is in today's dollars, which is why the return field asks for a figure after inflation.</p>
<p>For the case above, the crossing comes after ${K.dec(yrs, 1)} years. That is the honest headline, and also the place where most online tools stop. The remainder of this page covers what moves that figure and what it leaves out.</p>
${h.mini('when', { t: 'Change only what you save each year', p: ['c'], d: { age, bal, c: save, spend } })}
<h2>Ten thousand dollars on either side of the budget</h2>
<p>A cut in spending works twice. It lowers the target by ${K.usd(10000 / swr)} at a ${K.pct(swr, 0)} rate, and in real life the same dollars usually end up invested. The calculator lets you test the two levers apart: the table below keeps the starting balance and the return fixed and varies only the yearly contribution, once for the original budget and once for a budget ${K.usd(10000)} lower.</p>
${h.table(['Saved per year', `Years to ${K.usd(target)}`, `Years to ${K.usd(K.fireNumber(spend - 10000, swr))}`], bySave, `Start ${K.usd(bal)}, ${K.pct(r, 0)} real return, ${K.pct(swr, 0)} withdrawal rate. Engine of this page.`, ['l', 'r', 'r'])}
<p>The gain per extra dollar shrinks as contributions climb: going from ${K.usd(26000)} to ${K.usd(36000)} a year saves more time than going from ${K.usd(46000)} to ${K.usd(56000)}. Early on, the contribution is most of the growth; later, the return on the balance already built does most of the work, and new money matters less.</p>
<h2>The withdrawal rate sets the finish line</h2>
<p>The target is spending divided by a rate, so the rate you accept matters as much as anything you save. At ${K.pct(0.035, 1)} instead of ${K.pct(swr, 0)}, the same ${K.usd(spend)} budget needs ${K.usd(K.fireNumber(spend, 0.035))}, and the wait grows from ${K.dec(yrs, 1)} to ${y(K.yearsTo(K.fireNumber(spend, 0.035), bal, save, r))} years. Someone retiring in the early fifties may need the money for forty years or more, longer than the thirty-year periods behind the classic ${K.pct(0.04, 0)} figure, which is why many early retirees test a lower rate. The ${h.a('4-percent-rule', '4 % rule page')} shows how long a portfolio lasts at each rate.</p>
<h2>How much the return assumption decides</h2>
<p>The return is the field people leave at its default and should not. Over a twenty-year horizon, one point of real return moves the date by years. The figures below change only that input.</p>
${h.table(['Real return per year', 'Years to the target', 'Age reached'], byReturn, `${K.usd(bal)} today, ${K.usd(save)} a year, target ${K.usd(target)}.`, ['l', 'r', 'r'])}
<p>No one can promise any line of that table. A prudent reading is to plan on a low line and treat a higher one as a margin. Also note that a market fall shortly before or after the date you pick hurts more than the same fall twenty years earlier, a point the ${h.a('sequence-of-returns-risk', 'sequence of returns page')} measures.</p>
<h2>The wall at 59½</h2>
<p>Reaching the target at ${Math.ceil(at)} means nothing if the money is in the wrong accounts. The tax code adds a ${K.pct(E.penalty, 0)} additional tax to most withdrawals from a 401(k) or IRA before age 59½, with a list of exceptions (${h.src('irs_exceptions', 'IRS table of exceptions')}). Retiring at the date above leaves about ${K.dec(gap, 1)} years to fund from money you can reach: a taxable brokerage account, Roth IRA contributions, a governmental 457(b), the 401(k) of the employer you leave if that happens in or after the year you turn ${E.ruleOf55Age}, or a 72(t) series.</p>
<p>The full ${h.a('early-retirement-calculator', 'early retirement calculator')} applies those rules to the same person. Suppose the ${K.usd(bal)} is split as ${K.usd(D.taxable)} in a brokerage account, ${K.usd(D.plan)} in a 401(k) and ${K.usd(D.roth)} in a Roth IRA, of which ${K.usd(D.rothBasis)} are contributions, and that the ${K.usd(save)} goes ${K.usd(D.savePlan)} to the 401(k), ${K.usd(D.saveRoth)} to the Roth and the rest to the brokerage account. Add federal tax on withdrawals and ${K.usd(D.health)} a year of health premiums until ${K.P.aca.medicareAge}. The plain rule says age ${year(pD.classicAge)}. The plan that funds every year without a penalty says age ${year(pD.rulesAge)}.</p>
<p>Stopping at ${year(pD.classicAge)} anyway does not ruin anything, it just costs money. The year-by-year run shows the reachable accounts running dry at ${early.firstPenaltyAge ?? 'n/a'}, after which the 401(k) pays the bills with ${K.usd(early.penalty)} of ${K.pct(E.penalty, 0)} additional tax in total before 59½. That is the price of retiring on the plain number with most savings in pre-tax accounts.</p>
${h.mini('bridgeYears', { t: 'How many bridge years your reachable money covers', p: ['age'], d: { age: Math.ceil(at), sp: spend + D.health, t: 140000, rb: 70000, g: 0 } })}
<h2>One change in where the savings go</h2>
<p>The same saver can move ${K.usd(10000)} a year from the 401(k) to the brokerage account, keeping the total at ${K.usd(save)}. The engine then finds age ${year(pD2.rulesAge)} instead of ${year(pD.rulesAge)}: more money sits outside the 59½ lock, and the target with tax is lower because fewer withdrawals are ordinary income. The trade-off is a higher tax bill during the working years, since a brokerage contribution gets no deduction. Whether that trade is worth it depends on your bracket now and later, which is why the calculator lets you test it instead of answering for you.</p>
<p>Social Security is left out of every figure here. For the order in which each account opens, see ${h.a('when-can-you-draw-401k', 'when each account can be drawn')}; for the target itself with tax and health premiums, the ${h.a('fire-number-calculator', 'FIRE number calculator')}.</p>
`,
  faqs: [
    { q: 'When can I retire if I save $36,000 a year and want to spend $55,000?', a: `Starting from ${K.usd(bal)} at ${age} with a ${K.pct(r, 0)} real return, the balance reaches ${K.usd(target)}, the ${K.pct(swr, 0)} target for ${K.usd(spend)}, after ${K.dec(yrs, 1)} years. With a ${K.pct(0.03, 0)} return it takes ${y(K.yearsTo(target, bal, save, 0.03))} years. These dates ignore tax and the 59½ access rules, which can push the real date later.` },
    { q: 'Does a when can I retire calculator count saving more or spending less the same way?', a: `No. Spending ${K.usd(10000)} less lowers the target by ${K.usd(10000 / swr)} at a ${K.pct(swr, 0)} rate, while saving ${K.usd(10000)} more only adds to the balance. In the example on this page, the first cuts the wait to ${K.dec(yLess, 1)} years and the second to ${K.dec(yMore, 1)}. Doing both gives ${K.dec(yBoth, 1)} years.` },
    { q: 'Why does the early retirement date move once taxes and the 59½ rule are added?', a: `Because withdrawals from pre-tax accounts are taxed, health insurance must be bought until Medicare at ${K.P.aca.medicareAge}, and most 401(k) and IRA money owes a ${K.pct(E.penalty, 0)} additional tax before 59½. For the saver on this page, the plain rule says ${year(pD.classicAge)} and the full plan says ${year(pD.rulesAge)}.` },
    { q: 'What return should I enter in a retirement date calculator?', a: `A return after inflation, since every amount is in today's dollars. On this page's example, ${K.pct(0.03, 0)} gives ${y(K.yearsTo(target, bal, save, 0.03))} years to the target and ${K.pct(0.07, 0)} gives ${y(K.yearsTo(target, bal, save, 0.07))}. Nobody knows the future figure; testing a low value shows how much margin your plan has if markets disappoint.` },
  ],
  tool: 'when',
  related: ['early-retirement-calculator', 'fire-number-calculator', 'how-much-to-save-for-retirement', 'early-retirement-bridge', 'when-can-you-draw-401k'],
  sources: ['irs_exceptions', 'rp_2025_32', 'limits_2026'],
});
