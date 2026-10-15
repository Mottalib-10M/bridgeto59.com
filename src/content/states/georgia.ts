import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('georgia');
const rate = st.rate.flat ?? 0; // 4.99 % in 2026
const [mid, top] = st.exclusions; // $35,000 at 62-64, $65,000 from 65 (2025 booklet)
const ex62 = mid.amount ?? 0, ex65 = top.amount ?? 0;
// Worked case: $45,000 a year drawn from a 401(k) or IRA.
const amt = 45000;
const at = (age: number) => K.stateTax('georgia', amt, age, 0, age < K.P.early.age);
const a58 = at(58), a63 = at(63), a66 = at(66);
const gapYears = 62 - 50;

export default defineState({
  slug: 'georgia',
  title: 'Georgia Retirement Exclusion 2026: Nothing Before Age 62',
  description: `Georgia retirement exclusion 2026: ${K.usd(ex62)} a person from 62 and ${K.usd(ex65)} from 65; before 62, 401(k) and IRA payouts are taxed in full at the ${K.pct(rate, 2)} flat rate.`,
  intro: `Georgia's retirement income exclusion is generous once it starts, but it starts at 62: a FIRE retiree drawing a 401(k) or IRA in the fifties pays the flat ${K.pct(rate, 2)} on every dollar.`,
  resume: `Georgia excludes up to ${K.usd(ex62)} of retirement income per person from 62 to 64 and up to ${K.usd(ex65)} from 65, IRA and plan payouts included. Those are the amounts in the 2025 IT-511 booklet; the 2026 booklet was not out when we read the Department of Revenue site, and its 2026 tax updates page shows no change to them. Below 62, unless permanently and totally disabled, retirement distributions are fully taxable, and from 2026 the state rate is a flat ${K.pct(rate, 2)}, down from 5.19 % in 2025. For someone who stops working at 50, that means ${gapYears} years of fully taxed withdrawals before the exclusion appears. On ${K.usd(amt)} a year, Georgia takes ${K.usd(a58.total)} at 58, ${K.usd(a63.total)} at 63 and ${K.usd(a66.total)} at 66. Each spouse must qualify on their own age and income, and up to $5,000 of the exclusion may be earned income, such as part-time pay in a Barista FIRE plan.`,
  body: (h) => `
<h2>A long wait for early retirees</h2>
<p>Georgia's exclusion is aimed at traditional retirees, and its age gate shows it. The IT-511 booklet sets the maximum at ${K.usd(ex62)} for taxpayers "62 - 64 years of age" and ${K.usd(ex65)} at 65 or older. Nothing is available at 55, at 59½ or at 61. A resident who leaves work at 50 and lives on a 401(k) or IRA until 62 reports every dollar to Georgia for ${gapYears} years, whatever the IRS says about the federal penalty.</p>
${h.mini('state', { t: 'Georgia tax on a withdrawal at 58', p: ['amt', 'age'], d: { sx: 'georgia', age: 58, amt: 45000 } })}
<h2>One withdrawal, three ages</h2>
${h.table(['Age during the year', 'Georgia exclusion', 'Taxed in Georgia', `Tax at ${K.pct(rate, 2)}`], [
  ['58', K.usd(a58.excluded), K.usd(a58.taxed), K.usd(a58.total)],
  ['63', K.usd(a63.excluded), K.usd(a63.taxed), K.usd(a63.total)],
  ['66', K.usd(a66.excluded), K.usd(a66.taxed), K.usd(a66.total)],
], `${K.usd(amt)} a year from a 401(k) or IRA, one person, no other retirement income. Exclusion amounts from the 2025 IT-511 booklet.`, ['l', 'r', 'r', 'r'])}
<p>The drop between 61 and 62 is the largest single change in the table. That is why the order of withdrawals matters more in Georgia than the rate alone suggests: pre-tax money drawn at 60 is taxed in full, while the same money drawn at 62 sits largely inside the exclusion.</p>
<h2>Filling the years before 62</h2>
<p>The years from leaving work to 62 are better carried by money that adds little or nothing to taxable income. Roth contributions come back out without federal tax, and cash savings are not income at all. A ${h.a('roth-conversion-ladder', 'Roth conversion ladder')} works too, with one Georgia point to weigh: a conversion before 62 raises income in a year when no state exclusion exists to absorb it. Whether a conversion made after 62 falls inside the exclusion is not something the booklet we read addresses, so this page leaves it open. The ${h.a('early-retirement-bridge', 'bridge page')} lays out the federal sequence.</p>
<h2>Couples and part-time work</h2>
<p>Each spouse qualifies separately, on their own age and income. A 63-year-old married to a 58-year-old has one exclusion, not two: the younger spouse's IRA withdrawals stay fully taxable until that spouse reaches 62. Up to $5,000 of each person's exclusion may be earned income, which helps a ${h.a('barista-fire', 'Barista FIRE')} retiree past 62 who keeps a part-time job. A taxpayer who is permanently and totally disabled can claim the exclusion before 62.</p>
`,
  faqs: [
    { q: 'How much retirement income can I exclude in Georgia at 63?', a: `Up to ${K.usd(ex62)} a person for taxpayers aged 62 to 64, according to the 2025 IT-511 booklet. It covers IRA and plan distributions, pensions and up to $5,000 of earned income. On a ${K.usd(amt)} withdrawal at 63, ${K.usd(a63.taxed)} stays taxable, about ${K.usd(a63.total)} at the 2026 rate.` },
    { q: 'Is a 401(k) withdrawal at 55 taxable in Georgia?', a: `Yes, in full. Georgia's exclusion starts at 62, so a 401(k) or IRA payout at 55 is taxed at the flat ${K.pct(rate, 2)} rate in 2026, even when the rule of 55 removes the federal 10 %. Only permanently and totally disabled taxpayers can claim the exclusion before 62.` },
    { q: 'Can both spouses claim the Georgia retirement exclusion?', a: `Yes, if each one qualifies separately. Each spouse needs to be 62 or older, or permanently and totally disabled, and the exclusion applies to that spouse's own retirement income. Two spouses aged 65 or more can exclude up to ${K.usd(ex65)} each, ${K.usd(ex65 * 2)} together.` },
    { q: 'What is Georgia’s flat income tax rate in 2026?', a: `Georgia's flat rate is ${K.pct(rate, 2)} for 2026, down from 5.19 % for 2025, according to the Department of Revenue's tax updates page. It applies to retirement withdrawals not covered by the exclusion, which before 62 means all of them.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'early-retirement-bridge', 'roth-conversion-ladder', 'barista-fire', 'retire-at-50'],
});
