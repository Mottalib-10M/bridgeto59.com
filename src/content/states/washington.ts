import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const fed = K.P.early.penalty;
// Capital gains excise tax (states.json rules, dor.wa.gov): 7 % above the standard deduction ($278,000 for 2025),
// plus 2.9 % on gains over $1 million. SB 6346: 9.9 % on AGI over $1 million from January 1, 2028.
const cgRate = 0.07, cgExtra = 0.029, cgDed2025 = 278000, million = 1000000;
// Worked case: $70,000 from a 401(k) at 46, single, no exception.
const amt = 70000;
const w = K.early({ amount: amt, age: 46, account: 'oldPlan', status: 'single' });
// Bridge from a taxable account: $60,000 of long-term gains, married filing jointly, no other income.
const gains = 60000;
const g = K.tax({ ordinary: 0, ltcg: gains, status: 'joint' });
const bigGain = 300000;

export default defineState({
  slug: 'washington',
  title: 'Washington State Income Tax 2026: Zero on 401(k) and IRAs',
  description: `Washington state income tax 2026: none, so 401(k) and IRA payouts owe nothing at any age. Retirement accounts are also exempt from the 7 % capital gains tax.`,
  intro: 'Washington has no individual income tax in 2026, so an early 401(k) or IRA payout owes the state nothing, and the gains a FIRE retiree realizes in a brokerage account usually fall under the capital gains threshold.',
  resume: `Washington does not tax individual income in 2026: in the Department of Revenue's words, it "does not currently have an individual income tax." A 401(k), 403(b), 457(b) or IRA payout at any age owes the state nothing; only the federal tax and the federal ${K.pct(fed, 0)} before 59½ apply. The state does levy a capital gains excise tax on long-term gains: 7 % above a standard deduction of $278,000 for 2025, plus an extra 2.9 % on Washington capital gains over $1 million from tax year 2025. Assets held in 401(k), 403(b), 457(b), traditional and Roth IRA accounts are exempt under RCW 82.87.050. For a FIRE bridge funded by selling shares from a taxable account, gains under the deduction owe no Washington tax at all. One change is coming: Senate Bill 6346 creates a 9.9 % income tax on adjusted gross income above $1 million, starting January 1, 2028, with first returns due in April 2029. How it will treat retirement distributions was not detailed in what we read.`,
  body: (h) => `
<h2>No state line on the return</h2>
<p>A Washington resident who leaves work at 46 and draws ${K.usd(amt)} from an old 401(k) files no state income tax return on it. The bill is purely federal: ${K.usd(w.penalty)} of additional tax if no exception applies, and about ${K.usd(w.federal)} of federal income tax for a single filer with no other income in 2026. The calculator shows a state total of zero at every age and amount, because there is nothing to compute.</p>
${h.mini('state', { t: 'Washington state tax on a 401(k) payout at 46', p: ['amt', 'age'], d: { sx: 'washington', age: 46, amt: 70000 } })}
<p>That makes the federal side the only lever. The ${h.a('rule-of-55', 'rule of 55')}, a ${h.a('72t-calculator', '72(t) series')} and Roth contributions are what reduce the cost of early money here.</p>
<h2>The capital gains excise tax, and why the bridge usually escapes it</h2>
<p>Washington taxes long-term capital gains through an excise tax under chapter 82.87 RCW. The rate is 7 % on gains above the standard deduction, which was ${K.usd(cgDed2025)} for 2025, and an additional 2.9 % applies to gains over ${K.usd(million)} from tax year 2025. The 2026 deduction was not visible in the Department's table when we read it.</p>
<p>For a FIRE household this tax rarely bites. A couple funding the years before 59½ by selling ${K.usd(gains)} of long-term gains from a brokerage account stays far below the deduction, so Washington takes nothing. On the federal side, with no other income, those gains fit inside the deduction and the 0 % bracket: the federal tax is ${K.usd(g.total)}. The ${h.a('zero-percent-capital-gains', '0 % capital gains page')} shows how much room the 0 % bracket leaves.</p>
<p>The excise tax matters in a year with an unusually large sale. A ${K.usd(bigGain)} long-term gain in a year with the 2025 deduction would owe 7 % on ${K.usd(bigGain - cgDed2025)}, or ${K.usd((bigGain - cgDed2025) * cgRate)}. Spreading large sales over several years keeps each year under the threshold.</p>
<h2>Retirement accounts sit outside the excise tax</h2>
<p>RCW 82.87.050 exempts assets held in retirement savings accounts under section 401(k) of the Internal Revenue Code and the related accounts listed by the Department: 403(b), 457(b), traditional IRA and Roth IRA. Rebalancing inside a 401(k) or an IRA, even with large gains, creates no Washington excise tax, and neither does the later withdrawal.</p>
<h2>2028: a new income tax above ${K.usd(million)}</h2>
<p>Senate Bill 6346, passed in 2026, creates a 9.9 % income tax for individuals and married couples filing jointly with adjusted gross income above ${K.usd(million)}, beginning January 1, 2028. Most early retirees will never reach that level. Its rules on deductions and on retirement distributions were not part of the Department summary we read. Until then, the state cost of an early withdrawal in Washington is zero, and the planning stays on the ${h.a('state-tax-on-retirement-withdrawals', 'federal and other-state side')}.</p>
`,
  faqs: [
    { q: 'Does Washington tax a 401(k) withdrawal at 50?', a: `No. Washington has no individual income tax in 2026, so a 401(k), 403(b) or IRA withdrawal at 50 owes no state tax. Federal rules still apply: income tax, and the federal ${K.pct(fed, 0)} additional tax unless an exception such as the rule of 55 or a 72(t) series covers the payout.` },
    { q: 'Do I owe Washington capital gains tax when I sell shares to fund early retirement?', a: `Only on long-term gains above the standard deduction, which was ${K.usd(cgDed2025)} for 2025. Above it the excise tax is 7 %, plus 2.9 % on gains over ${K.usd(million)}. Selling ${K.usd(gains)} of gains a year to cover living costs stays well under the deduction and owes Washington nothing.` },
    { q: 'Will the Washington 2028 income tax apply to retirement withdrawals?', a: `Senate Bill 6346 creates a 9.9 % tax on adjusted gross income above ${K.usd(million)} starting January 1, 2028. The Department of Revenue summary we read does not say how retirement distributions will be treated. A household below ${K.usd(million)} of adjusted gross income is outside the new tax either way.` },
    { q: 'Are gains inside an IRA subject to the Washington capital gains excise tax?', a: 'No. RCW 82.87.050 exempts assets held in retirement accounts: 401(k), 403(b), 457(b), traditional IRA and Roth IRA. Selling a fund with a large gain inside one of these accounts triggers no Washington excise tax, and a later withdrawal from the account is not a capital gain for the state.' },
  ],
  related: ['state-tax-on-retirement-withdrawals', 'zero-percent-capital-gains', 'rule-of-55', '72t-calculator', 'early-retirement-bridge'],
});
