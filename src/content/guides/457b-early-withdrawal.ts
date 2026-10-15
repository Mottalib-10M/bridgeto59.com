import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const E = K.P.early;
const L = K.P.limits;
const pen = K.pct(E.penalty, 0);
// Worked case: a married teacher who leaves at 49 and takes $45,000 from a governmental 457(b), no other income.
const t = K.tool('gov457', { amt: 45000, age: 49, st: 'joint', oi: 0 });
const g49 = K.early({ amount: 45000, age: 49, account: 'gov457', status: 'joint' });
const k49 = K.early({ amount: 45000, age: 49, account: 'oldPlan', status: 'joint' });
// Table: single filer at 50 with no other income, governmental 457(b) against an old 401(k) or IRA.
const rows = [15000, 30000, 60000, 90000].map((x) => { const g = K.early({ amount: x, age: 50, account: 'gov457', status: 'single' }); const k = K.early({ amount: x, age: 50, account: 'ira', status: 'single' }); return [K.usd(x), K.usd(g.federal), K.usd(g.penalty), K.usd(k.penalty), K.usd(g.net - k.net)]; });
const maxSave50 = L.deferral + L.catchUp50;
const maxSave60 = L.deferral + L.catchUp60to63;

export default defineGuide({
  id: '457b-early-withdrawal',
  group: 'access',
  order: 33,
  slug: '457b-early-withdrawal',
  nav: '457(b) early withdrawal',
  card: 'Governmental 457(b): no 10 % at any age, except on money rolled in',
  title: '457(b) Early Withdrawal 2026: No 10 % Penalty Before 59½',
  description: `457(b) early withdrawal in 2026: a governmental plan pays at any age with no ${pen} additional tax, except on money rolled in. Deferral limit: ${K.usd(L.deferral)} a year.`,
  h1: '457(b) early withdrawal: income tax yes, 10 % no',
  intro: `Money in a state or local government 457(b) owes income tax when it comes out but not the ${pen} additional tax, whatever your age, as long as it was not rolled in from another kind of plan.`,
  resume: `A governmental 457(b) stands apart among workplace plans: its early withdrawals skip the ${pen} additional tax. IRS Topic 558 explains why: an eligible state or local government 457 plan is not a qualified retirement plan, so a payment from it is not subject to the tax on early distributions, at 40 as at 58. One exception matters: money that came into the 457(b) by rollover or direct transfer from a 401(k), 403(b) or IRA keeps the ${pen}. Income tax still applies. A married public employee who leaves at 49 and takes ${K.usd(45000)} with no other income keeps ${K.usd(g49.net)}; the same money from a 401(k) of an earlier job keeps ${K.usd(k49.net)}, a difference of ${K.usd(g49.net - k49.net)}. In 2026 a participant can defer up to ${K.usd(L.deferral)}, plus ${K.usd(L.catchUp50)} from age 50. The plan decides when it pays. The calculator above compares your withdrawal with a 401(k) one.`,
  body: (h) => `
<h2>What Topic 558 says, and what it does not</h2>
<p>The ${pen} additional tax hits early distributions from qualified retirement plans: 401(k), 403(a), 403(b) and IRAs. Topic 558 then adds: "In general, an eligible state or local government section 457 deferred compensation plan isn't a qualified retirement plan and any distribution from such plan isn't subject to the 10% additional tax on early distributions" (${h.src('tc558', 'IRS Topic 558')}). The IRS table of exceptions repeats it in a footnote, with the same limit for amounts "attributable to rollovers from another type of plan or IRA" (${h.src('irs_exceptions', 'exceptions table')}).</p>
<p>The statement is about governmental plans, those of a state, a city, a county, a school district or a similar body. A 457(b) offered by a non-governmental tax-exempt employer has its own IRS page; this site does not model it, and its participants should read their plan documents and that page rather than assume the same treatment.</p>
<h2>The rollover trap, both ways</h2>
<p>Money moving into a governmental 457(b) carries its old status. Roll an IRA or an old 401(k) into the 457(b), and Topic 558 says "any distribution attributable to amounts the section 457 plan received in a direct transfer or rollover" from a qualified plan "would be subject to the 10% additional tax". Consolidating everything into the 457(b) does not open IRA money early.</p>
<p>The reverse move loses the advantage. Roll the 457(b) into an IRA after you leave and the money becomes IRA money, which owes the ${pen} before 59½ unless an exception applies.</p>
${h.mini('gov457', { t: 'Your 457(b) withdrawal against a 401(k) one', p: ['amt', 'age'], d: { amt: 45000, age: 49, st: 'joint', oi: 0 } })}
<h2>What the absence of the 10 % is worth</h2>
<p>The married teacher above leaves at 49. The ${K.usd(45000)} withdrawal costs ${K.usd(g49.federal)} of federal income tax: the 2026 standard deduction of ${K.usd(K.P.tax.standardDeduction.joint)} covers most of it and the rest falls in the 10 % bracket. ${t.label}: ${t.value}. Taken from a 401(k) left before the year of the 55th birthday, the same amount adds ${K.usd(k49.penalty)} of additional tax.</p>
${h.table(['Withdrawal at 50', '457(b): income tax', '457(b): 10 %', 'IRA: 10 %', 'Kept in addition by the 457(b)'], rows, 'Single filer, no other income in 2026, no exception for the IRA. Engine of this site, Rev. Proc. 2025-32 brackets.', ['r', 'r', 'r', 'r', 'r'])}
<p>The saving is exactly the ${pen} of each withdrawal, because income tax is the same on both sides. Over a ten-year bridge from 49 to 59 at ${K.usd(45000)} a year, that is ${K.usd(10 * k49.penalty)} not paid, before any interest it would have earned.</p>
<h2>Roth money and the 457(b) in a bridge plan</h2>
<p>The IRS page on these plans notes that a governmental 457(b) may offer designated Roth contributions and in-plan rollovers to a designated Roth account. Roth money inside the plan follows the plan's Roth rules, not those of a Roth IRA, so check how the plan orders a payment that mixes pre-tax and Roth dollars before you rely on it.</p>
<p>Pre-tax 457(b) payments are ordinary income, and that has a second effect beyond the bracket. They raise the modified adjusted gross income (MAGI) that sets the premium tax credit for Marketplace health coverage. A public employee who retires at 52 and lives on 457(b) withdrawals until Medicare has a single dial for both the tax bill and the health premium: the amount taken each year. Splitting a large need between the 457(b) and a taxable account, where only the gain counts as income, keeps that dial lower. The ${h.a('aca-subsidy-cliff', '400 % line page')} shows where the credit stops for each household size.</p>
<h2>When the plan actually pays</h2>
<p>The tax rule only says the ${pen} does not apply. The plan document says when you can ask. The common case is a payment after you leave the employer that sponsors the plan, and the IRS 457(b) page also refers to distributions for an unforeseeable emergency, under rules of their own (${h.src('irc_457', 'IRS, 457(b) plans')}). Plans differ on lump sums, installments and how often you can change the amount, so the administrator's distribution form is the document to read before you give notice.</p>
<p>The draw-age checker above treats the governmental 457(b) as open in the year you leave. For a public employee who also has a 401(k) or 403(b), the ${h.a('when-can-you-draw-401k', 'draw-age page')} puts the two calendars side by side.</p>
<h2>2026 limits: filling the 457(b) before you leave</h2>
<p>The IRS page on 457(b) plans sets the deferral limit at the section 402(g) limit, ${K.usd(L.deferral)} in 2026. Participants in governmental 457(b) plans aged 50 or more for any part of the year may add a catch-up of up to ${K.usd(L.catchUp50)}, and those aged 60 to 63 a larger catch-up of ${K.usd(L.catchUp60to63)} (${h.src('limits_2026', 'IR-2025-111')}). That puts the yearly maximum at ${K.usd(maxSave50)} from 50 and ${K.usd(maxSave60)} between 60 and 63.</p>
<p>For an early retiree, those last working years are where a 457(b) earns its place: every dollar deferred is a dollar reachable at 50 without the ${pen}. The ${h.a('retirement-contribution-limits', 'contribution limits page')} adds the IRA and HSA amounts.</p>
${h.mini('limits', { t: 'Your 2026 room, 457(b) included', p: ['age'], d: { age: 54, hsa: 'none' } })}
`,
  faqs: [
    { q: 'Does a 457(b) early withdrawal owe the 10 % penalty?', a: `Not from a governmental 457(b) of a state or local government. IRS Topic 558 says such a plan is not a qualified retirement plan, so its payments are free of the ${pen} at any age. The exception is money the plan received by rollover or transfer from a 401(k), 403(b) or IRA, which keeps the ${pen}.` },
    { q: 'If I roll my IRA into my 457(b), can I withdraw it at 50 without the 10 %?', a: `No. Topic 558 says distributions attributable to amounts the 457 plan received by rollover or direct transfer from a qualified plan or IRA remain subject to the ${pen} additional tax. That part opens without the ${pen} at 59½ or under another exception.` },
    { q: 'Is a 457(b) early withdrawal still taxed as income?', a: `Yes. Only the ${pen} additional tax is absent. Each payment from a pre-tax 457(b) is ordinary income. A married couple with no other income in 2026 pays ${K.usd(g49.federal)} of federal tax on a ${K.usd(45000)} withdrawal, thanks to the ${K.usd(K.P.tax.standardDeduction.joint)} standard deduction.` },
    { q: 'How much can I put in a 457(b) in 2026?', a: `Up to ${K.usd(L.deferral)} of deferrals, the section 402(g) limit. Participants in governmental 457(b) plans who are 50 or older can add up to ${K.usd(L.catchUp50)}, and those aged 60 to 63 up to ${K.usd(L.catchUp60to63)}. The IRS adds that a plan without a Roth option cannot accept catch-up contributions from some participants, so ask the plan.` },
    { q: 'What happens to the 457(b) penalty exemption if I roll the plan into an IRA?', a: `The exemption is lost on that money. Rolling it to an IRA turns it into IRA money, which owes the ${pen} before 59½ unless an exception applies. Left in a governmental 457(b), the same money pays at any age without it. The tax difference is ${K.usd(k49.penalty)} on every ${K.usd(45000)} taken before 59½.` },
  ],
  tool: 'gov457',
  toolArg: { amt: 45000, age: 49, st: 'joint' },
  related: ['when-can-you-draw-401k', 'early-retirement-bridge', 'rule-of-55-public-safety', 'retirement-contribution-limits', 'early-withdrawal-penalty-exceptions'],
  sources: ['tc558', 'irs_exceptions', 'irc_457', 'limits_2026'],
});
