import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const L = K.P.limits;
const r = 0.05, swr = 0.04;
const y = (x: number | null) => (x === null ? 'more than 80' : K.dec(x, 1));
const yr = (rate: number, ret = r, w = swr, startYears = 0) => K.yearsFromRate(rate, ret, w, startYears * 100000 * (1 - rate));
const rates = [0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7];
// Example household: $90,000 of take-home pay.
const pay = 90000;
const sr = 0.3;
const saved = pay * sr, spent = pay - saved;
// Maxing the three main accounts of one person under 50, and from 50.
const under50 = L.deferral + L.ira + L.hsaSelf;
const over50 = L.deferral + L.catchUp50 + L.ira + L.iraCatchUp + L.hsaSelf;
const spend60 = 60000;
const maxRate = under50 / (under50 + spend60);
// Lowest whole-percent rate that reaches independence within 15 years from zero.
const for15 = Array.from({ length: 95 }, (_, i) => (i + 1) / 100).find((x) => (yr(x) ?? 99) <= 15) ?? 0.95;

export default defineGuide({
  id: 'how-much-to-save-for-retirement',
  group: 'fire',
  order: 12,
  slug: 'how-much-to-save-for-retirement',
  nav: 'How much to save',
  card: 'Your savings rate sets the number of working years',
  title: 'Savings Rate for Retirement 2026: How Much to Save, in Years',
  description: `How much to save for retirement in 2026: a ${K.pct(0.3, 0)} savings rate means about ${K.dec(Math.round((yr(0.3) ?? 0) * 10) / 10, 1)} working years, ${K.pct(0.5, 0)} about ${K.dec(Math.round((yr(0.5) ?? 0) * 10) / 10, 1)}. Plus the 2026 limits on each account you can fill.`,
  h1: 'How much should I save for retirement? Start from the rate, not the amount',
  intro: `The share of your take-home pay that you save decides, almost on its own, how many years you need to work, whatever your income.`,
  resume: `How much to save for retirement is best answered as a share of take-home pay, because that one rate fixes both what you put away and the lifestyle your savings must replace. Starting from zero, with a ${K.pct(r, 0)} return after inflation and a ${K.pct(swr, 0)} withdrawal rate, saving ${K.pct(0.1, 0)} of pay takes about ${y(yr(0.1))} years to reach financial independence, ${K.pct(0.2, 0)} takes ${y(yr(0.2))}, ${K.pct(0.3, 0)} takes ${y(yr(0.3))}, ${K.pct(0.5, 0)} takes ${y(yr(0.5))} and ${K.pct(0.7, 0)} takes ${y(yr(0.7))}. Income drops out of the math: a household on ${K.usd(pay)} saving ${K.pct(sr, 0)} and one on twice as much at the same rate reach their own targets in the same time. The 2026 limits cap how much of that saving fits in tax-advantaged accounts: ${K.usd(L.deferral)} in a 401(k), ${K.usd(L.ira)} in an IRA and ${K.usd(L.hsaSelf)} in a self-only HSA, ${K.usd(under50)} in all for one person under 50.`,
  body: (h) => `
<h2>Why the rate beats any dollar figure</h2>
<p>Advice such as "save ${K.pct(0.15, 0)}" or "have ten times your salary" hides the mechanism. Each dollar you save does two things at once. It adds to the pile, and it is a dollar you have learned to live without, which lowers the pile you need. A household with ${K.usd(pay)} of take-home pay that saves ${K.pct(sr, 0)} puts away ${K.usd(saved)} a year and lives on ${K.usd(spent)}. Its target at a ${K.pct(swr, 0)} withdrawal rate is ${K.usd(K.fireNumber(spent, swr))}. Double the income and keep the rate, and both the yearly saving and the target double: the years do not move.</p>
<p>The calculator above therefore asks for one rate and nothing in dollars. It assumes you will spend in retirement what you spend now, in today's money, and it starts from what you already hold, expressed in years of spending.</p>
${h.mini('rate', { t: 'Try a quarter of your pay', p: ['sr'], d: { sr: 25, bal: 0 } })}
<h2>The table of years</h2>
${h.table(['Savings rate', `Years at ${K.pct(r, 0)} real`, `Years at ${K.pct(0.03, 0)} real`, `Years at ${K.pct(r, 0)}, ${K.pct(0.035, 1)} withdrawals`], rates.map((x) => [K.pct(x, 0), y(yr(x)), y(yr(x, 0.03)), y(yr(x, r, 0.035))]), 'Starting from zero, contributions at the end of each year, spending kept equal before and after. Engine of this page.', ['l', 'r', 'r', 'r'])}
<p>Three things stand out. The first steps are the most valuable: going from ${K.pct(0.1, 0)} to ${K.pct(0.2, 0)} removes about ${K.dec(Math.round(((yr(0.1) ?? 0) - (yr(0.2) ?? 0)) * 10) / 10, 1)} years, while going from ${K.pct(0.6, 0)} to ${K.pct(0.7, 0)} removes about ${K.dec(Math.round(((yr(0.6) ?? 0) - (yr(0.7) ?? 0)) * 10) / 10, 1)}. The return matters most at low rates, where the money has decades to compound, and barely at high rates. And a more cautious withdrawal rate costs a couple of years at most levels, a fair price for someone whose retirement may last fifty years.</p>
<h2>Money already saved shortens the list</h2>
<p>Few people start from zero. The second field of the calculator counts existing savings in years of spending, which keeps the arithmetic free of income again. At a ${K.pct(0.4, 0)} rate, starting from nothing takes ${y(yr(0.4))} years; with three years of spending already invested it takes ${y(yr(0.4, r, swr, 3))}; with eight years, ${y(yr(0.4, r, swr, 8))}. Someone in their forties with a decent balance can therefore reach the finish line with a moderate rate, and the table above overstates the wait for them.</p>
<h2>The 2026 ceilings on tax-advantaged saving</h2>
<p>A savings rate tells you how much to save. The contribution limits tell you how much of it can go into accounts with a tax break. For 2026 the IRS sets the employee deferral to a 401(k), 403(b) or governmental 457(b) at ${K.usd(L.deferral)}, with ${K.usd(L.catchUp50)} more from age 50 and ${K.usd(L.catchUp60to63)} instead for ages 60 to 63; the IRA limit is ${K.usd(L.ira)}, plus ${K.usd(L.iraCatchUp)} from 50 (${h.src('limits_2026', 'IRS IR-2025-111')}). A health savings account takes ${K.usd(L.hsaSelf)} with self-only coverage or ${K.usd(L.hsaFamily)} with family coverage (${h.src('rp_2025_19', 'Rev. Proc. 2025-19')}).</p>
${h.table(['Account', 'Under 50', 'Ages 50 to 54'], [
  ['401(k), 403(b) or 457(b) deferral', K.usd(L.deferral), K.usd(L.deferral + L.catchUp50)],
  ['IRA, traditional or Roth', K.usd(L.ira), K.usd(L.ira + L.iraCatchUp)],
  ['HSA, self-only coverage', K.usd(L.hsaSelf), K.usd(L.hsaSelf)],
  ['Total for one person', K.usd(under50), K.usd(over50)],
], 'Employee money only; employer contributions come on top, within the annual additions limit. 2026 figures.', ['l', 'r', 'r'])}
<p>Put the two together. A single saver who spends ${K.usd(spend60)} a year and fills all three accounts saves ${K.usd(under50)}, a rate of ${K.pct(maxRate, 0)} of the ${K.usd(under50 + spend60)} total, enough for financial independence in about ${y(yr(maxRate))} years from zero. Anything saved beyond that goes to a brokerage account, which has no limit and no age rule. For an early retiree that overflow is useful rather than a second-best: it is the money that pays the years before 59½, when most of the 401(k) and IRA are still under the ${K.pct(K.P.early.penalty, 0)} additional tax.</p>
${h.mini('limits', { t: 'Your 2026 room at 50 with family HSA coverage', p: ['age'], d: { age: 50, hsa: 'family' } })}
<h2>What the table of years leaves out</h2>
<p>The rate model is deliberately simple, and two simplifications matter for anyone aiming to stop early. It ignores tax on the way out: a portfolio held mostly in a 401(k) and a traditional IRA must also pay income tax on each withdrawal, so the real target is somewhat higher than spending divided by the withdrawal rate. And it treats every dollar as reachable on the day you stop, which the tax code does not: before 59½, money in those accounts owes the ${K.pct(K.P.early.penalty, 0)} additional tax unless an exception applies. A plan that reaches the target at 45 with nearly everything in pre-tax accounts may need several more working years, or a bridge such as a Roth ladder or a 72(t) series. The ${h.a('early-retirement-calculator', 'early retirement calculator')} adds both effects year by year.</p>
<h2>Using the rate to set a monthly figure</h2>
<p>Once the rate is chosen, the monthly amount follows from your own pay. At ${K.usd(pay)} of take-home pay, ${K.pct(sr, 0)} is ${K.usd(saved / 12)} a month. Raises are the easiest place to move the rate: saving half of each raise lifts the rate every year without cutting what you already spend. Social Security is left out of these years entirely. The ${h.a('when-can-i-retire-calculator', 'retirement date calculator')} uses dollars instead of a rate, the ${h.a('retirement-savings-by-age', 'savings by age page')} checks whether a balance is on track, and the ${h.a('retirement-contribution-limits', 'contribution limits page')} explains which account to fill first when you plan to stop before 59½.</p>
`,
  faqs: [
    { q: 'How much should I save for retirement if I want to stop working in 15 years?', a: `About ${K.pct(for15, 0)} of take-home pay starting from zero: at a ${K.pct(r, 0)} real return and a ${K.pct(swr, 0)} withdrawal rate, that rate takes ${y(yr(for15))} years, while ${K.pct(0.5, 0)} takes ${y(yr(0.5))} and ${K.pct(0.6, 0)} takes ${y(yr(0.6))}. Savings you already hold lower the rate needed; a lower return or a more cautious withdrawal rate raises it.` },
    { q: 'Does a higher income mean I need to save a smaller percentage for retirement?', a: `Not if you spend in proportion to it. The years depend on the share saved, because spending sets the target. A household saving ${K.pct(sr, 0)} of ${K.usd(pay)} and one saving ${K.pct(sr, 0)} of twice that both need about ${y(yr(sr))} years from zero at a ${K.pct(r, 0)} real return. A higher earner who keeps spending flat does reach the target sooner.` },
    { q: 'How much can I save in tax-advantaged retirement accounts in 2026?', a: `One person under 50 can defer ${K.usd(L.deferral)} to a 401(k), put ${K.usd(L.ira)} in an IRA and ${K.usd(L.hsaSelf)} in a self-only HSA, ${K.usd(under50)} in all. Between 50 and 54 the catch-ups raise it to ${K.usd(over50)}. Employer contributions come on top, up to ${K.usd(L.annualAdditions)} of total additions to the plan.` },
    { q: 'Is saving 15 % of income enough for retirement?', a: `It depends on the age you want to stop. From zero, at a ${K.pct(r, 0)} real return and a ${K.pct(swr, 0)} withdrawal rate, ${K.pct(0.15, 0)} of take-home pay takes about ${y(yr(0.15))} years, which suits a career started in the twenties with retirement in the sixties. Retiring early needs a much higher rate: ${K.pct(0.4, 0)} takes ${y(yr(0.4))} years.` },
  ],
  tool: 'rate',
  related: ['when-can-i-retire-calculator', 'retirement-savings-by-age', 'retirement-contribution-limits', 'fire-number-calculator', 'financial-independence-retire-early'],
  sources: ['limits_2026', 'notice_2025_67', 'rp_2025_19', 'irs_exceptions'],
});
