import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const r = 0.05, swr = 0.04;
/** Balance that, with `c` added each year, grows to the target by the retirement age (today's dollars). */
const onTrack = (age: number, ret: number, spend: number, c: number, ret_ = r) => {
  const k = Math.max(0, ret - age);
  const target = K.fireNumber(spend, swr);
  return Math.max(0, (target - K.grow(0, c, ret_, k)) / Math.pow(1 + ret_, k));
};
const spend = 60000, c = 20000;
const target = K.fireNumber(spend, swr);
const ages = [25, 30, 35, 40, 45, 50, 55];
const rets = [55, 60, 65];
const at40 = onTrack(40, 60, spend, c);
const at40early = onTrack(40, 55, spend, c);
const have45 = 450000;
const gap45 = onTrack(45, 55, 50000, 20000) - have45;
const cNeed = (K.fireNumber(50000, swr) - have45 * Math.pow(1 + r, 10)) / K.grow(0, 1, r, 10);
const yLate = K.yearsTo(K.fireNumber(50000, swr), have45, 20000, r) ?? 0;
const contribs = [0, 10000, 20000, 30000, 40000];
// 45-year-old aiming at 55 with a smaller budget.
const spend45 = 50000;
const t45 = K.fireNumber(spend45, swr);
const reach55 = spend45 * (E.age - 55);
const at35coast = onTrack(35, 60, spend, 0);

export default defineGuide({
  id: 'retirement-savings-by-age',
  group: 'fire',
  order: 13,
  slug: 'retirement-savings-by-age',
  nav: 'Savings by age',
  card: 'The balance that puts you on track for your own target',
  title: 'Retirement Savings by Age 2026: On Track for Your Own Target',
  description: `Retirement savings by age in 2026: at 40, ${K.usd(at40)} keeps a ${K.usd(spend)} budget on track for 60 if you add ${K.usd(c)} a year. Tables for 25 to 55, your own target.`,
  h1: 'How much should I have saved for retirement at my age?',
  intro: `There is no universal figure for your age: the right balance is the one that, with what you keep adding, grows to your own target by the age you choose.`,
  resume: `The amount you need saved for retirement at a given age depends on three choices: the spending you want, the age you want to stop and what you will keep adding each year. For ${K.usd(spend)} of yearly spending, the target at a ${K.pct(swr, 0)} withdrawal rate is ${K.usd(target)}. With ${K.usd(c)} added each year and a ${K.pct(r, 0)} return after inflation, a 40-year-old aiming at 60 is on track with ${K.usd(at40)} today; aiming at 55, the figure rises to ${K.usd(at40early)}. At 50 with the same plan for 60, it is ${K.usd(onTrack(50, 60, spend, c))}. These amounts already count the future contributions: a balance below them means saving more or stopping later, a balance above them means the target arrives earlier. Rules of thumb that multiply your salary skip all three choices and say nothing about when you can actually reach the money, a question that matters before 59½.`,
  body: (h) => `
<h2>A trajectory instead of a multiple of salary</h2>
<p>Published benchmarks often express savings as a multiple of income at each birthday. They rest on assumptions you never see: retiring at 67, replacing a fixed share of pay, a given return. Change any of them and the benchmark is meaningless for you. This page works the other way round. It starts from your target, ${K.usd(target)} for ${K.usd(spend)} a year in the example, and walks back to today: how much must already be invested at each age so that the balance, plus the yearly contributions, reaches the target on time.</p>
<p>The formula is short. The contributions still to come are grown to the retirement age; whatever part of the target they do not cover must come from the current balance, discounted by the return over the years left. Everything is in today's dollars.</p>
${h.mini('byAge', { t: 'At 45, aiming to stop at 55', p: ['age'], d: { age: 45, ret: 55, spend: spend45, c: 25000 } })}
<h2>On-track balances, age by age</h2>
${h.table(['Your age', ...rets.map((x) => `Retire at ${x}`)], ages.map((a) => [String(a), ...rets.map((x) => (a < x ? K.usd(onTrack(a, x, spend, c)) : 'n/a'))]), `Target ${K.usd(target)} (${K.usd(spend)} a year at ${K.pct(swr, 0)}), ${K.usd(c)} added every year until retirement, ${K.pct(r, 0)} real return. Engine of this page.`, ['l', 'r', 'r', 'r'])}
<p>Read across a row to see what an earlier exit costs. At 40, aiming at 55 instead of 60 asks for ${K.usd(at40early - at40)} more today, because there are five fewer years of contributions and five fewer years of growth. Read down a column to see the trajectory itself: the figure climbs quickly in the last decade, when most of the target must already be in place. Where a cell shows $0, the yearly additions alone reach the target in time, so a young saver with nothing invested is already on the path at this contribution level.</p>
<h2>How much should be in a 401(k) at 45?</h2>
<p>The question is common, and the honest answer is that the account type matters less than the total until you want to stop before 59½. Take a 45-year-old planning ${K.usd(spend45)} a year from 55, a target of ${K.usd(t45)}. The table shows how the on-track figure depends on what is still to come.</p>
${h.table(['Added each year from 45', 'On track at 45 for retiring at 55', 'On track at 45 for retiring at 60'], contribs.map((x) => [K.usd(x), K.usd(onTrack(45, 55, spend45, x)), K.usd(onTrack(45, 60, spend45, x))]), `Target ${K.usd(t45)}, ${K.pct(r, 0)} real return.`, ['l', 'r', 'r'])}
<p>Where that balance sits then decides whether 55 works. Leaving an employer in or after the year you turn ${E.ruleOf55Age} lets that employer's 401(k) pay without the ${K.pct(E.penalty, 0)} additional tax (${h.src('irs_exceptions', 'IRS exceptions table')}). An IRA or a 401(k) from an earlier job does not open until 59½. Covering ${K.dec(E.age - 55, 1)} years at ${K.usd(spend45)} means about ${K.usd(reach55)} that must come from the last 401(k), a brokerage account or Roth contributions. A 401(k) balance at 45 is therefore good news only if it will be in the plan you leave at 55, or if enough sits elsewhere.</p>
<h2>What if you stop contributing?</h2>
<p>The first row of the second table, with nothing added, is the coast figure: a balance that reaches the target on growth alone. A 35-year-old aiming at 60 with ${K.usd(spend)} a year needs ${K.usd(at35coast)} invested today to coast there with nothing added. That number is useful to anyone thinking of switching to lower-paid work or part-time hours; the ${h.a('coast-fire-calculator', 'Coast FIRE calculator')} finds the age at which you reach it.</p>
${h.mini('coast', { t: 'From what age can you stop adding?', p: ['bal'], d: { age: 40, ret: 58, spend: 52000, bal: 420000, c: 20000 } })}
<h2>Below the line: three ways back</h2>
<p>Say the 45-year-old aiming at 55 with ${K.usd(spend45)} a year holds ${K.usd(have45)} rather than the ${K.usd(onTrack(45, 55, spend45, 20000))} the table asks for with ${K.usd(20000)} of yearly additions, a gap of ${K.usd(gap45)}. Keeping the same savings, the target arrives after ${K.dec(yLate, 1)} years, at about ${Math.ceil(45 + yLate)} instead of 55. Keeping 55, the yearly addition has to rise to about ${K.usd(cNeed)}, which may or may not fit under the 2026 limits of ${K.usd(K.P.limits.deferral)} for a 401(k) plus ${K.usd(K.P.limits.catchUp50)} of catch-up from 50 and ${K.usd(K.P.limits.ira)} for an IRA. The third route is the budget: a lower spending figure shrinks the target and every number on this page with it. Most real plans mix the three, and the calculator above lets you try each one on your own figures.</p>
<h2>Why the return field changes everything</h2>
<p>All the figures above use a ${K.pct(r, 0)} return after inflation. At ${K.pct(0.03, 0)}, the 40-year-old aiming at 60 needs ${K.usd(onTrack(40, 60, spend, c, 0.03))} today instead of ${K.usd(at40)}; at ${K.pct(0.07, 0)}, only ${K.usd(onTrack(40, 60, spend, c, 0.07))}. That spread is wider than most of the gaps between ages in the first table. Testing a low return gives an on-track figure that leaves a margin if markets disappoint; testing a high one shows how much the plan depends on them.</p>
<p>The withdrawal rate works the same way. A ${K.pct(0.035, 1)} rate raises the target to ${K.usd(K.fireNumber(spend, 0.035))}, and every on-track figure rises with it. Social Security is left out, so the target covers the whole budget. For the target itself with tax and health insurance, use the ${h.a('fire-number-calculator', 'FIRE number calculator')}; for the share of pay to save, the ${h.a('how-much-to-save-for-retirement', 'savings rate page')}.</p>
`,
  faqs: [
    { q: 'How much retirement savings should I have at 40?', a: `Enough that, with what you keep adding, you reach your target on time. For ${K.usd(spend)} a year of spending, a ${K.pct(swr, 0)} withdrawal rate and ${K.usd(c)} added each year at a ${K.pct(r, 0)} real return, a 40-year-old is on track for 60 with ${K.usd(at40)} and for 55 with ${K.usd(at40early)}. Lower spending or larger contributions lower these figures.` },
    { q: 'How much should I have in my 401(k) at 45 to retire early?', a: `For a ${K.usd(t45)} target and ${K.usd(20000)} added a year, about ${K.usd(onTrack(45, 55, spend45, 20000))} in total at 45 to stop at 55. Only the 401(k) of the employer you leave at ${E.ruleOf55Age} or later opens before 59½, so about ${K.usd(reach55)} should sit in that plan or in accounts you can reach freely.` },
    { q: 'Are salary multiples a good guide for retirement savings by age?', a: `They assume a retirement age, a replacement rate and a return you did not choose, and they ignore what you will add from now on. Starting from your own target is more precise: at 35, aiming at 60 with ${K.usd(spend)} a year, ${K.usd(onTrack(35, 60, spend, c))} is on track if you add ${K.usd(c)} a year, and ${K.usd(at35coast)} if you add nothing.` },
    { q: 'I am behind on retirement savings for my age. What changes the most?', a: `Spending, because it sets the target: ${K.usd(10000)} less a year lowers it by ${K.usd(10000 / swr)} at a ${K.pct(swr, 0)} rate. Then contributions and the retirement age. At 45, aiming at 55 with ${K.usd(spend45)} a year, adding ${K.usd(30000)} instead of ${K.usd(10000)} lowers the balance needed today from ${K.usd(onTrack(45, 55, spend45, 10000))} to ${K.usd(onTrack(45, 55, spend45, 30000))}.` },
  ],
  tool: 'byAge',
  related: ['how-much-to-save-for-retirement', 'coast-fire-calculator', 'fire-number-calculator', 'retire-at-55', 'when-can-i-retire-calculator'],
  sources: ['irs_exceptions', 'limits_2026', 'pub575'],
});
