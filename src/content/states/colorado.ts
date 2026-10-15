import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('colorado');
const [young, old] = st.exclusions; // $20,000 from 55 to 64, $24,000 from 65, per person
const lo = young.amount ?? 0, hi = old.amount ?? 0;
const fed = K.P.early.penalty;
const rate2025 = 0.044; // 2025 rate read on tax.colorado.gov (states.json rate note); 2026 not read
// Worked case: $30,000 at 57 from the 401(k) of an employer left at 55 (no federal penalty).
const amt = 30000;
const ok = K.stateTax('colorado', amt, 57, 0, false);
const pen = K.stateTax('colorado', amt, 57, 0, true);

export default defineState({
  slug: 'colorado',
  title: 'Colorado Pension Subtraction 2026: $20,000 a Year From 55',
  description: `Colorado pension subtraction 2026: from 55, up to ${K.usd(lo)} each of 401(k) or IRA income leaves Colorado tax, ${K.usd(hi)} from 65, unless the IRS calls it premature.`,
  intro: `Colorado's pension and annuity subtraction opens at 55, earlier than in most states, but it skips any 401(k) or IRA payout that the IRS treats as premature.`,
  resume: `Colorado lets residents age 55 or older subtract up to ${K.usd(lo)} a year of pension and annuity income, IRA and 401(k) payouts included, and up to ${K.usd(hi)} from age 65. Each spouse on a joint return computes the subtraction separately, so a couple both past 55 can remove up to ${K.usd(lo * 2)}. The catch is the federal label: distributions "deemed to be premature for federal income tax purposes do not qualify", while those not subject to the federal penalty may. A 57-year-old drawing ${K.usd(amt)} from the 401(k) of an employer left at 55, free of the federal ${K.pct(fed, 0)} under the rule of 55, can subtract ${K.usd(ok.excluded)} and is taxed on ${K.usd(ok.taxed)}. The same sum from an IRA at 57, penalized by the IRS, gets no subtraction. Under 55, only pension income received as a death benefit qualifies. The rate was 4.4 % for 2025; the Colorado page we read did not yet list 2026, so the calculator asks for your rate.`,
  body: (h) => `
<h2>Fifty-five, with a federal condition attached</h2>
<p>Colorado's subtraction is one of the few state breaks that starts at the same age as the federal ${h.a('rule-of-55', 'rule of 55')}. The Department of Revenue says it "is generally allowed only to individuals age 55 or older" and limits it to ${K.usd(lo)} a year, or ${K.usd(hi)} for those 65 or older. It covers pension and annuity income included in federal taxable income, which reaches IRA and 401(k)-type distributions.</p>
<p>The wording that matters for an early retiree is about IRAs and self-employed plans: distributions "deemed to be premature for federal income tax purposes do not qualify", and "the subtraction may be claimed for these distributions that are not subject to the federal penalty." In other words, Colorado lets the IRS decide. A payout covered by a federal exception can come off the Colorado return; a payout that owes the federal ${K.pct(fed, 0)} stays fully in it.</p>
${h.mini('state', { t: 'Colorado at 57: a rule of 55 payout', p: ['amt', 'age'], d: { sx: 'colorado', age: 57, amt: 30000, fp: 'no' } })}
<h2>The same ${K.usd(amt)}, two Colorado results</h2>
${h.table(['Payout at 57', 'Federal 10 %', 'Colorado subtraction', 'Left in Colorado income'], [
  ['401(k) of the employer left at 55', 'no', K.usd(ok.excluded), K.usd(ok.taxed)],
  ['Traditional IRA, no exception', 'yes', K.usd(pen.excluded), K.usd(pen.taxed)],
], 'Figures from the state calculator above; Colorado rules as read on tax.colorado.gov.', ['l', 'l', 'r', 'r'])}
<p>At the 2025 rate of 4.4 %, the gap between the two lines is worth ${K.usd(lo * rate2025)} of Colorado tax a year, on top of the ${K.usd(amt * fed)} federal penalty the IRA payout carries. A ${h.a('72t-calculator', '72(t) series')} from the IRA is another way to keep the federal label clean after 55.</p>
<h2>Married filers: two subtractions, one per spouse</h2>
<p>For joint returns the subtraction is computed separately for each spouse, on that spouse's own pension and annuity income. A couple who are 58 and 56, each drawing ${K.usd(lo)} from their own penalty-free plan, can remove ${K.usd(lo * 2)} together. If only one spouse has retirement income, only that spouse's ${K.usd(lo)} can be used. Age is measured at the end of the tax year, and the higher ${K.usd(hi)} amount applies from the year a spouse is 65.</p>
<h2>Before 55, and the 2026 rate</h2>
<p>Under 55 the subtraction is limited to pension and annuity income received as a death benefit, so a FIRE retiree at 50 has no Colorado break on plan or IRA money. As for the rate: the individual income tax guide shows 4.4 % for 2025 and 4.25 % for 2024, and did not list 2026 when we read it. Type your rate in the calculator once the 2026 figure is known, and compare with the neighbors on the ${h.a('state-tax-on-retirement-withdrawals', 'state overview')}.</p>
`,
  faqs: [
    { q: 'Can I take the Colorado pension subtraction at 56 on a rule of 55 payout?', a: `Yes, on the Department of Revenue's wording. You are 55 or older, and a 401(k) payout covered by the rule of 55 is not subject to the federal penalty, so it is not premature for federal purposes. Up to ${K.usd(lo)} of it can be subtracted on the Colorado return each year until 65.` },
    { q: 'Does a penalized IRA withdrawal at 57 get the Colorado subtraction?', a: `No. Colorado excludes IRA and self-employed plan distributions deemed premature for federal tax purposes. If the IRS charges its ${K.pct(fed, 0)} additional tax on the withdrawal, the amount stays fully in Colorado income even though you are past 55. A federal exception, such as a 72(t) series, changes that.` },
    { q: 'How does the Colorado pension subtraction work for a married couple?', a: `It is computed separately for each spouse, on each spouse's own qualifying income. Two spouses aged 55 to 64 can subtract up to ${K.usd(lo)} each, ${K.usd(lo * 2)} together, and up to ${K.usd(hi)} each from 65. Each amount is tied to that spouse's own income, not pooled.` },
    { q: 'What Colorado income tax rate applies to retirement payouts in 2026?', a: 'The Colorado individual income tax guide we read lists 4.4 % for 2025 and 4.25 % for 2024 but no 2026 rate yet. Until it is posted, the calculator on this page asks you to type the rate. The subtraction amounts of $20,000 and $24,000 apply before any rate is used.' },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'rule-of-55', 'retire-at-55', '72t-calculator', 'ira-early-withdrawal-penalty'],
});
