import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const pen = K.pct(E.penalty, 0);
// Case A: stops at 50, spends $60,000, $300,000 taxable, $80,000 of Roth contributions, $120,000 in a governmental 457(b).
const A = K.tool('bridgeYears', { age: 50, sp: 60000, t: 300000, rb: 80000, g: 120000 });
// Case B: stops at 48, spends $55,000, $250,000 taxable, $60,000 of Roth contributions, no 457(b).
const B = K.tool('bridgeYears', { age: 48, sp: 55000, t: 250000, rb: 60000, g: 0 });
// Table: cost of the bridge by stop age at $60,000 a year, 4 % real return.
const byAge = [45, 48, 50, 52, 55].map((age) => { const r = K.tool('bridgeYears', { age, sp: 60000, t: 0, rb: 0, g: 0 }); return [String(age), K.dec(E.age - age, 1), r.rows?.[1]?.[1] ?? '']; });
// Long-term gains at 0 %: a couple selling $60,000 of gains with no other income.
const gains = K.tax({ ordinary: 0, ltcg: 60000, status: 'joint' });
const r55 = K.early({ amount: 45000, age: 55, account: 'plan', exception: 'separation55', status: 'joint' });
const zeroTop = K.P.tax.capitalGains.zeroMax.joint + K.P.tax.standardDeduction.joint;

export default defineGuide({
  id: 'early-retirement-bridge',
  group: 'access',
  order: 34,
  slug: 'early-retirement-bridge',
  nav: 'Early retirement bridge',
  card: 'The money you can reach before 59½, and the years it has to cover',
  title: 'Early Retirement Bridge 2026: Fund the Years Before 59½',
  description: `Early retirement bridge in 2026: count the money you can reach before 59½ (taxable, Roth contributions, 457(b), rule of ${E.ruleOf55Age}) against the years you must cover.`,
  h1: 'The early retirement bridge: reachable money against the years to 59½',
  intro: `The years between your last paycheck and 59½ are paid from a narrower pot than your net worth: only the money you can reach without the ${pen} counts.`,
  resume: `An early retirement bridge is the money that pays your spending from the day you stop working until 59½, when every 401(k) and IRA opens without the ${pen} additional tax. Four sources are reachable before then: a taxable brokerage account and cash, the contributions already in a Roth IRA, a governmental 457(b), and the 401(k) of an employer you leave in or after the year you turn ${E.ruleOf55Age}. A Roth conversion ladder and a 72(t) series can add to them later. Someone who stops at 50 and spends ${K.usd(60000)} a year must cover ${K.dec(E.age - 50, 1)} years; with ${K.usd(300000)} taxable, ${K.usd(80000)} of Roth contributions and ${K.usd(120000)} in a 457(b), the reachable pot lasts ${A.value} at a 4 % real return. Stop at 48 on ${K.usd(55000)} with less in reach and the shortfall is ${B.value}. The calculator above runs your own figures.`,
  body: (h) => `
<h2>Net worth is not bridge money</h2>
<p>A FIRE number built as 25 times spending treats every dollar as spendable from the first day. Before 59½ that is wrong for most savers, because the largest balance usually sits in a 401(k) or an IRA. Those accounts owe the ${pen} additional tax on early payments, on top of income tax, unless an exception applies (${h.src('irs_exceptions', 'IRS exceptions table')}). The bridge is the subset that escapes it.</p>
${h.table(['Source', 'Reachable before 59½', 'Tax when you take it'], [
  ['Taxable brokerage and cash', 'any time', 'only the gain, at 0 %, 15 % or 20 %'],
  ['Roth IRA contributions', 'any time', 'none'],
  ['Governmental 457(b)', 'once the plan pays, no 10 %', 'ordinary income'],
  [`401(k) of the employer left in the year you turn ${E.ruleOf55Age} or later`, 'from the exit', 'ordinary income'],
  ['Roth conversions', 'five tax years after each', 'none when withdrawn'],
  ['IRA and older 401(k)s', 'only through a 72(t) series', 'ordinary income'],
], 'Sources: IRS exceptions table, Topic 558, Publication 590-B (2025).', ['l', 'l', 'l'])}
<p>The first four rows are money you can count on the day you leave. The last two are mechanisms you build: a conversion ladder needs five years of lead time, a 72(t) series locks a fixed payment for at least five years. Both work, but neither helps in the first year of retirement unless you prepared them in advance.</p>
<h2>How many years, and what they cost</h2>
<p>The length of the bridge is simply 59½ minus your stop age. Its cost depends on spending and on what the money earns while it waits. At ${K.usd(60000)} a year, health premiums included, and a 4 % return after inflation, the engine of this site prices the bridge in today's dollars:</p>
${h.table(['Stop at', 'Years to 59½', 'Bridge cost today'], byAge, 'Spending of $60,000 a year paid at the start of each year, 4 % real return; no reachable assets assumed.', ['r', 'r', 'r'])}
<p>Stopping at 55 is a special case. If the job you leave at 55 carries your main 401(k), the rule of ${E.ruleOf55Age} makes that plan bridge money too, and the problem largely disappears. Leaving at 52 with the same plan, it stays shut for seven and a half years. The ${h.a('when-can-you-draw-401k', 'draw-age page')} gives the date for each account.</p>
${h.mini('bridgeYears', { t: 'Your reachable money against your years', p: ['age', 't'], d: { age: 50, sp: 60000, t: 300000, rb: 80000, g: 120000 } })}
<h2>Two households, two answers</h2>
<p>The first household stops at 50, spends ${K.usd(60000)}, and holds ${K.usd(300000)} in a brokerage account, ${K.usd(80000)} of Roth contributions and ${K.usd(120000)} in a governmental 457(b) from a public job. That is ${A.rows?.[0]?.[1] ?? ''} within reach against a bridge cost of ${A.rows?.[1]?.[1] ?? ''}; it lasts ${A.value}, enough for the ${K.dec(E.age - 50, 1)} years. The 457(b) carries a share of the load that a private-sector 401(k) could not.</p>
<p>The second stops at 48 on ${K.usd(55000)} a year, with ${K.usd(250000)} taxable and ${K.usd(60000)} of Roth contributions. ${B.rows?.[0]?.[1] ?? ''} covers about ${B.rows?.[2]?.[1] ?? ''} years of the ${K.dec(E.age - 48, 1)} needed; the gap is ${B.value} in today's money. Three levers close it: work two more years, start a ${h.a('roth-conversion-ladder', 'conversion ladder')} in the first year so that rungs open from 53, or carve a ${h.a('72t-calculator', '72(t) series')} out of an IRA for exactly the missing income.</p>
<h2>In what order to spend the reachable money</h2>
<p>There is no single right order, but each source has a tax profile that suggests a place. Taxable accounts come first for many early retirees because only the gain is income, and long-term gains fall in the 0 % band up to ${K.usd(K.P.tax.capitalGains.zeroMax.joint)} of taxable income for a couple in 2026. With no other income, a couple can realize about ${K.usd(zeroTop)} of long-term gains a year before any of it is taxed: on ${K.usd(60000)} of gains the federal tax is ${K.usd(gains.total)}, with ${K.usd(gains.zeroRoom)} of 0 % room left.</p>
${h.mini('ltcg', { t: 'Gains you can sell at 0 %', p: ['g'], d: { st: 'joint', oi: 0, g: 60000 } })}
<p>Roth contributions often play the reserve: tax free at any age and invisible to the premium credit, they can pay for a year in which selling shares would mean selling low. A governmental 457(b) and a rule-of-55 plan pay ordinary income, which fits naturally in the years where the low brackets are empty, often alongside Roth conversions. The ${h.a('early-retirement-calculator', 'early retirement calculator')} applies an order year by year and shows the tax of each year.</p>
<h2>The 401(k) as a late pillar of the bridge</h2>
<p>For someone who stops at 52 but keeps a part-time job with a 401(k) until the year of the 55th birthday, the picture changes in the middle of the bridge. The first three years run on taxable money and Roth contributions; from the exit year onward that employer's plan pays without the ${pen}. A married couple taking ${K.usd(45000)} a year from it at 55, with no other income, owes ${K.usd(r55.federal)} of federal tax on each payment and no additional tax, although the plan holds back ${K.usd(r55.withheld)} at payout until the return is filed. Rolling an old 401(k) into that plan before the exit brings it under the same rule; rolling it into an IRA does the opposite. Planning the bridge in two halves, a short one funded by savings and a long one funded by the plan, often needs far less taxable money than a single block.</p>
<h2>The health cost inside the bridge</h2>
<p>Spending in the bridge years must include health coverage until Medicare at ${K.P.aca.medicareAge}. For most early retirees that means a Marketplace plan, whose premium credit depends on the income each withdrawal creates: brokerage sales count only their gain, Roth contributions count for nothing, 457(b) and 401(k) payments count in full. The order of withdrawals therefore changes the premium as well as the tax. The ${h.a('health-insurance-before-medicare', 'health coverage page')} sets out the 2026 and 2027 credit rules.</p>
`,
  faqs: [
    { q: 'What counts as bridge money before 59½?', a: `Money you can take without the ${pen} additional tax: taxable brokerage accounts and cash, the contributions in a Roth IRA, a governmental 457(b), and the 401(k) of an employer you leave in or after the year you turn ${E.ruleOf55Age}. Roth conversions join after five tax years each, an IRA only through a 72(t) series.` },
    { q: 'How big must my early retirement bridge be if I stop at 50?', a: `It must cover ${K.dec(E.age - 50, 1)} years. At ${K.usd(60000)} a year and a 4 % real return, that is ${byAge[2][2]} in today's dollars before counting any 401(k) under the rule of ${E.ruleOf55Age}. Health premiums until Medicare belong inside the yearly spending figure.` },
    { q: 'Can a governmental 457(b) carry the early retirement bridge on its own?', a: `It can, if the balance is large enough, because its payments owe no ${pen} at any age. Each payment is ordinary income, though, so a big yearly draw climbs the brackets and raises the income that sets a Marketplace premium credit.` },
    { q: 'Why spend taxable savings first in the bridge years?', a: `Because only the gain is taxed, and long-term gains are taxed at 0 % up to ${K.usd(K.P.tax.capitalGains.zeroMax.joint)} of taxable income for a couple in 2026. With no other income, about ${K.usd(zeroTop)} of gains a year costs nothing in federal tax, while the 401(k) and IRA keep growing untouched.` },
    { q: 'What if my reachable money falls short of the bridge?', a: 'Three levers close a gap: working longer, which shortens the bridge and lets a rule of 55 exit open the 401(k); starting a Roth conversion ladder at once so that rungs open five years later; or a 72(t) series sized to the missing income from part of an IRA.' },
  ],
  tool: 'bridgeYears',
  toolArg: { age: 50, sp: 60000, t: 300000, rb: 80000, g: 120000 },
  related: ['when-can-you-draw-401k', 'roth-conversion-ladder', '457b-early-withdrawal', 'zero-percent-capital-gains', 'early-retirement-calculator', 'health-insurance-before-medicare'],
  sources: ['irs_exceptions', 'tc558', 'pub590b', 'rp_2025_32'],
});
