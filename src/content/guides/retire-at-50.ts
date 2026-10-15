import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { SOURCE_LABEL, type PlanIn, type Bridge } from '../../lib/engine/plan';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
const MED = K.P.aca.medicareAge;
const at = 50;
const toHalf = E.age - at;
// Worked case: 43 today, single, an IRA from an old job, a current 401(k), a brokerage account, $48,000 of spending, $7,200 of premiums to 65.
const C: PlanIn = { age: 43, spend: 48000, taxable: 110000, plan: 380000, ira: 260000, roth: 40000, rothBasis: 30000, gov457: 0, savePlan: 24500, saveRoth: 7500, saveTaxable: 8000,
  r: 0.05, swr: 0.04, status: 'single', stateRate: 0, health: 7200, strategy: 'none', convert: 40000, gainShare: 0.4, publicSafety: false };
const bNone = K.bridge(C, at);
const bSepp = K.bridge({ ...C, strategy: 'sepp' }, at);
const bLad = K.bridge({ ...C, strategy: 'ladder' }, at);
const bPs = K.bridge({ ...C, publicSafety: true }, at);
const pPs = K.plan({ ...C, publicSafety: true });
const pNone = K.plan(C), pSepp = K.plan({ ...C, strategy: 'sepp' }), pLad = K.plan({ ...C, strategy: 'ladder' });
const n50 = K.fireNumbers(C, at);
const startTotal = C.taxable + C.plan + C.ira + C.roth;
const yearly = C.savePlan + C.saveRoth + C.saveTaxable;
const total50 = K.grow(startTotal, yearly, C.r, at - C.age);
const ira50 = K.grow(C.ira, 0, C.r, at - C.age);
const age = (x: number | null) => (x === null ? 'never' : String(x));
const srcText = (src: Record<string, number>) => Object.entries(src).filter(([, x]) => x > 0.5).map(([k, x]) => `${SOURCE_LABEL[k]} ${K.usd(x)}`).join('; ');
const rowsOf = (b: Bridge) => b.rows.filter((r) => r.age < 60).map((r) => [String(r.age), srcText(r.src), K.usd(r.tax), K.usd(r.penalty)]);
const need = C.spend + C.health;

export default defineGuide({
  id: 'retire-at-50',
  group: 'fire',
  order: 11,
  slug: 'retire-at-50',
  nav: 'Retire at 50',
  card: 'No rule of 55 yet: 72(t), a Roth ladder or taxable savings',
  title: 'Retire at 50 in 2026: 72(t), Roth Ladder or Taxable Savings',
  description: `Retire at 50 in 2026: no rule of 55 yet, so ${K.dec(toHalf, 1)} years to 59½ come from a 72(t) series, a Roth ladder or taxable money. Compare all three, penalty included.`,
  h1: 'Retire at 50: nine and a half years before 59½, without the rule of 55',
  intro: `At ${at}, the 401(k) of the job you leave stays locked unless you work in public safety, so the years until 59½ need another source: a 72(t) series, Roth conversions or money outside retirement accounts.`,
  resume: `Retiring at ${at} means ${K.dec(toHalf, 1)} years before 59½ and ${MED - at} before Medicare, with no help from the rule of 55, which starts in the year you turn ${E.ruleOf55Age}; only qualified public safety employees get it at ${E.publicSafetyAge}. The bridge must come from a 72(t) series of fixed payments, a Roth conversion ladder that needs five years before each rung can be spent, or savings outside retirement accounts. Take a single saver of ${C.age} with ${K.usd(startTotal)}, of which ${K.usd(C.ira)} sits in an IRA from an old job, saving ${K.usd(yearly)} a year for ${K.usd(C.spend)} of spending and ${K.usd(C.health)} of premiums. At ${at} the engine projects ${K.usd(total50)} against ${K.usd(n50.full)} needed with tax and health. Without a bridge, the reachable money runs out at ${bNone.firstPenaltyAge ?? 'n/a'} and the penalties reach ${K.usd(bNone.penalty)}. A 72(t) of ${K.usd(bSepp.seppPayment)} a year on the IRA funds every year with ${K.usd(bSepp.penalty)} of penalty; the ladder leaves ${K.usd(bLad.penalty)}.`,
  body: (h) => `
<h2>Five years too early for the rule of 55</h2>
<p>The separation-from-service exception opens the 401(k) of the employer you leave only when the separation happens in or after the year you reach ${E.ruleOf55Age} (${h.src('irs_exceptions', 'IRS exceptions table')}). Leaving at ${at} does not qualify, and the plan stays under the ${pen} additional tax until 59½ even after you turn ${E.ruleOf55Age}, because the test looks at the year of separation. The one group for whom ${at} works is qualified public safety employees: public safety employees of a state or local government in a governmental plan, federal law enforcement and corrections officers, customs and border protection officers, federal and private-sector firefighters and air traffic controllers. They use age ${E.publicSafetyAge}, or ${E.publicSafetyYearsOfService} years of service under the plan if that comes first (${h.src('pub575', 'Publication 575')}).</p>
${h.mini('rule55', { t: 'Public safety at 48 with 25 years of service', p: ['sy'], d: { by: '1978', ly: '2026', ps: 'yes', sy: E.publicSafetyYearsOfService, amt: 35000 } })}
<h2>Four ways to fund the same nine and a half years</h2>
<p>The saver of ${C.age} has ${K.usd(C.plan)} in the current 401(k), ${K.usd(C.ira)} in an IRA, ${K.usd(C.taxable)} in a brokerage account and ${K.usd(C.roth)} in a Roth IRA with ${K.usd(C.rothBasis)} of contributions. Each year of the bridge costs ${K.usd(need)} before tax. The engine runs the bridge from ${at} four times, changing only how the locked money is reached.</p>
${h.table(['Bridge from 50', `${pen} paid before 59½`, 'First penalized year', 'Earliest penalty-free age'], [
  ['Taxable savings and Roth contributions only', K.usd(bNone.penalty), age(bNone.firstPenaltyAge), age(pNone.rulesAge)],
  [`Roth ladder, ${K.usd(C.convert)} converted a year`, K.usd(bLad.penalty), age(bLad.firstPenaltyAge), age(pLad.rulesAge)],
  [`72(t) series on the ${K.usd(ira50)} IRA`, K.usd(bSepp.penalty), age(bSepp.firstPenaltyAge), age(pSepp.rulesAge)],
  ['Public safety employee, no bridge', K.usd(bPs.penalty), age(bPs.firstPenaltyAge), age(pPs.rulesAge)],
], `Single filer, ${K.pct(C.r, 0)} real return, no state tax. "Never" means no year before 59½ needs a penalized withdrawal.`, ['l', 'r', 'r', 'r'])}
<h2>The 72(t) route, year by year</h2>
<p>By ${at} the IRA has grown to about ${K.usd(ira50)}. A series of substantially equal periodic payments on it, computed with the fixed amortization method at the ${K.pct(bSepp.seppRate, 2)} ceiling for ${K.month(K.CAP_MONTHS[K.CAP_MONTHS.length - 1])}, pays ${K.usd(bSepp.seppPayment)} a year with no ${pen} (${h.src('notice_2022_6', 'Notice 2022-6')}). Started at ${at}, it must run until 59½: the five-year minimum ends earlier, so the age decides. The brokerage account covers the rest of each year's budget, then the Roth contributions take over.</p>
${h.table(['Age', 'Taken from', 'Federal tax', pen], rowsOf(bSepp), `Retiring at ${at} with a 72(t) series. ${K.usd(need)} a year of spending and premiums, today's dollars.`, ['l', 'l', 'r', 'r'])}
<p>The series has a price in flexibility. For nine and a half years the payment cannot change, nothing may be added to that IRA or taken from it beyond the payment, and breaking the series brings back the ${pen} on every payment already received, with interest. That is why the margin matters: in the year of age 58 the brokerage account is empty, and from then on the Roth contributions are the only thing standing next to the payment. A smaller IRA dedicated to the series, split from the rest before the first payment, keeps a second IRA untouched for emergencies after 59½. The ${h.a('72t-calculator', '72(t) calculator')} sizes it.</p>
${h.mini('sepp', { t: 'The payment at 50 on the IRA of this example', p: ['b'], d: { b: Math.round(ira50), by: '1976', bm: '4', me: 'amortization' } })}
<h2>What the 72(t) years cost in tax</h2>
<p>The federal tax column reads ${K.usd(bSepp.rows[0].tax)} a year, and the reason is the mix. Of the ${K.usd(bSepp.seppPayment)} payment, the first ${K.usd(K.P.tax.standardDeduction.single)} is covered by the 2026 standard deduction and the remainder is taxed at ${K.pct(0.1, 0)}. The ${K.usd(bSepp.rows[0].src.T ?? 0)} sold from the brokerage account carries about ${K.usd((bSepp.rows[0].src.T ?? 0) * C.gainShare)} of long-term gains, which fall in the 0 % band. Spending ${K.usd(need)} a year for ${K.usd(bSepp.rows[0].tax)} of federal tax is typical of a well-built bridge, and it is also what keeps the income used for a Marketplace credit low. A state income tax, if you have one, comes on top; the calculator takes a flat rate.</p>
<h2>Why the ladder leaves a gap at 50</h2>
<p>A Roth conversion is taxed in the year it is made and its principal can be withdrawn without penalty from the fifth tax year after (${h.src('pub590b', 'Publication 590-B')}). Converting ${K.usd(C.convert)} a year from ${at} opens the first rung at ${at + 5}. The five years before must be paid from the brokerage account and Roth contributions, while the conversions add ordinary income on top. Here those two sources fall short just before the rungs start to cover the budget, and each later year draws a little from the IRA with the penalty: ${K.usd(bLad.penalty)} in all, starting at ${age(bLad.firstPenaltyAge)}. Retire at ${age(pLad.rulesAge)} instead and the ladder works with no penalty at all, as the earliest-age column shows.</p>
<h2>Taxable savings alone</h2>
<p>With no bridge at all, the brokerage account pays the first years and the Roth contributions the next ones. They are gone by ${age(bNone.firstPenaltyAge)}, and the IRA pays the rest of the way with the ${pen}, ${K.usd(bNone.penalty)} over the remaining years. For this saver, keeping the plan penalty-free without a bridge means working to ${age(pNone.rulesAge)}. Each extra dollar put into the brokerage account instead of the 401(k) during the working years shortens that wait, at the cost of the tax deduction given up.</p>
<h2>Fifteen years of health insurance</h2>
<p>Leaving at ${at} means ${MED - at} years of premiums before Medicare at ${MED}. At ${K.usd(C.health)} a year the engine adds ${K.usd(n50.health)} in today's money to the target, ${n50.health > n50.tax ? 'more than' : 'against'} the ${K.usd(n50.tax)} added for tax on withdrawals. A Marketplace credit depends on income, and a 72(t) payment counts in it in full. The ${h.a('health-insurance-before-medicare', 'health insurance page')} covers the 2026 and 2027 tables. Social Security is not counted in any figure on this page; to test your own balances at ${at} or another age, the ${h.a('early-retirement-calculator', 'early retirement calculator')} runs the same engine.</p>
`,
  faqs: [
    { q: 'Can I use the rule of 55 if I retire at 50 and wait until 55 to withdraw?', a: `No. The rule looks at the year you leave the employer, which must be the year you turn ${E.ruleOf55Age} or later. Leaving at ${at} and waiting does not qualify, and that 401(k) owes the ${pen} until 59½. Qualified public safety employees are the exception: their age is ${E.publicSafetyAge}, or ${E.publicSafetyYearsOfService} years of service.` },
    { q: 'How big is a 72(t) payment if I retire at 50?', a: `It depends on the balance and the rate. On the ${K.usd(ira50)} IRA of this page's example, fixed amortization at the ${K.pct(bSepp.seppRate, 2)} ceiling for ${K.month(K.CAP_MONTHS[K.CAP_MONTHS.length - 1])} gives ${K.usd(bSepp.seppPayment)} a year. Started at ${at}, the payment must stay the same until 59½, nine and a half years.` },
    { q: 'Does a Roth conversion ladder work if I retire at 50?', a: `Only with five years of other money first, since each conversion can be spent penalty-free from the fifth tax year after. For the saver on this page, a ${K.usd(C.convert)} ladder from ${at} still leaves ${K.usd(bLad.penalty)} of penalties, because the brokerage account and Roth contributions run short before the rungs cover the budget.` },
    { q: 'How much do I need saved to retire at 50 with health insurance until 65?', a: `For ${K.usd(C.spend)} of yearly spending and ${K.usd(C.health)} of premiums, the engine asks for ${K.usd(n50.full)} at ${at} in today's dollars for the saver on this page: the ${K.pct(C.swr, 0)} target, tax on withdrawals and ${MED - at} years of premiums. Where that money sits then decides whether the bridge to 59½ is penalty-free.` },
  ],
  tool: 'fire',
  toolArg: { ret: 50, strat: 'sepp' },
  related: ['72t-calculator', 'roth-conversion-ladder', 'rule-of-55-public-safety', 'retire-at-55', 'early-retirement-bridge', 'health-insurance-before-medicare'],
  sources: ['irs_exceptions', 'pub575', 'notice_2022_6', 'irs_sepp', 'pub590b'],
});
