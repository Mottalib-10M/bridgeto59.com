import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('new-york');
const cap = st.exclusions[0].amount ?? 0; // $20,000 a person
const fed = K.P.early.penalty;
// Worked case: $28,000 from an IRA at 61.
const amt = 28000;
const r = K.stateTax('new-york', amt, 61, 0, false);
// Split year: $15,000 before 59½ and $15,000 after, in the year of the half-birthday.
const half = 15000;

export default defineState({
  slug: 'new-york',
  title: 'New York Pension Exclusion 2026: $20,000 Only After 59½',
  description: `New York pension exclusion 2026: up to ${K.usd(cap)} a person of IRA and periodic 401(k) income, but only on money received after 59½. Before, all of it is taxed.`,
  intro: `New York lets each person exclude up to ${K.usd(cap)} of retirement income, but only dollars received after reaching 59½ count; an early retiree drawing at 52 gets no state break at all.`,
  resume: `New York's pension and annuity income exclusion is worth up to ${K.usd(cap)} per person a year, and the IT-201 instructions tie it to a date: only amounts received after you reach 59½ qualify. In the year of your half-birthday, the money taken before that date stays taxable. The list of qualifying income is narrower than the federal idea of a retirement account: IRA payments count whether periodic or lump sum, while 401(k), 403(b) and governmental 457 money counts only when paid periodically. A lump-sum 401(k) cash-out is not on the list, and a private 457(b) is not either. Pensions from New York State, its local governments and the federal government are subtracted separately and in full, with no age condition. New York taxes the rest at progressive rates that reach ${K.pct(st.rate.topRate ?? 0, 1)} above $25 million in the 2025 schedules; the 2026 instructions were not out when we read them, so the calculator asks for your rate. At 61, a ${K.usd(amt)} IRA payout leaves ${K.usd(r.taxed)} taxable.`,
  body: (h) => `
<h2>A break that starts at 59½, not at retirement</h2>
<p>Many early retirees in New York assume that leaving work opens the state exclusion. It does not. The instructions for Form IT-201 say: "If you became 59½ during 2025, enter only the amount you received after you became 59½, but not more than $20,000." The test is your age on the day each dollar arrives. From 45 to 59, a New York resident living on 401(k) or IRA withdrawals reports them in full on the state return, whatever the federal treatment.</p>
<p>The half-birthday year is split in two. Picture an IRA owner who reaches 59½ in July and takes ${K.usd(half)} in March and ${K.usd(half)} in October. The March payment is fully taxable in New York; the October one is excluded. Had both payments come after the half-birthday, the whole ${K.usd(half * 2)} would have counted, within the ceiling.</p>
${h.mini('state', { t: 'New York at 61: the exclusion on an IRA payout', p: ['amt', 'age'], d: { sx: 'new-york', age: 61, amt: 28000 } })}
<h2>Periodic or lump sum: the 401(k) wording</h2>
<p>The list in the instructions reads differently for each account. IRAs are covered for "periodic and lump-sum payments", except payments derived from contributions made after you retired. For employer plans the word is periodic: periodic 401(k) distributions, periodic 403(b) distributions, periodic payments from government section 457 plans. A one-time 401(k) cash-out is not on the list, and a private 457(b) is absent altogether. Someone planning to empty an old 401(k) at 60 may get a different New York result by rolling it into an IRA first and drawing from there.</p>
${h.table(['Source of the money, received after 59½', 'Counts toward the exclusion'], [
  ['IRA, periodic or lump sum', `yes, up to ${K.usd(cap)}`],
  ['401(k) or 403(b), periodic payments', `yes, up to ${K.usd(cap)}`],
  ['401(k), single lump sum', 'not listed'],
  ['Governmental 457, periodic payments', `yes, up to ${K.usd(cap)}`],
  ['Private 457(b)', 'not listed'],
  ['New York State, local or federal government pension', 'subtracted in full, separately'],
], 'Source: Instructions for Form IT-201 (2025), lines 26 and 29.', ['l', 'l'])}
<h2>One ceiling per person, whatever the mix</h2>
<p>The instructions are blunt: "You may not take a pension and annuity income exclusion that exceeds $20,000, regardless of the source of the income." An IRA and a periodic 403(b) together still share one ${K.usd(cap)} ceiling. For a married couple the limit applies to each spouse's own qualifying income, so two people over 59½ with their own accounts can exclude up to ${K.usd(cap * 2)} between them.</p>
<h2>Rates: 2025 schedules for now</h2>
<p>New York taxes the amount above the exclusion at graduated rates. The 2025 schedules end at ${K.pct(st.rate.topRate ?? 0, 1)} on taxable income above $25 million; we did not extract the lower brackets, and the 2026 instructions had not been posted. Type the marginal rate from your last IT-201 in the calculator. The federal side, including the ${K.pct(fed, 0)} on early money, is on the ${h.a('401k-withdrawal-penalty', '401(k) penalty page')}.</p>
`,
  faqs: [
    { q: 'I reach 59½ in August. How much of the New York pension exclusion can I use this year?', a: `Only the qualifying money you receive after your half-birthday counts, up to ${K.usd(cap)}. IRA or periodic plan payments taken from January to July stay fully taxable on the New York return. The IT-201 instructions say to enter only the amount received after you became 59½, with ${K.usd(cap)} as the ceiling.` },
    { q: 'Does a lump-sum 401(k) payout qualify for the New York $20,000 exclusion?', a: 'Not on the wording of the IT-201 instructions. They list periodic 401(k) distributions, while lump-sum payments are named only for IRAs. A single 401(k) cash-out after 59½ is therefore not shown as qualifying. IRA payments, by contrast, qualify in a lump sum or in installments, which is why some retirees look at the account the money will come from before 59½ arrives.' },
    { q: 'Is a private 457(b) covered by the New York pension exclusion?', a: 'No. The instructions list periodic distributions from government section 457 deferred compensation plans only. A 457(b) offered by a private tax-exempt employer is not named, so its payouts are taxed in full by New York. New York State, local and federal government pensions are a separate case, subtracted in full on line 26.' },
    { q: 'Can a married couple in New York exclude $20,000 each?', a: `Yes, when each spouse is over 59½ and has qualifying income of their own. The exclusion is a per-person amount, capped at ${K.usd(cap)} whatever the source, so a couple can exclude up to ${K.usd(cap * 2)} together. Each spouse's ceiling is measured against the payments that spouse receives after 59½.` },
  ],
  related: ['state-tax-on-retirement-withdrawals', '401k-withdrawal-penalty', '457b-early-withdrawal', 'how-to-withdraw-money-from-401k', 'state:new-jersey'],
});
