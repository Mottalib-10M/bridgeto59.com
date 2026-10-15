import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P0 = 1000000;
const startAge = 45, horizon = 50;
const y = (x: number | null) => (x === null ? '100+' : K.dec(Math.round(x * 10) / 10, 1));
const rates = [0.03, 0.035, 0.04, 0.045, 0.05, 0.06];
const rets = [0, 0.02, 0.03, 0.04, 0.05];
/** Highest withdrawal rate, in steps of 0.1 point, that lasts `years` at a real return `r`. */
const maxFor = (years: number, r: number) => {
  let best = 0;
  for (let k = 10; k <= 100; k++) { const w = k / 1000; const L = K.lasts(P0, P0 * w, r); if (L === null || L >= years) best = w; }
  return best;
};
const w4 = P0 * 0.04;
const l4 = K.lasts(P0, w4, 0.03);
const crash = K.crash(P0, w4, 0.04, -0.2, 2, horizon);
const drops = rets.map((x) => maxFor(30, x) - maxFor(horizon, x));
const reachable = 350000;
const lReach = K.lasts(reachable, w4, 0.03) ?? 100;
const toHalf = K.P.early.age - startAge;

export default defineGuide({
  id: 'how-long-will-my-money-last',
  group: 'fire',
  order: 14,
  slug: 'how-long-will-my-money-last',
  nav: 'How long will my money last?',
  card: 'Years of withdrawals by rate and return, up to a 50-year horizon',
  title: 'Retirement Money Calculator 2026: How Long Will It Last?',
  description: `How long will your money last in retirement? 2026 calculator: ${K.pct(0.04, 0)} withdrawals at ${K.pct(0.03, 0)} real return last about ${y(l4)} years. Table for a 50-year horizon from 45.`,
  h1: 'How long will my money last in retirement?',
  intro: `Give a balance, a yearly withdrawal and a return after inflation: the calculator counts how many years the money pays before it runs out.`,
  resume: `How long your money lasts in retirement depends on two numbers more than on the size of the portfolio: the share you withdraw each year and the return you earn after inflation. A ${K.usd(P0)} portfolio paying ${K.usd(w4)} a year, a ${K.pct(0.04, 0)} withdrawal rate, lasts ${y(K.lasts(P0, w4, 0))} years with no real return, about ${y(K.lasts(P0, w4, 0.02))} years at ${K.pct(0.02, 0)}, ${y(l4)} at ${K.pct(0.03, 0)} and ${y(K.lasts(P0, w4, 0.04))} at ${K.pct(0.04, 0)}. Someone stopping at ${startAge} needs money until ${startAge + horizon} or later, a ${horizon}-year horizon, much longer than the thirty years behind most rules of thumb. Over ${horizon} years the highest rate that holds is ${K.pct(maxFor(horizon, 0.02), 1)} at a ${K.pct(0.02, 0)} real return, ${K.pct(maxFor(horizon, 0.03), 1)} at ${K.pct(0.03, 0)} and ${K.pct(maxFor(horizon, 0.04), 1)} at ${K.pct(0.04, 0)}, with withdrawals kept level in today's dollars and taken at the start of each year.`,
  body: (h) => `
<h2>What the count assumes</h2>
<p>The calculator takes the withdrawal at the start of each year, lets the remainder earn the return you set and repeats until the balance cannot pay a full year. The withdrawal stays the same in today's dollars, which means it rises with prices in nominal terms, and the return you type is therefore a real return, after inflation. The answer is the number of years, with a fraction for the last partial one. The calculation has no randomness: it gives the path for one steady return, and the order in which good and bad years arrive is a separate risk, measured further down.</p>
${h.mini('lasts', { t: 'A million dollars at your withdrawal', p: ['w'], d: { p: P0, w: w4, r: 3 } })}
<h2>Years of withdrawals, by rate and by return</h2>
${h.table(['Withdrawal rate', ...rets.map((x) => `${K.pct(x, 0)} real`)], rates.map((w) => [K.pct(w, 1), ...rets.map((x) => y(K.lasts(P0, P0 * w, x)))]), `Years before ${K.usd(P0)} runs out with a level withdrawal in today's dollars. "100+" means a hundred years or more. Engine of this page.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The left column is plain division: with no return at all, ${K.pct(0.04, 0)} a year lasts exactly ${y(K.lasts(P0, w4, 0))} years, ${K.pct(0.05, 0)} lasts ${y(K.lasts(P0, P0 * 0.05, 0))}. Any positive real return stretches that. The cells marked 100+ are where the return covers the withdrawal, more or less, and the balance never shrinks to zero; that is the zone an early retiree looks for, since nobody knows how long they will live.</p>
<p>Two readings matter. Between ${K.pct(0.03, 0)} and ${K.pct(0.04, 0)} of real return, a ${K.pct(0.04, 0)} rate moves from about ${y(l4)} years to ${y(K.lasts(P0, w4, 0.04))}: the return assumption decides whether the plan is tight or comfortable. And at ${K.pct(0.06, 0)} withdrawals, no line of the table reaches forty years. A rate that high only works for a short retirement or with another income arriving later.</p>
<h2>A fifty-year horizon from age ${startAge}</h2>
<p>Retiring at ${startAge} changes the question. The money may have to pay until ${startAge + horizon}, and the Single Life Table the IRS uses for required distributions gives a 45-year-old ${K.dec(K.life(startAge), 1)} more years on average (${h.src('ecfr_tables', '26 CFR 1.401(a)(9)-9')}); an average means many people live longer. The table below turns the problem round: for each real return, the highest withdrawal rate that still lasts the full horizon, and what it means on ${K.usd(P0)}.</p>
${h.table(['Real return', 'Highest rate lasting 30 years', `Highest rate lasting ${horizon} years`, `Yearly withdrawal on ${K.usd(P0)}`], rets.map((x) => [K.pct(x, 0), K.pct(maxFor(30, x), 1), K.pct(maxFor(horizon, x), 1), K.usd(P0 * maxFor(horizon, x))]), 'Steps of 0.1 point, level real withdrawals at the start of each year.', ['l', 'r', 'r', 'r'])}
<p>Going from a thirty-year to a fifty-year horizon costs between ${K.dec(Math.min(...drops) * 100, 1)} and ${K.dec(Math.max(...drops) * 100, 1)} points of withdrawal rate across these returns. On a million dollars, that is several thousand dollars a year of spending, or several years of extra work to build a larger portfolio. It is the main reason early retirees often plan on ${K.pct(0.035, 1)} rather than ${K.pct(0.04, 0)}, a choice the ${h.a('4-percent-rule', '4 % rule page')} discusses.</p>
<h2>Same average, different order</h2>
<p>A steady return is a convenient fiction. Take ${K.usd(P0)} with ${K.usd(w4)} a year over ${horizon} years and an average real return of ${K.pct(0.04, 0)}. If two years of ${K.pct(-0.2, 0)} come first and the other years make up the average, the portfolio ends at ${K.usd(crash.endFirst)}${crash.depletedFirst >= 0 ? `, running dry in year ${crash.depletedFirst + 1}` : ''}. If the same two bad years come last, it ends at ${K.usd(crash.endLast)}. The average is identical; the withdrawals taken while the balance is down are what make the gap.</p>
${h.mini('sequence', { t: 'Two bad years at the start of a long retirement', p: ['c'], d: { p: 1200000, w: 48000, avg: 4, c: -25, k: 2, h: horizon } })}
<h2>When only part of the money can be reached</h2>
<p>For someone stopping at ${startAge}, the portfolio is not one pot. Money in a 401(k) or a traditional IRA is mostly locked for another ${K.dec(toHalf, 1)} years, until 59½, unless an exception applies. Suppose ${K.usd(reachable)} of the ${K.usd(P0)} sits in a brokerage account and Roth contributions, and the rest in pre-tax accounts. At ${K.usd(w4)} a year and a ${K.pct(0.03, 0)} real return, the reachable part lasts ${y(lReach)} years, to about age ${Math.round(startAge + lReach)}, ${lReach < toHalf ? `${K.dec(toHalf - lReach, 1)} years short of 59½` : 'long enough to reach 59½'}. The portfolio as a whole would last decades; the reachable slice would not. Closing that gap is what a Roth ladder or a 72(t) series is for, and the ${h.a('early-retirement-bridge', 'bridge page')} compares them.</p>
<p>The three extra lines of the calculator help here too. Typing only the reachable balance, then reading the line with two points less return, shows how fragile the early years are if markets start badly.</p>
<h2>What this count leaves out</h2>
<p>The withdrawal here is what leaves the portfolio, so taxes on it come out of the same figure. A dollar from a traditional 401(k) is ordinary income, a dollar from a brokerage account is partly a gain, and a qualified Roth withdrawal is tax-free; the after-tax spending from ${K.usd(w4)} can therefore differ by thousands. Before 59½ a withdrawal from most retirement accounts can also owe a ${K.pct(K.P.early.penalty, 0)} additional tax, and health premiums before Medicare at ${K.P.aca.medicareAge} are part of the spending. Social Security is left out; if you expect it, the true horizon of the portfolio alone is shorter. The ${h.a('early-retirement-calculator', 'early retirement calculator')} handles taxes, the 59½ rules and premiums year by year, and the ${h.a('sequence-of-returns-risk', 'sequence of returns page')} goes further into the order of returns.</p>
`,
  faqs: [
    { q: 'How long will $1 million last in retirement at $40,000 a year?', a: `It depends on the real return. With none, exactly ${y(K.lasts(P0, w4, 0))} years. At ${K.pct(0.02, 0)} after inflation, about ${y(K.lasts(P0, w4, 0.02))} years; at ${K.pct(0.03, 0)}, about ${y(l4)}; at ${K.pct(0.04, 0)}, ${y(K.lasts(P0, w4, 0.04))}. These figures assume level withdrawals in today's dollars, taken at the start of each year, and a steady return.` },
    { q: 'How long will my money last if I retire at 45?', a: `Plan for a horizon of about ${horizon} years, to ${startAge + horizon}. Over that span, a withdrawal rate of ${K.pct(maxFor(horizon, 0.03), 1)} holds at a ${K.pct(0.03, 0)} real return and ${K.pct(maxFor(horizon, 0.04), 1)} at ${K.pct(0.04, 0)}. A ${K.pct(0.05, 0)} rate runs out after ${y(K.lasts(P0, P0 * 0.05, 0.03))} years at ${K.pct(0.03, 0)}, around age ${Math.round(startAge + (K.lasts(P0, P0 * 0.05, 0.03) ?? 0))}.` },
    { q: 'What return should I use in a how long will my money last calculator?', a: `A real return, after inflation, because the withdrawal is kept level in today's dollars. Testing ${K.pct(0.02, 0)} and ${K.pct(0.04, 0)} brackets most cautious plans: at a ${K.pct(0.04, 0)} withdrawal rate, ${K.usd(P0)} lasts ${y(K.lasts(P0, w4, 0.02))} years in the first case and ${y(K.lasts(P0, w4, 0.04))} in the second. Nobody can promise either figure.` },
    { q: 'Does a market crash early in retirement make my money run out sooner?', a: `Yes, even with the same average return. For ${K.usd(P0)} and ${K.usd(w4)} a year over ${horizon} years at a ${K.pct(0.04, 0)} average, two ${K.pct(-0.2, 0)} years at the start leave ${K.usd(crash.endFirst)} at the end, against ${K.usd(crash.endLast)} when they come last. Withdrawals taken while the balance is low cannot recover.` },
  ],
  tool: 'lasts',
  related: ['4-percent-rule', 'sequence-of-returns-risk', 'fire-number-calculator', 'early-retirement-calculator', 'lean-fire-vs-fat-fire'],
  sources: ['ecfr_tables', 'irs_exceptions', 'medicare_start'],
});
