import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MED = K.P.aca.medicareAge;
const P0 = 1000000;
const yrs = (x: number | null) => (x === null ? '100+' : K.dec(Math.round(x * 10) / 10, 1));
const at = (w: number, r: number) => K.lasts(P0, P0 * w, r);
const four0 = at(0.04, 0), four2 = at(0.04, 0.02), four3 = at(0.04, 0.03);
const three2 = at(0.03, 0.02), five2 = at(0.05, 0.02);
const rates = [0.03, 0.035, 0.04, 0.045, 0.05];
// Default case of the calculator: $1,250,000 and $50,000 a year.
const d = K.tool('swr');

export default defineGuide({
  id: '4-percent-rule',
  group: 'fire',
  order: 5,
  slug: '4-percent-rule',
  nav: '4 % rule',
  card: 'A rule built on 30-year retirements, tested against the 50 years of an early exit',
  title: '4 Percent Rule 2026: Does It Hold for a 50-Year Retirement?',
  description: `4 percent rule in 2026: it was built on 30-year retirements. At a steady 2 % real return a 4 % withdrawal lasts ${yrs(four2)} years and 3 % lasts ${yrs(three2)}. Test yours.`,
  h1: 'The 4 percent rule: where it comes from and how long it lasts for an early retiree',
  intro: 'The 4 percent rule says you can spend 4 % of your portfolio in the first year of retirement and raise that amount with inflation every year after.',
  resume: `The 4 percent rule is a rule of thumb from retirement research that tested a simple plan against past United States market returns: withdraw 4 % of the portfolio in year one, then the same amount adjusted for inflation each year, and see whether the money lasts. The research looked at retirements of 30 years, which fits someone who stops at 65. An early retiree has a longer road: stop at 40 and the plan may need to run 50 years or more. The arithmetic of a fixed real withdrawal is unforgiving over that span. With no growth at all, 4 % lasts exactly 25 years; at a steady 2 % return after inflation, ${yrs(four2)} years; at 3 %, ${yrs(four3)} years. Real markets do not deliver steady returns, and the order of good and bad years matters as much as the average. The calculator above turns any portfolio and withdrawal into a rate and the number of years it lasts at the return you choose.`,
  body: (h) => `
<h2>What the rule actually says</h2>
<p>The rule is a starting withdrawal, not a yearly percentage. In year one you take 4 % of the portfolio: ${K.usd(P0 * 0.04)} from ${K.usd(P0)}. From then on you ignore the balance and take the same amount in real terms, raised each year by inflation. If markets fall, you still take it; if they boom, you do not take more. That fixed real withdrawal is what the original studies tested, and it is what the calculator above assumes.</p>
<p>The research ran this plan through historical sequences of stock and bond returns in the United States, starting a new 30-year retirement in each year of the record, and counted how often the money survived. A 4 % start was close to the highest rate that survived nearly all of those historical periods for a portfolio holding a large share of stocks. That is the whole claim. It is not a forecast, it carries no promise about future markets, and it was never built for a retirement that starts at 40.</p>
<h2>Thirty years against fifty</h2>
<p>Someone who stops at 42 and plans to age 92 needs 50 years of withdrawals. The extra two decades change the math more than they seem to, because the last years of a long plan depend on returns that compound from a balance already reduced by decades of spending. The table uses the site's engine to show how long a fixed real withdrawal lasts at steady returns after inflation. Steady returns flatter every row; they are here to show the shape, not the odds.</p>
${h.table(['Starting withdrawal rate', 'Lasts at 0 % real', 'At 2 % real', 'At 3 % real', 'At 4 % real'],
  rates.map((w) => [K.pct(w, 1), yrs(at(w, 0)), yrs(at(w, 0.02)), yrs(at(w, 0.03)), yrs(at(w, 0.04))]),
  `Years until a ${K.usd(P0)} portfolio runs out, withdrawal taken at the start of each year and raised with inflation. "100+" means it lasts a century or more. Computed by the site's engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>At 4 % and a 2 % real return the money lasts ${yrs(four2)} years: comfortably past 30, short of 50. Drop to 3 % and the same return carries it ${yrs(three2)} years. Push to 5 % and it lasts ${yrs(five2)} years. The lesson for an early retiree is that half a point of withdrawal rate buys years at the far end, and that the margin of a 30-year rule gets used up over a 50-year one.</p>
${h.mini('swr', { t: 'Your withdrawal against your portfolio', p: ['w'], d: { p: 900000, w: 36000, r: 3 } })}
<h2>Gross withdrawals and taxes</h2>
<p>The rule speaks of withdrawals, not spending money. A withdrawal from a traditional 401(k) or IRA is ordinary income, and in the years before 59½ some accounts add a ${K.pct(K.P.early.penalty, 0)} additional tax on top unless an exception applies. If 4 % of the portfolio is the withdrawal, the spending it supports is that amount minus federal and state tax. The ${h.a('fire-number-calculator', 'FIRE number calculator')} works the other way round: it starts from the spending, adds the 2026 tax that the withdrawal creates, and divides by the rate. Health premiums before Medicare at ${MED} are another cost the 30-year framing, built around a retirement that starts near ${MED}, never had to bridge.</p>
<h2>Flexible spending stretches the rule</h2>
<p>The fixed real withdrawal is the hardest version of the plan. Many retirees spend less after a bad year, skip a trip, or delay a large purchase, and even small cuts in the first years help, because those years shape everything that follows. The page on ${h.a('sequence-of-returns-risk', 'sequence of returns risk')} shows the effect with the engine: the same average return can leave a portfolio empty or larger than it started, depending only on when the bad years arrive. Other levers are a lower starting rate, part-time income in the first years, or a cash reserve that covers a year or two of spending so that nothing is sold after a crash.</p>
${h.mini('lasts', { t: 'A 50-year horizon: how long does it hold?', p: ['w', 'r'], d: { p: 1400000, w: 49000, r: 2.5 } })}
<h2>Turning the rule into dollars</h2>
<p>Applied to the calculator's default portfolio of ${K.usd(1250000)}, the four common rates give very different budgets: ${String(d.rows[0][1])} a year at 3 %, ${String(d.rows[1][1])} at 3.5 %, ${String(d.rows[2][1])} at 4 % and ${String(d.rows[3][1])} at 4.5 %. The spread between the lowest and highest is ${K.usd(1250000 * 0.015)} a year, which is the price of extra safety. Seen the other way, moving from 4 % to 3.5 % means saving about ${K.pct(0.04 / 0.035 - 1, 0)} more for the same budget.</p>
<p>That is why the starting rate is a choice and not a fact. Someone with a pension or rental income starting later, or with spending that can bend, can accept a higher rate than someone whose whole budget depends on the portfolio for fifty years.</p>
<h2>Reading the calculator</h2>
<p>The calculator above takes a portfolio and a yearly withdrawal and returns the rate, the number of years the money lasts at the return you enter, and the dollar withdrawal at four common rates. With its default ${K.usd(1250000)} and ${K.usd(50000)}, the rate is ${d.value}. The return field is an assumption, not a forecast; testing 2 % and 4 % shows how much the answer depends on it. For an early retiree, a sensible check is whether the plan still works at a low real return over the full horizon to 90 or beyond, not only over 30 years.</p>
`,
  faqs: [
    { q: 'Does the 4 percent rule work for a 50-year early retirement?', a: `It was built and tested on 30-year retirements, so a 50-year plan is outside what it was designed for. At a steady 2 % return after inflation, a 4 % starting withdrawal lasts ${yrs(four2)} years; a 3 % start lasts ${yrs(three2)}. Many early retirees use a lower rate or plan to cut spending after bad years.` },
    { q: 'Is the 4 percent rule before or after taxes?', a: 'Before. The rule describes the amount withdrawn from the portfolio, and withdrawals from a traditional 401(k) or IRA are taxed as ordinary income. The spending money left after federal and state tax is smaller. The FIRE number calculator on this site adds the 2026 tax to the target instead of taking it out of the withdrawal.' },
    { q: 'Does the 4 percent rule mean taking 4 % of the balance every year?', a: `No. You take 4 % of the starting portfolio in year one, ${K.usd(40000)} from ${K.usd(P0)}, then raise that dollar amount with inflation each year whatever the market does. Taking 4 % of each year's balance is a different plan: it never runs out, but the income swings with markets.` },
    { q: 'How long does the 4 percent rule last with no investment growth?', a: `Exactly 25 years, since 25 times 4 % is the whole portfolio. With a steady 2 % return after inflation it lasts ${yrs(four2)} years, and with 3 % about ${yrs(four3)} years, in the engine's model with the withdrawal taken at the start of each year.` },
  ],
  tool: 'swr',
  related: ['sequence-of-returns-risk', 'fire-number-calculator', 'how-long-will-my-money-last', 'how-much-do-i-need-to-retire', 'early-retirement-calculator'],
  sources: ['rp_2025_32', 'irs_exceptions', 'medicare_start'],
});
