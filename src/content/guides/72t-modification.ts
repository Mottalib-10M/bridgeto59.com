import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early, S = K.P.sepp;
const pen = K.pct(E.penalty, 0);
// Worked case: born September 1972, first payment March 2023 at 51, fixed amortization on $600,000 at the 5 % floor.
const pay = Math.round(K.sepp('amortization', 600000, 51, S.floor));
const lock = K.lockEnd('2023-03-01', '1972-09-01');
const before = 4, extra = 15000;
const broken = K.tool('recapture', { p: pay, k: before, x: pay + extra });
const back = pay * before * E.penalty, now = (pay + extra) * E.penalty;
// Same owner uses the one-time switch to the RMD method in 2027 (age 55) with an assumed $560,000 balance.
const rmd = K.sepp('rmd', 560000, 55, 0);

export default defineGuide({
  id: '72t-modification',
  group: 'access',
  order: 24,
  slug: '72t-modification',
  nav: '72(t) modification',
  card: 'What breaks a 72(t) series, and the recapture tax it brings back',
  title: '72(t) Modification 2026: What Breaks a SEPP, What It Costs',
  description: `72(t) modification in 2026: one extra or skipped payment brings back the ${pen} on every past payment, plus interest. What breaks a SEPP and what does not.`,
  h1: '72(t) modification: what breaks a series, and the bill that follows',
  intro: `A 72(t) series forgives the ${pen} additional tax only as long as the yearly amount never changes; one wrong withdrawal and the IRS reaches back to the first payment.`,
  resume: `A 72(t) series is modified when the amount taken in a year differs from the amount its method produces, larger or smaller, or when money is added to or moved out of the account outside the payments. If that happens before the later of the fifth anniversary of the first payment and age 59½, two taxes fall in the year of the change, according to the IRS SEPP questions and answers: the ${pen} additional tax on everything taken that year, and a recapture tax equal to the ${pen} that every earlier payment escaped, plus interest for the deferral period. A series of ${K.usd(pay)} a year broken in its fifth year with ${K.usd(extra)} extra costs ${broken.value} before interest. Four events are not modifications: death, disability, the exhaustion of the account by a final smaller payment, and one switch from a fixed method to the RMD method. A distribution to a qualified public safety employee under section 72(t)(10) is also excluded.`,
  body: (h) => `
<h2>The legal trigger, word for word</h2>
<p>Section 72(t)(4) of the tax code, as summarized in IRS Notice 2022-6, says that if a series excepted from the ${pen} additional tax "is subsequently modified (other than by reason of death, disability, or a distribution to which section 72(t)(10) applies)" before the end of the five-year period starting with the first payment, or before age 59½, the tax for the year of the modification rises by the tax that would have applied without the exception, plus interest (${h.src('notice_2022_6', 'Notice 2022-6, section 2.04')}). The SEPP questions and answers translate it into practice in Q&A 9: taking a yearly amount either lesser or greater than the amount set by the method ends the series for that year (${h.src('irs_sepp', 'IRS SEPP FAQ')}).</p>
<p>The lock is the later of two dates, not the earlier. For an owner born in September 1972 whose first payment arrived in March 2023, the five-year mark comes in March 2028 but the 59½ date comes later, so the series must run unchanged until ${K.day(lock.date)}. A change in 2028, after five full years, still counts as a modification.</p>
<h2>Moves that break a series</h2>
<ul>
<li>Taking more than the yearly amount, even once, even a few hundred dollars for a car repair.</li>
<li>Taking less, or skipping a year, because a bonus or a side job made the money unnecessary.</li>
<li>Adding money to the account: a contribution, a rollover in, or a transfer in from another IRA.</li>
<li>Taking money out of the account other than the payments: a transfer out, a rollover to another IRA, a second payout.</li>
<li>Running a second series from the same account in the same year.</li>
<li>Changing method in any way other than the single switch to the RMD method, or changing the life expectancy table of an RMD-method series.</li>
<li>Reverting a pre-2022 RMD series to the older tables after it moved to the 2022 tables under the transition rule.</li>
</ul>
<p>Two of these surprise people. The first is the smaller payment: the rule cuts both ways, and taking less is as much a modification as taking more. The second is the account itself. The FAQ says that once a series is set, no additions and no other payments are allowed from that account; investment gains and losses are fine. A rollover deposited into the series IRA by mistake can end a series that the owner never meant to touch.</p>
<h2>A series broken in its fifth year, in dollars</h2>
<p>Take the owner born in September 1972. The first payment came in March 2023, the year of the 51st birthday, under fixed amortization on a ${K.usd(600000)} IRA at the ${K.pct(S.floor, 0)} floor: ${K.usd(pay)} a year. Four payments went out cleanly, in 2023, 2024, 2025 and 2026. In 2027 a roof needs replacing and ${K.usd(pay + extra)} comes out instead of ${K.usd(pay)}.</p>
${h.table(['Line on the 2027 return', 'Base', 'Amount'], [
  [`Recapture: ${pen} of the four earlier payments`, K.usd(pay * before), K.usd(back)],
  [`${pen} on everything taken in 2027`, K.usd(pay + extra), K.usd(now)],
  ['Interest for the deferral period', 'computed by the IRS', 'not estimated here'],
  ['Total before interest', '', broken.value],
], 'Income tax on the withdrawals is due in any case and is not part of the modification cost. Engine: recapture calculator of this page.', ['l', 'r', 'r'])}
<p>The ${K.usd(extra)} the owner wanted ends up costing ${broken.value} of extra tax on top of income tax, before interest. The arithmetic is brutal because the recapture is measured on the whole history, not on the excess. Had the roof waited until after ${K.day(lock.date)}, the same withdrawal would have owed only income tax, since the owner is past 59½ by then.</p>
${h.mini('recapture', { t: 'Change the year of the break', p: ['k'], d: { p: pay, k: before, x: pay + extra } })}
<h2>Changes the IRS does not count</h2>
<p>The FAQ and the notice list exactly which events leave the exception intact. Death and disability of the owner are named in the statute. A distribution to a qualified public safety employee under section 72(t)(10) is named with them. Q&A 11 covers the account that runs dry: if a final yearly payment empties the account and is smaller than the required amount, there is no ${pen} on it and no recapture. Q&A 10 allows one change of method, from fixed amortization or fixed annuitization to the RMD method, once, without it being a modification.</p>
<p>That switch is the only legal way to lower a fixed payment. Suppose the same owner, instead of breaking the series in 2027, switches to the RMD method that year. At age 55 the Single Life Table gives ${K.dec(K.life(55), 1)} years; on an assumed balance of ${K.usd(560000)} at the end of 2026, the 2027 payment becomes ${K.usd(rmd)} instead of ${K.usd(pay)}, and the RMD method must then be used every year until the lock ends. The switch cannot be undone, and the payment from then on moves with the balance.</p>
<p>Other things are not modifications either. Under the RMD method the yearly amount changes by design, and Notice 2022-6 says that redetermination is not a modification as long as the same method and the same table continue. Paying the yearly amount in monthly or quarterly installments is fine, provided the total for the year matches. And a series started before 2022 under the RMD method could move to the 2022 tables once, under the transition rule of Q&A 3.</p>
<h2>After a break: no obligation, and a fresh start possible</h2>
<p>Once a series is treated as no longer in effect, the FAQ says the owner has no obligation to keep taking the original amount in later years. A new series can begin in a calendar year after the year of the modification, using the age, balance and interest rate of that new year. With rates in 2026 above the floor from the summer, a new series may pay more per dollar than the old one; the ${h.a('72t-interest-rate', 'monthly rate table')} shows the current ceiling.</p>
<h2>Designing a series that survives</h2>
<p>Most breaks come from a budget that was too tight on day one. Splitting the IRA before the first payment, so that one account carries the series and another stays free, gives an emergency source that does not touch the series; the second IRA still owes the ${pen} if tapped before 59½, but only on what comes out of it. Taxable savings and ${h.a('roth-ira-withdrawal-rules', 'Roth IRA contributions')} serve the same purpose without the penalty. The ${h.a('72t-calculator', '72(t) calculator')} sizes the account for the income you need.</p>
`,
  faqs: [
    { q: 'Is taking less than my 72(t) amount a modification?', a: `Yes. IRS Q&A 9 treats a yearly amount either lesser or greater than the one set by the method as a modification. Skipping a payment or taking part of it before the later of five years and 59½ brings back the ${pen} on every earlier payment, plus interest, and the ${pen} on what was taken that year.` },
    { q: 'Does a 72(t) modification after age 59½ still trigger the recapture tax?', a: `It can, if the five-year period has not ended. The series must continue until the later of the fifth anniversary of the first payment and 59½. Someone who started at 56 is locked until 61; a change at 60 still brings back the ${pen} on the earlier payments, plus interest for the deferral period.` },
    { q: 'Is switching my 72(t) from amortization to the RMD method a modification?', a: `No, once. IRS Q&A 10 allows one change from fixed amortization or fixed annuitization to the RMD method without recapture. On ${K.usd(560000)} at age 55 the RMD amount is ${K.usd(rmd)}. The RMD method must then continue every year until the lock ends; any other change of method is a modification.` },
    { q: 'What if my 72(t) account runs out of money before the series ends?', a: `IRS Q&A 11 covers it: if a final yearly payment brings the account to zero and is smaller than the required amount, there is no ${pen} on it and no recapture tax. Running out is not a change of method nor a modification. It does mean no money is left in that account for later years.` },
    { q: 'How is the interest on a 72(t) recapture tax calculated?', a: `The statute adds interest for the deferral period, the years during which the ${pen} was not paid because of the exception. The IRS computes it, and neither Notice 2022-6 nor the SEPP questions and answers give a formula. This site estimates the tax itself, ${broken.value} in the example of a fifth-year break, but not the interest.` },
  ],
  tool: 'recapture',
  related: ['72t-calculator', '72t-interest-rate', 'rule-of-55-public-safety', 'early-retirement-bridge', 'roth-ira-withdrawal-rules'],
  sources: ['irs_sepp', 'notice_2022_6', 'ecfr_tables'],
});
