import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.tax;
const Z = T.capitalGains.zeroMax, F = T.capitalGains.fifteenMax, D = T.standardDeduction;
// Couple living on a brokerage account: $20,000 of 401(k) money (rule of 55) and $60,000 of long-term gains.
const couple = K.tax({ ordinary: 20000, ltcg: 60000, status: 'joint' });
// Single filer: $30,000 ordinary and $60,000 of gains, part above the 0 % band.
const single = K.tax({ ordinary: 30000, ltcg: 60000, status: 'single' });
// Highest gain a single filer with no other income can realize at 0 %: deduction + 0 % band.
const maxSingle = D.single + Z.single;
const maxJoint = D.joint + Z.joint;

export default defineGuide({
  id: 'zero-percent-capital-gains',
  group: 'tax',
  order: 51,
  slug: 'zero-percent-capital-gains',
  nav: '0 % capital gains',
  card: 'Gains you can sell tax-free in 2026, given your other income',
  title: '0% Capital Gains Bracket 2026: Live Off Gains at Zero Tax',
  description: `0% capital gains in 2026: up to ${K.usd(Z.single)} of taxable income single and ${K.usd(Z.joint)} joint. An early retiree can sell about ${K.usd(maxJoint)} of gains as a couple tax-free.`,
  h1: 'The 0 % capital gains bracket: how much you can sell tax-free in 2026',
  intro: `Long-term gains are taxed at 0 % as long as your taxable income, gains included, stays under ${K.usd(Z.single)} for a single filer or ${K.usd(Z.joint)} for a married couple in 2026.`,
  resume: `Gains on investments held more than a year are taxed at 0 %, 15 % or 20 %, and the rate depends on where the gain sits on top of your other taxable income. For 2026, Rev. Proc. 2025-32 puts the top of the 0 % band at ${K.usd(Z.single)} of taxable income for a single filer, ${K.usd(Z.head)} for a head of household and ${K.usd(Z.joint)} for a married couple filing jointly; the 15 % band runs to ${K.usd(F.single)} single and ${K.usd(F.joint)} joint. Since the standard deduction comes off first, a single early retiree with no other income can realize about ${K.usd(maxSingle)} of long-term gains with no federal income tax, and a couple about ${K.usd(maxJoint)}. That is why a taxable brokerage account is often the cheapest money to spend before 59½. Ordinary income (401(k) withdrawals, Roth conversions, interest) fills the bands first and pushes gains up; the calculator above shows how much 0 % room is left for yours.`,
  body: (h) => `
<h2>How the stacking works</h2>
<p>The tax return stacks income in a fixed order. Ordinary income comes first, reduced by the standard deduction. Long-term gains and qualified dividends sit on top. The part of the gains that falls below the 0 % threshold is taxed at nothing; the part above it at 15 %, and above the second threshold at 20 %. Nothing about the gain itself changes the rate: only what is under it.</p>
<p>Take a couple who left work at 56 and live on two sources: ${K.usd(20000)} from the 401(k) of the last employer, paid without the 10 % under the ${h.a('rule-of-55', 'rule of 55')}, and ${K.usd(60000)} of long-term gains from selling shares. After the ${K.usd(D.joint)} joint deduction, taxable ordinary income is ${K.usd(couple.taxableOrdinary)}, taxed ${K.usd(couple.ordinaryTax)}. The gains sit between ${K.usd(couple.taxableOrdinary)} and ${K.usd(couple.taxableOrdinary + couple.taxableGains)}, all under ${K.usd(Z.joint)}: ${K.usd(couple.gainsTax)} of tax on them, with ${K.usd(couple.zeroRoom)} of 0 % room still unused.</p>
${h.mini('ltcg', { t: 'How much 0 % room your year leaves', p: ['oi', 'g'], d: { st: 'joint', oi: 20000, g: 60000 } })}
<h2>Where the 0 % band stops</h2>
<p>A single filer with ${K.usd(30000)} of ordinary income who sells ${K.usd(60000)} of gains goes past the line. Taxable ordinary income is ${K.usd(single.taxableOrdinary)}; the gains run from there to ${K.usd(single.taxableOrdinary + single.taxableGains)}, so part of them is above ${K.usd(Z.single)} and taxed at 15 %: ${K.usd(single.gainsTax)} in all. Selling the extra shares in January instead of December would put that part into the next year's band.</p>
${h.table(['Filing status', 'Standard deduction', '0 % up to (taxable income)', 'Gains at 0 % with no other income', '15 % up to'], [
  ['Single', K.usd(D.single), K.usd(Z.single), K.usd(D.single + Z.single), K.usd(F.single)],
  ['Married filing jointly', K.usd(D.joint), K.usd(Z.joint), K.usd(D.joint + Z.joint), K.usd(F.joint)],
  ['Head of household', K.usd(D.head), K.usd(Z.head), K.usd(D.head + Z.head), K.usd(F.head)],
], '2026 thresholds, Rev. Proc. 2025-32 sections 4.03 and 4.14. The fourth column assumes no ordinary income at all.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Gain, not sale price</h2>
<p>Only the gain counts, not the cash you receive. Selling ${K.usd(80000)} of shares bought for ${K.usd(50000)} creates ${K.usd(30000)} of gain; the other ${K.usd(50000)} is your own money coming back and is not income. Early in a long holding, most of a sale is basis; late, most of it is gain. That is why a taxable account bought over the years before retirement can fund a large part of a bridge with almost no income on the return, which in turn keeps the Marketplace premium tax credit high (see the ${h.a('aca-subsidy-cliff', 'subsidy cliff page')}).</p>
<h2>A year of spending from a brokerage account</h2>
<p>Picture a couple at 52 who need ${K.usd(70000)} for the year and hold an index fund whose value is half original cost and half gain. Selling ${K.usd(70000)} creates ${K.usd(35000)} of long-term gain and returns ${K.usd(35000)} of basis. With no other income, the gain sits entirely inside the deduction and the 0 % band: federal income tax ${K.usd(K.tax({ ordinary: 0, ltcg: 35000, status: 'joint' }).total)}. Their adjusted gross income for the year is ${K.usd(35000)}, low enough to keep a sizable premium tax credit on a Marketplace plan, while the 401(k) and IRAs keep growing untouched until the rules open them. The same couple funding the year from a traditional IRA would report ${K.usd(70000)} of ordinary income, owe ${K.usd(K.tax({ ordinary: 70000, status: 'joint' }).total)} of income tax and, at 52, the ${K.pct(K.P.early.penalty, 0)} additional tax as well.</p>
<p>The trade-off appears later: every year spent from the brokerage account leaves the pre-tax accounts larger, and their withdrawals after 59½ will be fully taxed. Many plans therefore combine both, selling gains at 0 % and converting a slice of the IRA in the same year, up to the edge of the band that matters most to them.</p>
<h2>Harvesting gains on purpose</h2>
<p>In a year when you do not need to sell, you can still use the band: sell shares with a gain and buy them back at once. The gain is taxed at 0 %, and the new cost basis is higher, so future sales carry less gain. The wash-sale rule concerns losses, not gains, so buying back at once does not cancel a gain. The move uses room that the same year's Roth conversions would also want, so the two compete: a conversion fills the ordinary brackets first and pushes gains up into the 15 % band.</p>
<h2>What can still tax a 0 % gain</h2>
<ul>
<li>State income tax: most states tax capital gains as ordinary income; see the ${h.a('state-tax-on-retirement-withdrawals', 'state pages')}. Washington taxes large gains through a separate excise.</li>
<li>Short-term gains, on shares held a year or less, are ordinary income and fill the brackets like wages.</li>
<li>The 3.8 % net investment income tax applies only above much higher incomes and is not modeled here.</li>
</ul>
`,
  faqs: [
    { q: 'How much in capital gains can a married couple realize at 0 % in 2026?', a: `With no other income, about ${K.usd(maxJoint)}: the ${K.usd(D.joint)} standard deduction plus the 0 % band up to ${K.usd(Z.joint)} of taxable income. Any ordinary income, such as 401(k) withdrawals, interest or a Roth conversion, takes space in that band first and reduces the gains that stay at 0 %.` },
    { q: 'Does a Roth conversion reduce my 0 % capital gains room?', a: `Yes. A conversion is ordinary income, so it is stacked below the gains. Converting ${K.usd(30000)} as a single filer with no other income uses the ${K.usd(D.single)} deduction and ${K.usd(30000 - D.single)} of the band, leaving ${K.usd(Z.single - (30000 - D.single))} of gains at 0 %. The calculator shows the room left for your mix.` },
    { q: 'Are gains on shares held for six months taxed at 0 %?', a: 'No. Gains on investments held one year or less are short-term and taxed as ordinary income at your bracket. Only long-term gains and qualified dividends use the 0 %, 15 % and 20 % rates. Waiting past the one-year mark before selling can change the rate on the whole gain.' },
    { q: 'Is the whole sale counted for the 0 % capital gains threshold?', a: `No, only the gain is income. Selling ${K.usd(80000)} of shares that cost ${K.usd(50000)} adds ${K.usd(30000)} to your income; the ${K.usd(50000)} of basis is your own money returned. Early retirees use this to spend from taxable accounts with little income on the return.` },
  ],
  tool: 'ltcg',
  related: ['tax-on-401k-withdrawal', 'early-retirement-bridge', 'aca-subsidy-cliff', 'roth-conversion-ladder', 'state:washington'],
  sources: ['rp_2025_32', 'hc_lower', 'irs_exceptions'],
});
