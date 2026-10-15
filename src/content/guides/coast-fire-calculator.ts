import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const EARLY = K.P.early.age;
const R = 0.05;
// Default case of the calculator: 32 years old, retire at 60, $50,000 a year, $120,000 invested, $15,000 added a year.
const T = K.fireNumber(50000, 0.04);
const need60 = K.coast(T, 32, 60, R);
const need50 = K.coast(T, 32, 50, R);
const at60 = K.coastAge(T, 120000, 15000, 32, 60, R);
// Faster saver: $40,000 a year from the same start.
const fast60 = K.coastAge(T, 120000, 40000, 32, 60, R);
const fast50 = K.coastAge(T, 120000, 40000, 32, 50, R);
const bridge50 = String(K.tool('bridgeYears', { age: 50, sp: 50000, t: 0, rb: 0, g: 0, r: 5 }).rows[1][1]);
const bridge55 = String(K.tool('bridgeYears', { age: 55, sp: 50000, t: 0, rb: 0, g: 0, r: 5 }).rows[1][1]);
const ages = [25, 30, 35, 40, 45];
// Worked case at 38: $300,000 invested, $25,000 added a year, $48,000 of spending, retire at 55.
const c38 = K.tool('coast', { age: 38, ret: 55, bal: 300000, c: 25000, spend: 48000 });

export default defineGuide({
  id: 'coast-fire-calculator',
  group: 'fire',
  order: 2,
  slug: 'coast-fire-calculator',
  nav: 'Coast FIRE',
  card: 'The balance that grows to your FIRE number alone, and the bridge it must fund before 59½',
  title: 'Coast FIRE Calculator 2026: Stop Saving, Then Bridge to 59½',
  description: `Coast FIRE in 2026: the sum that grows to your FIRE number with no new savings. At 32, ${K.usd(need60)} reaches ${K.usd(T)} by 60; retiring at 50 needs a bridge too.`,
  h1: 'Coast FIRE calculator: when can you stop saving, and is the money reachable?',
  intro: 'Coast FIRE is the point where the money already invested will grow to your full FIRE number on its own, so new savings can stop and your pay only has to cover today.',
  resume: `Coast FIRE means you have invested enough that, without adding a dollar, the balance grows to your FIRE number by the age you plan to retire. At a 5 % return after inflation, someone aged 32 who wants ${K.usd(50000)} a year at a 4 % withdrawal rate needs ${K.usd(T)} at retirement, and ${K.usd(need60)} invested today is enough to get there by 60. Aim for 50 instead and the coast number jumps to ${K.usd(need50)}, because the money has ten fewer years to compound. The age matters for a second reason most Coast FIRE calculators skip: a 401(k) or IRA tapped before 59½ owes a ${K.pct(K.P.early.penalty, 0)} additional tax unless an exception applies. Retiring at 50 means about ${K.dec(EARLY - 50, 1)} years paid from money you can reach, and that bridge costs ${bridge50} in today's dollars at ${K.usd(50000)} a year. The calculator above shows your coast number and the age at which your saving pace gets you there.`,
  body: (h) => `
<h2>How the coast number is computed</h2>
<p>The arithmetic is short. Take the FIRE number at retirement, here ${K.usd(T)} for ${K.usd(50000)} of yearly spending at 4 %, and discount it back to today at the return you assume after inflation. With 28 years to go at 5 %, each dollar invested now becomes roughly four, so the coast number is about a quarter of the target: ${K.usd(need60)}. Everything is in today's dollars, which is why the return is a real return and not a market headline.</p>
<p>The calculator then runs your saving forward year by year. With ${K.usd(120000)} invested and ${K.usd(15000)} added each year, the balance catches the shrinking coast number at age ${at60 ?? 'never'}. Raise the yearly saving to ${K.usd(40000)} and the same person coasts from ${fast60 ?? 'never'}. That is the practical question behind the search: how many more years of heavy saving before the pressure comes off.</p>
${h.mini('coast', { t: 'Already 40: how far is the coast line?', p: ['age', 'bal'], d: { age: 40, bal: 260000, ret: 62, spend: 46000, c: 18000 } })}
<h2>Coast numbers by age</h2>
<p>The younger you are, the more of the work compounding does. The table keeps the same goal, ${K.usd(50000)} a year at 4 %, and compares two retirement ages for people who are 25 to 45 today.</p>
${h.table(['Age today', 'Coast number to retire at 60', 'Coast number to retire at 50', 'Gap'],
  ages.map((a) => { const x = K.coast(T, a, 60, R), y = K.coast(T, a, 50, R); return [String(a), K.usd(x), K.usd(y), K.usd(y - x)]; }),
  `FIRE number ${K.usd(T)} (${K.usd(50000)} ÷ 4 %), 5 % real return, no further contributions. Computed by the site's engine.`, ['l', 'r', 'r', 'r'])}
<p>A 25-year-old needs ${K.usd(K.coast(T, 25, 60, R))} to coast to 60, while a 45-year-old would need ${K.usd(K.coast(T, 45, 60, R))}. Moving the finish line from 60 to 50 costs every row more than half again, which is the compounding of ten missing years. None of these figures say when the money can be spent, though.</p>
<h2>Coasting to 50 leaves a gap before 59½</h2>
<p>Here is the part that turns a simple ratio into a plan. Most coast balances sit in a 401(k), a 403(b) or an IRA, because that is where workplace saving goes. Those accounts reach the full FIRE number on schedule, but if the date on the calculator is earlier than 59½, a withdrawal on that date usually owes the ${K.pct(K.P.early.penalty, 0)} additional tax on top of income tax. The coast math says the money is big enough; the tax code says part of it is still locked.</p>
<p>At ${K.usd(50000)} a year, the stretch from 50 to 59½ costs ${bridge50} in today's money (nine and a half years of withdrawals, discounted at 5 %). That sum has to come from accounts you can reach: a taxable brokerage account, Roth IRA contributions (which come out tax-free and penalty-free at any age), a governmental 457(b), or pre-tax money released by an exception. Leave your job in or after the year you turn ${K.P.early.ruleOf55Age} and the ${h.a('rule-of-55', 'rule of 55')} opens that employer's 401(k); the remaining bridge from 55 shrinks to ${bridge55}. Before 55 the usual tools are a ${h.a('72t-calculator', '72(t) series')} of equal payments or a ${h.a('roth-conversion-ladder', 'Roth conversion ladder')} started five years ahead.</p>
<p>So a Coast FIRE target with an early date is really two targets. One is the coast balance, which can sit anywhere. The other is a bridge fund in reachable accounts, which has to exist by the retirement date, not later. In the faster example above, the saver who puts away ${K.usd(40000)} a year coasts to 50 from age ${fast50 ?? 'never'}; if every dollar of that went into a 401(k), the coast is real but the first decade of retirement is not funded.</p>
${h.mini('coast', { t: 'Pick an early date and see the warning row', p: ['ret'], d: { age: 34, ret: 52, bal: 210000, c: 30000, spend: 54000 } })}
<h2>A worked case: coasting to 55</h2>
<p>Take a 38-year-old with ${K.usd(300000)} invested who saves ${K.usd(25000)} a year and wants ${K.usd(48000)} a year from 55. The FIRE number is ${String(c38.rows[0][1])}, the coast number today is ${c38.value}, and at that saving pace the balance crosses the coast line at age ${String(c38.rows[2][1])}. From then on, contributions can stop and the money is expected to reach the target by 55 on its own.</p>
<p>Fifty-five is a useful date in this plan. Someone who leaves the employer in or after the calendar year of their 55th birthday can take money from that employer's 401(k) with no additional tax, so a balance built in the current plan does not need a separate bridge for those years. What it does not cover is an IRA or an old 401(k) from an earlier job, which stay locked until 59½. Moving an old plan into the current one before leaving, when the plan accepts rollovers in, brings that money under the same rule. Retire one year earlier, at 54 in a year when you do not turn 55, and the exception is lost for the whole stretch.</p>
<h2>What coasting does not cover</h2>
<p>Coasting means your paycheck still pays every bill until the retirement date, and it means the invested money is never touched. A layoff that forces withdrawals at 45 breaks the arithmetic. The figure also assumes a steady real return; real markets deliver the same average in very different orders, and a bad decade just before the date leaves you short. The calculator does not include tax on withdrawals or health premiums before Medicare, which the ${h.a('fire-number-calculator', 'FIRE number calculator')} adds to the target itself.</p>
<p>Two habits make a coast plan sturdier. Keep a margin above the coast number rather than stopping the day you cross it, and decide early which account will pay the first years. The ${h.a('early-retirement-bridge', 'bridge page')} walks through the order in which each account opens before 59½.</p>
`,
  faqs: [
    { q: 'What is my coast FIRE number at 30 if I want to retire at 60?', a: `With ${K.usd(50000)} of yearly spending at a 4 % withdrawal rate, the FIRE number is ${K.usd(T)}. At a 5 % return after inflation, ${K.usd(K.coast(T, 30, 60, R))} invested at 30 grows to it by 60 with no further savings. A lower assumed return raises the coast number; the calculator lets you change it.` },
    { q: 'Does coast FIRE work if I plan to retire before 59½?', a: `The growth works, but the access may not. Money in a 401(k) or IRA withdrawn before 59½ usually owes a ${K.pct(K.P.early.penalty, 0)} additional tax. Retiring at 50 on ${K.usd(50000)} a year means funding about ${K.dec(EARLY - 50, 1)} years, worth ${bridge50} today, from taxable savings, Roth contributions or an exception such as the rule of 55.` },
    { q: 'Can I stop contributing to my 401(k) once I hit coast FIRE?', a: 'The coast math says the invested balance can grow to your target without new money, as long as the assumed return holds. Many people keep contributing up to the employer match, since that money is added on top of their pay. Stopping entirely leaves no margin for a weak decade or a later change of plan.' },
    { q: 'How is coast FIRE different from barista FIRE?', a: `With coast FIRE you keep working at a job that covers current spending and simply stop saving; the portfolio is not touched until retirement. With barista FIRE you already draw on the portfolio and part-time pay covers the rest. A coast plan for ${K.usd(50000)} a year needs a balance today; a barista plan needs a smaller portfolio plus steady part-time income.` },
    { q: 'What return should a coast FIRE calculator assume?', a: `A return after inflation, since the target is in today's dollars. The calculator starts at 5 % and lets you test lower values. At 32, aiming for ${K.usd(T)} at 60, moving from 5 % to 4 % raises the coast number from ${K.usd(need60)} to ${K.usd(K.coast(T, 32, 60, 0.04))}, because the gap compounds every year. The figure is an assumption, not a forecast of what markets will deliver.` },
  ],
  tool: 'coast',
  related: ['fire-number-calculator', 'barista-fire', 'early-retirement-bridge', 'rule-of-55', 'retirement-savings-by-age', 'roth-conversion-ladder'],
  sources: ['irs_exceptions', 'pub590b', 'tc558'],
});
