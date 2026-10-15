import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = K.P.sepp;
const ex = S.irsExample;
const last = K.CAP_MONTHS[K.CAP_MONTHS.length - 1];
const cap = K.maxRate(last);
const bal = 500000, age = 50;
const pay = (m: 'rmd' | 'amortization' | 'annuitization', r = cap.rate) => K.sepp(m, bal, age, r);
const lockA = K.lockEnd(`${last}-01`, '1976-06-01');
const lockB = K.lockEnd(`${last}-01`, '1969-03-01');

export default defineGuide({
  id: '72t-calculator',
  group: 'access',
  order: 22,
  slug: '72t-calculator',
  nav: '72(t) calculator',
  card: 'The three IRS methods, this month’s top rate and the lock date',
  title: '72(t) Calculator 2026: SEPP Payments at This Month’s Rate',
  description: `72(t) calculator for 2026: the three Notice 2022-6 methods, the ${K.pct(cap.rate, 2)} cap for ${K.month(last)}, and the date your series can stop. Matches the IRS examples.`,
  h1: '72(t) calculator: substantially equal payments before 59½',
  intro: `A 72(t) series lets you take fixed yearly payments from an IRA at any age without the ${K.pct(K.P.early.penalty, 0)} additional tax, as long as you never change them until the lock ends.`,
  resume: `Section 72(t)(2)(A)(iv) of the tax code removes the ${K.pct(K.P.early.penalty, 0)} additional tax from a series of substantially equal periodic payments, often called SEPP. IRS Notice 2022-6 accepts three ways to set the yearly amount: the required minimum distribution method (balance divided by life expectancy, recomputed each year), fixed amortization and fixed annuitization (one amount fixed at the start). For the fixed methods the interest rate may not exceed the greater of ${K.pct(S.floor, 0)} and 120 % of the federal mid-term rate of either of the two months before the first payment: ${K.pct(cap.rate, 2)} for a series starting in ${K.month(last)}. On a ${K.usd(bal)} IRA at age ${age}, that gives ${K.usd(pay('rmd'))} a year under the RMD method, ${K.usd(pay('amortization'))} under amortization and ${K.usd(pay('annuitization'))} under annuitization. The payments must continue until the later of five years after the first one and age 59½; changing them earlier brings back the 10 % on every past payment, plus interest.`,
  body: (h) => `
<h2>The calculator reproduces the IRS examples to the dollar</h2>
<p>The IRS publishes one worked case in its SEPP questions and answers: an IRA owner who turns ${ex.age} in the first year, a ${K.usd(ex.balance)} balance, a rate of ${K.pct(ex.rate, 0)} and the Single Life Table (${h.src('irs_sepp', 'IRS SEPP FAQ')}). The RMD method gives ${K.usd(ex.rmd)}, fixed amortization ${K.usd(ex.amortization)} with a factor of ${ex.amortFactor}, and fixed annuitization ${K.usd(ex.annuitization)} with an annuity factor of ${ex.annuityFactor}. The engine of this page returns those three amounts exactly; they run as automated tests every time the site is built. The annuity factor comes from the mortality rates of 26 CFR 1.401(a)(9)-9(e), the life expectancies from the Single Life Table of the same section (${h.src('ecfr_tables', 'eCFR')}).</p>
${h.table(['Method', 'How the amount is set', `${K.usd(bal)} at ${age}, ${K.pct(cap.rate, 2)}`, 'Same at 5 %'], [
  ['Required minimum distribution', 'balance ÷ life expectancy, every year', K.usd(pay('rmd')), K.usd(pay('rmd', 0.05))],
  ['Fixed amortization', 'level payment over the life expectancy', K.usd(pay('amortization')), K.usd(pay('amortization', 0.05))],
  ['Fixed annuitization', 'balance ÷ life annuity factor', K.usd(pay('annuitization')), K.usd(pay('annuitization', 0.05))],
], `Single Life Table, life expectancy ${K.dec(K.life(age), 1)} years at ${age}. The RMD method does not use the interest rate.`, ['l', 'l', 'r', 'r'])}
<h2>Choosing a method</h2>
<p>The RMD method pays the least and moves with the market: a fall in the account lowers next year's payment, which protects the balance but not your budget. The two fixed methods pay more and stay flat, which suits someone who needs a known income for a bridge to 59½. Notice 2022-6 lets you switch once, from a fixed method to the RMD method, without it counting as a change; any other switch breaks the series.</p>
<p>A smaller series is often the better design. Because each series is computed on one account and nothing may be added to or taken from that account outside the payments, many people split an IRA in two before starting: one IRA sized to produce exactly the income they need, the other left free for later. The IRS FAQ confirms that a series is set for a single account and that several accounts cannot be pooled into one payment.</p>
${h.mini('sepp', { t: 'Size the IRA for the income you need', p: ['b', 'me'], d: { b: 300000, by: '1978' } })}
<h2>The rate cap changes every month</h2>
<p>The interest rate you choose for the fixed methods raises or lowers the payment. The ceiling is the greater of ${K.pct(S.floor, 0)} and 120 % of the federal mid-term rate published in the revenue rulings of the two months before the first payment. Rates in 2026 rose from ${K.pct(S.afr['2026-01'].mid120, 2)} in January to ${K.pct(S.afr['2026-10'].mid120, 2)} in October (${h.src('rr_2026_19', 'Rev. Rul. 2026-19')}), so the 5 % floor stopped being the binding figure from the summer. The ${h.a('72t-interest-rate', 'monthly rate table')} lists every month and its ruling. A lower rate is always allowed: someone who wants a smaller fixed payment can simply pick one.</p>
<h2>When the series may stop</h2>
<p>The payments must go on until the later of the fifth anniversary of the first payment and the day you reach 59½. Started in ${K.month(last)} by someone born in June 1976, the series runs until ${K.day(lockA.date)}, the 59½ date. Started the same month by someone born in March 1969, it runs until ${K.day(lockB.date)}, because the five-year minimum ends later than 59½. The IRS FAQ gives the same two cases with other dates. After the lock ends, withdrawals of any size are allowed, and after 59½ they owe no additional tax anyway.</p>
<h2>Rules that catch people</h2>
<ul>
<li>From a 401(k) or 403(b), the series requires that you have left the employer; from an IRA, it does not.</li>
<li>No contribution, rollover in or transfer out of the account once the series is set. Investment gains and losses are fine.</li>
<li>Take the yearly amount in one payment or in monthly installments, but the total for the year must match.</li>
<li>Income tax is due on every payment; only the ${K.pct(K.P.early.penalty, 0)} additional tax is removed. Report the exception on Form 5329 if the 1099-R does not show it.</li>
<li>Keep the paperwork: the balance used, its date, the table, the rate and the ruling it came from. If the IRS asks years later, that sheet proves the amount was computed under one of the three methods.</li>
<li>Running out of money is not a modification: if the account is exhausted, the last smaller payment does not trigger the recapture.</li>
</ul>
<p>What happens if you change the payments is detailed on the ${h.a('72t-modification', 'modification page')}. For a plan where the series covers only part of the bridge, the ${h.a('early-retirement-calculator', 'early retirement calculator')} combines it with taxable savings and Roth money year by year.</p>
${h.mini('recapture', { t: 'If the series is broken in year three', p: ['p'], d: { p: Math.round(pay('amortization')), k: 3, x: Math.round(pay('amortization')) + 10000 } })}
`,
  faqs: [
    { q: 'Which 72(t) method gives the largest payment?', a: `Usually fixed annuitization, then fixed amortization, then the RMD method. On ${K.usd(bal)} at age ${age} with the ${K.pct(cap.rate, 2)} cap of ${K.month(last)}, the three give ${K.usd(pay('annuitization'))}, ${K.usd(pay('amortization'))} and ${K.usd(pay('rmd'))} a year. The RMD amount is recomputed every year; the two others stay fixed.` },
    { q: 'Can I start a 72(t) series from my current 401(k) while still working?', a: 'No. For a 401(k), 403(b) or other employer plan, the IRS requires that you have separated from service with the employer that maintains the plan before payments begin. An IRA has no such condition, which is why most series are run from an IRA, often after a rollover.' },
    { q: 'How long must 72(t) payments last if I start at 57?', a: 'Until the later of five years after the first payment and age 59½. Starting at 57, the five-year minimum ends after 59½, so the payments must continue to about 62. Starting at 50, the 59½ date comes later and decides the end.' },
    { q: 'Do 72(t) payments still owe income tax?', a: `Yes. The series only removes the ${K.pct(K.P.early.penalty, 0)} additional tax. Each payment from a traditional IRA is ordinary income for the year and is taxed at your bracket; in 2026 a single filer with no other income pays nothing on the first ${K.usd(K.P.tax.standardDeduction.single)} thanks to the standard deduction.` },
    { q: 'What interest rate should a 72(t) calculation use in 2026?', a: `Any rate up to the greater of ${K.pct(S.floor, 0)} and 120 % of the federal mid-term rate of either of the two months before the first payment. For a first payment in ${K.month(last)} the ceiling is ${K.pct(cap.rate, 2)}. Choosing a lower rate is allowed and gives a smaller fixed payment.` },
  ],
  tool: 'sepp',
  related: ['72t-interest-rate', '72t-modification', 'rule-of-55', 'roth-conversion-ladder', 'retire-at-50'],
  sources: ['notice_2022_6', 'irs_sepp', 'ecfr_tables', 'rr_2026_19', 'afr_index'],
});
