import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SD = K.P.tax.standardDeduction;
const MED = K.P.aca.medicareAge;
const ZERO = K.P.tax.capitalGains.zeroMax;
// Default case of the calculator: $60,000 a year, 4 %, stops at 45, 60 % pre-tax, $7,200 of premiums a year, single.
const base = K.tool('firenum');
const val = (i: number) => Number(base.rows[i][2]);
const classic = val(0), taxAdd = val(1), health = val(2);
const full = classic + taxAdd + health;
const taxYear = String(base.rows[3][1]);
const mix = (pre: number, status: 'single' | 'joint' = 'single') => K.quick({ spend: 60000, swr: 0.04, status, pretaxShare: pre, taxableShare: (1 - pre) / 2 });
const allPre = mix(1), lowPre = mix(0.1), joint = mix(0.6, 'joint'), single = mix(0.6);
const healthAt = (age: number) => Number(K.tool('firenum', { age }).rows[2][2]);
const gapYears = (full - classic) / 60000;

export default defineGuide({
  id: 'fire-number-calculator',
  group: 'fire',
  order: 1,
  slug: 'fire-number-calculator',
  nav: 'FIRE number',
  card: 'The 25× number plus federal tax on withdrawals and premiums until Medicare',
  title: 'FIRE Number Calculator 2026: 25× Plus Tax and Health Costs',
  description: `FIRE number 2026: spending ÷ 4 % leaves out federal tax on 401(k) withdrawals and health premiums to ${MED}. On $60,000 a year the real target is ${K.usd(full)}.`,
  h1: 'FIRE number calculator: what 25 times your spending leaves out',
  intro: `Your FIRE number is the portfolio that pays your spending for good; this one adds the 2026 federal tax on what you withdraw and the health premiums you carry until Medicare at ${MED}.`,
  resume: `A FIRE number is usually spending divided by the withdrawal rate: ${K.usd(60000)} a year at 4 % gives ${K.usd(classic)}, the familiar 25×. That figure assumes every withdrawn dollar is yours to spend, which is rarely true in the United States. Money from a traditional 401(k) or IRA is ordinary income, so part of each withdrawal goes to federal tax; for a single filer who stops at 45 with 60 % of the money pre-tax, the 2026 brackets and the ${K.usd(SD.single)} standard deduction take about ${taxYear} a year, which raises the target by ${K.usd(taxAdd)}. Health coverage is the second gap: with ${K.usd(7200)} a year of premiums after any tax credit, the twenty years from 45 to ${MED} cost ${K.usd(health)} in today's money. The complete number is ${K.usd(full)}, not ${K.usd(classic)}. The calculator above lets you change the spending, the account mix, the age you stop and the premium you expect.`,
  body: (h) => `
<h2>Three parts of one target</h2>
<p>The calculator splits the number into pieces you can check one by one. The first is the classic part: yearly spending divided by the withdrawal rate. At 4 % that is 25 times spending; at 3.5 % it is about 28.6 times. The second is the tax part. Each year you must withdraw your spending plus the federal tax that the withdrawal itself creates, and every dollar of yearly tax needs its own 25 dollars of capital at a 4 % rate. The third is the health part, treated differently because it stops: premiums run only until Medicare at ${MED}, so the calculator adds their present value as a lump instead of dividing them by the withdrawal rate.</p>
<p>In the default case the three parts are ${K.usd(classic)}, ${K.usd(taxAdd)} and ${K.usd(health)}. The tax part looks small next to the first, and it is, for a modest budget. It grows quickly with spending and with the share of money held in pre-tax accounts, which is the next section.</p>
${h.mini('firenum', { t: 'Mostly pre-tax savings: how much does the tax part add?', p: ['pre'], d: { spend: 72000, pre: 85, age: 48, health: 6600 } })}
<h2>Why the account mix moves the number</h2>
<p>Three kinds of money are taxed in three different ways when you spend them. A pre-tax 401(k), 403(b) or traditional IRA is taxed in full as ordinary income. A taxable brokerage account is taxed only on the gain you realize, and long-term gains sit in a 0 % band up to ${K.usd(ZERO.single)} of taxable income for a single filer in 2026 (${K.usd(ZERO.joint)} on a joint return). Roth money withdrawn under the Roth rules is not taxed at all. The same ${K.usd(60000)} of spending therefore costs a different amount to withdraw depending on where it comes from.</p>
${h.table(['Share in 401(k) and IRAs', 'Federal tax, first year', 'Added to the number', 'Number before health'],
  [1, 0.8, 0.6, 0.4, 0.2, 0].map((pre) => { const q = mix(pre); return [K.pct(pre, 0), K.usd(q.taxYear), K.usd(q.tax), K.usd(q.classic + q.tax)]; }),
  `Single filer, ${K.usd(60000)} of spending, 4 % withdrawal rate. The rest of the money is split evenly between a taxable account (40 % of each sale is gain) and Roth accounts. 2026 brackets, Rev. Proc. 2025-32.`, ['l', 'r', 'r', 'r'])}
<p>With everything in pre-tax accounts the tax is ${K.usd(allPre.taxYear)} a year and the target rises by ${K.usd(allPre.tax)}. With only a tenth pre-tax, the ordinary income stays under the standard deduction, the gains fall in the 0 % band, and the tax part disappears: the number is ${K.usd(lowPre.full)}. Married couples filing jointly have twice the deduction and wider brackets, so the same 60 % mix costs ${K.usd(joint.taxYear)} a year instead of ${K.usd(single.taxYear)}.</p>
<p>The mix is not frozen, of course. Years of low income after you stop working are a chance to convert pre-tax money to Roth at a low rate, and the order in which you draw accounts changes the tax of each year. The calculator takes a steady blend, which is a reasonable average; the ${h.a('early-retirement-calculator', 'early retirement calculator')} plays the accounts year by year instead.</p>
<h2>The health part depends on when you stop</h2>
<p>Employer coverage ends with the job, and Medicare starts at ${MED}. Everything in between is yours to pay: COBRA for a while, then a Marketplace plan, whose premium tax credit depends on your income. That is why the field asks for premiums after any credit. The earlier you stop, the longer the stretch and the larger the lump.</p>
${h.table(['Age you stop working', 'Years to Medicare', 'Health part of the number'],
  [40, 45, 50, 55, 60].map((a) => [String(a), String(MED - a), K.usd(healthAt(a))]),
  `${K.usd(7200)} of premiums a year, discounted at a 5 % real return. Medicare age: Medicare.gov.`, ['l', 'r', 'r'])}
<p>Stopping at 40 instead of 60 roughly triples this part. The premium itself is the biggest unknown: it depends on age, county, household size and income, and the credit can cut it sharply when withdrawals are planned to keep income moderate. The ${h.a('health-insurance-before-medicare', 'health insurance guide')} explains how the credit is computed and where its 400 % line sits.</p>
${h.mini('firenum', { t: 'Stop at 50 with a higher premium', p: ['age'], d: { spend: 52000, age: 50, health: 9600, pre: 55 } })}
<h2>Reading the result card</h2>
<p>The large figure is the complete target. The line under it gives the gap with the plain 25× rule, ${K.usd(full - classic)} in the default case, which is about ${K.dec(gapYears, 1)} years of spending that a classic calculator never asks you to save. The rows break that gap down. "Tax in a typical year" is the federal bill on one year of withdrawals at the account mix you entered; it is the figure to compare with your current tax return, and it is usually far lower than people expect, because the standard deduction and the 10 % bracket absorb the first slices of pre-tax income. If that row shows zero, your mix already keeps ordinary income under the deduction and gains in the 0 % band.</p>
<p>Two fields move the result more than the others. The withdrawal rate changes the classic part in proportion, and the premium changes the health part almost one for one with the number of years to ${MED}. The share in pre-tax accounts matters mainly at higher spending, where withdrawals reach the 22 % bracket.</p>
<h2>What the number still leaves out</h2>
<p>State income tax is set to zero by default; the folded field takes your state rate, and the ${h.a('state-tax-on-retirement-withdrawals', 'state tax page')} lists the states that exempt part of retirement income. Social Security is left aside on purpose, as a margin rather than a planned source. The figure is also silent about access: a portfolio can match the number and still be stuck in a 401(k) that pays a 10 % additional tax before 59½. Reaching the number at 45 means planning which accounts pay the years until then, through taxable savings, Roth contributions, the ${h.a('rule-of-55', 'rule of 55')} or a ${h.a('roth-conversion-ladder', 'conversion ladder')}.</p>
<p>All amounts are in today's dollars. The calculator treats the 2026 brackets as indexed to inflation, which is how they move each year, and uses a real return (after inflation) only for the health part. Change any field and the three parts update separately, so you can see which assumption drives your own target.</p>
`,
  faqs: [
    { q: 'Does a FIRE number calculator need to include income tax?', a: `Yes, if most of your savings are in a 401(k) or traditional IRA. Those withdrawals are ordinary income. In 2026 a single filer with ${K.usd(60000)} of spending, all of it from pre-tax accounts, owes about ${K.usd(allPre.taxYear)} of federal tax a year, which adds ${K.usd(allPre.tax)} to a FIRE number built at a 4 % withdrawal rate.` },
    { q: 'Why is my FIRE number with health insurance higher than 25 times my spending?', a: `Because premiums before Medicare at ${MED} are a cost most budgets leave out. At ${K.usd(7200)} a year after any tax credit, stopping at 45 adds ${K.usd(health)} in today's money. The calculator adds it as a lump, since it ends at ${MED}, rather than dividing it by the withdrawal rate.` },
    { q: 'Does Roth money lower my FIRE number?', a: `It can. Qualified Roth withdrawals carry no federal tax, so a portfolio held mostly in Roth and taxable accounts needs no tax add-on at moderate spending. With only 10 % pre-tax and ${K.usd(60000)} of spending, the 2026 tax is zero and the number stays at ${K.usd(lowPre.full)} before health costs.` },
    { q: 'Is the FIRE number different for a married couple filing jointly?', a: `The classic part is the same, but the tax part shrinks. A joint return has a ${K.usd(SD.joint)} standard deduction in 2026 and wider brackets. On ${K.usd(60000)} of spending with 60 % pre-tax, the yearly federal tax is about ${K.usd(joint.taxYear)} for a couple against ${K.usd(single.taxYear)} for a single filer.` },
    { q: 'Should the FIRE number use a 4 % or a lower withdrawal rate?', a: `The calculator starts at 4 % and accepts any rate. At 3.5 % the classic part of ${K.usd(60000)} of spending becomes ${K.usd(K.fireNumber(60000, 0.035))} instead of ${K.usd(classic)}. Someone retiring at 40 faces a horizon well beyond the 30 years behind the usual rule, which the page on the 4 percent rule shows with the engine.` },
  ],
  tool: 'firenum',
  related: ['how-much-do-i-need-to-retire', '4-percent-rule', 'early-retirement-calculator', 'health-insurance-before-medicare', 'tax-on-401k-withdrawal', 'lean-fire-vs-fat-fire'],
  sources: ['rp_2025_32', 'medicare_start', 'hc_lower', 'pub590b'],
});
