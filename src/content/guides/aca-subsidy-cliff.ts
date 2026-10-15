import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const A = K.P.aca;
const capPct = K.pct(A.cap, 0);
const line = (y: '2026' | '2027', n: number) => K.fpl(y, n) * A.cap;
const sizes = [1, 2, 3, 4, 5, 6];
// Couple in 2026 with an assumed benchmark of $1,700 a month (typed by the reader from HealthCare.gov).
const bench = 1700;
const cap2 = line('2026', 2);
const at = K.ptc({ year: '2026', size: 2, magi: cap2, benchmarkMonthly: bench });
const over = K.ptc({ year: '2026', size: 2, magi: cap2 + 1, benchmarkMonthly: bench });
// Steering MAGI: a couple with $60,000 of 401(k) withdrawals has this much room before the line.
const room = cap2 - 60000;
// Sale of $50,000 of shares bought for $20,000: only the $30,000 gain enters MAGI.
const sale = 50000, basis = 20000;
// Single person in 2027, assumed benchmark $950.
const cap1y27 = line('2027', 1);
const one27 = K.ptc({ year: '2027', size: 1, magi: cap1y27, benchmarkMonthly: 950 });

export default defineGuide({
  id: 'aca-subsidy-cliff',
  group: 'health',
  order: 41,
  slug: 'aca-subsidy-cliff',
  nav: 'ACA subsidy cliff',
  card: 'The 400 % line, household by household, and how to stay under it',
  title: 'ACA Subsidy Cliff 2026: The 400 % Line and Your MAGI',
  description: `ACA subsidy cliff in 2026 and 2027: one dollar of MAGI above ${capPct} of the poverty line, ${K.usd(cap2)} for a couple in 2026, ends the whole premium credit at once.`,
  h1: 'The ACA subsidy cliff: the 400 % line and how early retirees steer under it',
  intro: `In 2026 and 2027 the Marketplace premium credit stops at ${capPct} of the poverty line, and it stops all at once: one dollar over and the whole credit is gone.`,
  resume: `The ACA subsidy cliff is the income line above which the premium tax credit disappears entirely. The applicable percentage tables for 2026 (Rev. Proc. 2025-25) and 2027 (Rev. Proc. 2026-26) end at ${capPct} of the federal poverty line, with no phase-out beyond it. For 2026 coverage the line is ${K.usd(line('2026', 1))} of modified adjusted gross income (MAGI) for one person and ${K.usd(cap2)} for a couple; for 2027 coverage it rises to ${K.usd(cap1y27)} and ${K.usd(line('2027', 2))}. With a benchmark premium of ${K.usd(bench)} a month, a couple exactly at the line keeps a credit of ${K.usd(at.credit)} a year, and one dollar more costs all of it. For an early retiree MAGI is largely chosen: a brokerage sale counts only its gain, Roth contributions count for nothing, while Roth conversions and 401(k) withdrawals count in full. The calculator above shows your room before the line.`,
  body: (h) => `
<h2>The line for your household</h2>
<p>The poverty line used for Marketplace savings is the one of the year before the coverage year: 2025 guidelines for 2026 coverage, 2026 guidelines for 2027 coverage (${h.src('hc_fpl', 'HealthCare.gov')}). Multiply it by four and you have the cliff. The figures below cover the 48 contiguous states and the District of Columbia.</p>
${h.table(['People in the tax household', '2026 coverage: 400 % line', '2027 coverage: 400 % line'], sizes.map((n) => [String(n), K.usd(line('2026', n)), K.usd(line('2027', n))]), 'MAGI above which no premium tax credit is allowed. Poverty guidelines as listed on HealthCare.gov; tables of Rev. Proc. 2025-25 and Rev. Proc. 2026-26.', ['r', 'r', 'r'])}
<p>The household is the tax household, the people counted on your return. Each extra person moves the 2026 line by ${K.usd(K.P.aca.fpl['2026'].extra * A.cap)} and the 2027 line by ${K.usd(K.P.aca.fpl['2027'].extra * A.cap)}, so a child who leaves the return can pull a family over the cliff without any change in income.</p>
<h2>What one dollar over costs</h2>
<p>Below the line the credit fades gently: between 300 % and 400 % the share of income you pay is flat at ${K.pct(A.applicable['2026'][5][2], 2)} in 2026 and ${K.pct(A.applicable['2027'][5][2], 2)} in 2027. At the line it stops. A couple whose benchmark silver premium is ${K.usd(bench)} a month, a figure you would read for your own ages and county on HealthCare.gov, keeps ${K.usd(at.credit)} a year of credit at ${K.usd(cap2)} of MAGI. At ${K.usd(cap2 + 1)} the credit is ${K.usd(over.credit)} and they pay the full ${K.usd(bench * 12)}. The same arithmetic, scaled to a single person, applies at ${K.usd(cap1y27)} in 2027: with a ${K.usd(950)} benchmark, the credit at the line is ${K.usd(one27.credit)}.</p>
<p>The benchmark premium rises with age, and the credit lost at the line rises with it, since your expected share stays fixed at the same income. In the last years before Medicare the cliff can be worth more than any bracket decision of the year.</p>
${h.mini('cliff', { t: 'Your distance to the line', p: ['magi'], d: { y: '2027', hh: 1, magi: 61000, b: 950 } })}
<h2>Steering MAGI when you control your income</h2>
<p>A salaried worker has little say over MAGI. An early retiree living on savings has a great deal, because each source of cash counts differently.</p>
<ul>
<li><strong>Sale from a taxable account</strong>: only the gain enters income. Selling ${K.usd(sale)} of shares bought for ${K.usd(basis)} adds ${K.usd(sale - basis)}, not ${K.usd(sale)}. Shares with a high cost basis are the cheapest cash in MAGI terms.</li>
<li><strong>Roth IRA contributions</strong>: a return of regular contributions is not included in income (Publication 590-B), so it adds nothing.</li>
<li><strong>Roth conversion</strong>: the taxable amount converted is income for the year, dollar for dollar.</li>
<li><strong>401(k), IRA or 457(b) payment</strong>: every pre-tax dollar counts, whether or not the ${K.pct(K.P.early.penalty, 0)} applies.</li>
<li><strong>Cash already in the bank</strong>: spending it adds nothing; only the interest it earned counts.</li>
</ul>
<p>A couple taking ${K.usd(60000)} from a 401(k) in 2026 has ${K.usd(room)} of room before the line. That room can hold a Roth conversion, a realized gain or a mix. Taken one step further, the same couple could cover part of their spending from Roth contributions and use the freed room for a larger conversion, paying for future years with today's low bracket while keeping the credit.</p>
<h2>The year that counts</h2>
<p>The credit is figured on the MAGI of the coverage year, not the year before: HealthCare.gov says savings are based on your income estimate "for the year you want coverage, not last year" (${h.src('hc_lower', 'HealthCare.gov')}). A December conversion counts in full for the year it happens. An estimate made in November for the following year is only a forecast: if the year ends above the line, the credit paid in advance during the year is settled on your return for that year.</p>
<p>Two habits limit surprises. Large one-off income, such as a lump sum from an old plan or a big gain, is easier to place in a year when you are not on Marketplace coverage, for example before you stop working or after ${A.medicareAge}. And conversions and sales are safest late in the year, once the rest of the year's income is known, with a margin under the line for interest and dividends that arrive in December.</p>
<h2>What sits under the floor</h2>
<p>The opposite edge exists too. Below 100 % of the poverty line, HealthCare.gov says you probably will not qualify for Marketplace savings and may qualify for Medicaid instead. For a couple in 2026 that floor is ${K.usd(K.fpl('2026', 2))}. Someone who has steered MAGI down to almost nothing by living on Roth contributions and cash can drop below it; a modest conversion brings MAGI back inside the credit range. The ${h.a('health-insurance-before-medicare', 'health coverage page')} gives the share of income paid at each level, and the ${h.a('roth-conversion-ladder', 'conversion ladder page')} sizes conversions inside the window.</p>
`,
  faqs: [
    { q: 'What is the ACA subsidy cliff for a couple in 2026?', a: `${K.usd(cap2)} of MAGI, which is ${capPct} of the ${K.usd(K.fpl('2026', 2))} poverty line used for 2026 coverage. Above it the premium tax credit is zero. With a ${K.usd(bench)} monthly benchmark premium, a couple at the line keeps ${K.usd(at.credit)} a year of credit.` },
    { q: 'Is the ACA subsidy cliff back for 2027 coverage?', a: `Yes. Rev. Proc. 2026-26, which sets the 2027 applicable percentages, stops at ${capPct} of the poverty line like the 2026 table. For 2027 the line is ${K.usd(cap1y27)} for one person and ${K.usd(line('2027', 2))} for two, based on the 2026 poverty guidelines.` },
    { q: 'Does selling stocks push me over the ACA subsidy cliff?', a: `Only the gain counts. Selling ${K.usd(sale)} of shares that cost ${K.usd(basis)} adds ${K.usd(sale - basis)} to MAGI. Long-term gains count in MAGI even when they are taxed at 0 %, so a large sale can cross the line although it costs no federal income tax.` },
    { q: 'How much can I convert to Roth without losing the ACA credit?', a: `The 400 % line minus your other MAGI. A couple with ${K.usd(60000)} of 401(k) withdrawals in 2026 can add up to ${K.usd(room)} of conversions and gains before reaching ${K.usd(cap2)}. Leave a margin for interest and dividends paid late in the year.` },
    { q: 'What happens if my income ends the year above the subsidy cliff?', a: 'The credit is based on the income of the coverage year. Any credit paid in advance on a lower estimate is settled on your tax return for that year, so crossing the line in December can mean paying back the advance credit for the whole year. Updating your estimate on HealthCare.gov during the year limits the gap.' },
  ],
  tool: 'cliff',
  related: ['health-insurance-before-medicare', 'cobra-vs-marketplace', 'roth-conversion-ladder', 'zero-percent-capital-gains', 'early-retirement-bridge'],
  sources: ['rp_2025_25', 'rp_2026_26', 'hc_fpl', 'hc_lower', 'pub590b'],
});
