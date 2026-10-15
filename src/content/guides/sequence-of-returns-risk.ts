import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

// Default case of the calculator: $1,000,000, $45,000 a year, 5 % average real return, two years at -20 %, 35 years.
const A = K.crash(1000000, 45000, 0.05, -0.2, 2, 35);
// Second case: $1,000,000, $40,000 a year, 4 % average, three years at -25 %, 45 years (retire at 45, plan to 90).
const B = K.crash(1000000, 40000, 0.04, -0.25, 3, 45);
const runOut = (i: number) => (i < 0 ? 'never' : `year ${i + 1}`);
const show = [1, 2, 3, 5, 10, 15, 20, 25, 30, 35];
// Bridge pot of a 48-year-old: taxable and Roth contributions only, hit by the same two bad years.
const pot = K.crash(450000, 45000, 0.05, -0.2, 2, 12);
const steady = K.lasts(1000000, 45000, 0.05);

export default defineGuide({
  id: 'sequence-of-returns-risk',
  group: 'fire',
  order: 6,
  slug: 'sequence-of-returns-risk',
  nav: 'Sequence of returns',
  card: 'Same average return, opposite order: why the first years of retirement decide the rest',
  title: 'Sequence of Returns Risk 2026: Bad Years First or Last',
  description: `Sequence of returns risk in 2026: same average return, opposite order. ${K.usd(1000000)} with two bad years first runs out in ${runOut(A.depletedFirst)}; bad years last leave ${K.usd(A.endLast)}.`,
  h1: 'Sequence of returns risk: when the bad years come matters as much as how bad they are',
  intro: 'Sequence of returns risk is the danger that poor market years arrive just as withdrawals begin, draining a portfolio that the same returns in a different order would have left intact.',
  resume: `Sequence of returns risk means that two retirees with the same average return can end up in opposite places because the bad years came at different times. Take ${K.usd(1000000)}, withdraw ${K.usd(45000)} a year in today's dollars, and give the portfolio an average real return of 5 % over 35 years, with two years at minus 20 % and every other year at ${K.pct(A.other, 1)}. If the two bad years open the retirement, the money runs out in ${runOut(A.depletedFirst)}. If the very same years close it, the portfolio ends with ${K.usd(A.endLast)}. Nothing differs but the order. The reason is that withdrawals in a falling market sell more shares at low prices, and those shares are not there when the recovery comes. Early retirees are more exposed than most: their horizon is longer, and the first years before 59½ are often paid from a smaller pool of taxable savings and Roth contributions.`,
  body: (h) => `
<h2>Same average, two endings</h2>
<p>The calculator builds two paths from one list of returns. In the first, the bad years come first; in the second, the list is reversed. The arithmetic average is identical, so a calculator that uses one steady return would show the two retirees with the same result. The table follows the default case year by year.</p>
${h.table(['Year', 'Balance, bad years first', 'Balance, bad years last'],
  show.map((y) => [String(y), K.usd(A.first[y - 1].end), K.usd(A.last[y - 1].end)]),
  `${K.usd(1000000)} at the start, ${K.usd(45000)} withdrawn at the start of each year, two years at -20 %, the other years at ${K.pct(A.other, 1)} so that the average is 5 %. End-of-year balances in today's dollars, computed by the site's engine.`, ['l', 'r', 'r'])}
<p>After the second year, the first retiree holds ${K.usd(A.first[1].end)} while the second holds ${K.usd(A.last[1].end)}. From there the first path never catches up: the same ${K.usd(45000)} now takes a much larger slice of a smaller balance, and the good years have less money to compound. By year 20 the gap is wider than the whole starting portfolio. The bad years at the end hurt the second retiree too, but by then the balance is large and the remaining horizon short.</p>
${h.mini('sequence', { t: 'How deep can the first years fall?', p: ['c'], d: { p: 800000, w: 34000, avg: 4.5, k: 2, h: 40 } })}
<h2>Why one average return misleads</h2>
<p>Most retirement calculators apply one steady return every year. Run the same case that way, ${K.usd(1000000)} with ${K.usd(45000)} withdrawn and 5 % after inflation every single year, and the money ${steady === null ? 'lasts a century or more' : `lasts ${K.dec(steady, 0)} years`}. The steady line sits between the two paths above and hides both. It is the result you would get if the market never had a bad year, and it is the result many online tools print.</p>
<p>The reason is the withdrawal. Without withdrawals, the order of returns does not change the end balance at all: multiplying the same growth factors in any order gives the same product. Selling a fixed amount every year breaks that symmetry, because each sale after a loss takes a larger share of the remaining shares. The bigger the withdrawal relative to the portfolio, the stronger the effect, which is why the risk is tied so closely to the starting withdrawal rate.</p>
<h2>A longer horizon makes it worse</h2>
<p>Stretch the plan to 45 years, the span from 45 to 90, and make the shock heavier: three years at minus 25 % within an average real return of 4 %, with ${K.usd(40000)} withdrawn from ${K.usd(1000000)}. With the bad years first the money is gone in ${runOut(B.depletedFirst)}; with the bad years last it ends at ${K.usd(B.endLast)}. A 4 % starting rate that looks comfortable on a steady-return chart has little room for an unlucky start.</p>
<p>These are stylized paths, not forecasts. Real markets mix good and bad years in every order, and the engine's two paths are the extremes of one list. They are useful because they isolate the effect: whatever the average turns out to be, the first decade of withdrawals carries most of the risk.</p>
<h2>The bridge years before 59½ are the exposed ones</h2>
<p>For an early retiree the first years have a second weakness. Before 59½, most 401(k) and IRA money is locked behind a ${K.pct(K.P.early.penalty, 0)} additional tax, so spending often comes from a smaller pot: a taxable brokerage account and Roth contributions. A bad start hits that pot first and hardest. Picture a 48-year-old whose reachable money is ${K.usd(450000)} and who spends ${K.usd(45000)} a year from it until 59½. Two years at minus 20 % at the outset, with the same 5 % average, leave ${K.usd(pot.first[1].end)} after two years. Had the stretch opened with the good years and kept the bad ones for its end, the pot would hold ${K.usd(pot.last[1].end)} at the same date. If the pot runs dry before 59½, the gap has to come from locked accounts, with the penalty, unless an exception is in place.</p>
<p>That is why the order in which accounts open matters as much as the size of the portfolio. Someone who leaves work in or after the year they turn ${K.P.early.ruleOf55Age} can draw on that employer's 401(k) under the ${h.a('rule-of-55', 'rule of 55')}, which widens the pool. A ${h.a('72t-calculator', '72(t) series')} or a ${h.a('roth-conversion-ladder', 'Roth conversion ladder')} can feed the bridge from IRA money. The ${h.a('early-retirement-bridge', 'bridge page')} lays out which account pays which year.</p>
${h.mini('sequence', { t: 'A small bridge pot, two bad years', p: ['p', 'w'], d: { p: 450000, w: 45000, avg: 5, c: -20, k: 2, h: 12 } })}
<h2>Ways people reduce the risk</h2>
<p>None of these remove the risk; each one moves it. A lower starting withdrawal rate leaves more room for a bad opening. Cutting spending for a year or two after a fall means fewer shares sold at low prices. A cash or bond reserve covering a year or two of spending lets the stock portfolio recover before it is tapped. Part-time income in the first years, the ${h.a('barista-fire', 'barista FIRE')} route, shrinks withdrawals exactly when they do the most damage. A later start, by a year or two, both adds savings and shortens the horizon. Run the calculator with your own portfolio, withdrawal and a plausible bad stretch to see which lever matters most for you.</p>
`,
  faqs: [
    { q: 'What is sequence of returns risk in simple terms?', a: `It is the risk that bad market years come early in retirement, while you are withdrawing. With ${K.usd(1000000)}, ${K.usd(45000)} a year and a 5 % average real return, two years at minus 20 % at the start empty the portfolio in ${runOut(A.depletedFirst)}; the same two years at the end leave ${K.usd(A.endLast)}.` },
    { q: 'Does sequence of returns risk matter more for early retirees?', a: 'Yes, for two reasons. The horizon is longer, so an early loss compounds over more years. And before 59½ withdrawals often come from a smaller pool of taxable savings and Roth contributions, because 401(k) and IRA money is locked behind the 10 % additional tax unless an exception applies.' },
    { q: 'Is sequence of returns risk a problem while I am still saving?', a: 'Much less. While you are adding money, a fall early in your career lets you buy shares at low prices, and the order of returns has a smaller effect on the final balance. The risk is sharpest in the years just before and just after withdrawals begin, when the balance is largest and selling starts.' },
    { q: 'How does a cash reserve help with sequence of returns risk?', a: 'A reserve covering one or two years of spending lets you stop selling stocks after a fall and wait for a recovery. It does not change the average return; it changes which assets are sold in the bad years. The cost is that cash usually earns less than stocks over long periods.' },
    { q: 'Can a sequence of returns calculator predict a crash?', a: `No. The calculator on this page compares two orders of the same returns to isolate the effect of timing. You choose the depth and number of bad years. In the default case the other years earn ${K.pct(A.other, 1)} so the average stays at 5 %; real markets will follow neither path exactly.` },
  ],
  tool: 'sequence',
  related: ['4-percent-rule', 'early-retirement-bridge', 'how-long-will-my-money-last', 'barista-fire', 'rule-of-55', '72t-calculator'],
  sources: ['irs_exceptions', 'pub590b', 'pub575'],
});
