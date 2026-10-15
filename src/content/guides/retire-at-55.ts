import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { SOURCE_LABEL, type PlanIn, type Bridge } from '../../lib/engine/plan';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const MED = K.P.aca.medicareAge;
const SD = K.P.tax.standardDeduction.single;
const toHalf = E.age - E.ruleOf55Age;
const toMed = MED - E.ruleOf55Age;
// Worked case: 47 today, single, most savings in the current employer's 401(k), $56,000 of spending, $7,200 of premiums to 65.
const B: PlanIn = { age: 47, spend: 56000, taxable: 60000, plan: 650000, ira: 90000, roth: 50000, rothBasis: 35000, gov457: 0, savePlan: 24500, saveRoth: 7500, saveTaxable: 3000,
  r: 0.05, swr: 0.04, status: 'single', stateRate: 0, health: 7200, strategy: 'none', convert: 40000, gainShare: 0.4, publicSafety: false };
const pB = K.plan(B);
const b55 = K.bridge(B, 55);
const b54 = K.bridge(B, 54);
const n55 = K.fireNumbers(B, 55);
const startTotal = B.taxable + B.plan + B.ira + B.roth;
const yearly = B.savePlan + B.saveRoth + B.saveTaxable;
const at55 = K.grow(startTotal, yearly, B.r, 55 - B.age);
const srcText = (src: Record<string, number>) => Object.entries(src).filter(([, x]) => x > 0.5).map(([k, x]) => `${SOURCE_LABEL[k]} ${K.usd(x)}`).join('; ');
const rowsOf = (b: Bridge) => b.rows.filter((r) => r.age < 60).map((r) => [String(r.age), srcText(r.src), K.usd(r.tax), K.usd(r.penalty)]);
const first = b55.rows[0];
const gains55 = (first.src.T ?? 0) * B.gainShare;
const premiums = B.health * toMed;
const r60 = b55.rows.find((r) => r.age === 60)!;

export default defineGuide({
  id: 'retire-at-55',
  group: 'fire',
  order: 10,
  slug: 'retire-at-55',
  nav: 'Retire at 55',
  card: 'Rule of 55 on the last 401(k), 4½ years to 59½, 10 to Medicare',
  title: 'Retire at 55 in 2026: Rule of 55, 4½ Years to 59½, Medicare',
  description: `Retire at 55 in 2026: the rule of 55 opens your last 401(k) with no ${pen} penalty, ${K.dec(toHalf, 1)} years before 59½ and ${toMed} before Medicare. See the plan year by year.`,
  h1: 'Retire at 55: the last 401(k) opens, Medicare is ten years away',
  intro: `Leaving your job in the year you turn ${E.ruleOf55Age} changes the shape of early retirement: the 401(k) of that employer can pay you without the ${pen} additional tax, even though 59½ is still ${K.dec(toHalf, 1)} years off.`,
  resume: `Retiring at ${E.ruleOf55Age} is the earliest age at which the largest account most savers have, the 401(k) of their current employer, pays out without the ${pen} additional tax: the rule of 55 covers a separation from service in or after the calendar year you reach ${E.ruleOf55Age}. That leaves ${K.dec(toHalf, 1)} years until 59½, when IRAs and older plans open too, and ${toMed} years until Medicare at ${MED}, which is the longer and often the costlier gap. Take a single saver of ${B.age} with ${K.usd(startTotal)}, mostly in the current 401(k), saving ${K.usd(yearly)} a year for ${K.usd(B.spend)} of yearly spending and ${K.usd(B.health)} of premiums. The engine projects ${K.usd(at55)} at ${E.ruleOf55Age} against ${K.usd(n55.full)} needed once tax and health are added, and funds every year from ${E.ruleOf55Age} to 59½ ${b55.penalty < 1 ? 'without any penalty' : `with ${K.usd(b55.penalty)} of penalty`}. Leaving one year earlier, at 54, the same plan pays ${K.usd(b54.penalty)} of penalty.`,
  body: (h) => `
<h2>The calendar year is the test, not the birthday</h2>
<p>The exception in the tax code reads on the year: a separation from service "during or after the year" you reach ${E.ruleOf55Age} (${h.src('irs_exceptions', 'IRS exceptions table')}). Someone born in November can leave in February of the year of the 55th birthday and qualify, still 54 on the last day of work. Leaving in December of the previous year does not qualify, and turning ${E.ruleOf55Age} later does not repair it. Publication 575 adds that the exception covers only the plan of the employer you leave (${h.src('pub575', 'Publication 575')}). A traditional IRA, a rollover IRA and the 401(k) of an earlier job stay locked until 59½.</p>
${h.mini('rule55', { t: 'Born in 1979: does a 2034 exit count?', p: ['by'], d: { by: '1979', ly: '2034', amt: 30000 } })}
<h2>A plan built around the last 401(k)</h2>
<p>Return to the saver of ${B.age}. Of the ${K.usd(startTotal)} saved today, ${K.usd(B.plan)} sits in the 401(k) of the current employer, ${K.usd(B.ira)} in an IRA, ${K.usd(B.taxable)} in a brokerage account and ${K.usd(B.roth)} in a Roth IRA, of which ${K.usd(B.rothBasis)} are contributions. New savings go ${K.usd(B.savePlan)} to the 401(k), ${K.usd(B.saveRoth)} to the Roth and ${K.usd(B.saveTaxable)} to the brokerage account. With a ${K.pct(B.r, 0)} return after inflation, the plain rule of 25 times spending is met at ${pB.classicAge ?? 'n/a'}; the plan with tax, premiums and access rules works from ${pB.rulesAge ?? 'n/a'}.</p>
${h.table(['Age', 'Taken from', 'Federal tax', pen], rowsOf(b55), `Leaving at ${E.ruleOf55Age}: ${K.usd(B.spend + B.health)} a year of spending and premiums, today's dollars. Engine of this page.`, ['l', 'l', 'r', 'r'])}
<p>Look at the 401(k) line. From ${E.ruleOf55Age} to 58 it pays exactly ${K.usd(SD)} a year, the 2026 single standard deduction (${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}): ordinary income with no tax on it and, thanks to the rule of 55, no penalty either. The rest of the budget comes from the brokerage account and then from Roth contributions, which add almost no taxable income. The gains part of the first year's sale, about ${K.usd(gains55)}, lands in the 0 % band for long-term capital gains, so the federal tax column stays at ${K.usd(first.tax)}. The IRA is not touched at all before 59½. The 401(k) keeps compounding and becomes the main source afterwards.</p>
${h.mini('ltcg', { t: 'Gains on top of a 401(k) payout that fills the deduction', p: ['g'], d: { st: 'single', oi: SD, g: Math.round(gains55) } })}
<p>The year of age 59 shows the hand-off. The Roth contributions are nearly spent, so the 401(k) pays ${K.usd(b55.rows[4].src.PL ?? 0)} and the tax rises to ${K.usd(b55.rows[4].tax)}. From 60 the IRA opens as well and the engine draws pre-tax money first: ${K.usd(r60.src.PL ?? 0)} from the 401(k) at 60, for ${K.usd(r60.tax)} of federal tax. The bridge years were cheap precisely because the brokerage account and the Roth took the load while the deduction absorbed the 401(k) payouts; after 59½ the pre-tax balance takes over and the tax bill becomes a normal one. A state income tax, which you can add in the calculator, would apply to the 401(k) payouts and to the gains.</p>
<h2>Four and a half years to 59½, ten years to Medicare</h2>
<p>The access gap closes at 59½; the health gap does not close until ${MED}. Between ${E.ruleOf55Age} and ${MED} the saver buys coverage for ${toMed} years, ${K.usd(premiums)} at ${K.usd(B.health)} a year, which the engine counts as ${K.usd(n55.health)} in today's money because the later premiums are paid from savings that keep earning in the meantime. COBRA keeps the employer plan for up to ${K.P.aca.cobraMonths} months at up to ${K.pct(K.P.aca.cobraMaxPremium, 0)} of its full cost (${h.src('dol_cobra', 'Department of Labor')}). After that comes a Marketplace plan, where the premium tax credit depends on income, and the bridge above keeps taxable income low on purpose. The ${h.a('health-insurance-before-medicare', 'health insurance page')} and the ${h.a('cobra-vs-marketplace', 'COBRA comparison')} take it further.</p>
<h2>Leaving at 54 instead</h2>
<p>Run the same saver with an exit one year earlier. The rule of 55 no longer applies to the 401(k), since the separation happens in the year of the 54th birthday. The brokerage account and Roth contributions carry the budget for a few years, then run out at ${b54.firstPenaltyAge ?? 'n/a'}. From there to 59½ the engine has to draw on the IRA and the 401(k) with the ${pen} additional tax, ${K.usd(b54.penalty)} in all, on top of a higher income tax bill. One year of difference in the exit date costs more than many people save in a year.</p>
${h.table(['Age', 'Taken from', 'Federal tax', pen], rowsOf(b54), `Leaving at 54: same savings and spending. The rule of 55 does not apply.`, ['l', 'l', 'r', 'r'])}
<h2>Moves to make before the last day</h2>
<p>The rule rewards what sits in the plan on the day you leave. An IRA or an old 401(k) can often be rolled into the current plan while you still work there, if the plan accepts incoming rollovers; that money then leaves under the rule of 55 with the rest. The reverse move, rolling the plan into an IRA after you leave, gives the exception up on every dollar moved. Check also how the plan pays former employees: some allow any partial withdrawal, others only a lump sum or fixed installments, and a plan that pays only a lump sum puts the whole balance on one tax return. The plan withholds ${K.pct(E.planWithholding, 0)} of each payment made to you, even when, as above, the real tax is zero; the difference comes back at filing time.</p>
<p>Social Security is left out of these figures. Public safety employees qualify at ${E.publicSafetyAge} rather than ${E.ruleOf55Age}, covered on the ${h.a('rule-of-55-public-safety', 'public safety page')}. To test another exit age with your own balances, use the ${h.a('early-retirement-calculator', 'early retirement calculator')}.</p>
`,
  faqs: [
    { q: 'If I retire at 55, can I take money from my IRA without the 10 % penalty?', a: `No. The rule of 55 covers only the 401(k) or 403(b) of the employer you leave in or after the year you turn ${E.ruleOf55Age}. An IRA owes the ${pen} additional tax until 59½, ${K.dec(toHalf, 1)} years later, unless another exception applies, such as a 72(t) series. Rolling the IRA into the current plan before you leave can bring it under the rule.` },
    { q: 'How many years of health insurance do I need to buy if I retire at 55?', a: `${toMed} years, until Medicare at ${MED}. At ${K.usd(B.health)} a year that is ${K.usd(premiums)} of premiums, or ${K.usd(n55.health)} in today's money when the later years are paid from invested savings. COBRA can cover the first ${K.P.aca.cobraMonths} months; a Marketplace plan, with a credit tied to income, usually covers the rest.` },
    { q: 'How much tax will I pay on 401(k) withdrawals after retiring at 55?', a: `Possibly none on the first ${K.usd(SD)} a year, the 2026 single standard deduction. In the example on this page, the 401(k) pays that amount each year from ${E.ruleOf55Age} and the rest of the budget comes from a brokerage account and Roth contributions, so the federal tax is ${K.usd(first.tax)} in the first year. Larger payouts climb into the ${K.pct(0.1, 0)} and ${K.pct(0.12, 0)} brackets.` },
    { q: 'What if I retire at 55 but leave my job in December of the year I turn 54?', a: `Then the rule of 55 does not apply to that 401(k), because the separation came before the year you reached ${E.ruleOf55Age}. Every withdrawal before 59½ owes the ${pen} unless another exception fits. For the saver on this page, leaving at 54 instead of ${E.ruleOf55Age} adds ${K.usd(b54.penalty)} of penalties to the bridge.` },
    { q: 'Is retiring at 55 with the rule of 55 enough to cover the whole bridge?', a: `Only if the 401(k) of the employer you leave holds enough. For the saver on this page it does: the plan works from ${pB.rulesAge ?? 'n/a'} with ${K.usd(at55)} projected at ${E.ruleOf55Age} against ${K.usd(n55.full)} needed with tax and premiums. Money in IRAs or older 401(k)s does not help before 59½ unless it was rolled into that plan first.` },
  ],
  tool: 'fire',
  toolArg: { ret: 55 },
  related: ['rule-of-55', 'rule-of-55-public-safety', 'health-insurance-before-medicare', 'cobra-vs-marketplace', 'retire-at-50', 'early-retirement-calculator'],
  sources: ['irs_exceptions', 'pub575', 'rp_2025_32', 'dol_cobra', 'medicare_start'],
});
