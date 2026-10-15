import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const MED = K.P.aca.medicareAge;
// Same assumptions as the calculator: 4 %, 70 % pre-tax, 15 % taxable, 15 % Roth, $8,400 of premiums a year until 65.
const need = (m: number, age = 55, status: 'single' | 'joint' = 'single') =>
  K.quick({ spend: m * 12, swr: 0.04, status, pretaxShare: 0.7, taxableShare: 0.15, health: 8400, healthYears: Math.max(0, MED - age), r: 0.05 });
const d = need(5000);
const dTool = K.tool('need');
const months = [3000, 4000, 5000, 6000, 8000, 10000];
const at45 = need(5000, 45), at62 = need(5000, 62), dj = need(5000, 55, 'joint');
const lo = need(3000), hi = need(10000);
const at35 = String(dTool.rows[0][1]);
// From $300,000 already invested, how long to reach the $5,000-a-month target.
const y30 = K.yearsTo(d.full, 300000, 30000, 0.05), y45 = K.yearsTo(d.full, 300000, 45000, 0.05);
const yy = (x: number | null) => (x === null ? 'more than 80' : K.dec(Math.round(x * 10) / 10, 1));

export default defineGuide({
  id: 'how-much-do-i-need-to-retire',
  group: 'fire',
  order: 7,
  slug: 'how-much-do-i-need-to-retire',
  nav: 'How much to retire',
  card: 'From a monthly budget to the savings it takes, tax and health premiums counted',
  title: 'Retirement Savings Needed 2026: Monthly Budget to Target',
  description: `How much you need to retire in 2026: ${K.usd(5000)} a month takes ${dTool.value} at 4 %, with federal tax on withdrawals and health premiums to ${MED}. Try your own budget.`,
  h1: 'How much do I need to retire? Start from the monthly budget',
  intro: 'The amount you need to retire starts with what you plan to spend each month; the calculator turns that budget into a savings target that already pays the tax on withdrawals and the premiums before Medicare.',
  resume: `How much money you need to retire depends first on what you will spend. A monthly budget of ${K.usd(5000)}, or ${K.usd(60000)} a year, needs ${K.usd(d.classic)} at a 4 % withdrawal rate, the familiar 25 times spending. Two costs come on top for most Americans. Federal income tax on withdrawals from a traditional 401(k) or IRA: with 70 % of savings pre-tax, a single filer withdraws about ${K.usd(d.taxYear)} more each year to pay it, which adds ${K.usd(d.tax)} to the target under 2026 brackets. And health premiums before Medicare at ${MED}: at ${K.usd(8400)} a year after any credit, retiring at 55 adds ${K.usd(d.health)} in today's money. The complete answer is ${dTool.value}. At ${K.usd(3000)} a month it is ${K.usd(lo.full)}; at ${K.usd(10000)} a month, ${K.usd(hi.full)}. A lower withdrawal rate of 3.5 % raises the ${K.usd(5000)} target to ${at35}.`,
  body: (h) => `
<h2>Start from the budget, not from a multiple of salary</h2>
<p>Rules of thumb based on salary skip the step that matters: what you will actually spend. Two people on the same pay can need very different sums if one has a paid-off home and the other rents. The calculator asks for a monthly figure because that is how most households know their budget. Leave out what ends at retirement, such as commuting and retirement contributions, and keep what lasts, including property tax, insurance, and an allowance for repairs and cars. Health insurance goes in its own field, since it changes at ${MED}.</p>
<p>Once the budget is set, the target follows from three parts: the budget times twelve divided by the withdrawal rate, the extra capital that pays federal tax on the withdrawals, and the present value of health premiums until Medicare.</p>
${h.mini('need', { t: 'Your monthly budget, retiring at 50', p: ['m'], d: { m: 4200, age: 50, pre: 60 } })}
<h2>The target for six monthly budgets</h2>
${h.table(['Monthly budget', '25× spending', 'Federal tax part', 'Health until 65', 'Total to save'],
  months.map((m) => { const x = need(m); return [K.usd(m), K.usd(x.classic), K.usd(x.tax), K.usd(x.health), K.usd(x.full)]; }),
  `Single filer, retiring at 55, 4 % withdrawal rate, 70 % of savings in 401(k)s and IRAs, ${K.usd(8400)} of premiums a year after any credit, 5 % real return. 2026 brackets, Rev. Proc. 2025-32. Computed by the site's engine.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The tax column does not grow in step with the budget. At ${K.usd(3000)} a month most of the pre-tax withdrawal falls under the ${K.usd(K.P.tax.standardDeduction.single)} standard deduction and the 10 % bracket, so tax adds ${K.usd(lo.tax)}. At ${K.usd(10000)} a month withdrawals reach the 22 % and 24 % brackets and the tax part is ${K.usd(hi.tax)}. The health column, on the other hand, stays flat here because the premium was held constant; in practice the Marketplace credit shrinks as income rises, so higher budgets often pay more for the same plan.</p>
<h2>Retiring at 45, 55 or 62</h2>
<p>The age you stop changes the target through health costs alone in this calculator: each year before ${MED} is another year of premiums. For ${K.usd(5000)} a month, stopping at 45 takes ${K.usd(at45.full)}, at 55 ${K.usd(d.full)} and at 62 ${K.usd(at62.full)}. The difference looks modest, and it is, for the target. The bigger effect of an early date is on access. Before 59½, a 401(k) or IRA withdrawal usually owes a ${K.pct(K.P.early.penalty, 0)} additional tax, so a 45-year-old needs enough in reachable accounts to fund more than a decade, or an exception such as the ${h.a('rule-of-55', 'rule of 55')} or a ${h.a('72t-calculator', '72(t) series')}. The ${h.a('early-retirement-calculator', 'early retirement calculator')} checks that year by year.</p>
${h.mini('need', { t: 'Same budget, different stop age', p: ['age'], d: { m: 6500, age: 58, pre: 75 } })}
<h2>Married couples and the account mix</h2>
<p>A joint return roughly doubles the standard deduction and the width of the low brackets, so the same withdrawal is taxed less. For ${K.usd(5000)} a month and the same mix, a married couple needs ${K.usd(dj.full)} against ${K.usd(d.full)} for a single filer, before any difference in health premiums for two people. The share of savings held in Roth and taxable accounts matters just as much: Roth withdrawals that follow the Roth rules are not taxed, and long-term gains in a taxable account fall in a 0 % band at moderate incomes. Move the pre-tax share in the calculator and the tax column moves accordingly.</p>
<h2>From a target to a date</h2>
<p>Knowing the target is half of the answer; the other half is how long it takes to get there. Someone with ${K.usd(300000)} already invested who adds ${K.usd(30000)} a year reaches the ${K.usd(d.full)} needed for ${K.usd(5000)} a month in about ${yy(y30)} years at a 5 % return after inflation. Adding ${K.usd(45000)} a year instead brings it to ${yy(y45)} years. The ${h.a('when-can-i-retire-calculator', 'retirement date calculator')} runs that projection with your own balance and saving.</p>
<p>A smaller budget works on both sides at once: it lowers the target and frees money to save. Cutting ${K.usd(500)} a month from the budget removes ${K.usd(K.fireNumber(6000, 0.04))} from the classic part of the target, before the tax effect.</p>
<h2>What the number does not include</h2>
<p>Social Security is left out of this calculator; treat any benefit as a margin. State income tax is not in this simplified version either; the ${h.a('fire-number-calculator', 'FIRE number calculator')} has a field for it. The 4 % rate itself comes from research on 30-year retirements; someone stopping at 45 faces a longer horizon, and the ${h.a('4-percent-rule', '4 percent rule page')} shows how long each rate lasts with the engine. Large one-off costs, such as a new roof or help for a child, belong in a separate reserve rather than in the monthly budget. And every figure here is in today's dollars: the target rises with inflation until the day you stop, and the calculator assumes it is invested at a return above inflation after that.</p>
`,
  faqs: [
    { q: 'How much do I need to retire on $5,000 a month?', a: `At a 4 % withdrawal rate, ${K.usd(5000)} a month needs ${K.usd(d.classic)}. A single filer with 70 % of savings pre-tax adds ${K.usd(d.tax)} for 2026 federal tax, and retiring at 55 with ${K.usd(8400)} of yearly premiums adds ${K.usd(d.health)}. The total is ${K.usd(d.full)} in today's dollars.` },
    { q: 'How much money do I need to retire if I spend $3,000 a month?', a: `${K.usd(lo.classic)} at 4 %, plus ${K.usd(lo.tax)} for federal tax with this page's account mix, plus ${K.usd(lo.health)} for health premiums from 55 to ${MED}: ${K.usd(lo.full)} in all. At that budget most of each pre-tax withdrawal falls under the 2026 standard deduction and the 10 % bracket.` },
    { q: 'Do I need less to retire if I am married filing jointly?', a: `For the same budget, yes, because the 2026 standard deduction is ${K.usd(K.P.tax.standardDeduction.joint)} on a joint return and the low brackets are twice as wide. On ${K.usd(5000)} a month with 70 % pre-tax savings, the target is ${K.usd(dj.full)} for a couple against ${K.usd(d.full)} for a single filer, before health costs for two people.` },
    { q: 'How much more do I need to retire at 45 instead of 55?', a: `In this calculator, the extra comes from ten more years of health premiums before Medicare. On ${K.usd(5000)} a month and ${K.usd(8400)} of yearly premiums, the target goes from ${K.usd(d.full)} to ${K.usd(at45.full)}. The larger challenge is access: most 401(k) and IRA money owes a 10 % additional tax before 59½ without an exception.` },
    { q: 'What withdrawal rate should a retirement savings target use?', a: `The calculator starts at 4 % and shows 3.5 % and 4.5 % beside it. For ${K.usd(5000)} a month, 3.5 % gives ${at35} and 4.5 % gives ${String(dTool.rows[2][1])}. A lower rate suits a longer horizon; the 4 % rule was built on 30-year retirements.` },
  ],
  tool: 'need',
  related: ['fire-number-calculator', '4-percent-rule', 'early-retirement-calculator', 'health-insurance-before-medicare', 'how-much-to-save-for-retirement', 'retirement-savings-by-age'],
  sources: ['rp_2025_32', 'medicare_start', 'hc_lower', 'irs_exceptions'],
});
