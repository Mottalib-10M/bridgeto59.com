import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.sepp;
const AFR = S.afr as Record<string, { rr: string; file: string; mid120: number }>;
const afrMonths = Object.keys(AFR).sort();
const firstAfr = afrMonths[0], lastAfr = afrMonths[afrMonths.length - 1];
const caps = K.CAP_MONTHS.map((m) => ({ m, ...K.maxRate(m) }));
const last = caps[caps.length - 1];
const firstCap = caps[0];
const floorMonths = caps.filter((c) => c.from === 'floor');
const lastFloor = floorMonths[floorMonths.length - 1];
const firstAbove = caps.find((c) => c.from !== 'floor')!;
// Worked case: a $650,000 IRA, owner aged 53 in the first year (Single Life Table).
const bal = 650000, age = 53;
const am = (r: number) => K.sepp('amortization', bal, age, r);
const an = (r: number) => K.sepp('annuitization', bal, age, r);
const rmd = K.sepp('rmd', bal, age, 0);
const atFloor = am(S.floor), atCap = am(last.rate), atLow = am(0.04);
const gain = atCap - atFloor;
const rateLabel = (c: { from: string; rate: number }) => (c.from === 'floor' ? `${K.pct(S.floor, 0)} floor` : `120 % mid-term of ${K.month(c.from)}`);

export default defineGuide({
  id: '72t-interest-rate',
  group: 'access',
  order: 23,
  slug: '72t-interest-rate',
  nav: '72(t) interest rate',
  card: 'The highest rate allowed for a series starting each month of 2026',
  title: '72(t) Interest Rate 2026: Highest SEPP Rate for Each Month',
  description: `72(t) interest rate for 2026: ${K.pct(last.rate, 2)} for a first payment in ${K.month(last.m)}, the ${K.pct(S.floor, 0)} floor and 120 % of the mid-term AFR for every month since March 2026.`,
  h1: '72(t) interest rate: the ceiling for each month of 2026',
  intro: `The interest rate behind a fixed 72(t) payment has a ceiling that moves every month, and the month of your first payment fixes it for the life of the series.`,
  resume: `The highest interest rate a 72(t) series may use is the greater of ${K.pct(S.floor, 0)} and 120 % of the federal mid-term rate published for either of the two months immediately before the month of the first payment (IRS Notice 2022-6 and its SEPP questions and answers). In 2026, 120 % of the mid-term rate went from ${K.pct(AFR[firstAfr].mid120, 2)} in the ${AFR[firstAfr].rr} for ${K.month(firstAfr)} to ${K.pct(AFR[lastAfr].mid120, 2)} in the ${AFR[lastAfr].rr} for ${K.month(lastAfr)}. The floor decided every month through ${K.month(lastFloor.m)}; from ${K.month(firstAbove.m)} the published rate took over, and a first payment in ${K.month(last.m)} may use up to ${K.pct(last.rate, 2)}. The rate only matters for the two fixed methods. On a ${K.usd(bal)} IRA at age ${age}, fixed amortization pays ${K.usd(atFloor)} a year at ${K.pct(S.floor, 0)} and ${K.usd(atCap)} at ${K.pct(last.rate, 2)}; the RMD method pays ${K.usd(rmd)} whatever the rate. Any lower rate is allowed too.`,
  body: (h) => `
<h2>The rule in one sentence, and where it comes from</h2>
<p>IRS Notice 2022-6, which governs every series that starts after 2022, caps the rate used by the fixed amortization and fixed annuitization methods. The SEPP questions and answers put it plainly: the rate may not be more than the greater of ${K.pct(S.floor, 0)} or 120 % of the federal mid-term rate published in the IRS revenue rulings on applicable federal rates (AFR) for either of the two months immediately preceding the month of the first payment (${h.src('irs_sepp', 'IRS SEPP FAQ, Q&A 4')}). The earlier guidance, Rev. Rul. 2002-62, used 120 % of the mid-term rate alone, with no floor (Notice 2022-6, section 2.06); the worked example in the current FAQ assumes a published figure below the floor and still lets the owner use ${K.pct(S.irsExample.rate, 0)}, because the floor sits above it.</p>
<p>Each month the IRS publishes a revenue ruling with a table of rates, and 120 % of the mid-term rate is the figure the notice points to. The index page lists them all (${h.src('afr_index', 'IRS applicable federal rates')}). The table below shows the figure from each 2026 ruling as recorded by this site.</p>
${h.table(['Ruling month', 'Revenue ruling', '120 % of mid-term AFR', 'Above the floor?'],
  afrMonths.map((m) => [K.month(m), AFR[m].rr, K.pct(AFR[m].mid120, 2), AFR[m].mid120 > S.floor ? 'yes' : 'no']),
  `120 % of the federal mid-term rate, from the monthly revenue rulings of 2026. Floor: ${K.pct(S.floor, 0)} (Notice 2022-6).`, ['l', 'l', 'r', 'l'])}
<h2>Two months back, and the higher one wins</h2>
<p>The month that counts is the month the first payment reaches you, not the month you sign the paperwork or the month of the account statement used for the balance. From it, you look back two months and take the higher of the two published figures, then compare it with the floor. A series whose first payment arrives in ${K.month(firstAbove.m)} looks at ${firstAbove.months.map((x) => K.month(x.month)).join(' and ')}; the higher of the two is ${K.pct(firstAbove.rate, 2)}, which beats ${K.pct(S.floor, 0)}. One that starts in ${K.month(lastFloor.m)} looks at two figures that both sit under the floor, so ${K.pct(S.floor, 0)} applies.</p>
${h.table(['First payment in', 'Months looked at', 'Highest rate allowed', 'Comes from', `Amortization on ${K.usd(bal)} at ${age}`],
  caps.map((c) => [K.month(c.m), c.months.map((x) => K.month(x.month).split(' ')[0]).join(', '), K.pct(c.rate, 2), rateLabel(c), K.usd(am(c.rate))]),
  `A series starting in January or February 2026 also depends on the rulings for November and December 2025, which this table does not include. Single Life Table, life expectancy ${K.dec(K.life(age), 1)} years at ${age}.`, ['l', 'l', 'r', 'l', 'r'])}
<p>The pattern of 2026 has a practical reading. Through the first half of the year, 120 % of the mid-term rate moved between ${K.pct(AFR['2026-01'].mid120, 2)} and ${K.pct(AFR['2026-06'].mid120, 2)}, always under the floor, so the cap did not move at all: ${K.pct(S.floor, 0)} from ${K.month(firstCap.m)} to ${K.month(lastFloor.m)}. The ${AFR['2026-07'].rr} pushed the figure over the line, and the ${h.src('rr_2026_17', AFR['2026-09'].rr)} and ${h.src('rr_2026_19', AFR['2026-10'].rr)} raised it again. Because either of the two prior months may be used, a drop in one month does not lower the cap right away: the previous, higher month stays available for one more month.</p>
${h.mini('seppRate', { t: 'Pick the month of your first payment', p: ['m'], d: { m: firstAbove.m, b: bal, age } })}
<h2>What a point of interest is worth</h2>
<p>The rate works like a discount: a higher rate assumes the account earns more, so the formula lets you take more each year. On the ${K.usd(bal)} example, moving from ${K.pct(S.floor, 0)} to ${K.pct(last.rate, 2)} adds ${K.usd(gain)} a year under fixed amortization, about ${K.usd(gain / 12)} a month, for every year the series runs. The annuitization method reacts in the same direction from a higher base.</p>
${h.table(['Rate used', 'Fixed amortization', 'Fixed annuitization', 'RMD method'], [
  [K.pct(0.04, 2), K.usd(atLow), K.usd(an(0.04)), K.usd(rmd)],
  [`${K.pct(S.floor, 2)} (floor)`, K.usd(atFloor), K.usd(an(S.floor)), K.usd(rmd)],
  [`${K.pct(last.rate, 2)} (${K.month(last.m)} cap)`, K.usd(atCap), K.usd(an(last.rate)), K.usd(rmd)],
], `Yearly payment on ${K.usd(bal)} at age ${age}. The RMD method divides the balance by the life expectancy and ignores the rate.`, ['l', 'r', 'r', 'r'])}
<p>Taking the maximum is not automatically the right design. A higher fixed payment drains the account faster if returns fall short, and the series cannot be lowered later without breaking it, apart from the one-time switch to the RMD method. Some owners pick the cap to need a smaller IRA for the same income and keep the rest in a separate account; others pick a rate under the cap to leave room. Notice 2022-6 allows any rate up to the ceiling, so a round 5 % in a month when ${K.pct(last.rate, 2)} is allowed is perfectly valid.</p>
<h2>The month of the first payment is fixed for good</h2>
<p>Once the first payment is made, the rate and the payment of a fixed method stay the same every year. Rates that rise or fall later change nothing, in either direction. That is why the timing of the first payment deserves a decision: in a year when rates climb month after month, as in 2026, waiting a month can add a little to the ceiling; when rates fall, the two-month look-back gives a short window to lock the earlier, higher figure. The IRS also notes that a series is not considered to have begun until the first payment is made, and that it should begin within the calendar year for which the annual amount was first determined.</p>
<h2>What to write down before the first payment</h2>
<p>An audit, if one comes, may arrive years later. Keep a single page with the balance used and its date, the life expectancy table, the method, the rate chosen, the two monthly figures it was compared with, and the revenue ruling numbers. The ${h.a('72t-calculator', '72(t) calculator')} shows the rate, its source month and the lock date for the month you select, and the ${h.a('72t-modification', 'modification page')} explains what happens if the yearly amount ever changes.</p>
`,
  faqs: [
    { q: `What is the highest 72(t) interest rate for a first payment in ${K.month(last.m)}?`, a: `${K.pct(last.rate, 2)}. The look-back months are ${last.months.map((x) => K.month(x.month)).join(' and ')}, whose rulings give 120 % of the mid-term rate at ${last.months.map((x) => ('mid120' in x ? K.pct(x.mid120, 2) : '')).join(' and ')}. The higher figure beats the ${K.pct(S.floor, 0)} floor, so it sets the cap. Any lower rate is also allowed for the fixed methods.` },
    { q: `Why was the 72(t) rate stuck at ${K.pct(S.floor, 0)} in the first half of 2026?`, a: `Because 120 % of the federal mid-term rate stayed below ${K.pct(S.floor, 0)} in every ruling from ${K.month(firstAfr)} to ${K.month('2026-06')}, between ${K.pct(AFR['2026-01'].mid120, 2)} and ${K.pct(AFR['2026-06'].mid120, 2)}. Notice 2022-6 lets you use the greater of the floor and the published figure, so the floor set the cap until the ${AFR['2026-07'].rr} crossed it.` },
    { q: 'Does the 72(t) interest rate change my payment after the series starts?', a: 'No. Under the fixed amortization and fixed annuitization methods, the rate and the yearly payment are set in the first year and stay the same until the series ends. Later rulings, higher or lower, do not apply. Under the RMD method the payment is recomputed each year from the balance and the life expectancy, and no interest rate is used.' },
    { q: 'Which month sets the 72(t) rate: the account statement or the first payment?', a: 'The month of the first payment. The cap looks at the two months immediately before the month in which the first payment is made. The balance can come from an earlier statement, such as the last one of the prior year, adjusted in a reasonable way for later contributions or payments, as the IRS SEPP questions and answers describe.' },
    { q: `How much more does the 72(t) cap pay than the 5 % floor on ${K.usd(bal)}?`, a: `At age ${age}, fixed amortization on ${K.usd(bal)} pays ${K.usd(atFloor)} a year at ${K.pct(S.floor, 0)} and ${K.usd(atCap)} at the ${K.pct(last.rate, 2)} cap of ${K.month(last.m)}: ${K.usd(gain)} more each year. The gain lasts as long as the series, but so does the faster drawdown if returns fall short.` },
  ],
  tool: 'seppRate',
  related: ['72t-calculator', '72t-modification', 'early-retirement-bridge', 'retire-at-55', 'roth-conversion-ladder'],
  sources: ['notice_2022_6', 'irs_sepp', 'rr_2026_19', 'rr_2026_17', 'afr_index', 'ecfr_tables'],
});
