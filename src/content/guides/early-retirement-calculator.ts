import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { SOURCE_LABEL, type PlanIn, type Bridge } from '../../lib/engine/plan';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
// Worked case: 41, single, mostly pre-tax savings, $52,000 of yearly spending, $7,200 of health premiums until 65.
const A: PlanIn = { age: 41, spend: 52000, taxable: 40000, plan: 420000, ira: 180000, roth: 35000, rothBasis: 28000, gov457: 0, savePlan: 24500, saveRoth: 7500, saveTaxable: 6000,
  r: 0.05, swr: 0.04, status: 'single', stateRate: 0, health: 7200, strategy: 'none', convert: 45000, gainShare: 0.4, publicSafety: false };
const none = K.plan(A);
const lad = K.plan({ ...A, strategy: 'ladder' });
const sepp = K.plan({ ...A, strategy: 'sepp' });
const test = 53;
const bNone = K.bridge(A, test);
const bSepp = K.bridge({ ...A, strategy: 'sepp' }, test);
const bLad = K.bridge({ ...A, strategy: 'ladder' }, test);
const startTotal = A.taxable + A.plan + A.ira + A.roth;
const yearly = A.savePlan + A.saveRoth + A.saveTaxable;
const atTest = K.grow(startTotal, yearly, A.r, test - A.age);
const age = (x: number | null) => (x === null ? 'after 75' : String(x));
const srcText = (src: Record<string, number>) => Object.entries(src).filter(([, x]) => x > 0.5).map(([k, x]) => `${SOURCE_LABEL[k]} ${K.usd(x)}`).join('; ');
const rowsOf = (b: Bridge) => b.rows.filter((r) => r.age < 60).map((r) => [String(r.age), K.usd(r.need), srcText(r.src), K.usd(r.tax), K.usd(r.penalty)]);
const s53 = bSepp.rows[0];
const gains53 = (s53.src.T ?? 0) * A.gainShare;

export default defineGuide({
  id: 'early-retirement-calculator',
  group: 'fire',
  order: 9,
  slug: 'early-retirement-calculator',
  nav: 'Early retirement calculator',
  card: 'The earliest age once tax, health and the 59½ rules are applied',
  title: 'Early Retirement Calculator 2026: Every Year to 59½ Funded',
  description: `Early retirement calculator for 2026: which account pays each year before 59½, federal tax, the ${pen} penalty avoided, health to 65, Roth ladder or 72(t).`,
  h1: 'Early retirement calculator: the year-by-year bridge to 59½',
  intro: `This calculator finds the earliest age at which you can retire and pay every year from money the law lets you touch, with 2026 federal tax and health premiums until Medicare.`,
  resume: `Retiring early is a cash-flow problem before it is a savings problem: the earliest age is the first one at which every year until 59½ can be paid without the ${pen} additional tax, and the calculator above tests each age in turn. Take a single saver of ${A.age} with ${K.usd(startTotal)}, most of it in a 401(k) and an IRA, who saves ${K.usd(yearly)} a year and wants ${K.usd(A.spend)} of spending plus ${K.usd(A.health)} of health premiums until ${K.P.aca.medicareAge}. The plain rule of 25 times spending says age ${age(none.classicAge)}. Once federal tax and the access rules apply, the answer is ${age(none.rulesAge)}, the year the rule of 55 opens the last 401(k). Converting ${K.usd(A.convert)} a year to a Roth IRA brings it to ${age(lad.rulesAge)}; a 72(t) series on the IRA brings it to ${age(sepp.rulesAge)}. Each row of the table shows which account pays, the tax and any penalty.`,
  body: (h) => `
<h2>Two ages, and why they differ</h2>
<p>The calculator gives two answers. The first is the classic one: the first age at which projected savings reach spending divided by the withdrawal rate, ${K.usd(none.classicNumber)} for ${K.usd(A.spend)} at ${K.pct(A.swr, 0)}. The second is the age at which the plan really works. To accept an age, the engine asks three things: savings must also cover the federal tax on future withdrawals and the health premiums until ${K.P.aca.medicareAge}; every year from that age to the horizon must be payable; and no year may need a withdrawal that owes the ${pen} additional tax. If any year fails, it moves to the next age.</p>
<p>For the saver above, the gap is ${(none.rulesAge ?? 0) - (none.classicAge ?? 0)} years. The money is there at ${age(none.classicAge)}, but ${K.usd(A.plan + A.ira)} of the starting ${K.usd(startTotal)} sits in a 401(k) and an IRA, and only ${K.usd(A.taxable + A.rothBasis)} is in accounts that pay out freely before 59½.</p>
<h2>Three bridges for the same saver</h2>
${h.table(['Bridge before 59½', 'Earliest age that works', 'Savings at that age', `${pen} paid if retiring at ${test}`], [
  ['None: taxable account, Roth contributions, rule of 55', age(none.rulesAge), K.usd(none.totalAt), K.usd(bNone.penalty)],
  [`Roth ladder, ${K.usd(A.convert)} converted a year`, age(lad.rulesAge), K.usd(lad.totalAt), K.usd(bLad.penalty)],
  ['72(t) series on the IRA', age(sepp.rulesAge), K.usd(sepp.totalAt), K.usd(bSepp.penalty)],
], `Single filer, ${K.pct(A.r, 0)} real return, no state tax. Engine of this page (src/lib/engine/plan.ts).`, ['l', 'r', 'r', 'r'])}
<p>The ladder and the 72(t) do not add a dollar of savings. They change which dollars you can reach. A Roth conversion becomes spendable without penalty five tax years after the conversion year, so each rung needs five years of other money first; the engine converts while a rung can still be spent before 59½. A 72(t) series pays a fixed amount from the IRA every year, with no ${pen}, as long as it is not changed until the later of five years and 59½ (${h.src('irs_sepp', 'IRS SEPP questions and answers')}).</p>
<h2>Where each year's money comes from, retiring at ${test} with a 72(t)</h2>
<p>The table is the core of the tool. It lists, for each age until 59½, the spending plus health premiums, the accounts drawn, the federal tax and any penalty. Here the IRA balance at ${test} supports a fixed amortization payment of ${K.usd(bSepp.seppPayment)} a year at ${K.pct(bSepp.seppRate, 2)}, the highest rate allowed for a series starting in ${K.month(K.CAP_MONTHS[K.CAP_MONTHS.length - 1])}. The series must run until ${bSepp.seppEnd === E.age ? '59½, which here comes after the five-year minimum' : `age ${K.dec(bSepp.seppEnd, 1)}, five years after the first payment`}.</p>
${h.table(['Age', 'Spending + health', 'Taken from', 'Federal tax', pen], rowsOf(bSepp), 'Today’s dollars. The 72(t) payment is ordinary income; 40 % of each taxable-account sale is assumed to be gain.', ['l', 'r', 'l', 'r', 'r'])}
<p>The tax column is small for a reason. The 72(t) payment of ${K.usd(s53.src.SEPP ?? 0)} is ordinary income, and ${K.usd(K.P.tax.standardDeduction.single)} of it is covered by the 2026 standard deduction (${h.src('rp_2025_32', 'Rev. Proc. 2025-32')}). The rest falls in the ${K.pct(0.1, 0)} bracket. The sales from the brokerage account add about ${K.usd(gains53)} of long-term gains, which stay inside the 0 % band for capital gains, worth up to ${K.usd(K.P.tax.capitalGains.zeroMax.single)} of taxable income for a single filer. The result is ${K.usd(s53.tax)} of federal tax on ${K.usd(s53.need)} of spending.</p>
${h.mini('ltcg', { t: 'Gains from the taxable account in a bridge year', p: ['g'], d: { st: 'single', oi: Math.round(s53.src.SEPP ?? 0), g: Math.round(gains53) } })}
<h2>The same age without a bridge</h2>
<p>Retiring at ${test} with no ladder and no series, the reachable money runs out at ${bNone.firstPenaltyAge ?? 'n/a'}. From then until 59½ the engine has to draw on the IRA and pay ${pen} on each dollar, ${K.usd(bNone.penalty)} in all. Nothing breaks: the plan still lasts to the horizon, but it pays a penalty that the two other designs avoid. With the ladder, ${test} costs ${K.usd(bLad.penalty)} of penalty, because only the conversions made at ${test} and ${test + 1} have time to season before 59½.</p>
<h2>The health line and the income it creates</h2>
<p>Each year of the bridge carries ${K.usd(A.health)} of premiums until Medicare at ${K.P.aca.medicareAge}, which is why the spending column shows ${K.usd(A.spend + A.health)} rather than ${K.usd(A.spend)}. Type the premium you expect after any premium tax credit. The credit itself depends on modified adjusted gross income (MAGI), and every design above creates some: the 72(t) payment counts in full, a Roth conversion counts in the year it is made, and only the gain part of a brokerage sale counts. A bridge built on low ordinary income can therefore also lower the premium, a link the ${h.a('health-insurance-before-medicare', 'health insurance page')} works through with the 2026 tables.</p>
<h2>The order the engine spends in</h2>
<p>Before 59½, each year starts by filling the standard deduction with income that is taxed anyway and free of penalty: the 457(b), then the 401(k) if the rule of 55 applies. Then come the brokerage account, Roth contributions and seasoned conversions, which cost little or no tax. Only when those are gone does it touch the IRA or a locked 401(k), with the ${pen}, and last of all Roth earnings. After 59½ the order changes: pre-tax accounts fill the deduction first, then the taxable account, then the rest, so the Roth is kept for the end. The ${h.a('method', 'method page')} lists each assumption.</p>
${h.mini('draw', { t: 'The year each of your accounts opens', p: ['leave'], d: { by: '1985', bm: '3', leave: test } })}
<h2>What to change first when the age is too late</h2>
<p>The engine's answer moves most with three inputs. Spending, because it sets the target and every bridge year. The split of new savings, because a dollar in a brokerage account can be spent at ${test} while a dollar in a 401(k) cannot. And the bridge choice, tested above. The return and the withdrawal rate move the date as well, but they are assumptions about markets rather than decisions. Social Security is not counted anywhere in the plan. For the rule that opens the last 401(k), see the ${h.a('rule-of-55', 'rule of 55')}; for the ladder alone, the ${h.a('roth-conversion-ladder', 'Roth conversion ladder')}; for the series, the ${h.a('72t-calculator', '72(t) calculator')}.</p>
`,
  faqs: [
    { q: 'How does this early retirement calculator decide which account to use each year?', a: `Before 59½ it fills the ${K.usd(K.P.tax.standardDeduction.single)} single standard deduction with penalty-free ordinary income, then spends the taxable account, Roth contributions and seasoned conversions, and only then the IRA or a locked 401(k), which owe the ${pen}. After 59½ it draws pre-tax money first up to the deduction and keeps Roth money for last.` },
    { q: 'Can I retire early with most of my money in a 401(k)?', a: `Yes, with a bridge. In the example on this page, a saver with ${K.usd(A.plan + A.ira)} of ${K.usd(startTotal)} in pre-tax accounts reaches the plain target at ${age(none.classicAge)} but can retire penalty-free at ${age(none.rulesAge)} with no bridge, ${age(lad.rulesAge)} with a Roth ladder and ${age(sepp.rulesAge)} with a 72(t) series on the IRA.` },
    { q: 'Does the early retirement calculator include taxes on withdrawals?', a: `Yes. Every year applies the 2026 federal brackets, the standard deduction and the 0 % and 15 % rates on long-term gains, plus an optional flat state rate. Retiring at ${test} with a 72(t), the saver on this page pays ${K.usd(s53.tax)} of federal tax on ${K.usd(s53.need)} of spending, because most income stays under the deduction and in the 0 % gains band.` },
    { q: 'What happens in the bridge if a year needs a penalized withdrawal?', a: `The engine still pays the bills from the IRA or the locked 401(k) and adds the ${pen} additional tax, then refuses that age as a penalty-free retirement. Retiring at ${test} with no bridge, the example on this page owes ${K.usd(bNone.penalty)} of penalties, the first in the year of age ${bNone.firstPenaltyAge ?? 'n/a'}.` },
    { q: 'Is a Roth ladder or a 72(t) better in an early retirement plan?', a: `It depends on the balances and the age. For the saver on this page, the 72(t) series gives age ${age(sepp.rulesAge)} and the ladder ${age(lad.rulesAge)}, because the ladder needs five years of other money before the first rung opens. A 72(t) locks a fixed payment until the later of five years and 59½; a ladder leaves the amounts flexible.` },
  ],
  tool: 'fire',
  related: ['early-retirement-bridge', 'roth-conversion-ladder', '72t-calculator', 'rule-of-55', 'retire-at-50', 'zero-percent-capital-gains'],
  sources: ['irs_exceptions', 'irs_sepp', 'rp_2025_32', 'pub590b'],
});
